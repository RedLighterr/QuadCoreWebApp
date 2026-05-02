// admin/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';
export const USE_MOCK = true;

const storage = {
  get: (key, defaultVal) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    } catch { return defaultVal; }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }
};

const KEYS = {
  FAQS:       'qc_admin_faqs',
  MESSAGES:   'qc_admin_messages',
  SETTINGS:   'qc_admin_settings',
  ADMIN_USER: 'qc_admin_username',
  ADMIN_PASS: 'qc_admin_pass',
  MSG_SEEDED: 'qc_admin_messages_seeded_v2'  // versiyon takibi
};


const DEFAULT_SETTINGS = {
  siteName:        '',
  siteDescription: '',
  contactEmail:    '',
  maintenanceMode: false,
  supportedSites:  []
};

// ── SETTINGS ────────────────────────────────────────────────────────────────
export const getSettings = async () => {
  if (USE_MOCK) {
    const data = storage.get(KEYS.SETTINGS, DEFAULT_SETTINGS);
    return { success: true, data };
  }
  return (await axios.get(`${API_URL}/settings`)).data;
};

export const updateSettings = async (newSet) => {
  if (USE_MOCK) {
    const current = storage.get(KEYS.SETTINGS, DEFAULT_SETTINGS);
    const merged  = { ...current, ...newSet };
    storage.set(KEYS.SETTINGS, merged);

    // SEO'yu anında güncelle
    if (merged.siteName) {
      document.title = merged.siteName;
    }
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', merged.siteDescription);

    return { success: true, data: merged };
  }
  return (await axios.put(`${API_URL}/settings`, newSet)).data;
};

// ── AUTH ────────────────────────────────────────────────────────────────────
export const login = async (username, password) => {
  await new Promise(r => setTimeout(r, 600));
  const cUser = storage.get(KEYS.ADMIN_USER, 'admin');
  const cPass = storage.get(KEYS.ADMIN_PASS, 'admin');
  if (username === cUser && password === cPass) {
    return { success: true, user: { name: 'Admin', username }, token: 'mock-token' };
  }
  throw new Error('Kullanıcı adı veya şifre hatalı.');
};

export const changeAdminUsername = async (newUsername) => {
  storage.set(KEYS.ADMIN_USER, newUsername);
  return { success: true };
};

export const changePassword = async (currentPass, newPass) => {
  const stored = storage.get(KEYS.ADMIN_PASS, 'admin');
  if (currentPass !== stored) throw new Error('Mevcut şifre hatalı.');
  storage.set(KEYS.ADMIN_PASS, newPass);
  return { success: true };
};

// ── MESSAGES ────────────────────────────────────────────────────────────────
export const getMessages = async () => {
  const data = storage.get(KEYS.MESSAGES, []);
  return { success: true, data };
};

export const markAsRead = async (id) => {
  const msgs = storage.get(KEYS.MESSAGES, []).map(m => m.id === id ? { ...m, isRead: true } : m);
  storage.set(KEYS.MESSAGES, msgs);
  return { success: true };
};

export const deleteMessage = async (id) => {
  const msgs = storage.get(KEYS.MESSAGES, []).filter(m => m.id !== id);
  storage.set(KEYS.MESSAGES, msgs);
  return { success: true };
};

export const replyMessage = async (id, replyText) => {
  const msgs = storage.get(KEYS.MESSAGES, []).map(m =>
    m.id === id ? { ...m, isRead: true, reply: replyText } : m
  );
  storage.set(KEYS.MESSAGES, msgs);
  return { success: true };
};

// ── FAQ ─────────────────────────────────────────────────────────────────────
const DEFAULT_FAQS = [
  { id: 'def_1', question: 'Hangi tedarikçileri destekliyorsunuz?', answer: 'Mouser, DigiKey, Farnell, Arrow, AliExpress ve LCSC dahil olmak üzere 50\'den fazla global distribütörü canlı destekliyoruz.' },
  { id: 'def_2', question: 'Fiyatlara gümrük vergileri dahil mi?', answer: 'Yapay zeka analiz raporlarında, ülkenize özgü tahmini gümrük vergileri ve kargo masrafları hesaplamalara dahil edilmektedir.' },
  { id: 'def_3', question: 'Kendi şirket verilerimi ekleyebilir miyim?', answer: 'Premium sürümde, kendi tedarikçilerinizi, API anahtarlarınızı ve şirket içi stok durumunuzu sisteme entegre edebilirsiniz.' },
  { id: 'def_4', question: 'Yapay zeka analizi tam olarak ne yapıyor?', answer: 'Aynı komponentin farklı distribütörlerdeki fiyat değişim grafiğini çıkarır, teslimat sürelerini ve risk skorunu analiz ederek size en optimum satın alma rotasını önerir.' }
];

export const getFAQs = async () => {
  let faqs = storage.get(KEYS.FAQS, []);
  const isSeeded = storage.get('qc_admin_faqs_seeded', false);

  if (!isSeeded) {
    // Mevcut (kullanıcının eklediği) soruları koruyarak varsayılanları başa ekle
    faqs = [...DEFAULT_FAQS, ...faqs];
    storage.set(KEYS.FAQS, faqs);
    storage.set('qc_admin_faqs_seeded', true);
  }

  return { success: true, data: faqs };
};

export const addFAQ = async (question, answer) => {
  const faqs  = storage.get(KEYS.FAQS, []);
  const newFAQ = { id: `faq_${Date.now()}`, question, answer };
  storage.set(KEYS.FAQS, [...faqs, newFAQ]);
  return { success: true, data: newFAQ };
};

export const deleteFAQ = async (id) => {
  storage.set(KEYS.FAQS, storage.get(KEYS.FAQS, []).filter(f => f.id !== id));
  return { success: true };
};
