import React from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Kullanim = () => {
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
          <FileText size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '15px' }}>Kullanım Şartları</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Son Güncelleme: 14 Eylül 2026</p>
      </div>

      <div className="glass-card" style={{ padding: '40px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '15px' }}>1. Şartların Kabulü</h2>
        <p style={{ marginBottom: '25px' }}>
          SourceFlow AI platformunu ve ilgili servislerini ("Hizmet") kullanarak, bu sayfada belirtilen tüm kullanım şartlarını okuduğunuzu, anladığınızı ve yasal olarak bunlara bağlı kalacağınızı kabul etmiş sayılırsınız. Şartların herhangi bir bölümünü kabul etmiyorsanız, platformu kullanmayı derhal bırakmalısınız.
        </p>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '15px' }}>2. Platform Kullanımı ve Sınırlamalar</h2>
        <p style={{ marginBottom: '25px' }}>
          Platformumuz, tedarik zinciri araştırması ve analizi yapmak amacıyla tasarlanmıştır. Hizmetlerimizi tersine mühendislik (reverse-engineering) yapmak, bot veya otomatik script'ler aracılığıyla platformdan aşırı miktarda veri çekmek (scraping) ve sunucularımıza aşırı yük bindirecek eylemlerde bulunmak kesinlikle yasaktır. Bu tür eylemler tespit edildiğinde hesabınız kalıcı olarak askıya alınabilir.
        </p>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '15px' }}>3. Doğruluk ve Garanti Reddi</h2>
        <p style={{ marginBottom: '25px' }}>
          Platformumuz, 3. taraf tedarikçilerden API'ler aracılığıyla veri çekmektedir. Gösterilen fiyatlar, stok durumları ve teslimat süreleri bilgilendirme amaçlıdır ve anlık değişimlere tabidir. SourceFlow AI, gösterilen bu verilerin %100 doğruluğunu, güncelliğini veya kesintisiz sunulacağını garanti etmez. Yapılan satın alımlarda sorumluluk tamamen kullanıcıya aittir.
        </p>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '15px' }}>4. Premium Abonelik ve İadeler</h2>
        <p style={{ marginBottom: '25px' }}>
          Premium özelliklere erişim için ödeme yapan kullanıcılar, aboneliklerini istedikleri zaman iptal edebilirler. Ancak mevzuatın gerektirdiği istisnai durumlar dışında, kullanılan ayın ücreti için geriye dönük para iadesi yapılmamaktadır. İptal durumunda haklarınız fatura döngünüzün sonuna kadar devam eder.
        </p>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '15px' }}>5. Değişiklik Hakkı</h2>
        <p style={{ marginBottom: '25px' }}>
          SourceFlow AI, bu kullanım şartlarını önceden haber vermeksizin dilediği zaman güncelleme veya değiştirme hakkını saklı tutar. Yapılan değişiklikler bu sayfada yayımlandığı anda yürürlüğe girer.
        </p>
      </div>
    </motion.div>
  );
};

export default Kullanim;
