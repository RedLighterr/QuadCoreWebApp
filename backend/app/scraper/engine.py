import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
import logging

# Loglama yapılandırması
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseScraper:
    """
    Tüm scraperlar için temel sınıf.
    Ortak HTTP istemcisi ve hata yönetimi mantığını içerir.
    """
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    async def fetch_page(self, url: str) -> Optional[str]:
        async with httpx.AsyncClient(headers=self.headers, timeout=10.0) as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                return response.text
            except Exception as e:
                logger.error(f"Error fetching {url}: {e}")
                return None

class MarketScraper(BaseScraper):
    """
    Pazar yerlerinden (Retail) fiyat çeken scraper.
    """
    async def get_competitor_prices(self, product_name: str) -> List[Dict]:
        # Not: Gerçek bir hackathonda burada Trendyol/Amazon vb. için 
        # spesifik parserlar yazılır. Şimdilik mimariyi göstermek için mock dönüyoruz.
        logger.info(f"Searching market for: {product_name}")
        return [
            {"source": "Trendyol", "price": 450.0},
            {"source": "Hepsiburada", "price": 445.50},
            {"source": "Amazon", "price": 430.0}
        ]

class WholesaleScraper(BaseScraper):
    """
    Toptancı sitelerinden maliyet çeken scraper.
    """
    async def get_wholesale_deals(self, product_name: str) -> List[Dict]:
        logger.info(f"Searching wholesale for: {product_name}")
        return [
            {"supplier": "GlobalToptan", "price": 300.0},
            {"supplier": "AnadoluTicaret", "price": 315.0}
        ]
