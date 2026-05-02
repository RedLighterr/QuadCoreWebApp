from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.session import engine
from .db import models
from .api import products

# Veritabanı tablolarını oluştur (SQLite için başlangıçta kolaylık sağlar)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="QuadCore API", version="1.0.0")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routerları ekle
app.include_router(products.router)

@app.get("/")
async def root():
    return {
        "project": "QuadCore",
        "status": "online",
        "docs": "/docs"
    }
