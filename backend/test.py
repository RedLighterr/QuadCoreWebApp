"""
QuadCore AI Pipeline Test - Internetten Veri Çekerek

İnternetten (DigiKey, Mouser, LCSC) veri çeker ve AI pipeline'ını çalıştırır.

Kullanım:
    python test_with_scraping.py ESP32
    python test_with_scraping.py ATmega328P
    python test_with_scraping.py STM32F103
"""

import sys
import asyncio
import logging
from pathlib import Path

# Setup path
sys.path.insert(0, str(Path(__file__).parent))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)-8s] %(name)s → %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

# Imports
from app.scraper.clients import DigiKeyClient, MouserClient, LCSCClient
from app.ai.pipeline import process as ai_process

# ============================================================================
# CONFIGURATION
# ============================================================================

W = 85

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def print_header(text: str):
    """Başlık yazdır."""
    print(f"\n{'╔' + '═' * (W - 2) + '╗'}")
    print(f"║ {text:<{W - 4}} ║")
    print(f"{'╚' + '═' * (W - 2) + '╝'}\n")


def print_section(title: str):
    """Bölüm başlığı yazdır."""
    print(f"\n{'─' * W}")
    print(f"  {title}")
    print(f"{'─' * W}\n")


def format_price(price: float, currency: str = "USD") -> str:
    """Fiyatı formatla."""
    currency = (currency or "TRY").upper()
    symbols = {"USD": "$", "TRY": "₺", "EUR": "€"}
    symbol = symbols.get(currency, "")
    if symbol:
        return f"{symbol}{price:,.2f}"
    return f"{price:,.2f} {currency}"


def print_product_card(product: dict, index: int = 1):
    """Ürün kartını yazdır."""
    title = product.get("title", "N/A")[:60]
    brand = product.get("brand", "N/A")
    price = product.get("price", 0)
    stock = product.get("stock", "N/A")
    source = product.get("source", "Unknown")
    region = product.get("region", "Unknown")
    currency = product.get("currency", "USD")
    
    print(f"  {index}. {title}")
    print(f"     ├─ Marka: {brand}")
    print(f"     ├─ Kaynak: {source} ({region})")
    print(f"     ├─ Fiyat: {format_price(price, currency)}")
    print(f"     └─ Stok: {stock}\n", end="")


# ============================================================================
# MAIN PIPELINE
# ============================================================================

async def run_pipeline(product_name: str):
    """Ürün için full pipeline çalıştır."""
    
    print_header(f"QuadCore AI Pipeline | Ürün: {product_name}")
    
    # ========================================================================
    # STEP 1: SCRAPING - INTERNETTEN VERİ ÇEK
    # ========================================================================
    print_section("ADIM 1: Pazarlardan Veri Çekiliyor (İnternetten)")
    print(f"  Aranıyor: {product_name}")
    print(f"  Kaynaklar: DigiKey, Mouser, LCSC\n")
    
    clients = [
        ("DigiKey", DigiKeyClient()),
        ("Mouser", MouserClient()),
        ("LCSC", LCSCClient()),
    ]
    
    all_products = []
    
    for source_name, client in clients:
        try:
            print(f"  ⏳ {source_name:<12} taranıyor...", end=" ", flush=True)
            products = await client.search_product(product_name)
            print(f"✓ ({len(products)} ürün)")
            all_products.extend(products)
            
        except Exception as e:
            print(f"✗ Hata: {str(e)[:50]}")
    
    if not all_products:
        print(f"\n  ❌ Hiçbir ürün bulunamadı!")
        return
    
    print(f"\n  ✓ Toplam {len(all_products)} ürün bulundu\n")
    
    # Show raw scraped data
    print(f"  Çekilen Ham Veriler:\n")
    for i, p in enumerate(all_products[:5], 1):
        print(f"    {i}. {p['title'][:50]}")
        print(f"       Fiyat: {format_price(p['price'], p['currency'])}")
        print(f"       Kaynak: {p['source']}\n")
    
    if len(all_products) > 5:
        print(f"    ... ve {len(all_products) - 5} ürün daha\n")
    
    # ========================================================================
    # STEP 2: AI PIPELINE - ANALYZE & PROCESS
    # ========================================================================
    print_section("ADIM 2: AI Pipeline'ı Çalıştırılıyor")
    
    try:
        print(f"  İşleniyor (Preprocessing, Embedding, Clustering, Pricing)...", end=" ", flush=True)
        result = ai_process(all_products)
        print("✓\n")
        
        if not result:
            print(f"  ⚠️  AI pipeline sonuç döndürmedi\n")
            return
        
        # Display results
        print(f"  📊 AI Sonuçları:\n")
        
        for i, item in enumerate(result, 1):
            print(f"  {i}. Küme Sonucu:")
            print(f"     ├─ Ürün: {item.get('product', 'N/A')[:50]}")
            print(f"     ├─ Maliyet: {format_price(item.get('cost', 0), 'TRY')}")
            pricing = item.get('pricing', {})
            recommended_price = pricing.get('price', 0)
            print(f"     ├─ Önerilen Fiyat: {format_price(recommended_price, 'TRY')}")

            if isinstance(pricing, dict):
                print(f"     ├─ Fiyatlandırma:")
                print(f"     │  ├─ Status: {pricing.get('status', 'N/A')}")
                print(f"     │  ├─ Price: {format_price(pricing.get('price', 0), 'TRY')}")
                print(f"     │  ├─ Margin: {pricing.get('margin', 'N/A')}")
                print(f"     │  └─ Currency: TRY")

            if item.get('description'):
                description = item['description'].replace('\n', ' ').strip()
                print(f"     ├─ Açıklama: {description[:120]}")

            if item.get('ref_suggestion'):
                suggestion = item['ref_suggestion'].replace('\n', ' ').strip()
                print(f"     ├─ Öneri Fiyat (AI): {suggestion}")

            # Top 3
            top3 = item.get('top3', [])
            if top3:
                print(f"     └─ En İyi 3 Fiyat: ({len(top3)} ürün)")
                for j, p in enumerate(top3[:3], 1):
                    print(f"        {j}. {p.get('source', 'N/A')}: {format_price(p.get('price', 0), p.get('currency', 'TRY'))} ({format_price(p.get('price_try', 0), 'TRY')} TRY)")
            print()
        
    except Exception as e:
        print(f"✗ AI Pipeline Hatası: {e}")
        logger.exception("Pipeline error")
        return
    
    # ========================================================================
    # STEP 3: SUMMARY
    # ========================================================================
    print_section("ÖZET")
    
    print(f"  📊 İstatistikler:")
    print(f"     • Toplam Ürün: {len(all_products)}")
    
    sources_count = {}
    for p in all_products:
        source = p.get('source', 'Unknown')
        sources_count[source] = sources_count.get(source, 0) + 1
    
    print(f"     • Kaynaklar: {', '.join(sources_count.keys())}")
    
    print(f"\n  📍 Kaynaklar Detaylı:")
    for source, count in sources_count.items():
        print(f"     • {source}: {count} ürün")
    
    print(f"\n  ✓ Pipeline başarıyla tamamlandı!\n")


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

async def main():
    """Ana fonksiyon."""
    
    if len(sys.argv) < 2:
        print("\n  Kullanım:")
        print(f"    python {sys.argv[0]} <ürün_adı>\n")
        print("  Örnekler:")
        print(f"    python {sys.argv[0]} ESP32")
        print(f"    python {sys.argv[0]} ATmega328P")
        print(f"    python {sys.argv[0]} STM32F103\n")
        sys.exit(1)
    
    product_name = " ".join(sys.argv[1:])
    
    try:
        await run_pipeline(product_name)
    except KeyboardInterrupt:
        print("\n\n  ⚠️  İşlem iptal edildi.\n")
    except Exception as e:
        print(f"\n  ❌ Hata: {e}\n")
        logger.exception("Main error")


if __name__ == "__main__":
    asyncio.run(main())