import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { getFAQs, addFAQ, deleteFAQ } from '../services/api';
import { sanitizeInput, containsXSS } from '../services/security';

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  backgroundColor: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  borderRadius: '10px',
  fontSize: '14px',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
};

const FAQ = () => {
  const [faqs, setFaqs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [isAdding, setIsAdding]   = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer]     = useState('');
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState({ type: '', text: '' });
  const submittingRef             = useRef(false); // double-submit önleci

  useEffect(() => { fetchFAQs(); }, []);

  const fetchFAQs = async () => {
    try {
      const res = await getFAQs();
      if (res.success) setFaqs(res.data);
    } catch (error) {
      console.error('SSS yüklenemedi', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    // XSS kontrol
    if (containsXSS(newQuestion) || containsXSS(newAnswer)) {
      setSaveMsg({ type: 'error', text: 'Güvenlik ihlali: geçersiz karakter.' });
      return;
    }

    // Çift gönderim önleci
    if (submittingRef.current || saving) return;
    submittingRef.current = true;
    setSaving(true);
    setSaveMsg({ type: '', text: '' });

    try {
      const res = await addFAQ(newQuestion, newAnswer);
      if (res.success) {
        // Liste içinde ID kontrolü yaparak state'e ekle (ekstra güvenlik)
        setFaqs(prev => {
          if (prev.some(f => f.id === res.data.id)) return prev;
          return [...prev, res.data];
        });
        setNewQuestion('');
        setNewAnswer('');
        setSaveMsg({ type: 'success', text: 'SSS başarıyla eklendi!' });
        setTimeout(() => setSaveMsg({ type: '', text: '' }), 3000);
      } else {
        setSaveMsg({ type: 'error', text: res.message || 'Eklenemedi.' });
      }
    } catch (error) {
      setSaveMsg({ type: 'error', text: 'Bir hata oluştu.' });
    } finally {
      setSaving(false);
      submittingRef.current = false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;
    try {
      const res = await deleteFAQ(id);
      if (res.success) setFaqs(faqs.filter(f => f.id !== id));
    } catch (error) {
      console.error('SSS Silinemedi', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{
          width: '36px', height: '36px',
          border: '3px solid var(--border-color)',
          borderTop: '3px solid var(--accent-blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .faq-input:focus { border-color: var(--accent-blue) !important; box-shadow: 0 0 0 3px var(--input-focus-ring) !important; }
        .faq-item:hover { border-color: var(--border-hover) !important; }
        .del-btn:hover { color: #ef4444 !important; background: rgba(239,68,68,0.08) !important; }
      `}</style>

      {/* Header */}
      <header style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{
            fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <HelpCircle size={24} color="var(--accent-blue)" /> Sıkça Sorulan Sorular
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Misafir sitesinde gösterilecek olan SSS içeriklerini buradan yönetebilirsiniz.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              border: 'none', borderRadius: '10px',
              color: 'white', fontSize: '14px', fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(67,97,238,0.3)',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            <Plus size={16} /> Yeni Ekle
          </button>
        )}
      </header>

      {/* Add Form */}
      {isAdding && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderTop: '3px solid var(--accent-blue)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          animation: 'fadeIn 0.3s ease',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h3 style={{ fontWeight: '700', fontSize: '17px', color: 'var(--text-primary)', marginBottom: '18px' }}>
            Yeni Soru Ekle
          </h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Soru</label>
              <input
                className="faq-input"
                type="text"
                style={inputStyle}
                placeholder="Örn: Sisteme nasıl üye olurum?"
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Cevap</label>
              <textarea
                className="faq-input"
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
                placeholder="Bu sorunun cevabını yazın..."
                value={newAnswer}
                onChange={e => setNewAnswer(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
              {/* Durum mesajı */}
              {saveMsg.text && (
                <div style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '13px', fontWeight: '600',
                  color: saveMsg.type === 'success' ? '#16a34a' : '#dc2626',
                  padding: '8px 12px',
                  background: saveMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${saveMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                  borderRadius: '8px',
                }}>
                  {saveMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                  {saveMsg.text}
                </div>
              )}
              <button
                type="button"
                onClick={() => { setIsAdding(false); setSaveMsg({ type: '', text: '' }); }}
                style={{
                  padding: '9px 18px', background: 'none',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Kapat
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '9px 22px',
                  background: saving ? '#d1fae5' : 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none', borderRadius: '10px',
                  color: saving ? '#6b7280' : 'white', fontSize: '14px', fontWeight: '700',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  boxShadow: saving ? 'none' : '0 4px 12px rgba(16,185,129,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                {saving ? 'Ekleniyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {faqs.map(faq => (
          <div
            key={faq.id}
            className="faq-item"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px', padding: '20px',
              display: 'flex', justifyContent: 'space-between', gap: '16px',
              alignItems: 'flex-start',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {faq.question}
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                {faq.answer}
              </p>
            </div>
            <button
              className="del-btn"
              onClick={() => handleDelete(faq.id)}
              title="Sil"
              style={{
                color: 'var(--text-muted)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px', borderRadius: '8px',
                transition: 'all 0.2s ease', flexShrink: 0,
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {faqs.length === 0 && !loading && (
          <div style={{
            textAlign: 'center', padding: '48px 32px',
            backgroundColor: 'var(--bg-card)',
            border: '2px dashed var(--border-color)',
            borderRadius: '16px',
          }}>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Henüz eklenmiş bir Sıkça Sorulan Soru bulunmuyor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
