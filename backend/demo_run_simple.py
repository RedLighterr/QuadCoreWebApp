import asyncio
import json
from concurrent.futures import ThreadPoolExecutor

class SimpleScraper:
    def __init__(self, name):
        self.name = name
    
    def fetch_mock(self, part_number):
        import time
        import random
        time.sleep(random.uniform(0.1, 0.5))
        
        # Görseldeki veri modeline birebir uyumlu çıktı
        if self.name == "DigiKey":
            return {
                "title": f"{part_number} Microcontroller",
                "brand": "Microchip",
                "price": 1.45,
                "currency": "USD",
                "region": "global",
                "source": "DigiKey"
            }
        elif self.name == "Mouser":
            return {
                "title": f"{part_number} Microcontroller DIP-28",
                "brand": "Microchip",
                "price": 1.2,
                "currency": "USD",
                "region": "global",
                "source": "Mouser"
            }
        return None

async def run_analysis(part_number):
    print(f"\n--- QuadCore Analiz Başlatıldı: {part_number} ---")
    
    scrapers = [SimpleScraper("DigiKey"), SimpleScraper("Mouser")]
    
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        results = await asyncio.gather(*[
            loop.run_in_executor(pool, s.fetch_mock, part_number) for s in scrapers
        ])
    
    all_deals = [r for r in results if r]
    
    if not all_deals:
        print("[!] Veri bulunamadı.")
        return
        
    best_deal = min(all_deals, key=lambda x: x['price'])
    suggested = best_deal['price'] * 0.95

    print("\n" + "="*50)
    print("       BEKLENEN VERİ MODELİ ÇIKTISI")
    print("="*50)
    print(json.dumps(all_deals, indent=4))
    print("-"*50)
    print(f"EN İYİ TEKLİF: {best_deal['source']} - {best_deal['price']} {best_deal['currency']}")
    print(f"ÖNERİLEN SATIŞ: {suggested:.2f} {best_deal['currency']}")
    print("="*50 + "\n")

if __name__ == "__main__":
    part_name = "ATmega328P"
    asyncio.run(run_analysis(part_name))
