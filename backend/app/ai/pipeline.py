import json
from .preprocess import preprocess
from .embedding import compute_embeddings
from .clustering import cluster_products
from .market import analyze_market
from .pricing import calculate_cost, calculate_sale_price
from .ranking import get_top3
from .description import generate_description_cached, generate_price_decision, generate_description
from .currency import convert_to_try

def _resolve_price_try(price, currency, usd_try=1.0):
    currency = (currency or "TRY").strip().lower()
    try:
        price = float(price)
    except Exception:
        price = 0.0

    if currency == "usd" and usd_try != 1.0:
        return round(price * usd_try, 2)

    try:
        return round(convert_to_try(price, currency), 2)
    except Exception:
        if currency == "try":
            return round(price, 2)
        return round(price, 2)


def _normalize_ref_suggestion(raw_value, fallback_price, fallback_reason):
    if raw_value:
        try:
            text = raw_value.strip()
            if text.startswith("```json"):
                text = text.split("```json", 1)[1].split("```", 1)[0].strip()
            elif text.startswith("```"):
                text = text.split("```", 1)[1].split("```", 1)[0].strip()
            parsed = json.loads(text)
            return json.dumps(parsed, ensure_ascii=False)
        except Exception:
            pass

    return json.dumps({
        "price": round(fallback_price, 2),
        "reason": fallback_reason,
    }, ensure_ascii=False)


def process(products, usd_try=1.0):
    """
    AI Pipeline: Siteden gelen ham fiyatları olduğu gibi işler.
    Global ürünler kendi para birimiyle, TR ürünleri TRY ile ayrı değerlendirilir.
    """
    products = preprocess(products)
    for p in products:
        p["price_try"] = _resolve_price_try(p.get("price", 0), p.get("currency", "TRY"), usd_try)
    products = compute_embeddings(products)
    clusters = cluster_products(products)

    results = []

    for cluster in clusters:
        # TR ve global ürünleri ayır — fiyatlar farklı para biriminde
        global_products = [p for p in cluster if p.get("region") != "TR"]
        tr_products = [p for p in cluster if p.get("region") == "TR"]

        # Fiyat analizi için aynı para birimindeki ürünleri kullan
        analysis_products = global_products if global_products else cluster
        if not analysis_products:
            continue

        prices = [p["price"] for p in analysis_products]

        cost = round(calculate_cost(prices), 2)
        market = analyze_market(prices)

        pricing = calculate_sale_price(cost, market)
        if pricing.get("status") == "ok":
            pricing["price"] = round(pricing["price"], 2)
            pricing["margin"] = round(pricing["margin"], 3)

        ref_price = pricing.get("price", cost * 1.25)
        ref_suggestion1 = generate_price_decision(
            cluster[0]["title"],
            cost,
            {"candidates": [clean_product(x) for x in analysis_products[:6]]},
            market,
            tr_products,
        )
        ref_suggestion = _normalize_ref_suggestion(
            ref_suggestion1,
            ref_price,
            "Distribütörlerden çekilen saf fiyatlar baz alınmıştır.",
        )
        
        results.append({
            "product": cluster[0]["title"],
            "cost": cost,
            "pricing": pricing,
            "ref_suggestion": ref_suggestion,
            "top3": [clean_product(x) for x in sorted(analysis_products, key=lambda x: x["price"])[:6]],
            "market_refs": [clean_product(x) for x in tr_products],
            "description": f"{generate_description_cached(cluster[0])}",
        })

    return results

def clean_product(p):
    return {
        "title": p["title"],
        "source": p["source"],
        "region": p["region"],
        "price": round(p["price"], 2),
        "price_try": round(p.get("price_try", p["price"]), 2),
        "currency": p.get("currency", "TRY"),
        "url": p.get("url")
    }
