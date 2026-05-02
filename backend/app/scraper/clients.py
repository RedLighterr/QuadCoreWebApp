import json
import logging
import re
import asyncio
import httpx
from typing import Any, Dict, List, Optional
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

_TIMEOUT = 30.0 # Daha stabil yanıt için arttırıldı

def _parse_price(text: str) -> float:
    if not text: return 0.0
    clean = re.sub(r"[^\d,.]", "", text.strip())
    if not clean: return 0.0
    try:
        if "," in clean and "." in clean:
            if clean.rfind(",") > clean.rfind("."): 
                clean = clean.replace(".", "").replace(",", ".")
            else: 
                clean = clean.replace(",", "")
        elif "," in clean: 
            clean = clean.replace(",", ".")
        return float(clean)
    except: return 0.0

class MasterScraper:
    def __init__(self):
        self.headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"}

    async def search(self, part_number: str) -> List[Dict]:
        logger.info(f"Karma Piyasa Operasyonu (TR + Global): {part_number}")
        
        try:
            tasks = [
                asyncio.wait_for(self._scrape_global(part_number), timeout=_TIMEOUT),
                asyncio.wait_for(self._scrape_tr_local(part_number), timeout=_TIMEOUT)
            ]
            results_nested = await asyncio.gather(*tasks, return_exceptions=True)
            
            all_results = []
            for res_list in results_nested:
                if isinstance(res_list, list):
                    all_results.extend(res_list)
        except:
            all_results = []

        # Fallback dummy verisi kaldırıldı. Artık sadece gerçek veriler dönülecek.
        return all_results

    async def _scrape_global(self, part):
        url = f"https://www.findchips.com/search/{part}?currency=EUR"
        results = []
        try:
            async with httpx.AsyncClient(headers=self.headers, timeout=_TIMEOUT) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    soup = BeautifulSoup(resp.text, 'html.parser')
                    blocks = soup.find_all(class_='distributor-results')
                    for block in blocks:
                        dist_title = block.find(class_='distributor-title')
                        if not dist_title: continue
                        name = dist_title.text.strip().split(' ')[0]
                        rows = block.find_all('tr')
                        for row in rows:
                            part_name = row.get('data-mfrpartnumber')
                            price_data_str = row.get('data-price')
                            if part_name and price_data_str:
                                try:
                                    price_data = json.loads(price_data_str)
                                    if price_data and len(price_data) > 0:
                                        p_val = float(price_data[0][2])
                                        if p_val > 0:
                                            results.append({
                                                "title": part_name, "price": p_val,
                                                "source": name, "region": "global", "currency": "EUR", "url": url
                                            })
                                            break
                                except: pass
        except: pass
        return results

    async def _scrape_tr_local(self, part):
        results = []
        configs = {
            "Robotistan": {
                "url": f"https://www.robotistan.com/arama?q={part}",
                "item": ".product-item", "title": ".product-title", "price": ".product-price"
            },
            "Direnc.net": {
                "url": f"https://www.direnc.net/arama?q={part}",
                "item": ".productItem", "title": ".productName a", "price": ".productPrice"
            },
            "Robo90": {
                "url": f"https://www.robo90.com/arama?q={part}",
                "item": ".product-item", "title": ".product-title a", "price": ".price"
            },
            "Robolink": {
                "url": f"https://www.robolinkmarket.com/arama?q={part}",
                "item": ".show-case", "title": ".product-name a", "price": ".price"
            },
            "Komponentci": {
                "url": f"https://www.komponentci.net/arama?q={part}",
                "item": ".product-item", "title": ".product-title a", "price": ".price"
            }
        }

        async def scrape_single_tr(name, cfg):
            try:
                async with httpx.AsyncClient(headers=self.headers, timeout=15.0, follow_redirects=True) as client:
                    resp = await client.get(cfg["url"])
                    if resp.status_code == 200:
                        soup = BeautifulSoup(resp.text, 'html.parser')
                        items = soup.select(cfg["item"])
                        for item in items:
                            title_el = item.select_one(cfg["title"])
                            price_el = item.select_one(cfg["price"])
                            if title_el and price_el:
                                title = title_el.text.strip()
                                if "stokta yok" in item.text.lower() or "tükendi" in item.text.lower(): continue
                                if len(title) < 5: continue
                                
                                return {
                                    "title": title,
                                    "price": _parse_price(price_el.text),
                                    "source": name,
                                    "region": "TR",
                                    "currency": "TRY",
                                    "url": cfg["url"]
                                }
            except: pass
            return None

        tr_tasks = [scrape_single_tr(name, config) for name, config in configs.items()]
        tr_results = await asyncio.gather(*tr_tasks)
        return [r for r in tr_results if r]

master_scraper = MasterScraper()

class DigiKeyClient:
    async def search_product(self, p): return [r for r in await master_scraper.search(p) if r['region'] == "global"]
class MouserClient:
    async def search_product(self, p): return []
class LCSCClient:
    async def search_product(self, p): return []
class FarnellClient:
    async def search_product(self, p): return []