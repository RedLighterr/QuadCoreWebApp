import React from 'react';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const faqList = [
  { q: 'Hangi tedarikçileri destekliyorsunuz?', a: 'Mouser, DigiKey, Farnell, Arrow, AliExpress ve LCSC dahil olmak üzere 50\'den fazla global distribütörü canlı destekliyoruz.' },
  { q: 'Fiyatlara gümrük vergileri dahil mi?', a: 'Yapay zeka analiz raporlarında, ülkenize özgü tahmini gümrük vergileri ve kargo masrafları hesaplamalara dahil edilmektedir.' },
  { q: 'Kendi şirket verilerimi ekleyebilir miyim?', a: 'Premium sürümde, kendi tedarikçilerinizi, API anahtarlarınızı ve şirket içi stok durumunuzu sisteme entegre edebilirsiniz.' },
  { q: 'Yapay zeka analizi tam olarak ne yapıyor?', a: 'Aynı komponentin farklı distribütörlerdeki fiyat değişim grafiğini çıkarır, teslimat sürelerini ve risk skorunu analiz ederek size en optimum satın alma rotasını önerir.' },
  { q: 'Sistem ne kadar sürede veri çeker?', a: 'Bileşen sorguları eşzamanlı ve paralel yapıldığı için sonuçlar genellikle 1 ila 3 saniye içinde ana ekranda belirir.' },
  { q: 'Alternatif parçalar (Cross-reference) öneriyor musunuz?', a: 'Evet. Aradığınız bileşenin stokları tükenmişse veya fiyatı uygun değilse, sistem teknik özelliklere göre birebir uyumlu pin-to-pin veya fonksiyonel alternatifler sunar.' },
  { q: 'Üyelik planları nasıl işliyor?', a: 'Standart sürümümüz bireysel geliştiriciler için her zaman ücretsiz kalacaktır. Şirket içi ERP entegrasyonu isteyen kullanıcılar için Premium planlar sunuyoruz.' },
  { q: 'Mevcut ERP sistemime (SAP vb.) entegrasyon yapabilir miyim?', a: 'Evet. Rest API ve Webhook desteğimiz sayesinde, analiz sonuçlarını veya stok uyarılarını doğrudan şirket içi yazılımlarınıza aktarabilirsiniz.' }
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

      <motion.div 
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        style={{ display: 'grid', gap: '20px' }}
      >
        {faqList.map((faq, i) => (
          <motion.div 
            key={i} 
            variants={fadeUp}
            className="glass-card" 
            style={{ padding: '24px', borderLeft: '4px solid var(--accent)' }}
          >
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '600', marginBottom: '10px' }}>{faq.q}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>{faq.a}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Sss;
