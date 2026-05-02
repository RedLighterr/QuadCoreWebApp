import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, Cpu, Search, History, Plus, MessageSquare, Menu, X, Clock, Edit, Aperture, PanelLeftOpen, PanelLeftClose, MoreHorizontal, Pin, Trash2, BookOpen, HelpCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Iletisim from './pages/Iletisim';
import Sss from './pages/Sss';
import Gizlilik from './pages/Gizlilik';
import Kullanim from './pages/Kullanim';



function Sidebar({ isOpen, setIsOpen }) {
  const [isHovered, setIsHovered] = useState(false);
  const [items, setItems] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const isExpanded = isOpen || isHovered;

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

  // Sort: pinned items first
  const sortedItems = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 90 }}
          className="mobile-backdrop"
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: isExpanded ? '200px' : '64px',
          minWidth: isExpanded ? '200px' : '64px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 60,
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isHovered && !isOpen ? '4px 0 15px rgba(0,0,0,0.05)' : 'none',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
        {/* Top Section: Navigation Controls */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          style={{ 
            padding: '14px 18px', 
            borderBottom: '1px solid var(--border)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: isExpanded ? 'flex-start' : 'center', 
            gap: '16px'
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', marginLeft: isExpanded ? '0' : '-2px', transition: 'all 0.2s' }}>
            <div style={{ width: 28, height: 28, borderRadius: '6px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Aperture size={16} color="#fff" />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap', display: isExpanded ? 'block' : 'none' }}>
              SourceFlow
            </span>
          </Link>

          {/* Row 1: Hamburger Menu (PC) */}
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

          {/* Mobile Close Button (Sadece Mobilde Görünür) */}
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

          {/* Row 2: Panel Toggle */}
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
            {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 8px', overflowX: 'hidden' }}>
          {/* Quick Actions */}
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

          {/* History List */}
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
                    to={`/?q=${item.label}`}
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

        {/* Bottom Logo */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 22, height: 22, borderRadius: '4px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Cpu size={12} color="#fff" />
          </div>
          {isExpanded && <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>SourceFlow AI</span>}
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
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

function TopNav({ isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();
  const navLinks = [
    { to: '/', label: 'Ana Sayfa' },
    { to: '/about', label: 'Hakkımızda' },
    { to: '/iletisim', label: 'İletişim' }
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: isSidebarOpen ? '200px' : '64px', right: 0,
      height: '52px', zIndex: 40,
      background: 'rgba(255,255,255,0.85)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      transition: 'left 0.2s ease'
    }}>
      {/* Left side: Hamburger if sidebar is closed */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {!isSidebarOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: '700' }}>
            <Cpu size={18} color="var(--accent)" /> SourceFlow
          </div>
        )}
      </div>

      {/* Nav Links - centered */}
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

      {/* Right - Admin Link only (User login removed) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      </div>
    </nav>
  );
}

function Footer() {
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
            <Cpu size={20} color="var(--accent)" /> SourceFlow AI
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
            Akıllı tedarik zinciri optimizasyonu ile donanım üretim süreçlerinizi hızlandırın. En iyi parçaları en uygun fiyata bulun.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'} title="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'} title="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'} title="X (Twitter)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </a>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '50px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600' }}>Platform</h4>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Arama Motoru</Link>
            <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Hakkımızda</Link>
            <Link to="/iletisim" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>İletişim</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600' }}>Yasal</h4>
            <Link to="/gizlilik" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Gizlilik Politikası</Link>
            <Link to="/kullanim" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Kullanım Şartları</Link>
            <Link to="/sss" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>S.S.S.</Link>
          </div>
        </div>
      </div>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '30px auto 0 auto', 
        padding: '20px 20px 0 20px', 
        borderTop: '1px solid var(--border)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: 'var(--text-dim)', 
        fontSize: '0.8rem' 
      }}>
        <div>&copy; {new Date().getFullYear()} SourceFlow AI. Tüm hakları saklıdır.</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#" style={{ color: 'var(--text-dim)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'} title="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="#" style={{ color: 'var(--text-dim)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'} title="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" style={{ color: 'var(--text-dim)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'} title="X (Twitter)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

function PageTitleUpdater() {
  const location = useLocation();
  useEffect(() => {
    const titles = {
      '/': 'SourceFlow AI | Akıllı Tedarik ve Komponent Analiz Aracı',
      '/about': 'Hakkımızda | SourceFlow AI',
      '/iletisim': 'İletişim | SourceFlow AI',
      '/sss': 'Sıkça Sorulan Sorular | SourceFlow AI',
      '/gizlilik': 'Gizlilik Politikası | SourceFlow AI',
      '/kullanim': 'Kullanım Şartları | SourceFlow AI',
    };
    document.title = titles[location.pathname] || 'SourceFlow AI';
  }, [location]);
  return null;
}

function CookieConsent() {
  const [visible, setVisible] = useState(!localStorage.getItem('cookieConsent'));
  if (!visible) return null;
  return (
    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', zIndex: 1000, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '20px', maxWidth: '800px', flexWrap: 'wrap' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1, margin: 0 }}>
          Deneyiminizi geliştirmek için çerezleri kullanıyoruz. Sitemizi kullanarak çerez politikamızı kabul etmiş olursunuz.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/gizlilik" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>Detaylı Bilgi</Link>
          <button onClick={() => { localStorage.setItem('cookieConsent', 'true'); setVisible(false); }} className="premium-button" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Anladım</button>
        </div>
      </div>
    </motion.div>
  );
}

function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 1000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} style={{ position: 'absolute', bottom: '70px', right: 0, width: '300px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--accent)', padding: '20px', color: '#fff' }}>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Müşteri Desteği</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.9 }}>Size nasıl yardımcı olabiliriz?</p>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => window.location.href='/iletisim'} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                <MessageSquare size={16} color="var(--accent)" />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Bize Mesaj Gönderin</span>
              </button>
              <button onClick={() => window.location.href='/sss'} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                <HelpCircle size={16} color="var(--accent)" />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Sıkça Sorulan Sorular</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setIsOpen(!isOpen)} style={{ width: '56px', height: '56px', borderRadius: '28px', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(2, 132, 199, 0.3)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <PageTitleUpdater />
      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text-main)', display: 'flex' }}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Main Wrapper */}
        <div className="main-wrapper" style={{ 
          flex: 1, 
          marginLeft: isSidebarOpen ? '200px' : '64px', 
          transition: 'margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%'
        }}>
          <TopNav isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          
          {/* Page content offset for navbar */}
          <div style={{ paddingTop: '52px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/iletisim" element={<Iletisim />} />
              <Route path="/sss" element={<Sss />} />
              <Route path="/gizlilik" element={<Gizlilik />} />
              <Route path="/kullanim" element={<Kullanim />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </div>

      <CookieConsent />
      <SupportWidget />

      <style>{`
        .sidebar-history-item:hover { background: rgba(0,0,0,0.04) !important; color: var(--text-main) !important; }
        .top-nav-link:hover { background: rgba(0,0,0,0.04) !important; color: var(--text-main) !important; }
        .admin-link:hover { background: rgba(0,0,0,0.04) !important; color: var(--text-main) !important; }
        .hamburger-btn:hover { background: rgba(0,0,0,0.06) !important; }
        .cookie-btn-outline:hover { background: var(--bg-sidebar) !important; border-color: var(--text-dim) !important; }
      `}</style>
    </Router>
  );
}

export default App;
