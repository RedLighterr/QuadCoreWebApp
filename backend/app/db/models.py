from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .session import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    sku = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    analyses = relationship("Analysis", back_populates="product")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    
    # Tüm sonuçları JSON olarak saklıyoruz (Görseldeki modele uygun)
    raw_results = Column(JSON) 
    
    suggested_price = Column(Float)
    best_deal_json = Column(JSON) # En iyi teklifin detayları
    
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="analyses")
