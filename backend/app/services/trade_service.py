from sqlalchemy.orm import Session
from ..db import models
from ..schemas import product as schemas
from ..scraper.clients import DigiKeyClient, MouserClient
import asyncio
from datetime import datetime

class TradeService:
    def __init__(self, db: Session):
        self.db = db
        self.digikey = DigiKeyClient()
        self.mouser = MouserClient()

    async def create_product(self, product_in: schemas.ProductCreate):
        db_product = models.Product(**product_in.dict())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    async def run_full_analysis(self, product_id: int):
        product = self.db.query(models.Product).filter(models.Product.id == product_id).first()
        if not product:
            return None

        # Paralel veri çekme
        results = await asyncio.gather(
            self.digikey.search_product(product.name),
            self.mouser.search_product(product.name)
        )
        
        # Tüm sonuçları birleştir (Görseldeki liste yapısı)
        all_market_products = results[0] + results[1]
        
        if not all_market_products:
            return None

        # En iyi fiyatı bul (USD bazında basitleştirilmiş)
        best_deal = min(all_market_products, key=lambda x: x['price'])
        
        # Basit fiyatlandırma: En iyi fiyatın %10 üstü (Toptancıdan alıp satıyorsak kâr koyuyoruz)
        # Veya en iyi fiyat perakende fiyatıysa onun altına iniyoruz.
        # Görseldeki senaryoya göre: Alırken kazan, satarken rakibi ele.
        suggested = best_deal['price'] * 0.95 # Rakibin %5 altına in

        analysis = models.Analysis(
            product_id=product.id,
            raw_results=all_market_products,
            suggested_price=suggested,
            best_deal_json=best_deal
        )

        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        
        # Response şemasına uygun dön
        return {
            "product_id": product.id,
            "results": all_market_products,
            "suggested_price": suggested,
            "best_deal": best_deal,
            "created_at": analysis.created_at
        }
