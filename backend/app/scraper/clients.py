import logging
import re
import asyncio
import httpx
from typing import Dict, List, Optional
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

_TIMEOUT = 12.0


def _parse_price(text: str) -> float:
    if not text:
        return 0.0
    clean = re.sub(r"[^\d,.]", "", text.strip())
    if not clean:
        return 0.0
    try:
        if "," in clean and "." in clean:
            if clean.rfind(",") > clean.rfind("."):
                clean = clean.replace(".", "").replace(",", ".")
            else:
                clean = clean.replace(",", "")
        elif "," in clean:
            clean = clean.replace(",", ".")
        return float(clean)
    except Exception:
        return 0.0


class MasterScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,*/*;q=0.9",
            "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        }

    async def search(self, part_number: str) -> List[Dict]:
        logger.info(f"Piyasa taraması başladı: '{part_number}'")

        results_nested = await asyncio.gather(
            asyncio.wait_for(self._scrape_tr_local(part_number), timeout=_TIMEOUT),
            return_exceptions=True,
        )

        all_results = []
        for res in results_nested:
            if isinstance(res, list):
                all_results.extend(res)
            elif isinstance(res, Exception):
                logger.warning(f"Scraper task hatası: {res}")

        logger.info(f"Toplam {len(all_results)} sonuç: '{part_number}'")
        return all_results

    async def _scrape_tr_local(self, part: str) -> List[Dict]:
        # Selector'lar canlı HTML analizi ile doğrulandı
        configs = {
            "Robotistan": {
                "url": f"https://www.robotistan.com/arama?q={part}",
                "item": ".product-item",
                "title": "a.product-title",
                "price": ".current-price",
            },
            "Direnc.net": {
                "url": f"https://www.direnc.net/arama?q={part}",
                "item": ".productItem",
                "title": "a.productDescription",
                "price": "span.currentPrice",
            },
            "Robolink": {
                "url": f"https://www.robolinkmarket.com/arama?q={part}",
                "item": ".show-case",
                "title": ".product-name a",
                "price": ".price",
            },
            "Komponentci": {
                "url": f"https://www.komponentci.net/arama?q={part}",
                "item": ".product-item",
                "title": ".product-title a",
                "price": ".price",
            },
        }

        async def scrape_single(name: str, cfg: dict) -> Optional[Dict]:
            try:
                async with httpx.AsyncClient(
                    headers=self.headers, timeout=_TIMEOUT, follow_redirects=True
                ) as client:
                    resp = await client.get(cfg["url"])
                    logger.info(f"{name} HTTP {resp.status_code} — '{part}'")
                    if resp.status_code != 200:
                        return None

                    soup = BeautifulSoup(resp.text, "html.parser")
                    items = soup.select(cfg["item"])
                    if not items:
                        logger.warning(f"{name}: ürün elementi bulunamadı")
                        return None

                    for item in items:
                        text_lower = item.text.lower()
                        if "stokta yok" in text_lower or "tükendi" in text_lower:
                            continue

                        title_el = item.select_one(cfg["title"])
                        price_el = item.select_one(cfg["price"])

                        if not title_el or not price_el:
                            continue

                        title = title_el.text.strip()
                        if len(title) < 3:
                            continue

                        price = _parse_price(price_el.text)
                        if price <= 0:
                            continue

                        logger.info(f"{name}: '{title[:50]}' — {price} TRY")
                        return {
                            "title": title,
                            "price": price,
                            "source": name,
                            "region": "TR",
                            "currency": "TRY",
                            "url": cfg["url"],
                        }
            except Exception as e:
                logger.error(f"{name} hata: {e}")
            return None

        tasks = [scrape_single(name, cfg) for name, cfg in configs.items()]
        results = await asyncio.gather(*tasks)
        return [r for r in results if r]


master_scraper = MasterScraper()


class DigiKeyClient:
    async def search_product(self, p):
        return await master_scraper.search(p)

class MouserClient:
    async def search_product(self, p): return []

class LCSCClient:
    async def search_product(self, p): return []

class FarnellClient:
    async def search_product(self, p): return []
