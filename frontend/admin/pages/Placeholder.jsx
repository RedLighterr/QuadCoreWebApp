import React from 'react';

const Placeholder = ({ title, description, icon: Icon }) => {
  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.4s ease' }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <header style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontSize: '24px', fontWeight: '800',
          color: 'var(--text-primary)', marginBottom: '4px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          {Icon && <Icon size={24} color="var(--accent-blue)" />}
          {title}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{description}</p>
      </header>

      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '2px dashed var(--border-color)',
        borderRadius: '20px',
        padding: '64px 32px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div style={{
          width: '72px', height: '72px',
          background: 'linear-gradient(135deg, rgba(67,97,238,0.1), rgba(124,58,237,0.1))',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px',
          color: 'var(--text-muted)',
        }}>
          {Icon ? <Icon size={34} /> : <div style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid var(--border-color)' }} />}
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
          Bu modül yakında aktif edilecek
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: '1.7' }}>
          Sistem altyapısı şu anda hazırlanıyor. <strong style={{ color: 'var(--text-primary)' }}>{title}</strong> modülü aktif edildiğinde buradan tüm işlemleri gerçekleştirebileceksiniz.
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
