import React, { useState, useEffect, useRef } from 'react';
import {
  Save, CheckCircle, AlertCircle, Database,
  ShieldCheck, User, Mail, Phone, MapPin,
  Globe, Link, AtSign, Info, Building
} from 'lucide-react';
import { getSettings, updateSettings, changePassword, changeAdminUsername } from '../services/api';
import { sanitizeInput, containsXSS } from '../services/security';

/* ─── Ortak stiller ─────────────────────────────── */
const iStyle = {
  width: '100%', padding: '11px 14px', backgroundColor: '#f8f9ff',
  border: '1.5px solid #dde3f4', borderRadius: '12px', fontSize: '14px',
  color: '#1a1e38', outline: 'none', transition: 'all 0.2s ease', fontFamily: 'inherit',
};
const lStyle    = { display: 'block', fontSize: '12px', fontWeight: '700', color: '#556088', marginBottom: '6px' };
const cardStyle = { backgroundColor: '#fff', border: '1px solid #dde3f4', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' };

/* ─── Yardımcı bileşenler ───────────────────────── */
const IconInput = ({ icon: Icon, iconColor = '#9099b8', ...rest }) => (
  <div style={{ position: 'relative' }}>
    <Icon size={15} color={iconColor}
      style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    <input {...rest} style={{ ...iStyle, paddingLeft: '36px' }} />
  </div>
);

const Banner = ({ msg }) => msg?.text ? (
  <div style={{ marginBottom: '14px', padding: '10px 14px', borderRadius: '10px',
    backgroundColor: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
    color: msg.type === 'success' ? '#16a34a' : '#dc2626',
    fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
    {msg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {msg.text}
  </div>
) : null;

/* ─── Sosyal medya alanları (YouTube/GitHub/Web kaldırıldı) ── */
const SOCIAL_FIELDS = [
  { name: 'instagram', label: 'Instagram',   placeholder: 'instagram.com/kullanici', icon: AtSign, color: '#e1306c' },
  { name: 'twitter',   label: 'Twitter / X', placeholder: 'twitter.com/kullanici',   icon: AtSign, color: '#1da1f2' },
  { name: 'linkedin',  label: 'LinkedIn',    placeholder: 'linkedin.com/in/...',      icon: Link,   color: '#0a66c2' },
];

/* ─── Hakkımızda alanları ───────────────────────── */
const ABOUT_FIELDS = [
  { name: 'description', label: 'Şirket Açıklaması', placeholder: 'Kısa bir açıklama yazın...', multiline: true },
  { name: 'mission',     label: 'Misyon',             placeholder: 'Misyonunuz nedir?' },
  { name: 'vision',      label: 'Vizyon',              placeholder: 'Vizyonunuz nedir?' },
  { name: 'foundedYear', label: 'Kuruluş Yılı',       placeholder: '2023' },
];



/* ════════════════════════════════════════════════ */
const Settings = () => {
  /* Genel ayarlar */
  const [settings, setSettings] = useState({
    siteName: '', contactEmail: '', phone: '',
    fullAddress: '',
    maintenanceMode: false, supportedSites: ['Mouser', 'DigiKey'],
    social: { instagram: '', twitter: '', linkedin: '' },
    about:  { description: '', mission: '', vision: '', ceoName: '', foundedYear: '' }
  });
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [message,  setMessage]  = useState({ type: '', text: '' });
  const [aboutMsg, setAboutMsg] = useState({ type: '', text: '' });
  const [socialMsg, setSocialMsg] = useState({ type: '', text: '' });
  const [phoneMsg, setPhoneMsg] = useState({ type: '', text: '' });

  /* Şifre */
  const [passForm,    setPassForm]    = useState({ current: '', new: '', confirm: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg,     setPassMsg]     = useState({ type: '', text: '' });
  const [showPass,    setShowPass]    = useState(false);

  /* Kullanıcı adı */
  const [adminUsername, setAdminUsername] = useState('');
  const [userLoading,   setUserLoading]   = useState(false);
  const [userMsg,       setUserMsg]       = useState({ type: '', text: '' });

  useEffect(() => {
    loadSettings();
    setAdminUsername(localStorage.getItem('qc_admin_username') || 'admin');
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getSettings();
      if (res.success) {
        setSettings(prev => ({
          ...prev, ...res.data,
          social: { instagram: '', twitter: '', linkedin: '', ...(res.data.social || {}) },
          about:  { description: '', mission: '', vision: '', ceoName: '', foundedYear: '', ...(res.data.about || {}) }
        }));
      }
    } catch { setMessage({ type: 'error', text: 'Ayarlar yüklenemedi.' }); }
    finally   { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    if (name === 'maintenanceMode' && val === true) {
      if (!window.confirm('DİKKAT: Bakım modu açıldığında site kapatılacak. Devam?')) return;
    }
    if (typeof val === 'string' && containsXSS(val)) {
      setMessage({ type: 'error', text: 'Güvenlik uyarısı!' }); return;
    }
    setSettings(prev => ({ ...prev, [name]: val }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, social: { ...prev.social, [name]: value } }));
  };

  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, about: { ...prev.about, [name]: value } }));
  };

  const toggleSite = (site) => {
    setSettings(prev => ({
      ...prev,
      supportedSites: (prev.supportedSites || []).includes(site)
        ? prev.supportedSites.filter(s => s !== site)
        : [...(prev.supportedSites || []), site]
    }));
  };

  const validateSocial = () => {
    for (const key of ['instagram', 'twitter', 'linkedin']) {
      const val = settings.social[key];
      if (val && val.trim() !== '' && !val.toLowerCase().includes(key)) {
        return `Lütfen geçerli bir ${key} bağlantısı girin.`;
      }
    }
    return null;
  };

  const validatePhone = () => {
    const p = settings.phone;
    if (!p || p.trim() === '') return null;
    const digits = p.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      return "Geçerli bir telefon numarası girin (örn: +90 532 000 00 00)";
    }
    return null;
  };

  const handleSave = async (e, source = 'genel') => {
    if (e) e.preventDefault();
    
    setPhoneMsg({ type: '', text: '' });
    setSocialMsg({ type: '', text: '' });

    if (source === 'genel') {
      const phoneErr = validatePhone();
      if (phoneErr) {
        setPhoneMsg({ type: 'error', text: phoneErr });
        return;
      }

      const socialErr = validateSocial();
      if (socialErr) {
        setSocialMsg({ type: 'error', text: socialErr });
        return;
      }
    }

    setSaving(true); 
    if (source === 'genel') setMessage({ type: '', text: '' });
    else setAboutMsg({ type: '', text: '' });

    try {
      const payload = { ...settings, siteName: sanitizeInput(settings.siteName) };
      const res = await updateSettings(payload);
      if (res.success) {
        const succ = { type: 'success', text: 'Ayarlar başarıyla kaydedildi.' };
        if (source === 'genel') {
          setMessage(succ);
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
          setAboutMsg(succ);
          setTimeout(() => setAboutMsg({ type: '', text: '' }), 3000);
        }
      }
    } catch { 
      const err = { type: 'error', text: 'Kayıt hatası.' };
      if (source === 'genel') setMessage(err);
      else setAboutMsg(err);
    }
    finally  { setSaving(false); }
  };

  const handlePassChange = async (e) => {
    e.preventDefault();
    if (passForm.new !== passForm.confirm) { setPassMsg({ type: 'error', text: 'Şifreler eşleşmiyor.' }); return; }
    if (passForm.new.length < 4)           { setPassMsg({ type: 'error', text: 'En az 4 karakter.' }); return; }
    setPassLoading(true);
    try {
      await changePassword(passForm.current, passForm.new);
      setPassMsg({ type: 'success', text: 'Şifre güncellendi!' });
      setPassForm({ current: '', new: '', confirm: '' });
    } catch (err) { setPassMsg({ type: 'error', text: err.message }); }
    finally       { setPassLoading(false); }
  };

  const handleUserChange = async (e) => {
    e.preventDefault();
    setUserLoading(true);
    try {
      await changeAdminUsername(adminUsername);
      setUserMsg({ type: 'success', text: 'Kullanıcı adı güncellendi!' });
      setTimeout(() => setUserMsg({ type: '', text: '' }), 3000);
    } catch { setUserMsg({ type: 'error', text: 'Hata oluştu.' }); }
    finally  { setUserLoading(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
      <div style={{ width: '30px', height: '30px', border: '3px solid #dde3f4', borderTop: '3px solid #4361ee', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px', animation: 'fadeIn 0.4s ease' }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .s-chip { cursor:pointer; padding:7px 14px; border-radius:10px; font-size:13px; font-weight:700;
                  border:1.5px solid #dde3f4; transition:.2s; background:#fff; color:#556088; }
        .s-chip.on { background:#4361ee; color:#fff; border-color:#4361ee; }
        .s-chip:hover { border-color:#4361ee; }
        .s-input:focus { border-color:#4361ee !important; box-shadow:0 0 0 3px rgba(67,97,238,.1) !important; }
        
        .settings-grid { display: grid; grid-template-columns: 1fr 400px; gap: 24px; align-items: start; }
        .settings-inner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .social-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        
        @media (max-width: 992px) {
          .settings-grid { grid-template-columns: 1fr; }
          .social-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .settings-inner-grid { grid-template-columns: 1fr; }
          .social-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1e38' }}>Sistem Yapılandırması</h2>
        <p style={{ color: '#6b7280' }}>Platform ayarlarını, iletişim ve hakkımızda bilgilerini yönetin.</p>
      </header>

      <div className="settings-grid">

        {/* ══ SOL KOLON ══════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Genel & İletişim */}
          <form onSubmit={e => handleSave(e, 'genel')}>
            <div style={cardStyle}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1e38' }}>
                <Globe size={18} color="#4361ee" /> Genel & İletişim
              </h3>
              <Banner msg={message} />

              <div className="settings-inner-grid">
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lStyle}>Site Adı</label>
                  <IconInput icon={Globe} iconColor="#4361ee" name="siteName" value={settings.siteName} onChange={handleChange} placeholder="ComponentSource AI" required />
                </div>
                <div>
                  <label style={lStyle}>İletişim E-postası</label>
                  <IconInput icon={Mail} name="contactEmail" type="email" value={settings.contactEmail || ''} onChange={handleChange} placeholder="info@site.com" />
                </div>
                <div>
                  <label style={lStyle}>Telefon</label>
                  <IconInput icon={Phone} name="phone" value={settings.phone || ''} onChange={handleChange} placeholder="+90 532 000 00 00" />
                  <div style={{ marginTop: '8px' }}><Banner msg={phoneMsg} /></div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lStyle}>Açık Adres Bilgileri</label>
                  <IconInput icon={MapPin} name="fullAddress" value={settings.fullAddress || ''} onChange={handleChange} placeholder="Örn: İl, İlçe, Mahalle, Sokak / Bina No..." />
                </div>
              </div>

              {/* Sosyal Medya */}
              <div style={{ borderTop: '1px solid #f0f2fa', paddingTop: '20px', marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', fontWeight: '800', color: '#9099b8', marginBottom: '14px', letterSpacing: '0.5px' }}>SOSYAL MEDYA</p>
                <div style={{ marginBottom: '14px' }}><Banner msg={socialMsg} /></div>
                <div className="social-grid">
                  {SOCIAL_FIELDS.map(f => (
                    <div key={f.name}>
                      <label style={lStyle}>{f.label}</label>
                      <IconInput icon={f.icon} iconColor={f.color} name={f.name}
                        value={settings.social?.[f.name] || ''} onChange={handleSocialChange} placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tedarikçiler */}
              <div style={{ borderTop: '1px solid #f0f2fa', paddingTop: '20px', marginBottom: '24px' }}>
                <label style={lStyle}>Desteklenen Tedarikçiler</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {['Mouser', 'DigiKey', 'Farnell', 'Arrow', 'LCSC', 'TME'].map(site => (
                    <div key={site} className={`s-chip ${(settings.supportedSites || []).includes(site) ? 'on' : ''}`} onClick={() => toggleSite(site)}>
                      {site}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving}
                  style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #4361ee, #7c3aed)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {saving ? 'Kaydediliyor...' : <><Save size={16} /> Kaydet</>}
                </button>
              </div>
            </div>
          </form>

          {/* Hakkımızda */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1e38' }}>
              <Info size={18} color="#7c3aed" /> Hakkımızda
            </h3>
            <Banner msg={aboutMsg} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ABOUT_FIELDS.map(f => (
                <div key={f.name}>
                  <label style={lStyle}>{f.label}</label>
                  {f.multiline ? (
                    <textarea name={f.name} value={settings.about?.[f.name] || ''} onChange={handleAboutChange}
                      placeholder={f.placeholder} rows={4}
                      style={{ ...iStyle, resize: 'vertical', minHeight: '100px' }} />
                  ) : (
                    <input type="text" name={f.name} value={settings.about?.[f.name] || ''} onChange={handleAboutChange}
                      placeholder={f.placeholder} style={iStyle} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={e => handleSave(e, 'about')} disabled={saving}
                style={{ padding: '11px 24px', background: 'linear-gradient(135deg, #7c3aed, #4361ee)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {saving ? 'Kaydediliyor...' : <><Save size={15} /> Hakkımızda'yı Kaydet</>}
              </button>
            </div>
          </div>

          {/* Bakım Modu */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1e38' }}>
              <Database size={18} color="#0d9488" /> Sistem Modu
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f4f6fd', padding: '18px', borderRadius: '14px' }}>
              <div>
                <p style={{ fontWeight: '800', fontSize: '15px', color: '#1a1e38' }}>Bakım Modu</p>
                <p style={{ color: '#9099b8', fontSize: '13px' }}>Aktif edildiğinde tüm trafik engellenir.</p>
              </div>
              <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                <div style={{ width: '50px', height: '26px', backgroundColor: settings.maintenanceMode ? '#4361ee' : '#dde3f4', borderRadius: '13px', transition: '.3s', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '3px', left: settings.maintenanceMode ? '27px' : '3px', width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', transition: '.3s', boxShadow: '0 1px 4px rgba(0,0,0,.15)' }} />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ══ SAĞ KOLON ══════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Kullanıcı Adı */}
          <div style={{ ...cardStyle, borderTop: '4px solid #4361ee' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1e38' }}>
              <User size={17} color="#4361ee" /> Giriş Kullanıcı Adı
            </h3>
            <Banner msg={userMsg} />
            <form onSubmit={handleUserChange}>
              <div style={{ marginBottom: '14px' }}>
                <label style={lStyle}>Kullanıcı Adı</label>
                <IconInput icon={User} iconColor="#4361ee" type="text" value={adminUsername}
                  onChange={e => setAdminUsername(e.target.value)} placeholder="admin" required />
              </div>
              <button type="submit" disabled={userLoading}
                style={{ width: '100%', padding: '11px', background: '#1a1e38', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
                {userLoading ? 'Güncelleniyor...' : 'Kullanıcı Adını Güncelle'}
              </button>
            </form>
          </div>

          {/* Şifre */}
          <div style={{ ...cardStyle, borderTop: '4px solid #ef4444' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1e38' }}>
              <ShieldCheck size={17} color="#ef4444" /> Yönetici Şifresi
            </h3>
            <Banner msg={passMsg} />
            <form onSubmit={handlePassChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Mevcut Şifre',        key: 'current' },
                { label: 'Yeni Şifre',           key: 'new'     },
                { label: 'Yeni Şifre (Tekrar)',  key: 'confirm' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={lStyle}>{label}</label>
                  <input type={showPass ? 'text' : 'password'} value={passForm[key]}
                    onChange={e => setPassForm(prev => ({ ...prev, [key]: e.target.value }))}
                    style={iStyle} required />
                </div>
              ))}
              <div style={{ textAlign: 'right' }}>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ background: 'none', border: 'none', color: '#4361ee', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  {showPass ? '🙈 Gizle' : '👁 Göster'}
                </button>
              </div>
              <button type="submit" disabled={passLoading}
                style={{ width: '100%', padding: '11px', background: '#1a1e38', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
                {passLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
