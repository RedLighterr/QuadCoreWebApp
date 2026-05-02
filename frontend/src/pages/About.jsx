import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Users, Globe, Zap, Shield, TrendingUp, Award } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } }
};

const stats = [
  { value: '50+', label: 'Global Distribütör', icon: <Globe size={22} /> },
  { value: '2M+', label: 'Bileşen Kataloğu', icon: <Zap size={22} /> },
  { value: '%99', label: 'Çalışma Süresi', icon: <Shield size={22} /> },
  { value: '10K+', label: 'Aktif Kullanıcı', icon: <Users size={22} /> },
];

const team = [
  { name: 'Ahmet Koçak', role: 'Kurucu & CEO', initials: 'AK', color: '#0284c7' },
  { name: 'Selin Demir', role: 'CTO', initials: 'SD', color: '#7c3aed' },
  { name: 'Mert Yıldız', role: 'Yapay Zeka Mühendisi', initials: 'MY', color: '#059669' },
  { name: 'Ece Arslan', role: 'Ürün Tasarımcısı', initials: 'EA', color: '#dc2626' },
];

const milestones = [
  { year: '2022', title: 'Fikir Aşaması', desc: 'Tedarik zinciri darboğazlarını çözmek için projeye başlandı.' },
  { year: '2023', title: 'İlk Prototip', desc: 'Mouser ve DigiKey entegrasyonu ile MVP sürümü yayınlandı.' },
  { year: '2024', title: 'AI Entegrasyonu', desc: 'Yapay zeka destekli fiyat analizi ve tahmin motoru eklendi.' },
  { year: '2025', title: 'Global Ölçek', desc: '50+ distribütör ve 10.000+ aktif kullanıcıya ulaşıldı.' },
];

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ background: 'var(--bg)' }}
    >
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '80px 20px',
        textAlign: 'center',
      }}>
        <motion.div {...fadeUp} style={{ maxWidth: '700px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', background: 'rgba(2,132,199,0.1)', color: 'var(--accent)',
            fontSize: '0.85rem', fontWeight: '600', letterSpacing: '1px',
            padding: '5px 16px', borderRadius: '20px', border: '1px solid rgba(2,132,199,0.2)',
            marginBottom: '20px', textTransform: 'uppercase'
          }}>
            Hakkımızda
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px', lineHeight: '1.2' }}>
            Tedarik Zincirini<br />
            <span style={{ color: 'var(--accent)' }}>Yeniden Tanımlıyoruz</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '0' }}>
            SourceFlow AI, elektronik donanım geliştiricileri ve satın alma ekiplerinin dünya genelindeki
            distribütörlerden en uygun fiyatlı, en hızlı teslimatlı bileşeni saniyeler içinde bulmasını sağlar.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 20px', borderBottom: '1px solid var(--border)' }}>
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid-cols-4"
          style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gap: '20px' }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '28px 20px', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '12px',
                background: 'rgba(2,132,199,0.08)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px auto'
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '80px 20px', borderBottom: '1px solid var(--border)' }}>
        <div className="grid-cols-2" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gap: '30px' }}>
          {[
            {
              icon: <Target size={28} />,
              color: '#0284c7',
              bg: 'rgba(2,132,199,0.08)',
              title: 'Misyonumuz',
              desc: 'Donanım geliştiricilerinin en iyi bileşenleri, en doğru fiyata ve en hızlı şekilde bulmasını sağlayarak küresel çapta inovasyonun önündeki lojistik engelleri kaldırmak. Her satın alma kararını veriye dayalı, şeffaf ve güvenilir hale getirmek.'
            },
            {
              icon: <Eye size={28} />,
              color: '#7c3aed',
              bg: 'rgba(124,58,237,0.08)',
              title: 'Vizyonumuz',
              desc: 'Dünyadaki tüm elektronik bileşen tedarik zincirini tek bir otonom platformda birleştirerek geleceğin fabrikaları ve Ar-Ge merkezleri için endüstri standardı olmak. 2030\'a kadar küresel elektronik üretim maliyetlerini %30 azaltmak.'
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '40px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '14px',
                background: card.bg, color: card.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {card.icon}
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>{card.title}</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1rem' }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '80px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '50px' }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>Yolculuğumuz</h2>
            <p style={{ color: 'var(--text-muted)' }}>Fikir aşamasından bugüne nasıl büyüdük</p>
          </motion.div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '28px', top: 0, bottom: 0,
              width: '2px', background: 'var(--border)'
            }} />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                style={{ display: 'flex', gap: '24px', marginBottom: '36px', position: 'relative' }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--accent)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.78rem', fontWeight: '700', zIndex: 1,
                  boxShadow: '0 0 0 4px var(--bg-sidebar)'
                }}>
                  {m.year}
                </div>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '20px 24px', flex: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>{m.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </motion.div>
  );
};

export default About;
