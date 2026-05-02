import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFAQs } from '../services/api';

const defaultFaqList = [
  { q: 'Hangi tedarikçileri destekliyorsunuz?', a: 'Mouser, DigiKey, Farnell, Arrow, AliExpress ve LCSC dahil olmak üzere 50\'den fazla global distribütörü canlı destekliyoruz.' },
  { q: 'Fiyatlara gümrük vergileri dahil mi?', a: 'Yapay zeka analiz raporlarında, ülkenize özgü tahmini gümrük vergileri ve kargo masrafları hesaplamalara dahil edilmektedir.' },
  { q: 'Kendi şirket verilerimi ekleyebilir miyim?', a: 'Premium sürümde, kendi tedarikçilerinizi, API anahtarlarınızı ve şirket içi stok durumunuzu sisteme entegre edebilirsiniz.' },
  { q: 'Yapay zeka analizi tam olarak ne yapıyor?', a: 'Aynı komponentin farklı distribütörlerdeki fiyat değişim grafiğini çıkarır, teslimat sürelerini ve risk skorunu analiz ederek size en optimum satın alma rotasını önerir.' }
];

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

const Sss = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      const data = await getFAQs();
      setFaqs(data && data.length > 0 ? data : defaultFaqList);
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', width: '100%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 60, height: 60, borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)',
          margin: '0 auto 20px auto', color: 'var(--accent)'
        }}>
          <HelpCircle size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '15px' }}>Sıkça Sorulan Sorular</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Platformumuz hakkında aklınıza takılan tüm soruların cevapları.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : faqs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Henüz sıkça sorulan soru eklenmemiş.</div>
      ) : (
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          style={{ display: 'grid', gap: '20px' }}
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id || i}
              variants={fadeUp}
              className="glass-card"
              style={{ padding: '24px', borderLeft: '4px solid var(--accent)' }}
            >
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '600', marginBottom: '10px' }}>{faq.question || faq.q}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>{faq.answer || faq.a}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sss;
