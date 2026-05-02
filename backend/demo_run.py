import asyncio
import httpx
import json
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db import models
from app.services.trade_service import TradeService
from app.schemas.product import ProductCreate

async def run_demo():
    # 1. Veritabanı tablolarını oluştur (Yoksa)
    print("--- [1] Veritabanı Hazırlanıyor ---")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    service = TradeService(db)

    try:
        # 2. Örnek bir elektronik bileşen ekle
        # Gerçek dünyada DigiKey/Mouser parça numarasıyla (Part Number) arama yapar.
        part_name = "STM32F103C8T6"  # Popüler bir mikrodenetleyici
        print(f"\n--- [2] Ürün Oluşturuluyor: {part_name} ---")
        
        # Önce veritabanında var mı kontrol et
        existing_product = db.query(models.Product).filter(models.Product.name == part_name).first()
        if not existing_product:
            product_in = ProductCreate(name=part_name, sku="MCU-STM32-001", image_url="http://example.com/stm32.jpg")
            product = await service.create_product(product_in)
            print(f"Ürün başarıyla oluşturuldu! ID: {product.id}")
        else:
            product = existing_product
            print(f"Ürün zaten mevcut. ID: {product.id}")

        # 3. Analizi Başlat (DigiKey & Mouser API Çağrıları)
        print(f"\n--- [3] DigiKey ve Mouser Analizi Başlatılıyor... ---")
        print("Not: Şu an API anahtarları eksikse 'mock' veri dönebilir.")
        
        analysis = await service.run_full_analysis(product.id)

        if analysis:
            print("\n=========================================")
            print("        ANALİZ SONUÇLARI (QuadCore)      ")
            print("=========================================")
            print(f"Ürün:           {part_name}")
            print(f"En İyi Tedarikçi: {analysis.best_supplier}")
            print(f"Maliyet (Wholesale): ${analysis.wholesale_price}")
            print(f"Pazar Ortalaması:   ${analysis.market_average_price:.2f}")
            print(f"Rakiplerin Fiyatları: {analysis.competitor_prices}")
            print("-----------------------------------------")
            print(f"ÖNERİLEN SATIŞ FİYATI: ${analysis.suggested_price:.2f}")
            print(f"TAHMİNİ KÂR MARJI:     %{analysis.estimated_profit_margin * 100:.1f}")
            print(f"STRATEJİ:              {analysis.strategy}")
            print("=========================================\n")
        else:
            print("\n[!] Analiz yapılamadı. Tedarikçilerden veri alınamadı.")

    except Exception as e:
        print(f"\n[X] Demo sırasında hata oluştu: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Python asenkron döngüsünü başlat
    asyncio.run(run_demo())
