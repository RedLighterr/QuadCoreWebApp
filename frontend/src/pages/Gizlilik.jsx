import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Gizlilik = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', width: '100%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          width: 60, height: 60, borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', 
          margin: '0 auto 20px auto', color: 'var(--accent)' 
        }}>
          <Shield size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '15px' }}>Gizlilik Politikası</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Son Güncelleme: 14 Eylül 2026</p>
      </div>

      <div className="glass-card" style={{ padding: '40px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '15px' }}>1. Veri Toplama ve Kullanımı</h2>
        <p style={{ marginBottom: '25px' }}>
          SourceFlow AI olarak gizliliğinize büyük önem veriyoruz. Hizmetlerimizi kullanırken, bize sağladığınız (ad, e-posta adresi gibi) kişisel verileri ve platformu kullanırken oluşan (arama geçmişi, analiz tercihleri) kullanım verilerini topluyoruz. Bu veriler sadece size daha iyi, daha hızlı ve kişiselleştirilmiş bir analiz deneyimi sunmak amacıyla kullanılmaktadır.
        </p>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '15px' }}>2. Çerezler (Cookies) ve İzleme Teknolojileri</h2>
        <p style={{ marginBottom: '25px' }}>
          Platformumuz, tercihlerinizi hatırlamak ve sistem performansını ölçmek için çerezler kullanmaktadır. Kesinlikle gerekli çerezler dışında kalan analitik çerezleri tarayıcı ayarlarınız üzerinden veya sitemizde bulunan çerez bildirim ekranından dilediğiniz zaman devre dışı bırakabilirsiniz.
        </p>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '15px' }}>3. Verilerin Üçüncü Taraflarla Paylaşımı</h2>
        <p style={{ marginBottom: '25px' }}>
          Kişisel verileriniz, yasal zorunluluklar haricinde kesinlikle reklam verenlerle veya 3. taraf veri brokerlarıyla paylaşılmaz. Arama sorgularınız, global tedarikçilere (API aracılığıyla) tamamen anonimleştirilmiş bir şekilde gönderilir; şirket isminiz veya profiliniz bu tedarikçilerle paylaşılmaz.
        </p>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '15px' }}>4. Veri Güvenliği</h2>
        <p style={{ marginBottom: '25px' }}>
          Sistemimizde depolanan verileriniz endüstri standardı olan AES-256 şifreleme protokolüyle korunmaktadır. Sunucularımız düzenli olarak sızma testlerine (penetration test) tabi tutularak güvenlik açıkları minimize edilmektedir.
        </p>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '15px' }}>5. Haklarınız</h2>
        <p style={{ marginBottom: '25px' }}>
          GDPR ve KVKK kapsamında, hakkınızda sakladığımız tüm verileri talep etme, bu verilerin değiştirilmesini veya tamamen silinmesini isteme hakkına sahipsiniz. Veri silme talepleriniz 30 iş günü içerisinde sonuçlandırılır. Bu talepler için <strong>info@componentsource.ai</strong> adresinden bizimle iletişime geçebilirsiniz.
        </p>
      </div>
    </motion.div>
  );
};

export default Gizlilik;
