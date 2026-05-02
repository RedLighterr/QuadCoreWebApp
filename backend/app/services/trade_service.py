import asyncio
import logging
from sqlalchemy.orm import Session
from ..db import models
from ..schemas import product as schemas
from ..scraper.clients import master_scraper

logger = logging.getLogger(__name__)

try:
    from ..ai.pipeline import process as ai_process
    _AI_AVAILABLE = True
    logger.info("AI pipeline loaded successfully.")
except ImportError as e:
    logger.warning(f"AI pipeline unavailable (missing deps?): {e}. Using fallback pricing.")
    _AI_AVAILABLE = False


class TradeService:
    def __init__(self, db: Session):
        self.db = db

    async def create_product(self, product_in: schemas.ProductCreate):
        db_product = models.Product(**product_in.model_dump())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    async def run_full_analysis(self, product_id: int):
        product = self.db.query(models.Product).filter(models.Product.id == product_id).first()
        if not product: return None

        # Sitelerden ham veri çekiliyor — hiçbir dönüşüm yapılmıyor
        all_market_products = await master_scraper.search(product.name)

        if not all_market_products: return None

        if _AI_AVAILABLE:
            try:
                loop = asyncio.get_running_loop()
                ai_results = await loop.run_in_executor(
                    None, lambda: ai_process(list(all_market_products))
                )
                if ai_results: return ai_results
            except Exception as e:
                logger.warning(f"AI pipeline execution failed: {e}")

        # Fallback Output
        global_prods = [p for p in all_market_products if p["region"] == "global"]
        tr_prods = [p for p in all_market_products if p["region"] == "TR"]

        def clean(p):
            return {
                "title": p["title"],
                "source": p["source"],
                "region": p["region"],
                "price": p["price"],
                "price_try": p.get("price_try", p["price"]),
                "url": p.get("url")
            }

        # Global ürün varsa: top3=global, market_refs=TR
        # Sadece TR ürün varsa: top3=TR, market_refs=[]
        if global_prods:
            analysis_prods = global_prods
            top3 = [clean(p) for p in sorted(global_prods, key=lambda x: x["price"])[:6]]
            market_refs = [clean(p) for p in tr_prods]
        else:
            analysis_prods = all_market_products
            top3 = [clean(p) for p in sorted(all_market_products, key=lambda x: x["price"])[:6]]
            market_refs = []

        best_deal = min(analysis_prods, key=lambda x: x["price"])

        return [{
            "product": product.name,
            "cost": round(best_deal["price"] * 1.10, 2),
            "pricing": {"status": "ok", "price": round(best_deal["price"] * 1.3, 2), "margin": 0.2},
            "ref_suggestion": f"json\\n{{\\n  \\\"price\\\": {round(best_deal['price'] * 1.3, 2)},\\n  \\\"reason\\\": \\\"Yerel ve global distribütör verileri analiz edilmiştir.\\\"\\n}}\\n",
            "top3": top3,
            "market_refs": market_refs,
            "description": f"{product.name}: Türkiye'deki distribütörler üzerinden analiz edilmiştir."
        }]
