from app.ai.pipeline import process

print("Running AI pipeline test...")
products = [
    {
        "title": "ATmega328P-PU Microcontroller",
        "brand": "Microchip",
        "price": 1.2,
        "currency": "USD",
        "region": "global",
        "source": "Mouser"
    },
    {
        "title": "ATmega328P-PU Microcontroller DIP-28",
        "brand": "Microchip",
        "price": 1.4,
        "currency": "USD",
        "region": "global",
        "source": "Digikey"
    },
    {
        "title": "ESP32-Wroom-32e",
        "brand": "Espressive Systems",
        "price": 1.4,
        "currency": "USD",
        "region": "global",
        "source": "Digikey"
    },
    {
        "title": "ATmega328",
        "brand": "Microchip",
        "price": 1.6,
        "currency": "USD",
        "region": "global",
        "source": "Digikey"
    },
    {
        "title": "ATMEGA328 DIP28 AVR",
        "brand": "Microchip",
        "price": 95,
        "currency": "TRY",
        "region": "TR",
        "source": "Trendyol"
    },
    {
        "title": "ATMEGA328 DIP28 AVR",
        "brand": "Microchip",
        "price": 195,
        "currency": "TRY",
        "region": "TR",
        "source": "Hepsiburada"
    }
]

results = process(products, market_region="TR")

print(results)