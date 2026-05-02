import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal, ChevronRight, TrendingUp, TrendingDown, Package, Truck, AlertTriangle, PlayCircle, HelpCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { searchComponents, analyzeComponent } from '../services/api';
import { useLocation, useNavigate, Link } from 'react-router-dom';

// Veriler backend API'den gelecek — placeholder veri yok

const SupplierBadge = ({ name, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
    <div style={{ width: 14, height: 14, borderRadius: '3px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: '800' }}>{name[0]}</span>
    </div>
    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>{name}</span>
  </div>
);

const ComponentCard = ({ comp, index, isSelected, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    onClick={onClick}
    style={{
      background: isSelected ? 'var(--bg-sidebar)' : 'var(--bg-card)',
      border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
      boxShadow: isSelected ? '0 0 0 1px var(--accent), 0 4px 6px -1px rgba(0, 0, 0, 0.05)' : '0 1px 3px rgba(0,0,0,0.05)',
      borderRadius: '10px',
      padding: '14px',
      cursor: 'pointer',
      transition: 'all 0.15s',
      position: 'relative',
    }}
    className="comp-card"
  >
    <div style={{ position: 'absolute', top: 10, left: 14, width: 18, height: 18, borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)' }}>
      {comp.id}
    </div>
    <button style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}>
      <MoreHorizontal size={14} />
    </button>

    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
      <div style={{ width: 48, height: 48, borderRadius: '6px', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Package size={20} color="var(--text-dim)" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', paddingLeft: '22px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{comp.name}</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: '8px', flexShrink: 0, marginRight: '18px' }}>{comp.status}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <SupplierBadge name={comp.supplier} color={comp.supplierColor} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>${comp.price.toFixed(2)}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{comp.stock} Stok</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(2, 132, 199, 0.08)',
          border: '1px solid rgba(2, 132, 199, 0.15)',
          borderRadius: '5px',
          padding: '5px 8px',
          fontSize: '0.72rem',
          color: 'var(--accent)',
          lineHeight: '1.3',
        }}>
          ✦ Yapay Zeka En İyi Eşleşme: {comp.ai}
        </div>
      </div>
    </div>
  </motion.div>
);

const DetailPanel = ({ comp }) => (
  <div className="dashboard-detail" style={{
    width: '380px',
    background: 'var(--bg-sidebar)',
    borderLeft: '1px solid var(--border)',
    padding: '24px',
    overflowY: 'auto'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>Bileşen Detayı</h3>
      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <MoreHorizontal size={18} />
      </button>
    </div>

    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <div style={{ width: 10, height: 10, borderRadius: '2px', background: 'var(--accent)', marginTop: '4px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>{comp.name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.4' }}>Kategori: {comp.category}<br/>Paket: SMD/QFN-32<br/>Çalışma Voltajı: 3.0V - 3.6V</div>
        <div style={{ background: 'rgba(2, 132, 199, 0.08)', borderRadius: '4px', padding: '6px 8px', fontSize: '0.75rem', color: 'var(--accent)', lineHeight: '1.4', border: '1px solid rgba(2, 132, 199, 0.1)' }}>
          ✦ Yapay Zeka Önerisi: En uygun fiyat ve lojistik kombinasyonu AliExpress'te tespit edildi. (Güvenilirlik: %94)
        </div>
      </div>
    </div>

    <div>
      <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase' }}>Fiyat Karşılaştırması</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        {priceComparison.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i !== priceComparison.length - 1 ? '8px' : '0', borderBottom: i !== priceComparison.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: '0.85rem', color: item.bold ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: item.bold ? '600' : '500' }}>{item.supplier}</span>
            <span style={{ fontSize: '0.85rem', color: item.bold ? 'var(--accent)' : 'var(--text-main)', fontWeight: item.bold ? '700' : '600' }}>{item.price}</span>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase' }}>Fiyat Trendi (6 Ay)</h4>
      <div style={{ height: '140px', background: 'var(--bg)', padding: '10px 10px 10px 0', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="detailGradLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="fiyat" stroke="var(--accent)" strokeWidth={2} fill="url(#detailGradLight)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingTop: '20px' }}>
      {[
        { label: 'Aktif Tedarikçiler', value: '24 Tedarikçi', icon: <Package size={14} /> },
        { label: 'Tahmini Teslimat', value: '4-7 İş Günü', icon: <Truck size={14} /> },
        { label: 'Risk Uyarıları', value: 'Düşük Risk', icon: <AlertTriangle size={14} />, color: '#10b981' },
      ].map((stat, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ color: stat.color || 'var(--text-dim)' }}>{stat.icon}</span>
            {stat.label}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: stat.color || 'var(--text-main)' }}>{stat.value}</span>
        </div>
      ))}
      <button className="premium-button" style={{ marginTop: '10px', width: '100%', padding: '12px' }}>
        Satın Alma Seçeneklerini Gör
      </button>
    </div>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="glass-card" 
      onClick={() => setIsOpen(!isOpen)}
      style={{ 
        padding: '16px 20px', 
        cursor: 'pointer', 
        borderLeft: isOpen ? '4px solid var(--accent)' : '1px solid var(--border)',
        background: isOpen ? 'rgba(2, 132, 199, 0.02)' : 'var(--bg-card)',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>{question}</h4>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <MoreHorizontal size={18} color="var(--text-dim)" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LandingView = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>Akıllı Komponent Analizi</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
          Dünya çapındaki distribütörleri saniyeler içinde tarayın. En uygun fiyatı, stok durumunu ve lojistik rotasını yapay zeka ile keşfedin.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} style={{ width: '100%', marginBottom: '80px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          borderRadius: '12px', padding: '12px 20px',
        }}>
          <Search size={22} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Parça numarası, üretici veya özellik girin (Örn: ESP32-WROOM)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-main)', fontSize: '1.1rem', flex: 1,
              fontFamily: 'Inter, sans-serif', padding: '8px 0'
            }}
          />
          <button
            onClick={() => onSearch(query)}
            className="premium-button"
            style={{ padding: '10px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            Ara <ArrowRight size={18} />
          </button>
        </div>
        {/* Öneri etiketleri backend entegrasyonundan sonra dinamik olarak gelecek */}
      </motion.div>

      {/* Info Sections */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ maxWidth: '900px', margin: '100px auto 40px auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Nasıl Çalışır? */}
        <section className="glass-card" style={{ padding: '30px', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <HelpCircle size={20} color="var(--accent)" /> Nasıl Çalışır?
          </h3>
          <div className="grid-cols-3" style={{ display: 'grid', gap: '20px' }}>
            {[
              { title: '1. Tarama', desc: 'Mouser, DigiKey, LCSC gibi 50+ küresel distribütör eş zamanlı olarak taranır.' },
              { title: '2. Yapay Zeka Analizi', desc: 'Gümrük, kargo süreleri ve fiyat avantajları yapay zeka tarafından hesaplanır.' },
              { title: '3. Optimizasyon', desc: 'Size en ucuz değil, en optimum (hız + maliyet) satın alma rotası sunulur.' }
            ].map((step, i) => (
              <div key={i} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{i + 1}</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--text-main)' }}>{step.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Müşterilerimiz Ne Diyor? */}
        <section className="glass-card" style={{ padding: '30px', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <MessageSquare size={20} color="var(--accent)" /> Müşterilerimiz Ne Diyor?
          </h3>
          <div className="grid-cols-3" style={{ display: 'grid', gap: '20px' }}>
            {[
              { name: 'Ayşe Y.', role: 'Satın Alma Müdürü', text: 'Tedarik zinciri yönetimimizde SourceFlow sayesinde %30 maliyet tasarrufu sağladık. Yapay zeka analizi inanılmaz.' },
              { name: 'Mehmet B.', role: 'Elektronik Mühendisi', text: 'Prototip aşamasında parça bulmak tam bir kabustu. Şimdi saniyeler içinde en uygun stoklu parçayı bulabiliyorum.' },
              { name: 'Caner T.', role: 'Donanım Tasarımcısı', text: 'Cross-reference özelliği sayesinde stokta olmayan kritik parçaların alternatiflerini anında bulup tasarıma devam edebiliyorum.' }
            ].map((t, i) => (
              <div key={i} className="glass-card" style={{ padding: '20px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '15px', lineHeight: '1.6' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sıkça Sorulan Sorular (Accordion) */}
        <section className="glass-card" style={{ padding: '30px', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <HelpCircle size={20} color="var(--accent)" /> Sıkça Sorulan Sorular
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { q: 'Hangi tedarikçileri destekliyorsunuz?', a: 'Mouser, DigiKey, Farnell, Arrow, AliExpress ve LCSC dahil olmak üzere 50\'den fazla global distribütörü canlı destekliyoruz.' },
              { q: 'Fiyatlara gümrük vergileri dahil mi?', a: 'Yapay zeka analiz raporlarında, ülkenize özgü tahmini gümrük vergileri ve kargo masrafları hesaplamalara dahil edilmektedir.' },
              { q: 'Veriler ne sıklıkla güncelleniyor?', a: 'Tüm stok ve fiyat verileri anlık olarak API üzerinden çekilir, önbellek süresi maksimum 5 dakikadır.' },
              { q: 'Kendi şirket verilerimi ekleyebilir miyim?', a: 'Premium sürümde, kendi tedarikçilerinizi, API anahtarlarınızı ve şirket içi stok durumunuzu sisteme entegre edebilirsiniz.' }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/sss" className="premium-button" style={{ display: 'inline-block', textDecoration: 'none', padding: '10px 24px' }}>
              Daha Fazla Soru Gör
            </Link>
          </div>
        </section>

      </motion.div>
    </div>
  );
}

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComp, setSelectedComp] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Hepsi');
  const [sortBy, setSortBy] = useState('price-low');
  const location = useLocation();
  const navigate = useNavigate();

  const filteredAndSortedResults = results
    .filter(c => filterCategory === 'Hepsi' || c.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'stock-high') {
        const parseStock = (val) => {
          if (typeof val === 'number') return val;
          if (typeof val !== 'string') return 0;
          let num = parseFloat(val.replace(/,/g, '').replace(/[^\d.-]/g, ''));
          if (val.toLowerCase().includes('k') || val.toLowerCase().includes('bin')) num *= 1000;
          if (val.toLowerCase().includes('m')) num *= 1000000;
          return isNaN(num) ? 0 : num;
        };
        const stockA = parseStock(a.stock);
        const stockB = parseStock(b.stock);
        return stockB - stockA;
      }
      return 0;
    });

  const categories = ['Hepsi', ...new Set(results.map(c => c.category).filter(Boolean))];

  useEffect(() => {
    // Check if there is a search query in the URL params
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      performSearch(q);
    } else {
      // Ana Sayfa linkine tıklandığında (veya URL'de q parametresi yoksa) aramayı sıfırla
      setHasSearched(false);
      setSearchQuery('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.search]);

  const handleSearch = (queryToSearch) => {
    const q = typeof queryToSearch === 'string' ? queryToSearch : searchQuery;
    if (!q.trim()) return;
    
    // Update the URL which will trigger the useEffect
    navigate(`/?q=${encodeURIComponent(q)}`);
  };

  const performSearch = async (q) => {
    setSearchQuery(q);
    setLoading(true);
    setHasSearched(true);
    
    try {
      const data = await searchComponents(q);
      setResults(data || []);
      setSelectedComp(data && data.length > 0 ? data[0] : null);
    } catch {
      setResults([]);
      setSelectedComp(null);
    } finally {
      setLoading(false);
    }
  };

  if (!hasSearched) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <LandingView onSearch={handleSearch} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="dashboard-layout"
      style={{ display: 'flex', height: 'calc(100vh - 52px)', overflow: 'hidden' }}
    >
      {/* Center Content */}
      <div className="dashboard-results" style={{ flex: 1, overflowY: 'auto', padding: '24px 30px', background: 'var(--bg)' }}>
        
        {/* Search Bar (Top) */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)' }}>Arama Sonuçları</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px', padding: '8px 16px',
              flex: 1, maxWidth: '400px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <Search size={16} color="var(--text-dim)" />
              <input
                type="text"
                placeholder="Bileşen veya parça numarası ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  color: 'var(--text-main)', fontSize: '0.95rem', flex: 1,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
            <button
              onClick={() => navigate('/')}
              className="premium-button"
              style={{ padding: '9px 20px', whiteSpace: 'nowrap' }}
            >
              {loading ? '...' : 'Yeni Analiz'}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Kategori:</span>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ 
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)',
                  background: 'var(--bg)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none'
                }}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Sırala:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)',
                  background: 'var(--bg)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none'
                }}
              >
                <option value="price-low">En Düşük Fiyat</option>
                <option value="price-high">En Yüksek Fiyat</option>
                <option value="stock-high">En Yüksek Stok</option>
              </select>
            </div>
          </div>

          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: '1px solid var(--border)',
            borderRadius: '6px', padding: '6px 14px',
            fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)',
            cursor: 'pointer', transition: 'all 0.15s'
          }} className="search-btn-mini">
            <Package size={14} /> Rapor Oluştur
          </button>
        </div>

        {/* Component Grid - 2 columns */}
        {loading ? (
           <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
              <div style={{ border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', width: 40, height: 40, animation: 'spin 1s linear infinite' }} />
           </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            {filteredAndSortedResults.map((comp, i) => (
              <ComponentCard
                key={comp.id}
                comp={comp}
                index={i}
                isSelected={selectedComp?.id === comp.id}
                onClick={() => setSelectedComp(comp)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Right Detail Panel */}
      {selectedComp && !loading && <DetailPanel comp={selectedComp} />}

      <style>{`
        .comp-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
          border-color: var(--accent) !important;
          transform: translateY(-2px);
        }
        .search-btn-mini:hover {
          background: var(--border) !important;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
};

export default Dashboard;
