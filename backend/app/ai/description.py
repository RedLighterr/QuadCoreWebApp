import os
import time
import logging
from pathlib import Path
from dotenv import load_dotenv
from google import genai

logger = logging.getLogger(__name__)

# Load .env from backend/app/ai/.env explicitly
_THIS_DIR = Path(__file__).resolve().parent
_env_file = _THIS_DIR / ".env"
if _env_file.exists():
    load_dotenv(_env_file)

# Support both GEMINI_API_KEY and GOOGLE_API_KEY
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
if api_key:
    api_key = api_key.strip().strip('"').strip("'")

# 2.5-flash-lite free tier'da çok daha yüksek günlük limite sahip
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
client = genai.Client(api_key=api_key) if api_key else None

_desc_cache = {}
_decision_cache = {}


def _is_rate_limit_error(err: Exception) -> bool:
    msg = str(err)
    return "429" in msg or "RESOURCE_EXHAUSTED" in msg or "quota" in msg.lower()


def _generate_with_retry(prompt: str, max_retries: int = 1) -> str:
    """Gemini'yi 429 durumunda tek seferlik kısa retry ile çağırır."""
    last_err = None
    for attempt in range(max_retries + 1):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
            )
            return (response.text or "").strip()
        except Exception as e:
            last_err = e
            if attempt < max_retries and _is_rate_limit_error(e):
                logger.warning(f"Gemini rate limit, retry in 3s... ({e})")
                time.sleep(3)
                continue
            raise
    raise last_err if last_err else RuntimeError("Gemini call failed")


def generate_description_cached(product):
    """Aynı ürün modeli için Gemini'yi tekrar çağırmaz — bellekte cache'ler."""
    key = (product.get("core_model") or product.get("title") or "").strip().lower()
    if key and key in _desc_cache:
        return _desc_cache[key]
    desc = generate_description(product)
    if key and desc:
        _desc_cache[key] = desc
    return desc

def _smart_fallback_description(product) -> str:
    """Gemini erişilemediğinde ürün tipine göre daha bilgilendirici bir özet üretir."""
    title = (product.get("title") or "").strip()
    brand = (product.get("brand") or "").strip()
    t = title.lower()

    if any(k in t for k in ["esp32", "esp-32"]):
        hint = "Wi-Fi/Bluetooth destekli düşük güç tüketimli mikrodenetleyici; IoT ve sensör ağları için uygundur."
    elif any(k in t for k in ["esp8266", "nodemcu"]):
        hint = "Wi-Fi destekli düşük maliyetli mikrodenetleyici; basit IoT projeleri için tercih edilir."
    elif "stm32" in t:
        hint = "ARM Cortex-M tabanlı yüksek performanslı 32-bit MCU; gömülü kontrol uygulamalarında yaygın kullanılır."
    elif "arduino" in t:
        hint = "Geliştirme ve prototipleme için popüler MCU kartı; geniş kütüphane ekosistemine sahiptir."
    elif "raspberry" in t or "rpi" in t:
        hint = "Linux çalıştırabilen tek kart bilgisayar; ağ uygulamaları ve görüntü işleme için uygundur."
    elif "atmega" in t or "attiny" in t:
        hint = "Düşük güçlü 8-bit AVR mikrodenetleyici; basit kontrol ve ölçüm devrelerinde kullanılır."
    elif "lcd" in t or "oled" in t or "display" in t or "ekran" in t:
        hint = "Gömülü sistemlerde kullanıcı arayüzü için tercih edilen ekran modülü."
    elif "sensor" in t or "sensör" in t:
        hint = "Çevresel ölçüm ve veri toplama uygulamaları için sensör modülü."
    elif "motor" in t or "servo" in t or "step" in t:
        hint = "Robotik ve hareket kontrol uygulamaları için motor/sürücü bileşeni."
    elif "regülat" in t or "regulator" in t or "lm" in t and any(c.isdigit() for c in t):
        hint = "Güç yönetimi ve gerilim regülasyonu için kullanılan analog bileşen."
    else:
        hint = "Elektronik prototipleme ve gömülü sistem projelerinde kullanılan bileşen."

    prefix = f"{brand} {title}".strip() if brand else title
    return f"{prefix}: {hint}"[:150]


def generate_description(product):
    try:
        if client is None:
            raise RuntimeError("GEMINI_API_KEY not set")

        title = product.get("title", "Bilinmeyen ürün")
        brand = product.get("brand", "")
        source = product.get("source", "")
        region = product.get("region", "")
        price = product.get("price", "?")
        currency = product.get("currency", "TRY")

        prompt = f"""
Sen deneyimli bir elektronik komponent mühendisisin.
Aşağıdaki ürün için Türkçe ve teknik bir mini değerlendirme yaz.

Ürün: {title}
Marka: {brand}
Kaynak: {source}
Bölge: {region}
Fiyat: {price} {currency}

Kurallar:
- KESINLIKLE 1-2 cümle yaz.
- KESINLIKLE 150 karakteri GEÇME.
- Genel/boş cümle kurma, ürün tipine uygun teknik yorum ver.
- Sadece açıklama metni dön, başlık/emoji/json/formatla kullanma.
""".strip()

        text = _generate_with_retry(prompt)
        if not text:
            raise RuntimeError("Empty Gemini response")
        if len(text) > 150:
            text = text[:147] + "..."
        return text

    except Exception as e:
        logger.warning(f"Gemini description failed, using smart fallback: {e}")
        return _smart_fallback_description(product)


def generate_price_decision(product_title, cost, ref_suggestion, market, market_refs):
    try:
        if client is None:
            raise RuntimeError("GEMINI_API_KEY not set")

        cache_key = (product_title or "").strip().lower()
        if cache_key and cache_key in _decision_cache:
            return _decision_cache[cache_key]

        prompt = f"""
Sen bir ürün fiyatlama asistanısın.

Ürün: {product_title}
Maliyet: {cost} TRY

Piyasa özeti:
- Min: {market['min'] if market else 'yok'}
- Avg: {market['avg'] if market else 'yok'}
- Max: {market['max'] if market else 'yok'}

Referanslardan üretilen aday fiyatlar:
{ref_suggestion['candidates'] if ref_suggestion else []}

Kurallar:
- Fiyat maliyetin altında olamaz.
- Mümkünse referans min fiyatın biraz altında veya referans ortalamasına yakın olmalı.
- Tek bir sayı döndür.
- Sadece JSON döndür:
{{
  "price": 0,
  "reason": "kısa açıklama"
}}
"""

        text = _generate_with_retry(prompt)
        if cache_key and text:
            _decision_cache[cache_key] = text
        return text

    except Exception as e:
        logger.warning(f"Gemini price decision failed: {e}")
        return None