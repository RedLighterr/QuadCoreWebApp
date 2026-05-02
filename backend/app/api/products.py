from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.session import get_db
from ..schemas import product as schemas
from ..services.trade_service import TradeService

router = APIRouter(prefix="/products", tags=["Products & Analysis"])

@router.post("/", response_model=schemas.ProductSchema, status_code=status.HTTP_201_CREATED)
async def create_new_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    service = TradeService(db)
    return await service.create_product(product)

@router.post("/{product_id}/analyze", response_model=schemas.AnalysisResponse)
async def perform_analysis(product_id: int, db: Session = Depends(get_db)):
    service = TradeService(db)
    analysis_data = await service.run_full_analysis(product_id)
    if not analysis_data:
        raise HTTPException(status_code=404, detail="Product not found or no data available")
    return analysis_data

@router.get("/", response_model=List[schemas.ProductSchema])
async def list_products(db: Session = Depends(get_db)):
    from ..db import models
    return db.query(models.Product).all()
