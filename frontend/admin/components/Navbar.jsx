import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Settings,
  HelpCircle,
  Mail,
  Search,
  Bell,
  Box,
  BarChart2,
  Plug,
  User,
  LogOut,
  X,
  MessageCircle,
} from 'lucide-react';
import { getMessages, getFAQs, getSettings } from '../services/api';

const STATIC_ROUTES = [
  { type: 'Sayfa', title: 'Gelen Kutusu',      path: '/',             icon: '✉️' },
  { type: 'Sayfa', title: 'Raporlar',           path: '/reports',      icon: '📊' },
  { type: 'Sayfa', title: 'SSS Yönetimi',       path: '/faq',          icon: '❓' },
  { type: 'Sayfa', title: 'Sistem Ayarları',    path: '/settings',     icon: '⚙️' },
];

const NavItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    end={to === '/'}
    style={({ isActive }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderBottom: `3px solid ${isActive ? '#4361ee' : 'transparent'}`,
      color: isActive ? '#4361ee' : '#6b7280',
      backgroundColor: isActive ? '#eef1ff' : 'transparent',
      fontWeight: isActive ? '700' : '500',
      fontSize: '15px',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease',
      borderRadius: isActive ? '6px 6px 0 0' : '0',
    })}
  >
    <Icon size={17} />
    <span>{label}</span>
  </NavLink>
);

const Navbar = ({ onLogout }) => {
  const [query, setQuery]                   = useState('');
  const [results, setResults]               = useState([]);
  const [showSearch, setShowSearch]         = useState(false);
  const [isSearching, setIsSearching]       = useState(false);
  const [allData, setAllData]               = useState({ messages: [], faqs: [] });
  const [siteName, setSiteName]             = useState('QuadCore');
  const [showBellDropdown, setShowBellDropdown] = useState(false);

  const searchRef  = useRef(null);
  const bellRef    = useRef(null);
  const inputRef   = useRef(null);
  const navigate   = useNavigate();

  // ── Veri ve site adını yükle ──
  useEffect(() => {
    const load = async () => {
      try {
        const [msgRes, faqRes, settingsRes] = await Promise.all([
          getMessages(), getFAQs(), getSettings()
        ]);
        setAllData({
          messages: msgRes.success ? msgRes.data : [],
          faqs:     faqRes.success ? faqRes.data : [],
        });
        if (settingsRes.success && settingsRes.data.siteName) {
          setSiteName(settingsRes.data.siteName);
        }
      } catch {}
    };
    load();

    // Messages.jsx'ten gelen silme/okundu eventini dinle → zili anlık güncelle
    const onMsgsUpdated = async () => {
      try {
        const res = await getMessages();
        if (res.success) setAllData(prev => ({ ...prev, messages: res.data }));
      } catch {}
    };
    window.addEventListener('messagesUpdated', onMsgsUpdated);
    // Ayarlar değiştiğinde site adını güncelle (Settings sayfasından kaydet sonrası)
    const storageListener = () => {
      try {
        const s = JSON.parse(localStorage.getItem('qc_admin_settings') || '{}');
        if (s.siteName) setSiteName(s.siteName);
      } catch {}
    };
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener('storage', storageListener);
      window.removeEventListener('messagesUpdated', onMsgsUpdated);
    };
  }, []);

  // ── Dışarı tıklayınca kapat ──
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowBellDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Arama mantığı ──
  const handleSearch = useCallback((value) => {
    setQuery(value);
    if (!value.trim()) { setResults([]); setShowSearch(false); return; }
    setIsSearching(true);
    const q = value.toLowerCase().trim();
    const found = [];
    STATIC_ROUTES.forEach(r => { if (r.title.toLowerCase().includes(q)) found.push({ ...r, subtitle: 'Sayfaya git' }); });
    allData.messages.forEach(m => {
      if (m.name.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.content.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) {
        found.push({ type: 'Mesaj', title: m.subject, subtitle: `${m.name} — ${m.email}`, path: '/', icon: '✉️' });
      }
    });
    allData.faqs.forEach(f => {
      if (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) {
        found.push({ type: 'SSS', title: f.question, subtitle: f.answer.slice(0, 60) + (f.answer.length > 60 ? '…' : ''), path: '/faq', icon: '❓' });
      }
    });
    setResults(found);
    setShowSearch(true);
    setIsSearching(false);
  }, [allData]);

  const handleSelect = (path) => { navigate(path); setQuery(''); setShowSearch(false); };
  const clearSearch  = () => { setQuery(''); setResults([]); setShowSearch(false); inputRef.current?.focus(); };

  const unreadMessages = allData.messages.filter(m => !m.isRead);

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #dde3f4', boxShadow: '0 1px 6px rgba(67,97,238,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
      <style>{`
        .bell-item:hover { background: #f4f6fd !important; }
        .bell-item:hover .bell-subject { color: #4361ee !important; }
      `}</style>

      {/* ── Top Row ── */}
      <div className="top-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 32px', borderBottom: '1px solid #dde3f4' }}>

        {/* Left: Logo + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Logo — site adı localStorage'dan gelir */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #4361ee, #7c3aed)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(67,97,238,0.28)' }}>
              <Box size={20} color="white" />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.4px', color: '#1a1e38', margin: 0 }}>
              {siteName}
            </h1>
          </div>

          {/* Search */}
          <div ref={searchRef} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={20} style={{ color: '#9099b8', flexShrink: 0 }} />
              <div style={{ position: 'relative' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Sistemde ara (Kullanıcı, Mail, Ayar...)"
                  style={{ width: '340px', padding: '9px 36px 9px 16px', backgroundColor: '#f4f6fd', border: '1.5px solid #dde3f4', borderRadius: '10px', fontSize: '14px', color: '#1a1e38', outline: 'none', transition: 'all 0.2s ease', fontFamily: 'inherit' }}
                  onFocus={e => { e.target.style.borderColor = '#4361ee'; e.target.style.boxShadow = '0 0 0 3px rgba(67,97,238,0.12)'; e.target.style.backgroundColor = '#fff'; if (query) setShowSearch(true); }}
                  onBlur={e  => { e.target.style.borderColor = '#dde3f4'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#f4f6fd'; }}
                />
                {query && (
                  <button onClick={clearSearch} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9099b8', padding: '2px', display: 'flex', alignItems: 'center' }}>
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Arama Dropdown */}
            {showSearch && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '30px', width: '380px', backgroundColor: '#fff', border: '1px solid #dde3f4', borderRadius: '14px', boxShadow: '0 8px 32px rgba(67,97,238,0.14)', zIndex: 200, overflow: 'hidden', maxHeight: '380px', overflowY: 'auto' }}>
                {isSearching ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#9099b8', fontSize: '14px' }}>Aranıyor...</div>
                ) : results.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <Search size={28} style={{ color: '#dde3f4', marginBottom: '8px' }} />
                    <p style={{ fontSize: '14px', color: '#9099b8' }}>"{query}" için sonuç bulunamadı.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '10px 14px 6px', fontSize: '11px', fontWeight: '700', color: '#9099b8', letterSpacing: '0.5px' }}>{results.length} SONUÇ</div>
                    {results.map((r, i) => (
                      <button key={i} onMouseDown={() => handleSelect(r.path)}
                        style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.15s', borderTop: i > 0 ? '1px solid #f0f2fa' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f4f6fd'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <span style={{ width: '34px', height: '34px', flexShrink: 0, background: '#eef1ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{r.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: '700', fontSize: '14px', color: '#1a1e38', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
                          <p style={{ fontSize: '12px', color: '#9099b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.subtitle}</p>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#9099b8', backgroundColor: '#f4f6fd', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>{r.type}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* ── Bildirim Zili ── */}
          <div ref={bellRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowBellDropdown(p => !p)}
              style={{ position: 'relative', color: showBellDropdown ? '#4361ee' : '#9099b8', background: showBellDropdown ? '#eef1ff' : 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#4361ee'; e.currentTarget.style.backgroundColor = '#f4f6fd'; }}
              onMouseLeave={e => { if (!showBellDropdown) { e.currentTarget.style.color = '#9099b8'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
            >
              <Bell size={20} />
              {unreadMessages.length > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', minWidth: '18px', height: '18px', backgroundColor: '#ef4444', borderRadius: '10px', border: '2px solid #fff', color: 'white', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                  {unreadMessages.length}
                </span>
              )}
            </button>

            {/* ── Bildirim Dropdown ── */}
            {showBellDropdown && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '340px', backgroundColor: '#fff', border: '1px solid #dde3f4', borderRadius: '16px', boxShadow: '0 12px 40px rgba(67,97,238,0.16)', zIndex: 200, overflow: 'hidden' }}>
                {/* Başlık */}
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f2fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '800', fontSize: '15px', color: '#1a1e38' }}>Bildirimler</p>
                    <p style={{ fontSize: '12px', color: '#9099b8' }}>{unreadMessages.length} okunmamış mesaj</p>
                  </div>
                  <button onClick={() => { navigate('/'); setShowBellDropdown(false); }}
                    style={{ fontSize: '12px', fontWeight: '700', color: '#4361ee', background: '#eef1ff', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}>
                    Tümünü Gör
                  </button>
                </div>

                {/* Mesaj Listesi */}
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {unreadMessages.length === 0 ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                      <Bell size={32} style={{ color: '#dde3f4', marginBottom: '8px' }} />
                      <p style={{ fontSize: '14px', color: '#9099b8', fontWeight: '600' }}>Tüm mesajlar okundu</p>
                    </div>
                  ) : (
                    unreadMessages.map((msg, i) => (
                      <button
                        key={msg.id}
                        className="bell-item"
                        onClick={() => { navigate('/'); setShowBellDropdown(false); }}
                        style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', borderTop: i > 0 ? '1px solid #f0f2fa' : 'none', transition: 'background 0.15s' }}
                      >
                        {/* Avatar */}
                        <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #eef1ff, #e8eaff)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <MessageCircle size={16} color="#4361ee" />
                        </div>

                        {/* İçerik */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                            <p className="bell-subject" style={{ fontWeight: '700', fontSize: '13px', color: '#1a1e38', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.15s' }}>
                              {msg.subject}
                            </p>
                            <span style={{ fontSize: '11px', color: '#9099b8', flexShrink: 0, marginLeft: '8px' }}>
                              {new Date(msg.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#9099b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <strong style={{ color: '#6b7280' }}>{msg.name}</strong> — {msg.content.slice(0, 50)}{msg.content.length > 50 ? '…' : ''}
                          </p>
                        </div>

                        {/* Okunmamış nokta */}
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#4361ee', borderRadius: '50%', flexShrink: 0, marginTop: '4px' }} />
                      </button>
                    ))
                  )}
                </div>

                {/* Alt: Mesajlara Git */}
                {unreadMessages.length > 0 && (
                  <div style={{ padding: '12px 18px', borderTop: '1px solid #f0f2fa', backgroundColor: '#fcfcff' }}>
                    <button
                      onClick={() => { navigate('/'); setShowBellDropdown(false); }}
                      style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #4361ee, #7c3aed)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    >
                      📥 Gelen Kutusuna Git
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#e4e8f5' }} />

          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1e38', lineHeight: '1.2' }}>Root Admin</p>
              <p style={{ fontSize: '12px', color: '#9099b8' }}>Sistem Yöneticisi</p>
            </div>
            <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #4361ee, #7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="white" />
            </div>
          </div>

          {/* Return to Site */}
          <a
            href="/"
            title="Siteye Dön"
            style={{ color: '#9099b8', background: 'none', border: '1.5px solid #dde3f4', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#4361ee'; e.currentTarget.style.borderColor = '#4361ee'; e.currentTarget.style.backgroundColor = '#eef1ff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9099b8'; e.currentTarget.style.borderColor = '#dde3f4'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Plug size={17} />
            Siteye Dön
          </a>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Çıkış Yap"
            style={{ color: '#9099b8', background: 'none', border: '1.5px solid #dde3f4', padding: '7px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9099b8'; e.currentTarget.style.borderColor = '#dde3f4'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>

      {/* ── Bottom Nav Row ── */}
      <nav className="bottom-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '0 28px', overflowX: 'auto', backgroundColor: '#fff' }}>
        <NavItem to="/"             icon={Mail}       label="Gelen Kutusu" />
        <NavItem to="/reports"      icon={BarChart2}  label="Raporlar" />
        <NavItem to="/faq"          icon={HelpCircle} label="SSS Yönetimi" />
        <NavItem to="/settings"     icon={Settings}   label="Sistem Ayarları" />
      </nav>
    </header>
  );
};

export default Navbar;
