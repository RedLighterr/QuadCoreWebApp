import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Eye, Globe, Zap, Shield, Cpu, Code2, Database,
  Sparkles, MapPin, Layers, GitBranch, ArrowRight, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSettings } from '../services/api';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
};

// Gerçekçi rakamlar — projenin mevcut durumunu yansıtır
const facts = [
  { value: '7', label: 'Entegre Tedarikçi', icon: <Globe size={20} />, sub: 'TR + Global' },
  { value: '3', label: 'Para Birimi', icon: <Database size={20} />, sub: 'EUR · USD · TRY' },
  { value: 'AI', label: 'Fiyat Önerisi', icon: <Sparkles size={20} />, sub: 'Gemini 2.5 Lite' },
  { value: 'Beta', label: 'Geliştirme Aşaması', icon: <GitBranch size={20} />, sub: 'Açık kaynak' },
];

const capabilities = [
  {
    icon: <Layers size={22} />,
    title: 'Çok kanallı tarama',
    desc: 'Mouser/DigiKey (FindChips üzerinden), Robotistan, Robolink, Robo90, Direnç.net ve Komponentci.net üzerinden eşzamanlı sorgu.'
  },
  {
    icon: <MapPin size={22} />,
    title: 'TR / Global ayrımı',
    desc: 'Yerli stok ve global distribütör fiyatları ayrı gruplarda gösterilir; aralarındaki fark yüzde olarak hesaplanır.'
  },
  {
    icon: <Cpu size={22} />,
    title: 'Anlamsal kümeleme',
    desc: 'Sentence-Transformers (MiniLM-L6) gömülü vektörleriyle benzer ürünler aynı kümeye yerleştirilir.'
  },
  {
    icon: <Sparkles size={22} />,
    title: 'AI destekli fiyat kararı',
    desc: 'Gemini, maliyet ve piyasa istatistiklerini değerlendirip kâr marjlı bir öneri fiyatı üretir.'
  },
  {
    icon: <Zap size={22} />,
    title: 'Anlık döviz dönüşümü',
    desc: 'Global kalemler EUR/USD ile çekilir, TRY karşılığı güncel kur üzerinden gösterilir.'
  },
  {
    icon: <Shield size={22} />,
    title: 'Önbellek + retry',
    desc: 'AI çağrıları kümelenmiş ürünler için cache\'lenir; rate-limit hatalarında otomatik tekrar denenir.'
  },
];

const stack = [
  { name: 'React 19', color: '#61dafb' },
  { name: 'Vite', color: '#646cff' },
  { name: 'FastAPI', color: '#009688' },
  { name: 'SQLAlchemy', color: '#d71f00' },
  { name: 'Gemini API', color: '#4285f4' },
  { name: 'Sentence-Transformers', color: '#ff6f00' },
  { name: 'httpx · BeautifulSoup', color: '#7c3aed' },
];

const milestones = [
  
];

const About = () => {
  const [settings, setSettings] = useState(null);

  

  const about = settings?.about || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ background: 'var(--bg)' }}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 45%, #f8fafc 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '90px 20px 100px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Dekoratif grid arka plan */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(2,132,199,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />

        <motion.div {...fadeUp} style={{ maxWidth: '760px', margin: '0 auto', position: 'relative' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(2,132,199,0.08)', color: 'var(--accent)',
            fontSize: '0.78rem', fontWeight: '600', letterSpacing: '0.6px',
            padding: '6px 14px', borderRadius: '20px',
            border: '1px solid rgba(2,132,199,0.18)',
            marginBottom: '22px', textTransform: 'uppercase'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' }} />
            Aktif Geliştirme
          </span>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '22px', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
            Komponent fiyatlarını{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              tek ekranda
            </span>
            <br />karşılaştırmak için bir araç
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.75', maxWidth: '640px', margin: '0 auto' }}>
            {about.description || 'QuadCore, elektronik komponent ararken Türkiye\'deki yerel satıcılar ile global distribütörlerin fiyatlarını paralel olarak gösterir. Açık kaynak scraper\'lar, anlamsal kümeleme ve yapay zeka destekli fiyat önerisiyle satın alma kararını veriye dayandırır. Henüz kişisel/akademik bir geliştirme projesidir.'}
          </p>
        </motion.div>
      </section>

      {/* ── Quick facts ──────────────────────────────────────────────────── */}
      <section style={{ padding: '50px 20px', borderBottom: '1px solid var(--border)' }}>
        <motion.div
          variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}
          className="grid-cols-4"
          style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}
        >
          {facts.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '22px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                cursor: 'default',
              }}
            >
              <div style={{
                position: 'absolute', top: 14, right: 14,
                color: 'var(--accent)', opacity: 0.7
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '600', marginBottom: '2px' }}>{s.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Mission & Vision ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          {[
            {
              icon: <Target size={26} />,
              color: '#0284c7',
              bg: 'rgba(2,132,199,0.08)',
              title: 'Misyon',
              desc: about.mission || 'Komponent satın alma kararlarını şeffaf hale getirmek. Aynı parçanın yerel ve global fiyatını yan yana gösterip, AI ile maliyet/marj analizi sunarak küçük ekiplerin de bilinçli tercih yapmasını sağlamak.'
            },
            {
              icon: <Eye size={26} />,
              color: '#7c3aed',
              bg: 'rgba(124,58,237,0.08)',
              title: 'Vizyon',
              desc: about.vision || 'TR pazarını birinci sınıf vatandaş olarak ele alan ve döviz dalgalanmalarını anlık yansıtan, geliştirici-dostu bir komponent fiyat zekâsı kaynağı olmak. Mümkün olduğunca açık kaynak ve self-hosted kalmak.'
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '36px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: `linear-gradient(90deg, ${card.color}, transparent)`,
              }} />
              <div style={{
                width: 52, height: 52, borderRadius: '14px',
                background: card.bg, color: card.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {card.icon}
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px', letterSpacing: '-0.01em' }}>{card.title}</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.75', fontSize: '0.98rem', margin: 0 }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '50px' }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
              Platform ne yapıyor?
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
              Pazarlama vaadi değil — hâlihazırda çalışan teknik yetenekler.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}
          >
            {capabilities.map((c, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -3, borderColor: 'var(--accent)', transition: { duration: 0.2 } }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex', flexDirection: 'column', gap: '12px',
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: '10px',
                  background: 'rgba(2,132,199,0.08)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{c.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.65', margin: 0 }}>{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────────────────── */}
      <section style={{ padding: '70px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)',
              letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '16px'
            }}>
              <Code2 size={14} /> Teknoloji Yığını
            </div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
              Modern, açık kaynak parçalardan inşa edildi
            </h2>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center',
              maxWidth: '720px', margin: '0 auto'
            }}>
              {stack.map((t, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '8px 14px', borderRadius: '20px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '500',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color }} />
                  {t.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '50px' }}
          >
           
           
          </motion.div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '24px', top: '12px', bottom: '12px',
              width: '2px', background: 'var(--border)'
            }} />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                style={{ display: 'flex', gap: '20px', marginBottom: '24px', position: 'relative' }}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
                  background: m.done ? 'var(--accent)' : 'var(--bg-card)',
                  border: m.done ? 'none' : '2px dashed var(--border)',
                  color: m.done ? '#fff' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1,
                  boxShadow: m.done ? '0 0 0 4px var(--bg-sidebar)' : 'none',
                  position: 'relative',
                }}>
                  {m.done ? <CheckCircle2 size={20} /> : <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>?</span>}
                  {m.current && (
                    <span style={{
                      position: 'absolute', inset: -4, borderRadius: '50%',
                      border: '2px solid var(--accent)', opacity: 0.4,
                      animation: 'pulse 2s ease-in-out infinite',
                    }} />
                  )}
                </div>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '18px 22px',
                  flex: 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: '700', color: m.done ? 'var(--accent)' : 'var(--text-muted)',
                      letterSpacing: '0.6px', textTransform: 'uppercase',
                      padding: '3px 8px', borderRadius: '4px',
                      background: m.done ? 'rgba(2,132,199,0.08)' : 'transparent',
                      border: m.done ? '1px solid rgba(2,132,199,0.15)' : '1px solid var(--border)',
                    }}>
                      {m.year}
                    </span>
                    {m.current && (
                      <span style={{
                        fontSize: '0.68rem', fontWeight: '700', color: '#10b981',
                        letterSpacing: '0.4px', padding: '3px 8px', borderRadius: '4px',
                        background: 'rgba(16,185,129,0.08)',
                        border: '1px solid rgba(16,185,129,0.2)',
                      }}>
                        ŞU ANKİ
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>{m.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{
            maxWidth: '780px', margin: '0 auto',
            background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
            borderRadius: '20px', padding: '50px 40px',
            textAlign: 'center', color: '#fff',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(2,132,199,0.25)',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '14px', letterSpacing: '-0.02em' }}>
              Bir parça aramayı dene
            </h2>
            <p style={{ fontSize: '1rem', opacity: 0.92, lineHeight: '1.7', maxWidth: '520px', margin: '0 auto 24px' }}>
              ESP32, STM32 veya bir direnç değeri yaz; TR ve global tedarikçilerin fiyatları yan yana çıksın.
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#fff', color: 'var(--accent)',
                padding: '12px 24px', borderRadius: '10px',
                textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Aramaya başla <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.15); }
        }
      `}</style>
    </motion.div>
  );
};

export default About;
