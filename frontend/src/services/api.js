import axios from 'axios';

// ============================================================================
// SourceFlow AI — Frontend API Servisi
// ============================================================================
// Backend bağlantı ayarları:
//   - Backend hazır olduğunda USE_MOCK = false yapılır
//   - API_BASE_URL backend sunucunun adresiyle güncellenir
//   - Vite proxy kullanılıyorsa '/api' yeterlidir
// ============================================================================

// ─── Ayarlar ────────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK     = import.meta.env.VITE_USE_MOCK === 'true'; // varsayılan: false (canlı API)

// ─── Axios İstemcisi ────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// İstek interceptor — token varsa ekler
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Yanıt interceptor — hata yönetimi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Oturum süresi dolmuş, login'e yönlendir
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// Mock Veriler — Boş (gerçek veriler backend API'den gelecek)
// ============================================================================

const mockSearchResults = [];

const mockAnalysisResult = {
  product_id: 0,
  results: [],
  suggested_price: 0,
  best_deal: null,
  created_at: new Date().toISOString(),
};

// ─── Yardımcı: Mock Gecikme Simülasyonu ─────────────────────────────────────
const mockDelay = (ms = 800) => new Promise(r => setTimeout(r, ms));

// ============================================================================
// API Fonksiyonları
// ============================================================================

// ─── Yardımcı: Backend Verisini UI Kartlarına Dönüştür ────────────────────────
const SUPPLIER_COLORS = {
  'DigiKey': '#cc0000',
  'Mouser': '#0054a6',
  'Robotistan': '#f59e0b',
  'Direnc.net': '#10b981',
  'LCSC': '#3b82f6',
  'Arrow': '#f7b500',
  'Newark': '#00558c',
  'Farnell': '#ff6b00'
};

function transformToCards(aiAnalysisList) {
  if (!aiAnalysisList || aiAnalysisList.length === 0) return [];
  
  const analysis = aiAnalysisList[0];
  const { top3 = [], market_refs = [], pricing } = analysis;
  
  // Tüm ürünleri (top3 + market_refs) birleştir
  const allResults = [...top3, ...market_refs];
  
  const aiHint = pricing ? `AI Önerisi: €${pricing.price} (Kâr: %${(pricing.margin * 100).toFixed(1)})` : '';

  return allResults.map((item, index) => ({
    id: index + 1,
    name: item.title,
    supplier: item.source,
    supplierColor: SUPPLIER_COLORS[item.source] || '#607d8b',
    price: item.price,
    price_try: item.price_try,
    stock: item.region === 'TR' ? 'Yerel Stok' : 'Global Stok',
    status: item.region === 'TR' ? 'Türkiye' : 'Global',
    ai: aiHint,
    category: item.region === 'TR' ? 'Yerel Piyasa' : 'Distribütör',
    url: item.url,
    // Detay paneli için orijinal analiz verilerini taşıyoruz
    description: analysis.description,
    ref_suggestion: analysis.ref_suggestion,
    pricing: pricing,
    cost: analysis.cost
  }));
}

// ─── 1. Komponent Arama ─────────────────────────────────────────────────────
export const searchComponents = async (query) => {
  if (USE_MOCK) {
    await mockDelay(800);
    return mockSearchResults.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    const response = await apiClient.get('/products/search', {
      params: {
        q: query,
        _t: Date.now() // Cache buster
      },
      // Backend scraping + AI pipeline yavaş olabilir (HF model + Gemini çağrıları)
      timeout: 120000,
    });
    return transformToCards(response.data);
  } catch (error) {
    console.error('[API] searchComponents hatası:', error.message);
    return [];
  }
};

// ─── 2. Ürün Oluşturma ──────────────────────────────────────────────────────
// Backend endpoint: POST /products
export const createProduct = async (productData) => {
  if (USE_MOCK) {
    await mockDelay(500);
    return { id: Date.now(), ...productData, created_at: new Date().toISOString() };
  }

  try {
    const response = await apiClient.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('[API] createProduct hatası:', error.message);
    throw error;
  }
};

// ─── 3. Ürün Analizi ─────────────────────────────────────────────────────────
// Backend endpoint: POST /products/{product_id}/analyze
export const analyzeComponent = async (productId) => {
  if (USE_MOCK) {
    await mockDelay(1500);
    return { ...mockAnalysisResult, product_id: productId };
  }

  try {
    const response = await apiClient.post(`/products/${productId}/analyze`);
    return response.data;
  } catch (error) {
    console.error('[API] analyzeComponent hatası:', error.message);
    throw error;
  }
};

// ─── 4. Tüm Ürünleri Listele ────────────────────────────────────────────────
// Backend endpoint: GET /products
export const listProducts = async () => {
  if (USE_MOCK) {
    await mockDelay(500);
    return mockSearchResults;
  }

  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('[API] listProducts hatası:', error.message);
    return [];
  }
};

// ─── 5. İletişim Formu ───────────────────────────────────────────────────────
// Backend endpoint: POST /contact (backend ekibinin eklemesi gerekebilir)
export const submitContactForm = async (formData) => {
  if (USE_MOCK) {
    await mockDelay(1000);
    // Mesajı admin paneline (localStorage) aktar
    try {
      const existing = JSON.parse(localStorage.getItem('qc_admin_messages') || '[]');
      const newMessage = {
        id: `msg_${Date.now()}`,
        name: formData.name || 'İsimsiz',
        email: formData.email || 'Belirtilmedi',
        subject: formData.subject || 'Konu Yok',
        content: formData.message || '',
        date: new Date().toISOString(),
        isRead: false,
        reply: null
      };
      localStorage.setItem('qc_admin_messages', JSON.stringify([newMessage, ...existing]));
      // Admin panelindeki (diğer sekmedeki) anlık güncellemeyi tetikle
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Mesaj admin paneline aktarılamadı", e);
    }
    return { success: true, message: 'Mesajınız alındı!' };
  }

  try {
    const response = await apiClient.post('/contact', formData);
    return response.data;
  } catch (error) {
    console.error('[API] submitContactForm hatası:', error.message);
    throw error;
  }
};

// ─── 6. Arama Geçmişi ───────────────────────────────────────────────────────
// Backend endpoint: GET/POST/DELETE /history (backend ekibi ekleyecek)
export const getSearchHistory = async () => {
  if (USE_MOCK) {
    await mockDelay(300);
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [
      { id: 1, label: 'ESP32' },
      { id: 2, label: 'STM32F103' },
      { id: 3, label: 'LCSC' },
      { id: 4, label: 'Dirençler' },
      { id: 5, label: 'LED Sürücü' },
    ];
  }

  try {
    const response = await apiClient.get('/history');
    return response.data;
  } catch (error) {
    console.error('[API] getSearchHistory hatası:', error.message);
    return [];
  }
};

export const saveSearchHistory = async (items) => {
  if (USE_MOCK) {
    localStorage.setItem('searchHistory', JSON.stringify(items));
    return { success: true };
  }

  try {
    const response = await apiClient.post('/history', { items });
    return response.data;
  } catch (error) {
    console.error('[API] saveSearchHistory hatası:', error.message);
    throw error;
  }
};

export const deleteSearchHistoryItem = async (itemId) => {
  if (USE_MOCK) {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      const items = JSON.parse(saved).filter(i => i.id !== itemId);
      localStorage.setItem('searchHistory', JSON.stringify(items));
    }
    return { success: true };
  }

  try {
    const response = await apiClient.delete(`/history/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('[API] deleteSearchHistoryItem hatası:', error.message);
    throw error;
  }
};

// ─── 7. Sağlık Kontrolü ─────────────────────────────────────────────────────
// Backend endpoint: GET /
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch {
    return { status: 'offline' };
  }
};

// ─── 8. SSS (Sıkça Sorulan Sorular) ─────────────────────────────────────────
// Backend endpoint: GET /faq
export const getFAQs = async () => {
  if (USE_MOCK) {
    try {
      const saved = localStorage.getItem('qc_admin_faqs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  try {
    const response = await apiClient.get('/faq');
    return response.data;
  } catch (error) {
    console.error('[API] getFAQs hatası:', error.message);
    return [];
  }
};

// ─── 9. Sistem Ayarları ─────────────────────────────────────────────────────
export const getSettings = async () => {
  if (USE_MOCK) {
    try {
      const saved = localStorage.getItem('qc_admin_settings');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  try {
    const response = await apiClient.get('/settings');
    return response.data;
  } catch (error) {
    console.error('[API] getSettings hatası:', error.message);
    return null;
  }
};

// ─── Varsayılan Export ───────────────────────────────────────────────────────
export default apiClient;
