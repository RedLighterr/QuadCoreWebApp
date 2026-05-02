// ═══════════════════════════════════════════════════════
//  security.js — XSS Koruması + IP Ban Sistemi
// ═══════════════════════════════════════════════════════

// ─── XSS Sanitizasyonu ───────────────────────────────
const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Kullanıcı girdisini XSS saldırılarına karşı temizler.
 * HTML özel karakterlerini encode eder.
 */
export const sanitizeInput = (input) => {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[&<>"'`=/]/g, (char) => HTML_ESCAPE_MAP[char]);
};

/**
 * URL'lerin güvenli protokol kullandığını kontrol eder.
 * javascript:// gibi tehlikeli URL'leri engeller.
 */
export const sanitizeUrl = (url) => {
  if (!url) return '#';
  const lower = url.toLowerCase().trim();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return '#';
  }
  return url;
};

/**
 * Input değerini sadece izin verilen karakterlere kısıtlar.
 * type: 'email' | 'text' | 'password' | 'alphanumeric'
 */
export const validateInput = (value, type = 'text') => {
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'alphanumeric':
      return /^[a-zA-Z0-9\s\-_.,!?çğıöşüÇĞİÖŞÜ]+$/.test(value);
    case 'password':
      return value.length >= 4;
    default:
      return value.trim().length > 0;
  }
};

/**
 * Script injection pattern tespiti.
 * Girdi tehlikeli pattern içeriyorsa true döner.
 */
export const containsXSS = (input) => {
  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript\s*:/gi,
    /on\w+\s*=/gi,       // onerror=, onclick= vs
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
  ];
  return xssPatterns.some(pattern => pattern.test(input));
};

// ─── IP Ban Sistemi ───────────────────────────────────
const STORAGE_KEY_ATTEMPTS = 'qc_login_attempts';
const STORAGE_KEY_BAN_UNTIL = 'qc_login_ban_until';
const MAX_ATTEMPTS = 5;
const BAN_DURATION_MS = 15 * 60 * 1000; // 15 dakika

/**
 * Mevcut ban durumunu kontrol eder.
 * Eğer ban varsa ban bitiş timestamp'ini döner, yoksa null.
 */
export const checkBanStatus = () => {
  try {
    const banUntil = localStorage.getItem(STORAGE_KEY_BAN_UNTIL);
    if (!banUntil) return null;

    const banEnd = parseInt(banUntil, 10);
    if (Date.now() < banEnd) {
      return banEnd; // Ban aktif, bitiş zamanı
    }
    // Ban süresi dolmuş, temizle
    clearBan();
    return null;
  } catch {
    return null;
  }
};

/**
 * Ban bitiş zamanından kalan süreyi dakika:saniye formatında döner.
 */
export const getRemainingBanTime = (banUntil) => {
  const remaining = Math.max(0, banUntil - Date.now());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Başarısız giriş denemesini kaydeder.
 * 5. denemede 15 dakikalık ban uygular.
 * { banned: boolean, banUntil: number|null, attemptsLeft: number } döner.
 */
export const recordFailedAttempt = () => {
  try {
    const current = parseInt(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || '0', 10);
    const newCount = current + 1;

    if (newCount >= MAX_ATTEMPTS) {
      const banUntil = Date.now() + BAN_DURATION_MS;
      localStorage.setItem(STORAGE_KEY_BAN_UNTIL, String(banUntil));
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, '0');
      return { banned: true, banUntil, attemptsLeft: 0 };
    }

    localStorage.setItem(STORAGE_KEY_ATTEMPTS, String(newCount));
    return { banned: false, banUntil: null, attemptsLeft: MAX_ATTEMPTS - newCount };
  } catch {
    return { banned: false, banUntil: null, attemptsLeft: MAX_ATTEMPTS };
  }
};

/**
 * Başarılı girişte tüm ban kayıtlarını temizler.
 */
export const clearBan = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEY_BAN_UNTIL);
  } catch {}
};

/**
 * Mevcut başarısız deneme sayısını döner.
 */
export const getAttemptCount = () => {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || '0', 10);
  } catch {
    return 0;
  }
};
