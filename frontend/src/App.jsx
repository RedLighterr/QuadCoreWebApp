import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, Cpu, Search, History, Plus, MessageSquare, Menu, X, Clock, Edit, Aperture, MoreHorizontal, Pin, Trash2, BookOpen, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Iletisim from './pages/Iletisim';
import Sss from './pages/Sss';
import Gizlilik from './pages/Gizlilik';
import Kullanim from './pages/Kullanim';
import { getSettings, getSearchHistory, saveSearchHistory } from './services/api';

function Sidebar({ isOpen, setIsOpen, siteName }) {
  const [isHovered, setIsHovered] = useState(false);
  const [items, setItems] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  // Aktif bir etkileşim varken (dropdown, rename, silme onayı) hover daralmasın
  const interactionLocked = activeDropdown !== null || renamingId !== null || itemToDelete !== null;
  const isExpanded = isOpen || isHovered || interactionLocked;

  // Hover daraltma için debounce ref'leri — fare kısa süreli çıksa bile sidebar kapanmasın
  const hoverCloseTimer = React.useRef(null);
  const hoverOpenTimer = React.useRef(null);

  const handleMouseEnter = React.useCallback(() => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
    if (hoverOpenTimer.current) return;
    // Çok hızlı geçişlerde anlık açılmasın — küçük gecikme stabilite sağlar
    hoverOpenTimer.current = setTimeout(() => {
      setIsHovered(true);
      hoverOpenTimer.current = null;
    }, 80);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    if (hoverOpenTimer.current) {
      clearTimeout(hoverOpenTimer.current);
      hoverOpenTimer.current = null;
    }
    if (hoverCloseTimer.current) return;
    // Kapanırken biraz beklesin (dropdown'a ulaşmaya çalışan kullanıcı için tolerans)
    hoverCloseTimer.current = setTimeout(() => {
      setIsHovered(false);
      hoverCloseTimer.current = null;
    }, 220);
  }, []);

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
      if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current);
    };
  }, []);

  // Geçmişi başlangıçta yükle ve diğer sekmelerden gelen güncellemeleri dinle
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getSearchHistory();
      if (mounted && Array.isArray(data)) setItems(data);
    })();

    const handleHistoryUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setItems(e.detail);
      } else {
        getSearchHistory().then(d => Array.isArray(d) && setItems(d));
      }
    };
    window.addEventListener('searchHistoryUpdated', handleHistoryUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('searchHistoryUpdated', handleHistoryUpdate);
    };
  }, []);

  // items state'i değişince backend'e kaydet (ilk yükleme hariç)
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveSearchHistory(items).catch(err => console.error('[Sidebar] geçmiş kaydedilemedi:', err.message));
  }, [items]);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.history-dropdown-wrapper')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
    setItemToDelete(null);
  };

  const handlePin = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, pinned: !item.pinned } : item));
    setActiveDropdown(null);
  };

  const handleRenameStart = (item) => {
    setRenamingId(item.id);
    setRenameValue(item.label);
    setActiveDropdown(null);
  };

  const handleRenameSubmit = (id) => {
    if (renameValue.trim()) {
      setItems(items.map(item => item.id === id ? { ...item, label: renameValue.trim() } : item));
    }
    setRenamingId(null);
  };

  const sortedItems = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 90 }}
          className="mobile-backdrop"
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: isExpanded ? '220px' : '64px',
          minWidth: isExpanded ? '220px' : '64px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 60,
          transition: 'width 0.28s cubic-bezier(0.32, 0.72, 0.24, 1), min-width 0.28s cubic-bezier(0.32, 0.72, 0.24, 1), box-shadow 0.2s ease',
          boxShadow: isExpanded && !isOpen ? '4px 0 24px rgba(15, 23, 42, 0.08)' : 'none',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          willChange: 'width',
        }}>
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: isExpanded ? 'flex-start' : 'center', 
            gap: '16px'
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', marginLeft: isExpanded ? '0' : '-2px', transition: 'all 0.2s' }}>
            <div style={{ width: 28, height: 28, borderRadius: '6px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Aperture size={16} color="#fff" />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap', display: isExpanded ? 'block' : 'none' }}>
              {siteName || 'SourceFlow'}
            </span>
          </Link>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            title="Menü"
            style={{ 
              background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', padding: '6px', marginLeft: '-4px', borderRadius: '50%',
              transition: 'background 0.2s', flexShrink: 0 
            }}
            className="hamburger-btn"
          >
            <Menu size={20} />
          </button>

          <button 
            onClick={() => setIsOpen(false)} 
            title="Menüyü Kapat"
            style={{ 
              background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', 
              display: 'none', alignItems: 'center', padding: '6px', marginLeft: '-4px', borderRadius: '50%',
              transition: 'background 0.2s', flexShrink: 0 
            }}
            className="mobile-close-sidebar-btn"
          >
            <X size={20} />
          </button>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? "Paneli Daralt" : "Paneli Genişlet"}
            style={{ 
              background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', padding: '6px', marginLeft: '-4px', borderRadius: '50%',
              transition: 'background 0.2s', flexShrink: 0 
            }}
            className="hamburger-btn"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 8px', overflowX: 'hidden' }}>
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Link to="/" className="sidebar-history-item" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
              color: 'var(--text-main)', fontSize: '0.88rem', textDecoration: 'none',
              justifyContent: isExpanded ? 'flex-start' : 'center',
              fontWeight: '500'
            }}>
              <Edit size={18} style={{ flexShrink: 0 }} />
              <span style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s ease' }}>Yeni Analiz</span>
            </Link>

            <Link to="/" className="sidebar-history-item" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
              color: 'var(--text-main)', fontSize: '0.88rem', textDecoration: 'none',
              justifyContent: isExpanded ? 'flex-start' : 'center',
              fontWeight: '500'
            }}>
              <Search size={18} style={{ flexShrink: 0 }} />
              <span style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s ease' }}>Arama Yap</span>
            </Link>
          </div>

          <p style={{
            color: 'var(--text-dim)', fontSize: '0.72rem', fontWeight: '600', letterSpacing: '1px',
            padding: isExpanded ? '0 8px' : '0', marginBottom: '10px', textTransform: 'uppercase',
            textAlign: isExpanded ? 'left' : 'center', opacity: isExpanded ? 1 : 0, transition: 'all 0.2s ease'
          }}>
            {isExpanded ? 'Geçmiş' : ''}
          </p>

          <div style={{
            opacity: isExpanded ? 1 : 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: isExpanded ? 'auto' : 'none',
            visibility: isExpanded ? 'visible' : 'hidden'
          }}>
            {sortedItems.map(item => (
              <div
                key={item.id}
                className="sidebar-history-item"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'all 0.15s',
                  marginBottom: '4px', position: 'relative'
                }}
              >
                {renamingId === item.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSubmit(item.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(item.id); if (e.key === 'Escape') setRenamingId(null); }}
                    style={{ flex: 1, background: 'rgba(0,0,0,0.05)', border: '1px solid var(--accent)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none' }}
                  />
                ) : (
                  <Link
                    to={`/?q=${encodeURIComponent(item.label)}`}
                    style={{ textDecoration: 'none', color: 'inherit', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                    title={item.label}
                  >
                    {item.pinned && <Pin size={12} style={{ flexShrink: 0, color: 'var(--accent)' }} />}
                    {item.label}
                  </Link>
                )}

                <div className="history-dropdown-wrapper">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === item.id ? null : item.id);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === item.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute', right: '0', top: '30px',
                          background: '#1e293b', color: '#fff', borderRadius: '8px',
                          padding: '6px', minWidth: '160px', zIndex: 100,
                          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                          display: 'flex', flexDirection: 'column', gap: '2px'
                        }}
                      >
                        {[
                          { icon: <Pin size={14} />, text: item.pinned ? 'Sabitlemeyi Kaldır' : 'Sabitle', action: () => handlePin(item.id) },
                          { icon: <Edit size={14} />, text: 'Yeniden adlandır', action: () => handleRenameStart(item) },
                          { icon: <Trash2 size={14} />, text: 'Sil', action: () => { setActiveDropdown(null); setItemToDelete(item); } }
                        ].map((btn, i) => (
                          <button key={i} onClick={(e) => { e.stopPropagation(); btn.action(); }} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            background: 'none', border: 'none', color: '#e2e8f0',
                            padding: '8px 10px', borderRadius: '5px', cursor: 'pointer',
                            fontSize: '0.85rem', width: '100%', textAlign: 'left',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                          >
                            {btn.icon} {btn.text}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 22, height: 22, borderRadius: '4px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Cpu size={12} color="#fff" />
          </div>
          {isExpanded && <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{siteName || 'SourceFlow'} AI</span>}
        </div>
      </aside>

      <AnimatePresence>
        {itemToDelete && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setItemToDelete(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              style={{
                background: 'var(--bg-card)', padding: '24px', borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', zIndex: 10000,
                width: '90%', maxWidth: '350px', textAlign: 'center',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Trash2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '8px' }}>Analizi Sil</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
                <strong>"{itemToDelete.label}"</strong> analizini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="cookie-btn-outline" 
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', fontWeight: '600' }}
                >İptal</button>
                <button 
                  onClick={() => handleDelete(itemToDelete.id)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', background: '#ef4444', border: 'none', color: '#fff', fontWeight: '600', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                >Sil</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function TopNav({ isSidebarOpen, setIsSidebarOpen, siteName }) {
  const location = useLocation();
  const navLinks = [
    { to: '/', label: 'Ana Sayfa' },
    { to: '/about', label: 'Hakkımızda' },
    { to: '/iletisim', label: 'İletişim' },
    { to: '/sss', label: 'SSS' }
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: isSidebarOpen ? '220px' : '64px', right: 0,
      height: '52px', zIndex: 40,
      background: 'rgba(255,255,255,0.85)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      transition: 'left 0.28s cubic-bezier(0.32, 0.72, 0.24, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {!isSidebarOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: '700' }}>
            <Cpu size={18} color="var(--accent)" /> {siteName || 'SourceFlow'}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
        {navLinks.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: '500',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                background: isActive ? 'rgba(2, 132, 199, 0.1)' : 'transparent',
                transition: 'all 0.15s',
              }}
              className="top-nav-link"
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <div style={{ width: '40px' }}></div>
    </nav>
  );
}

function Footer({ siteName }) {
  return (
    <footer style={{
      background: 'var(--bg-sidebar)',
      borderTop: '1px solid var(--border)',
      padding: '40px 0',
      marginTop: 'auto',
      width: '100%'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: '700', fontSize: '1.2rem' }}>
            <Cpu size={20} color="var(--accent)" /> {siteName || 'SourceFlow'} AI
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
            Akıllı tedarik zinciri optimizasyonu ile donanım üretim süreçlerinizi hızlandırın. En iyi parçaları en uygun fiyata bulun.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '50px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600' }}>Platform</h4>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Arama Motoru</Link>
            <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Hakkımızda</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', background: '#fee' }}>
          <h2>BİR HATA OLUŞTU!</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{ fontSize: '10px' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (data) setSiteSettings(data);
      } catch (err) {
        console.error('Ayarlar çekilirken hata:', err);
      }
    };
    fetchSettings();
  }, []);

  const siteName = siteSettings?.siteName;

  return (
    <ErrorBoundary>
      <Router>
        <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text-main)', display: 'flex' }}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} siteName={siteName} />
        
        <div className="main-wrapper" style={{ 
          flex: 1, 
          marginLeft: isSidebarOpen ? '220px' : '64px', 
          transition: 'margin-left 0.28s cubic-bezier(0.32, 0.72, 0.24, 1)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%'
        }}>
          <TopNav isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} siteName={siteName} />
          
          <div style={{ paddingTop: '52px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/iletisim" element={<Iletisim />} />
              <Route path="/sss" element={<Sss />} />
              <Route path="/gizlilik" element={<Gizlilik />} />
              <Route path="/kullanim" element={<Kullanim />} />
            </Routes>
            <Footer siteName={siteName} />
          </div>
        </div>
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
