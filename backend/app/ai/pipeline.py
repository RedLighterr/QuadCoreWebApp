from .preprocess import preprocess
from .embedding import compute_embeddings
from .clustering import cluster_products
from .market import analyze_market
from .pricing import calculate_cost, calculate_sale_price
from .ranking import get_top3
from .description import generate_description_cached

def process(products, usd_try=1.0):
    """
    AI Pipeline: Siteden gelen ham fiyatları olduğu gibi işler.
    Global ürünler kendi para birimiyle, TR ürünleri TRY ile ayrı değerlendirilir.
    """
    products = preprocess(products)
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
        ref_suggestion = f"json\\n{{\\n  \\\"price\\\": {round(ref_price, 2)},\\n  \\\"reason\\\": \\\"Distribütörlerden çekilen saf fiyatlar baz alınmıştır.\\\"\\n}}\\n"

        # Global ürün varsa: top3=global, market_refs=TR
        # Sadece TR ürün varsa: top3=TR (ucuzdan pahalıya), market_refs=[]
        if global_products:
            top3 = [clean_product(x) for x in sorted(global_products, key=lambda x: x["price"])[:6]]
            market_refs = [clean_product(x) for x in tr_products]
        else:
            top3 = [clean_product(x) for x in sorted(tr_products, key=lambda x: x["price"])[:6]]
            market_refs = []

        results.append({
            "product": cluster[0]["title"],
            "cost": cost,
            "pricing": pricing,
            "ref_suggestion": ref_suggestion,
            "top3": top3,
            "market_refs": market_refs,
            "description": generate_description_cached(cluster[0]),
        })

    return results

def clean_product(p):
    return {
        "title": p["title"],
        "source": p["source"],
        "region": p["region"],
        "price": round(p["price"], 2),
        "price_try": round(p["price"], 2),  # ham değeri olduğu gibi taşıyoruz
        "url": p.get("url")
    }
