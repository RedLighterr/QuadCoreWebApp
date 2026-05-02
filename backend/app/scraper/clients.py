import os
from typing import List, Dict
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class DigiKeyClient:
    async def search_product(self, part_number: str) -> List[Dict]:
        logger.info(f"DigiKey searching: {part_number}")
        # Görseldeki veri modeline uygun mock veri
        return [
            {
                "title": f"{part_number} Microcontroller",
                "brand": "Microchip",
                "price": 1.45,
                "currency": "USD",
                "region": "global",
                "source": "DigiKey"
            }
        ]

class MouserClient:
    async def search_product(self, part_number: str) -> List[Dict]:
        logger.info(f"Mouser searching: {part_number}")
        # Görseldeki veri modeline uygun mock veri
        return [
            {
                "title": f"{part_number} Microcontroller DIP-28",
                "brand": "Microchip",
                "price": 1.2,
                "currency": "USD",
                "region": "global",
                "source": "Mouser"
            }
        ]
