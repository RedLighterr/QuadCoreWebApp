import React, { useState, useEffect } from 'react';
import { Mail, Reply, Trash2, User, ArrowLeft, MessageCircle } from 'lucide-react';
import { getMessages, replyMessage, markAsRead, deleteMessage } from '../services/api';

// Navbar'ı anlık güncellemek için event fırlat
const notifyNavbar = () => window.dispatchEvent(new Event('messagesUpdated'));

const Messages = () => {
  const [messages, setMessages]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText]         = useState('');
  const [sending, setSending]             = useState(false);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const res = await getMessages();
      if (res.success) setMessages(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    if (selectedMessage?.id === id) setSelectedMessage(prev => ({ ...prev, isRead: true }));
    notifyNavbar(); // Zili güncelle
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    await deleteMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
    notifyNavbar(); // Zili anlık güncelle
  };

  const handleSelect = (msg) => {
    setSelectedMessage(msg);
    setReplyText('');
    if (!msg.isRead) handleMarkRead(msg.id);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;
    setSending(true);
    try {
      await replyMessage(selectedMessage.id, replyText);
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, reply: replyText, isRead: true } : m));
      setSelectedMessage(prev => ({ ...prev, reply: replyText, isRead: true }));
      setReplyText('');
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
      <div style={{ width: '30px', height: '30px', border: '3px solid #dde3f4', borderTop: '3px solid #4361ee', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const card = { backgroundColor: '#fff', border: '1px solid #dde3f4', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' };

  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.4s ease' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .msg-row { transition: all 0.18s; cursor: pointer; }
        .msg-row:hover { background: #f4f6fd !important; border-color: #c7d0f5 !important; }
        .msg-row.active { background: #eef1ff !important; border-color: #4361ee !important; }
        .del-btn { opacity: 0; transition: opacity 0.15s; }
        .msg-row:hover .del-btn { opacity: 1; }
        .messages-grid { display: grid; grid-template-columns: 380px 1fr; gap: 24px; align-items: start; }
        @media (max-width: 900px) {
          .messages-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1e38', marginBottom: '4px' }}>Gelen Kutusu</h2>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>İletişim formundan gelen mesajları yönetin.</p>
      </header>

      <div className="messages-grid">

        {/* ── Mesaj Listesi ── */}
        <div style={{ ...card, padding: '18px', height: '700px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1e38', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#4361ee" /> Mesajlar
            </h3>
            {messages.filter(m => !m.isRead).length > 0 && (
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#4361ee', backgroundColor: '#eef1ff', padding: '2px 10px', borderRadius: '20px' }}>
                {messages.filter(m => !m.isRead).length} Yeni
              </span>
            )}
          </div>

          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9099b8' }}>
                <Mail size={32} style={{ opacity: 0.3, marginBottom: '10px' }} /><br />Henüz mesaj yok.
              </div>
            ) : messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`msg-row ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                style={{ padding: '14px', border: '1px solid #dde3f4', borderRadius: '14px', position: 'relative', background: msg.isRead ? '#fff' : '#fafbff' }}
              >
                {!msg.isRead && (
                  <div style={{ position: 'absolute', top: '14px', right: '14px', width: '8px', height: '8px', backgroundColor: '#4361ee', borderRadius: '50%' }} />
                )}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ width: '34px', height: '34px', backgroundColor: '#f4f6fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={16} color="#9099b8" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: '800', fontSize: '13px', color: '#1a1e38', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.name}</p>
                    <p style={{ fontSize: '11px', color: '#9099b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.email}</p>
                  </div>
                </div>
                <p style={{ fontWeight: '700', fontSize: '13px', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(msg.date).toLocaleDateString('tr-TR')}</span>
                  <button
                    className="del-btn"
                    onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '3px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mesaj Detayı ── */}
        <div style={{ ...card, height: '700px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedMessage ? (
            <>
              {/* Başlık */}
              <div style={{ padding: '24px', borderBottom: '1px solid #f0f2fa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <button onClick={() => setSelectedMessage(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#4361ee', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                    <ArrowLeft size={16} /> Geri
                  </button>
                  <button onClick={() => handleDelete(selectedMessage.id)}
                    style={{ padding: '7px 12px', border: '1px solid #fecaca', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700' }}>
                    <Trash2 size={13} /> Sil
                  </button>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#1a1e38', marginBottom: '4px' }}>{selectedMessage.subject}</h3>
                <p style={{ fontSize: '13px', color: '#9099b8' }}>
                  Gönderen: <strong style={{ color: '#556088' }}>{selectedMessage.name}</strong> · {selectedMessage.email}
                </p>
              </div>

              {/* Mesaj İçeriği */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#fcfdff' }}>
                <div style={{ backgroundColor: '#fff', border: '1px solid #dde3f4', borderRadius: '16px', padding: '20px', lineHeight: '1.7', fontSize: '15px', color: '#374151' }}>
                  {selectedMessage.content}
                </div>

                {selectedMessage.reply && (
                  <div style={{ marginTop: '20px', padding: '18px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#166534', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Reply size={13} /> SİZİN YANITINIZ
                    </p>
                    <p style={{ fontSize: '14px', color: '#166534', lineHeight: '1.6' }}>{selectedMessage.reply}</p>
                  </div>
                )}
              </div>

              {/* Yanıt Formu */}
              {!selectedMessage.reply && (
                <div style={{ padding: '20px', borderTop: '1px solid #f0f2fa', backgroundColor: '#fff' }}>
                  <form onSubmit={handleReply}>
                    <textarea
                      placeholder="Yanıtınızı yazın..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      style={{ width: '100%', minHeight: '110px', padding: '14px', border: '1.5px solid #dde3f4', borderRadius: '12px', outline: 'none', resize: 'none', fontSize: '14px', marginBottom: '12px', fontFamily: 'inherit' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button disabled={sending || !replyText.trim()}
                        style={{ padding: '11px 22px', background: 'linear-gradient(135deg, #4361ee, #7c3aed)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        {sending ? 'Gönderiliyor...' : <><Reply size={15} /> Yanıtla</>}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9099b8' }}>
              <MessageCircle size={52} style={{ opacity: 0.15, marginBottom: '16px' }} />
              <p style={{ fontWeight: '700', fontSize: '15px' }}>Okumak için bir mesaj seçin</p>
              <p style={{ fontSize: '13px', marginTop: '6px' }}>{messages.filter(m => !m.isRead).length > 0 ? `${messages.filter(m => !m.isRead).length} okunmamış mesajınız var` : 'Tüm mesajlar okundu'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
