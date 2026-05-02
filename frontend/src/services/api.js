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
const USE_MOCK     = import.meta.env.VITE_USE_MOCK !== 'false'; // varsayılan: true

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

// ─── 1. Komponent Arama ─────────────────────────────────────────────────────
// Backend endpoint: GET /products (veya henüz bir search endpoint'i yoksa 
// frontend filtreleme yapar)
export const searchComponents = async (query) => {
  if (USE_MOCK) {
    await mockDelay(800);
    return mockSearchResults.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    // Öncelikle backend'de search endpoint varsa kullan
    const response = await apiClient.get('/products', {
      params: { search: query }
    });
    return response.data;
  } catch (error) {
    console.error('[API] searchComponents hatası:', error.message);
    // Backend erişilemezse mock veriye düş
    return mockSearchResults.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
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

// ─── Varsayılan Export ───────────────────────────────────────────────────────
export default apiClient;
