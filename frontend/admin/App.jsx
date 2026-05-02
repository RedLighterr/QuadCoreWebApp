import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, BarChart2, Plug } from 'lucide-react';
import Navbar from './components/Navbar';
import Messages from './pages/Messages';
import FAQ from './pages/FAQ';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Placeholder from './pages/Placeholder';
import { getSettings } from './services/api';

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ auth, children }) => {
  if (!auth) return <Navigate to="/login" replace />;
  return children;
};

// ─── Admin Layout ─────────────────────────────────────────────────────────────
const AdminLayout = ({ onLogout }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f8faff',
    color: '#1a1e38',
    fontFamily: "'Outfit', 'Inter', sans-serif",
  }}>
    <Navbar onLogout={onLogout} />
    <div className="main-container" style={{ flex: 1, width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
      <Routes>
        <Route path="/"             element={<Messages />} />
        <Route path="/reports"      element={<Placeholder title="Raporlar" description="Genel sistem analiz raporları." icon={BarChart2} />} />
        <Route path="/faq"          element={<FAQ />} />
        <Route path="/settings"     element={<Settings />} />
        <Route path="*"             element={<Messages />} />
      </Routes>
    </div>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [auth, setAuth] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const res = await getSettings();
        if (res.success) {
          // SEO Senkronizasyonu
          document.title = res.data.siteName;
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.name = "description";
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', res.data.siteDescription);
        }
      } catch (e) { console.error("SEO Init Error", e); }
      setIsInitializing(false);
    };
    initApp();
  }, []);

  const handleLogout = () => setAuth(null);

  if (isInitializing) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#f8faff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '30px', height: '30px', border: '3px solid #dde3f4', borderTop: '3px solid #4361ee', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          auth ? <Navigate to="/" replace /> : <Login setAuth={setAuth} />
        } />
        <Route path="/*" element={
          <ProtectedRoute auth={auth}>
            <AdminLayout onLogout={handleLogout} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
