import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Package, Truck, AlertTriangle, HelpCircle, ArrowRight, MessageSquare, ExternalLink, Globe, MapPin, ArrowDown, ArrowUp, Minus, Sparkles, Zap, Cpu, Database, TrendingUp, Layers, ChevronRight, FileDown, Filter, ArrowUpDown, Calculator, Receipt, Tag, Wallet, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchComponents, analyzeComponent, appendSearchHistory } from '../services/api';
import { useLocation, useNavigate, Link } from 'react-router-dom';

// TR satıcılar sadece TL üzerinden, Global satıcılar EUR + TL şeklinde gösterilir.
const isTR = (item) => item?.status === 'Türkiye' || item?.category === 'Yerel Piyasa';
const formatPrice = (item) => {
  const tl = item?.price_try ?? item?.price ?? 0;
  if (isTR(item)) return `₺${tl.toFixed(2)}`;
  const eur = item?.price ?? 0;
  return `€${eur.toFixed(2)} = ₺${tl.toFixed(2)}`;
};

// HTML escape — PDF içeriği güvenli render edilsin
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

// Yeni sekmede stil verilmiş bir rapor sayfası açar ve print dialog'unu tetikler.
// Kullanıcı "Hedef → PDF olarak kaydet" seçer ve dosya olarak kaydeder.
function generateReport(products, searchQuery) {
  if (!products || products.length === 0) return;

  const trItems = products.filter(p => isTR(p));
  const globalItems = products.filter(p => !isTR(p));
  const tlPrices = products.map(p => p.price_try ?? p.price).filter(n => typeof n === 'number' && n > 0);
  const min = tlPrices.length ? Math.min(...tlPrices) : 0;
  const max = tlPrices.length ? Math.max(...tlPrices) : 0;
  const avg = tlPrices.length ? tlPrices.reduce((a, b) => a + b, 0) / tlPrices.length : 0;
  const trMin = trItems.length ? Math.min(...trItems.map(p => p.price_try ?? p.price ?? 0)) : null;
  const glMin = globalItems.length ? Math.min(...globalItems.map(p => p.price_try ?? p.price ?? 0)) : null;

  const date = new Date().toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' });

  const productRow = (p, i) => `
    <tr>
      <td class="num">${i + 1}</td>
      <td>
        <div class="product-title">${esc(p.name)}</div>
        ${p.description ? `<div class="product-desc">${esc(p.description.replace(/\s+/g, ' ').slice(0, 140))}</div>` : ''}
      </td>
      <td>
        <span class="supplier-tag">${esc(p.supplier)}</span>
      </td>
      <td class="price">
        ${isTR(p)
          ? `<strong>₺${(p.price_try ?? p.price ?? 0).toFixed(2)}</strong>`
          : `<strong>€${(p.price ?? 0).toFixed(2)}</strong><br/><span class="price-tl">= ₺${(p.price_try ?? 0).toFixed(2)}</span>`
        }
      </td>
      <td>${esc(p.stock || '-')}</td>
      <td>${p.url ? `<a href="${esc(p.url)}" target="_blank">Kaynak</a>` : '-'}</td>
    </tr>
  `;

  const productTable = (items, title, color) => items.length === 0 ? '' : `
    <section class="section">
      <h2 class="section-title" style="border-color:${color}">
        <span class="section-dot" style="background:${color}"></span>
        ${title}
        <span class="section-count">${items.length} ürün</span>
      </h2>
      <table class="products">
        <thead>
          <tr>
            <th class="num">#</th>
            <th>Ürün</th>
            <th>Tedarikçi</th>
            <th>Fiyat</th>
            <th>Stok</th>
            <th>Kaynak</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((p, i) => productRow(p, i)).join('')}
        </tbody>
      </table>
    </section>
  `;

  const compareNote = (trMin !== null && glMin !== null) ? (() => {
    const diff = glMin - trMin;
    if (Math.abs(diff) < 0.01) return '<span>TR ve Global fiyatlar yaklaşık eşit.</span>';
    const cheaper = diff > 0 ? 'TR' : 'Global';
    const pct = (Math.abs(diff) / (diff > 0 ? trMin : glMin)) * 100;
    return `<span><strong>${cheaper}</strong> en düşük TRY karşılığında <strong>%${pct.toFixed(1)}</strong> daha avantajlı.</span>`;
  })() : '';

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8" />
<title>QuadCore Raporu — ${esc(searchQuery)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
    color: #0f172a;
    margin: 0;
    padding: 32px 36px;
    background: #fff;
    font-size: 11pt;
    line-height: 1.5;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 18px;
    margin-bottom: 24px;
    border-bottom: 2px solid #0284c7;
  }
  .brand {
    display: flex; align-items: center; gap: 10px;
    font-size: 18pt; font-weight: 800;
  }
  .brand-mark {
    width: 30px; height: 30px; border-radius: 7px;
    background: linear-gradient(135deg, #0284c7, #7c3aed);
    color: #fff; display: inline-flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14pt;
  }
  .meta { text-align: right; font-size: 9pt; color: #64748b; }
  .meta .query { font-size: 11pt; color: #0f172a; font-weight: 600; margin-bottom: 4px; }

  .summary {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
    margin-bottom: 24px;
  }
  .summary-card {
    border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;
    background: #f8fafc;
  }
  .summary-label { font-size: 8pt; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 6px; }
  .summary-value { font-size: 16pt; font-weight: 800; color: #0f172a; }
  .summary-sub { font-size: 8pt; color: #64748b; margin-top: 2px; }

  .compare-banner {
    background: linear-gradient(90deg, rgba(2,132,199,0.06), rgba(124,58,237,0.06));
    border: 1px dashed #cbd5e1;
    padding: 12px 16px; border-radius: 8px;
    margin-bottom: 20px; font-size: 10pt;
  }

  .section { margin-bottom: 24px; page-break-inside: auto; }
  .section-title {
    font-size: 13pt; font-weight: 700;
    padding-bottom: 8px; margin: 0 0 12px;
    border-bottom: 2px solid #cbd5e1;
    display: flex; align-items: center; gap: 10px;
  }
  .section-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .section-count {
    margin-left: auto; font-size: 9pt; color: #64748b; font-weight: 500;
    background: #f1f5f9; padding: 3px 9px; border-radius: 12px;
  }

  table.products { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  table.products th {
    text-align: left; padding: 8px 10px;
    background: #f1f5f9; color: #475569;
    border-bottom: 1px solid #cbd5e1;
    font-weight: 600; font-size: 8.5pt;
    text-transform: uppercase; letter-spacing: 0.4px;
  }
  table.products td {
    padding: 10px; vertical-align: top;
    border-bottom: 1px solid #e2e8f0;
  }
  table.products tr:nth-child(even) td { background: #fafbfc; }
  table.products .num { width: 28px; color: #94a3b8; font-size: 8.5pt; }
  table.products .price { white-space: nowrap; }
  table.products .price-tl { font-size: 8.5pt; color: #64748b; }
  .product-title { font-weight: 600; color: #0f172a; }
  .product-desc { font-size: 8.5pt; color: #64748b; margin-top: 3px; }
  .supplier-tag {
    background: #e0f2fe; color: #0284c7;
    padding: 2px 8px; border-radius: 10px;
    font-size: 8.5pt; font-weight: 600;
    white-space: nowrap;
  }
  a { color: #0284c7; text-decoration: none; font-size: 8.5pt; }

  .footer {
    margin-top: 30px; padding-top: 14px;
    border-top: 1px solid #e2e8f0;
    text-align: center; color: #94a3b8; font-size: 8.5pt;
  }

  @media print {
    body { padding: 18mm 14mm; }
    .no-print { display: none !important; }
    .section { page-break-inside: avoid; }
    table.products thead { display: table-header-group; }
  }
  @page {
    size: A4;
    margin: 14mm;
  }

  .toolbar {
    position: fixed; top: 12px; right: 12px;
    display: flex; gap: 8px;
    background: #fff; padding: 8px;
    border-radius: 10px; border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    z-index: 100;
  }
  .toolbar button {
    background: #0284c7; color: #fff; border: none;
    padding: 8px 14px; border-radius: 6px;
    font-size: 9pt; font-weight: 600;
    cursor: pointer; font-family: inherit;
  }
  .toolbar button.secondary {
    background: #f1f5f9; color: #475569;
  }
</style>
</head>
<body>
  <div class="toolbar no-print">
    <button onclick="window.print()">PDF olarak kaydet</button>
    <button class="secondary" onclick="window.close()">Kapat</button>
  </div>

  <div class="header">
    <div>
      <div class="brand">
        <span class="brand-mark">Q</span>
        QuadCore Analiz Raporu
      </div>
      <div style="margin-top: 6px; font-size: 9pt; color: #64748b;">
        Tedarikçi karşılaştırma ve fiyat analizi
      </div>
    </div>
    <div class="meta">
      <div class="query">Sorgu: "${esc(searchQuery)}"</div>
      <div>Oluşturulma: ${esc(date)}</div>
    </div>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="summary-label">Toplam Ürün</div>
      <div class="summary-value">${products.length}</div>
      <div class="summary-sub">${trItems.length} TR · ${globalItems.length} Global</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">En Düşük Fiyat</div>
      <div class="summary-value" style="color:#10b981">₺${min.toFixed(2)}</div>
      <div class="summary-sub">TRY karşılığı</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Ortalama</div>
      <div class="summary-value">₺${avg.toFixed(2)}</div>
      <div class="summary-sub">Tüm ürünler</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">En Yüksek Fiyat</div>
      <div class="summary-value" style="color:#ef4444">₺${max.toFixed(2)}</div>
      <div class="summary-sub">TRY karşılığı</div>
    </div>
  </div>

  ${compareNote ? `<div class="compare-banner">${compareNote}</div>` : ''}

  ${productTable(trItems, 'Türkiye Satıcıları', '#dc2626')}
  ${productTable(globalItems, 'Global Satıcılar', '#0284c7')}

  <div class="footer">
    Bu rapor QuadCore platformu tarafından otomatik üretilmiştir · ${esc(date)}
  </div>

  <script>
    // Sayfa yüklendiğinde otomatik olarak print dialog'unu aç
    setTimeout(() => window.print(), 400);
  </script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=1100');
  if (!win) {
    alert('Pop-up engellendi — lütfen tarayıcı ayarlarınızdan bu siteye izin verin.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

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
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>
              {formatPrice(comp)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{comp.stock}</div>
          </div>
        </div>

        {comp.url && (
          <a 
            href={comp.url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.7rem',
              color: 'var(--accent)',
              textDecoration: 'none',
              marginBottom: '8px',
              fontWeight: '600'
            }}
          >
            <ExternalLink size={12} /> Sitede Gör
          </a>
        )}

        <div style={{
          background: 'rgba(2, 132, 199, 0.08)',
          border: '1px solid rgba(2, 132, 199, 0.15)',
          borderRadius: '5px',
          padding: '5px 8px',
          fontSize: '0.72rem',
          color: 'var(--accent)',
          lineHeight: '1.4',
        }}>
          {comp.description && (
            <div>
              ├─ Açıklama: {comp.description.replace(/\n/g, ' ').trim().substring(0, 120)}
            </div>
          )}
          {comp.ref_suggestion && (
            <div style={{ marginTop: '4px' }}>
              ├─ Öneri Fiyat (AI): {(() => {
                try {
                  const parsed = JSON.parse(comp.ref_suggestion);
                  return `€${parsed.price} - ${parsed.reason}`;
                } catch (e) {
                  return comp.ref_suggestion.substring(0, 100);
                }
              })()}
            </div>
          )}
          {!comp.description && !comp.ref_suggestion && (
            <div>✦ Yapay Zeka En İyi Eşleşme: {comp.ai}</div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const DetailPanel = ({ comp, allResults }) => {
  // Karşılaştırma listesi — isim eşleşmesine göre, fiyat sırasıyla
  const comparisons = allResults
    ? allResults.filter(r => r.name.toLowerCase().includes(comp.name.split(' ')[0].toLowerCase())).sort((a, b) => (a.price_try ?? a.price) - (b.price_try ?? b.price))
    : [];

  // Fiyat istatistikleri her zaman gösterilsin → tüm sonuçlardan TRY üzerinde hesaplanır
  // Tek ürün varsa karşılaştırma için yine doluyoruz (min=avg=max=current)
  const allTryPrices = (allResults || []).map(r => r.price_try ?? r.price).filter(p => typeof p === 'number' && p > 0);
  const stats = (() => {
    if (allTryPrices.length === 0) {
      const t = comp.price_try ?? comp.price ?? 0;
      return { min: t, max: t, avg: t, count: 1 };
    }
    return {
      min: Math.min(...allTryPrices),
      max: Math.max(...allTryPrices),
      avg: allTryPrices.reduce((a, b) => a + b, 0) / allTryPrices.length,
      count: allTryPrices.length,
    };
  })();
  const currentTl = comp.price_try ?? comp.price ?? 0;
  const range = (stats.max - stats.min) || 1;
  const currentPos = ((currentTl - stats.min) / range) * 100;
  const savingsPct = stats.avg > 0 ? Math.max(0, ((stats.avg - stats.min) / stats.avg) * 100) : 0;

  // AI önerisini parse et — hem TRY hem EUR içerebilir
  let parsedSuggestion = { price: 0, reason: '' };
  try {
    if (comp.ref_suggestion) parsedSuggestion = JSON.parse(comp.ref_suggestion);
  } catch (e) { /* sessizce yok say */ }

  // Satış Hesaplayıcı state — ürün değişince resetlenir (parent'ta key={comp.id} gerekiyor)
  const [kdvPct, setKdvPct] = useState(20);
  const [kargo, setKargo] = useState(30);
  const [commissionPct, setCommissionPct] = useState(0);

  const cost = currentTl;

  // Kâr garantili öneri: KDV+komisyon+kargo+alış sonrasında en az %15 kâr eden fiyat.
  //
  //   netProfit = salePrice * (1 - kdv/100 - kom/100) - kargo - cost
  //
  // → break-even = (cost + kargo) / (1 - kdv/100 - kom/100)
  //
  // %15 buffer ile kâr garantili minimum fiyatı bulup, pazar ortalamasının
  // %3 altıyla karşılaştırıyoruz; daha YÜKSEK olanı seçiyoruz (kâr asla negatif olmasın).
  const taxRate = 1 - (kdvPct + commissionPct) / 100;
  const breakEvenPrice = taxRate > 0 ? (cost + Number(kargo || 0)) / taxRate : cost * 1.5;
  const safeProfitablePrice = breakEvenPrice * 1.15;
  const competitivePrice = stats.avg > 0 ? stats.avg * 0.97 : safeProfitablePrice;
  const recommendedSale = Math.max(safeProfitablePrice, competitivePrice);
  const recommendationStrategy = competitivePrice >= safeProfitablePrice
    ? 'competitive'   // pazarın altında kalıp kâr edebiliyor
    : 'profit-floor'; // pazar çok düşük, kâr için ortalamanın üstünde fiyat

  const [salePrice, setSalePrice] = useState(Math.round(recommendedSale * 100) / 100);

  const kdvAmount = (salePrice * kdvPct) / 100;
  const commissionAmount = (salePrice * commissionPct) / 100;
  const totalDeductions = kdvAmount + Number(kargo || 0) + commissionAmount;
  const netRevenue = salePrice - totalDeductions;
  const netProfit = netRevenue - cost;
  const profitMarginPct = cost > 0 ? (netProfit / cost) * 100 : 0;
  const isProfitable = netProfit > 0;

  return (
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

      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ width: 10, height: 10, borderRadius: '2px', background: 'var(--accent)', marginTop: '4px', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>{comp.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.4' }}>
            Kategori: {comp.category}<br/>
            Kaynak: {comp.supplier}<br/>
            Birim Fiyat: {formatPrice(comp)}
          </div>
          
          {comp.url && (
            <a 
              href={comp.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: 'var(--accent)',
                textDecoration: 'none',
                marginBottom: '10px',
                fontWeight: '600'
              }}
            >
              <ExternalLink size={14} /> Kaynak Sayfaya Git
            </a>
          )}

          <div style={{ background: 'rgba(2, 132, 199, 0.08)', borderRadius: '6px', padding: '12px', fontSize: '0.78rem', color: 'var(--accent)', lineHeight: '1.55', border: '1px solid rgba(2, 132, 199, 0.12)' }}>
            <div style={{ fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Yapay Zeka Yorumu
            </div>
            {comp.description && (
              <p style={{ marginBottom: '10px', color: 'var(--text-main)' }}>{comp.description}</p>
            )}

            {/* İnsancıl öneri kartı */}
            <div style={{
              background: 'var(--bg-card)',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(2, 132, 199, 0.18)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--accent)', fontWeight: '700' }}>
                <TrendingUp size={14} /> Fiyatlandırma Önerisi
              </div>
              <p style={{ margin: 0, lineHeight: '1.6' }}>
                {(() => {
                  // Önerilen fiyatla net kârı hesapla (mevcut KDV/kargo/komisyonlarla)
                  const recKdv = (recommendedSale * kdvPct) / 100;
                  const recCom = (recommendedSale * commissionPct) / 100;
                  const recProfit = recommendedSale - recKdv - Number(kargo || 0) - recCom - cost;
                  const recMargin = cost > 0 ? (recProfit / cost) * 100 : 0;
                  return recommendationStrategy === 'competitive' ? (
                    <>
                      Rakiplerin ortalama satış fiyatı <strong>₺{stats.avg.toFixed(2)}</strong>.{' '}
                      Bu ürünü <strong style={{ color: '#10b981' }}>₺{recommendedSale.toFixed(2)}</strong>'a satarsanız{' '}
                      pazarın altında kalıp giderlerden sonra{' '}
                      <strong style={{ color: '#10b981' }}>≈ ₺{recProfit.toFixed(2)}</strong>{' '}
                      net kâr edersiniz (%{recMargin.toFixed(1)} marj).
                    </>
                  ) : (
                    <>
                      Pazar ortalaması (<strong>₺{stats.avg.toFixed(2)}</strong>) bu ürünü kârlı satmak için düşük.{' '}
                      KDV, kargo ve komisyon sonrası kâr edebilmek için{' '}
                      <strong style={{ color: '#10b981' }}>en az ₺{recommendedSale.toFixed(2)}</strong>'a satmalısınız.{' '}
                      Bu fiyatla net kâr <strong style={{ color: '#10b981' }}>≈ ₺{recProfit.toFixed(2)}</strong> (%{recMargin.toFixed(1)} marj).
                    </>
                  );
                })()}
              </p>
              {parsedSuggestion.reason && (
                <p style={{ margin: '8px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px dashed var(--border)', paddingTop: '6px' }}>
                  AI notu: {parsedSuggestion.reason}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase' }}>Fiyat Karşılaştırması</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          {comparisons.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i !== comparisons.length - 1 ? '8px' : '0', borderBottom: i !== comparisons.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: '0.85rem', color: item.id === comp.id ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: item.id === comp.id ? '600' : '500' }}>{item.supplier}</span>
              <span style={{ fontSize: '0.85rem', color: item.id === comp.id ? 'var(--accent)' : 'var(--text-main)', fontWeight: item.id === comp.id ? '700' : '600' }}>
                {formatPrice(item)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fiyat İstatistikleri (her zaman gösterilir, tüm sonuçlardan) ── */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingUp size={14} /> Fiyat İstatistikleri
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: '500', color: 'var(--text-dim)', textTransform: 'none', letterSpacing: 0 }}>
            {stats.count} kaynak
          </span>
        </h4>
        <div style={{ background: 'var(--bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
            {[
              { label: 'En Düşük', value: `₺${stats.min.toFixed(2)}`, color: '#10b981' },
              { label: 'Ortalama', value: `₺${stats.avg.toFixed(2)}`, color: 'var(--text-main)' },
              { label: 'En Yüksek', value: `₺${stats.max.toFixed(2)}`, color: '#ef4444' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '8px 4px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px', fontWeight: '600' }}>{s.label}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {stats.max > stats.min && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span>Seçili ürün konumu</span>
                <span style={{ fontWeight: '700', color: 'var(--accent)' }}>₺{currentTl.toFixed(2)}</span>
              </div>
              <div style={{ position: 'relative', height: '8px', background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)', borderRadius: '4px', opacity: 0.3 }}>
                <div style={{
                  position: 'absolute',
                  left: `${Math.max(0, Math.min(100, currentPos))}%`,
                  top: '-3px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  border: '2px solid var(--bg-card)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  transform: 'translateX(-50%)'
                }} />
              </div>
            </div>
          )}

          {savingsPct > 0 && (
            <div style={{ marginTop: '12px', padding: '8px 10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ortalama → en düşük tasarruf</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>%{savingsPct.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Satış Hesaplayıcı ─────────────────────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Receipt size={14} /> Satış Hesaplayıcı
        </h4>
        <div style={{
          background: 'var(--bg)',
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          {/* Seçili ürün özeti */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border)', marginBottom: '12px' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: '600' }}>Seçili Ürün</div>
              <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {comp.name}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: '600' }}>Alış</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>₺{cost.toFixed(2)}</div>
            </div>
          </div>

          {/* Inputlar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            {[
              { label: 'Satış Fiyatı (₺)', value: salePrice, setter: setSalePrice, icon: <Tag size={12} />, step: '0.01' },
              { label: 'KDV (%)', value: kdvPct, setter: setKdvPct, icon: <Receipt size={12} />, step: '1' },
              { label: 'Kargo (₺)', value: kargo, setter: setKargo, icon: <Truck size={12} />, step: '1' },
              { label: 'Komisyon (%)', value: commissionPct, setter: setCommissionPct, icon: <Wallet size={12} />, step: '0.5' },
            ].map((f, i) => (
              <label key={i} className="calc-field">
                <span className="calc-field-label">{f.icon} {f.label}</span>
                <input
                  type="number"
                  step={f.step}
                  min="0"
                  value={f.value}
                  onChange={(e) => f.setter(parseFloat(e.target.value) || 0)}
                  className="calc-input"
                />
              </label>
            ))}
          </div>

          {/* Hızlı set butonu */}
          <button
            onClick={() => setSalePrice(Math.round(recommendedSale * 100) / 100)}
            className="calc-suggest-btn"
          >
            <Sparkles size={12} />
            AI önerisini uygula (₺{recommendedSale.toFixed(2)})
          </button>

          {/* Detay döküm */}
          <div style={{ marginTop: '14px', borderTop: '1px dashed var(--border)', paddingTop: '12px' }}>
            {[
              { label: 'Brüt Satış', value: salePrice, color: 'var(--text-main)' },
              { label: `KDV (%${kdvPct})`, value: -kdvAmount, color: '#ef4444' },
              { label: 'Kargo', value: -Number(kargo || 0), color: '#ef4444' },
              ...(commissionPct > 0 ? [{ label: `Komisyon (%${commissionPct})`, value: -commissionAmount, color: '#ef4444' }] : []),
              { label: 'Alış Maliyeti', value: -cost, color: '#ef4444' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', padding: '4px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                <span style={{ color: row.color, fontWeight: '600', fontFamily: 'ui-monospace, monospace' }}>
                  {row.value < 0 ? '−' : ''}₺{Math.abs(row.value).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Net kâr göstergesi */}
          <div style={{
            marginTop: '12px',
            padding: '12px 14px',
            background: isProfitable ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))' : 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))',
            border: `1px solid ${isProfitable ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: '700' }}>
                Net Kâr
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Marj: <strong style={{ color: isProfitable ? '#10b981' : '#ef4444' }}>%{profitMarginPct.toFixed(1)}</strong>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: isProfitable ? '#10b981' : '#ef4444', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                {isProfitable ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                {netProfit < 0 ? '−' : ''}₺{Math.abs(netProfit).toFixed(2)}
              </div>
            </div>
          </div>

          {!isProfitable && cost > 0 && (
            <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#ef4444', textAlign: 'center', fontStyle: 'italic' }}>
              Bu fiyatla zarar edersiniz. Satış fiyatını yükseltin veya giderleri düşürün.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

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
  const [isFocused, setIsFocused] = useState(false);

  const popularQueries = ['ESP32', 'STM32F103', 'ATmega328', 'LM7805', 'LCD 16x2', 'NRF24L01'];

  const suppliers = [
    { name: 'Mouser', region: 'Global', color: '#0054a6' },
    { name: 'DigiKey', region: 'Global', color: '#cc0000' },
    { name: 'Robotistan', region: 'TR', color: '#f59e0b' },
    { name: 'Direnç.net', region: 'TR', color: '#10b981' },
    { name: 'Robolink', region: 'TR', color: '#8b5cf6' },
    { name: 'Robo90', region: 'TR', color: '#ec4899' },
    { name: 'Komponentci', region: 'TR', color: '#06b6d4' },
    { name: 'FindChips', region: 'Global', color: '#7c3aed' },
  ];

  const steps = [
    {
      icon: <Search size={22} />,
      title: 'Tarama',
      desc: 'Türkiye ve global distribütörler eş zamanlı sorgulanır; ham ürün listesi çıkar.',
      color: '#0284c7'
    },
    {
      icon: <Cpu size={22} />,
      title: 'Kümeleme',
      desc: 'Anlamsal vektörlerle aynı parça farklı isimlerde olsa bile tek kümeye toplanır.',
      color: '#7c3aed'
    },
    {
      icon: <Sparkles size={22} />,
      title: 'AI Analizi',
      desc: 'Gemini, piyasa istatistiği ve maliyet üzerinden marjlı bir öneri fiyatı üretir.',
      color: '#10b981'
    },
    {
      icon: <TrendingUp size={22} />,
      title: 'Karşılaştırma',
      desc: 'TR ve Global fiyatlar yan yana; tasarruf yüzdesi anında görülür.',
      color: '#f59e0b'
    },
  ];

  const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* ── Animasyonlu arka plan blob'ları ──────────────────────────── */}
      <div className="landing-bg-blobs" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
        <div className="dot-grid" />
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '36px', maxWidth: '760px' }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="hero-badge"
          >
            <span className="hero-badge-dot" />
            Yapay Zeka Destekli Komponent Analizi
          </motion.span>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
            fontWeight: '800',
            color: 'var(--text-main)',
            lineHeight: '1.1',
            letterSpacing: '-0.025em',
            marginTop: '24px',
            marginBottom: '18px'
          }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ display: 'inline-block' }}
            >
              Tek aramada
            </motion.span>{' '}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="hero-gradient-text"
            >
              TR ve Global
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ display: 'inline-block' }}
            >
              fiyatları yan yana
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', maxWidth: '620px', margin: '0 auto' }}
          >
            Robotistan, Direnç.net, Mouser, DigiKey ve daha fazlasında aynı anda arar; AI ile fiyat farkını ve en uygun seçimi gösterir.
          </motion.p>
        </motion.div>

        {/* ── Search bar ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.45 }}
          style={{ width: '100%', maxWidth: '720px', marginBottom: '20px', position: 'relative' }}
        >
          <div className={`hero-search ${isFocused ? 'focused' : ''}`}>
            <Search size={22} color={isFocused ? 'var(--accent)' : 'var(--text-dim)'} style={{ transition: 'color 0.2s' }} />
            <input
              type="text"
              placeholder="ESP32-WROOM, STM32, LM7805..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: 'var(--text-main)', fontSize: '1.05rem', flex: 1,
                fontFamily: 'Inter, sans-serif', padding: '8px 0'
              }}
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onSearch(query)}
              className="premium-button hero-search-btn"
            >
              <span>Ara</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                style={{ display: 'inline-flex' }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </motion.button>
          </div>
        </motion.div>

        {/* ── Quick chips ──────────────────────────────────────── */}
        <motion.div
          variants={stagger} initial="initial" animate="animate"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '70px' }}
        >
          <motion.span variants={fadeUp} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '6px' }}>
            Popüler:
          </motion.span>
          {popularQueries.map((q, i) => (
            <motion.button
              key={q}
              variants={fadeUp}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setQuery(q); onSearch(q); }}
              className="popular-chip"
            >
              {q}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Live demo card (decorative) ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="demo-card-wrap"
        >
          <div className="demo-card">
            <div className="demo-card-header">
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="demo-dot" style={{ background: '#ef4444' }} />
                <span className="demo-dot" style={{ background: '#f59e0b' }} />
                <span className="demo-dot" style={{ background: '#10b981' }} />
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>esp32-wroom-32</span>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontSize: '0.7rem', color: '#10b981', fontWeight: '600'
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> CANLI
              </motion.span>
            </div>
            <div className="demo-card-body">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="demo-row demo-row-tr"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="demo-flag-tr">TR</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>Robotistan</span>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>₺285,00</span>
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="demo-row demo-row-global"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="demo-flag-gl">GL</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>Mouser</span>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>€7,80 = ₺312,40</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="demo-savings"
              >
                <ArrowDown size={14} />
                <span>TR %8,8 daha ucuz</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── How it works ─────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '1000px', marginTop: '100px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="section-eyebrow">
              <Layers size={14} /> Süreç
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: '700', color: 'var(--text-main)', marginTop: '12px', letterSpacing: '-0.02em' }}>
              Bir aramanın <span className="hero-gradient-text">arka planında</span> ne olur?
            </h2>
          </div>

          <motion.div
            variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}
            className="steps-grid"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="step-card"
                style={{ '--step-color': step.color }}
              >
                <div className="step-number">{i + 1}</div>
                <div className="step-icon" style={{ background: `${step.color}15`, color: step.color }}>
                  {step.icon}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>{step.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>{step.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight size={18} className="step-connector" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Suppliers showcase ───────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '1000px', marginTop: '100px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '34px' }}>
            <span className="section-eyebrow">
              <Globe size={14} /> Veri Kaynakları
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: '700', color: 'var(--text-main)', marginTop: '12px', letterSpacing: '-0.02em' }}>
              Eş zamanlı sorgulanan tedarikçiler
            </h2>
          </div>

          <motion.div
            variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}
          >
            {suppliers.map((s, i) => (
              <motion.div
                key={s.name}
                variants={fadeUp}
                whileHover={{ y: -3, scale: 1.03 }}
                className="supplier-pill"
              >
                <span className="supplier-pill-dot" style={{ background: s.color }} />
                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{s.name}</span>
                <span className={`supplier-pill-tag ${s.region === 'TR' ? 'tr' : 'gl'}`}>
                  {s.region}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '780px', marginTop: '100px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '34px' }}>
            <span className="section-eyebrow">
              <HelpCircle size={14} /> Sıkça Sorulanlar
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: '700', color: 'var(--text-main)', marginTop: '12px', letterSpacing: '-0.02em' }}>
              Aklınıza takılanlar
            </h2>
          </div>

          <motion.div
            variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {[
              { q: 'Hangi tedarikçileri destekliyorsunuz?', a: 'Mevcut sürümde 7 entegre kaynak var: Robotistan, Direnç.net, Robolink, Robo90, Komponentci (TR) ve FindChips üzerinden Mouser/DigiKey gibi global distribütörler.' },
              { q: 'Fiyat farkı nasıl hesaplanıyor?', a: 'TR ve global gruplarının en düşük TRY karşılığı kıyaslanır. Global fiyatlar EUR/USD\'den günlük kura göre TRY\'ye çevrilir.' },
              { q: 'AI önerileri ne kadar güvenilir?', a: 'Gemini modeli, piyasa min/avg/max + maliyet verisi üzerinden çalışır. Kararı sizin için bağlam sağlar; nihai tercih size aittir.' },
              { q: 'Veriler ne sıklıkla güncellenir?', a: 'Her arama anlık olarak distribütör sayfalarından çekilir. Aynı ürün tekrar aranırsa AI açıklaması cache\'lenip hızlı dönülür.' }
            ].map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <FAQItem question={faq.q} answer={faq.a} />
              </motion.div>
            ))}
          </motion.div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/sss" className="text-link">
              Tüm soruları gör <ArrowRight size={14} />
            </Link>
          </div>
        </motion.section>

      </div>
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

  const categories = ['Hepsi', ...new Set(results.map(c => c.category).filter(Boolean))];

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

  const performSearch = async (q) => {
    if (!q || !q.trim()) return;
    setSearchQuery(q);
    setLoading(true);
    setHasSearched(true);
    
    try {
      const data = await searchComponents(q);
      setResults(data || []);
      setSelectedComp(data && data.length > 0 ? data[0] : null);
      // Sonuç dönerse geçmişe kaydet (boş aramaları geçmişte tutma)
      if (data && data.length > 0) {
        appendSearchHistory(q);
      }
    } catch {
      setResults([]);
      setSelectedComp(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      performSearch(q);
    } else {
      setHasSearched(false);
      setSearchQuery('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.search]);

  const handleSearch = (queryToSearch) => {
    const q = typeof queryToSearch === 'string' ? queryToSearch : searchQuery;
    if (!q.trim()) return;
    navigate(`/?q=${encodeURIComponent(q)}`);
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
      <div className="dashboard-results" style={{ flex: 1, overflowY: 'auto', padding: '24px 30px', background: 'var(--bg)' }}>
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

        <div className="filter-toolbar">
          <div className="filter-group">
            <div className="filter-label">
              <Filter size={14} />
              <span>Kategori</span>
            </div>
            <div className="chip-row">
              {categories.map(cat => {
                const count = cat === 'Hepsi'
                  ? results.length
                  : results.filter(r => r.category === cat).length;
                const active = filterCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`filter-chip ${active ? 'active' : ''}`}
                  >
                    <span>{cat}</span>
                    <span className="filter-chip-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <div className="filter-label">
              <ArrowUpDown size={14} />
              <span>Sırala</span>
            </div>
            <div className="segmented">
              {[
                { value: 'price-low', label: 'Ucuz → Pahalı' },
                { value: 'price-high', label: 'Pahalı → Ucuz' },
                { value: 'stock-high', label: 'En Çok Stok' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`segmented-btn ${sortBy === opt.value ? 'active' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => generateReport(filteredAndSortedResults, searchQuery)}
            disabled={filteredAndSortedResults.length === 0}
            className="report-btn"
          >
            <FileDown size={16} />
            <span>PDF Rapor</span>
            <span className="report-btn-badge">{filteredAndSortedResults.length}</span>
          </motion.button>
        </div>

        {loading ? (
           <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
              <div style={{ border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', width: 40, height: 40, animation: 'spin 1s linear infinite' }} />
           </div>
        ) : (() => {
          const trItems = filteredAndSortedResults.filter(c => c.status === 'Türkiye');
          const globalItems = filteredAndSortedResults.filter(c => c.status !== 'Türkiye');

          const stats = (list) => {
            if (!list.length) return null;
            const tryPrices = list.map(c => c.price_try).filter(p => typeof p === 'number' && p > 0);
            if (!tryPrices.length) return null;
            const min = Math.min(...tryPrices);
            const avg = tryPrices.reduce((a, b) => a + b, 0) / tryPrices.length;
            return { min, avg, count: list.length };
          };

          const trStats = stats(trItems);
          const globalStats = stats(globalItems);

          const renderSection = (items, title, Icon, color, accentBg, sub) => (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px',
                padding: '10px 14px', background: accentBg, borderRadius: '8px',
                borderLeft: `3px solid ${color}`,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '6px', background: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>{title}</div>
                  {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>}
                </div>
                <div style={{
                  fontSize: '0.7rem', fontWeight: '700', color,
                  padding: '4px 10px', background: '#fff', borderRadius: '20px',
                  border: `1px solid ${color}33`,
                }}>
                  {items.length} ürün
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                {items.map((comp, i) => (
                  <ComponentCard
                    key={comp.id}
                    comp={comp}
                    index={i}
                    isSelected={selectedComp?.id === comp.id}
                    onClick={() => setSelectedComp(comp)}
                  />
                ))}
              </div>
            </div>
          );

          if (filteredAndSortedResults.length === 0) {
            return (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
                Sonuç bulunamadı.
              </div>
            );
          }

          return (
            <div style={{ marginBottom: '30px' }}>
              {trStats && renderSection(
                trItems,
                'Türkiye Satıcıları',
                MapPin,
                '#dc2626',
                'rgba(220, 38, 38, 0.06)',
                `Min: ₺${trStats.min.toFixed(2)} • Ort: ₺${trStats.avg.toFixed(2)} • Yerel pazar, hızlı kargo, TRY üzerinden satış`
              )}

              {trStats && globalStats && (() => {
                const diff = globalStats.min - trStats.min;
                const pct = trStats.min > 0 ? Math.abs(diff / trStats.min) * 100 : 0;
                const cheaperSide = diff > 0 ? 'TR' : (diff < 0 ? 'Global' : 'eşit');
                const DiffIcon = diff > 0 ? ArrowDown : (diff < 0 ? ArrowUp : Minus);
                const diffColor = diff > 0 ? '#10b981' : (diff < 0 ? '#ef4444' : 'var(--text-muted)');

                return (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    margin: '8px 0 28px 0',
                    padding: '14px 18px',
                    background: 'var(--bg-card)',
                    border: '1px dashed var(--border)',
                    borderRadius: '10px',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600', marginBottom: '4px' }}>
                        Karşılaştırma (En Düşük TRY Fiyat)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                        <span style={{ color: '#dc2626', fontWeight: '700' }}>TR ₺{trStats.min.toFixed(2)}</span>
                        <span style={{ color: 'var(--text-dim)' }}>vs</span>
                        <span style={{ color: '#0284c7', fontWeight: '700' }}>Global ₺{globalStats.min.toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 14px', background: `${diffColor}15`,
                      borderRadius: '20px', border: `1px solid ${diffColor}40`,
                    }}>
                      <DiffIcon size={16} color={diffColor} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: diffColor }}>
                        {cheaperSide === 'eşit' ? 'Fiyatlar eşit' : `${cheaperSide} %${pct.toFixed(1)} daha ucuz`}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {globalStats && renderSection(
                globalItems,
                'Global Satıcılar',
                Globe,
                '#0284c7',
                'rgba(2, 132, 199, 0.06)',
                `Min: ₺${globalStats.min.toFixed(2)} • Ort: ₺${globalStats.avg.toFixed(2)} • Distribütör, döviz + gümrük, geniş katalog`
              )}
            </div>
          );
        })()}
      </div>

      {selectedComp && !loading && <DetailPanel key={selectedComp.id} comp={selectedComp} allResults={results} />}

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
