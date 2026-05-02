import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, ShieldAlert, Clock } from 'lucide-react';
import { login } from '../services/api';
import {
  checkBanStatus,
  getRemainingBanTime,
  recordFailedAttempt,
  clearBan,
  getAttemptCount,
  containsXSS,
  sanitizeInput,
} from '../services/security';

const Login = ({ setAuth }) => {
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState('');
  const [banUntil, setBanUntil]       = useState(null);
  const [remainingTime, setRemainingTime] = useState('');
  const [attemptsLeft, setAttemptsLeft]   = useState(5);
  const [shake, setShake]             = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // ── Ban kontrolü ──
  useEffect(() => {
    const ban = checkBanStatus();
    if (ban) {
      setBanUntil(ban);
      setAttemptsLeft(0);
    } else {
      setAttemptsLeft(5 - getAttemptCount());
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (!banUntil) return;
    const tick = () => {
      const remaining = banUntil - Date.now();
      if (remaining <= 0) {
        clearBan();
        setBanUntil(null);
        setAttemptsLeft(5);
        clearInterval(timerRef.current);
      } else {
        setRemainingTime(getRemainingBanTime(banUntil));
      }
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [banUntil]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Güvenlik kontrolleri
    const currentBan = checkBanStatus();
    if (currentBan) { setBanUntil(currentBan); return; }

    if (containsXSS(username) || containsXSS(password)) {
      setError('Güvenlik ihlali tespit edildi.');
      setShake(true); setTimeout(() => setShake(false), 500);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await login(sanitizeInput(username), password);
      if (response.success) {
        clearBan();
        if (setAuth) setAuth(response.user); // App.jsx'teki setAuth'u tetikle
        localStorage.setItem('admin_token', response.token);
        navigate('/');
      }
    } catch (err) {
      const result = recordFailedAttempt();
      if (result.banned) {
        setBanUntil(result.banUntil);
        setAttemptsLeft(0);
      } else {
        setAttemptsLeft(result.attemptsLeft);
        setError(err.message || 'Kullanıcı adı veya şifre hatalı.');
        setShake(true); setTimeout(() => setShake(false), 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    flex: 1, padding: '12px 16px', background: '#f8f9ff', border: '1.5px solid #dde3f4', borderRadius: '12px', fontSize: '14px', outline: 'none', transition: 'all 0.2s ease'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8eeff 0%, #f0f4ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', animation: 'fadeIn 0.5s ease' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', transform: shake ? 'translateX(0)' : 'none', animation: shake ? 'shake 0.4s ease' : 'none' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #4361ee, #7c3aed)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <ShieldAlert color="white" size={28} />
            </div>
            <h2 style={{ fontWeight: '800', fontSize: '22px', color: '#1a1e38' }}>Yönetici Girişi</h2>
          </div>

          {error && <div style={{ marginBottom: '16px', padding: '10px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={16} /> {error}</div>}

          {banUntil ? (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <Clock size={32} color="#ef4444" style={{ marginBottom: '10px' }} />
              <p style={{ color: '#ef4444', fontWeight: '700' }}>Kilitlendi: {remainingTime}</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4361ee', marginBottom: '6px' }}>Kullanıcı Adı</label>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <User size={18} color="#9099b8" style={{ position: 'absolute', left: '12px' }} />
                  <input type="text" style={{ ...inputStyle, paddingLeft: '40px' }} placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4361ee', marginBottom: '6px' }}>Şifre</label>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <Lock size={18} color="#9099b8" style={{ position: 'absolute', left: '12px' }} />
                  <input type={showPassword ? 'text' : 'password'} style={{ ...inputStyle, paddingLeft: '40px', paddingRight: '40px' }} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#9099b8' }}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', background: isLoading ? '#a5b4fc' : 'linear-gradient(135deg, #4361ee, #7c3aed)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(67,97,238,0.3)', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {isLoading ? 'Giriş Yapılıyor...' : <>Giriş Yap <ArrowRight size={18} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
      `}</style>
    </div>
  );
};

export default Login;
