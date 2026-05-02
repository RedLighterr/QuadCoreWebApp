from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class MarketProduct(BaseModel):
    """Görseldeki veri modeline tam uyumlu ürün yapısı."""
    title: str = Field(..., description="Ürün başlığı")
    brand: str = Field(..., description="Marka")
    price: float = Field(..., description="Fiyat")
    currency: str = Field(..., description="Para birimi (USD, TRY vb.)")
    region: str = Field(..., description="Bölge (global, TR vb.)")
    source: str = Field(..., description="Veri kaynağı (Mouser, Trendyol vb.)")

class ProductBase(BaseModel):
    name: str = Field(..., description="Ürünün aranan adı veya parça numarası")
    sku: Optional[str] = Field(None, description="Stok Kodu")

class ProductCreate(ProductBase):
    pass

class ProductSchema(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AnalysisResponse(BaseModel):
    product_id: int
    results: List[MarketProduct]
    suggested_price: float
    best_deal: MarketProduct
    created_at: datetime

    class Config:
        from_attributes = True
