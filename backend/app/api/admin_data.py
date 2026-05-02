import json
import os
import threading
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(tags=["Admin Data"])

_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
_DATA_DIR.mkdir(exist_ok=True)

_SETTINGS_FILE = _DATA_DIR / "settings.json"
_FAQS_FILE = _DATA_DIR / "faqs.json"
_MESSAGES_FILE = _DATA_DIR / "messages.json"
_HISTORY_FILE = _DATA_DIR / "history.json"

_lock = threading.Lock()


def _load(path: Path, default):
    if not path.exists():
        return default
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def _save(path: Path, data):
    with _lock:
        with path.open("w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)


# ── Defaults ────────────────────────────────────────────────────────────────
DEFAULT_SETTINGS: Dict[str, Any] = {
    "siteName": "QuadCore",
    "siteDescription": "Yapay zeka destekli komponent fiyat analizi.",
    "contactEmail": "info@quadcore.local",
    "maintenanceMode": False,
    "supportedSites": [],
}

DEFAULT_FAQS: List[Dict[str, str]] = [
    {"id": "def_1", "question": "Hangi tedarikçileri destekliyorsunuz?",
     "answer": "Mouser, DigiKey, Farnell, Arrow, AliExpress ve LCSC dahil olmak üzere 50'den fazla global distribütörü canlı destekliyoruz."},
    {"id": "def_2", "question": "Fiyatlara gümrük vergileri dahil mi?",
     "answer": "Yapay zeka analiz raporlarında, ülkenize özgü tahmini gümrük vergileri ve kargo masrafları hesaplamalara dahil edilmektedir."},
    {"id": "def_3", "question": "Kendi şirket verilerimi ekleyebilir miyim?",
     "answer": "Premium sürümde, kendi tedarikçilerinizi, API anahtarlarınızı ve şirket içi stok durumunuzu sisteme entegre edebilirsiniz."},
    {"id": "def_4", "question": "Yapay zeka analizi tam olarak ne yapıyor?",
     "answer": "Aynı komponentin farklı distribütörlerdeki fiyat değişim grafiğini çıkarır, teslimat sürelerini ve risk skorunu analiz ederek size en optimum satın alma rotasını önerir."},
]


# ── Settings ────────────────────────────────────────────────────────────────
class SettingsUpdate(BaseModel):
    siteName: Optional[str] = None
    siteDescription: Optional[str] = None
    contactEmail: Optional[str] = None
    maintenanceMode: Optional[bool] = None
    supportedSites: Optional[List[str]] = None


@router.get("/settings")
async def get_settings():
    return _load(_SETTINGS_FILE, DEFAULT_SETTINGS)


@router.put("/settings")
async def update_settings(payload: SettingsUpdate):
    current = _load(_SETTINGS_FILE, DEFAULT_SETTINGS)
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    merged = {**current, **updates}
    _save(_SETTINGS_FILE, merged)
    return merged


# ── FAQ ─────────────────────────────────────────────────────────────────────
class FAQItem(BaseModel):
    question: str
    answer: str


@router.get("/faq")
async def list_faqs():
    return _load(_FAQS_FILE, DEFAULT_FAQS)


@router.post("/faq")
async def add_faq(item: FAQItem):
    faqs = _load(_FAQS_FILE, DEFAULT_FAQS)
    new_item = {
        "id": f"faq_{int(datetime.utcnow().timestamp() * 1000)}",
        "question": item.question,
        "answer": item.answer,
    }
    faqs.append(new_item)
    _save(_FAQS_FILE, faqs)
    return new_item


@router.delete("/faq/{faq_id}")
async def delete_faq(faq_id: str):
    faqs = _load(_FAQS_FILE, DEFAULT_FAQS)
    new_faqs = [f for f in faqs if f.get("id") != faq_id]
    if len(new_faqs) == len(faqs):
        raise HTTPException(status_code=404, detail="FAQ not found")
    _save(_FAQS_FILE, new_faqs)
    return {"success": True}


# ── Contact / Messages ──────────────────────────────────────────────────────
class ContactForm(BaseModel):
    name: Optional[str] = "İsimsiz"
    email: Optional[str] = "Belirtilmedi"
    subject: Optional[str] = "Konu Yok"
    message: str = Field(..., min_length=1)


@router.post("/contact")
async def submit_contact(form: ContactForm):
    messages = _load(_MESSAGES_FILE, [])
    new_msg = {
        "id": f"msg_{int(datetime.utcnow().timestamp() * 1000)}",
        "name": form.name,
        "email": form.email,
        "subject": form.subject,
        "content": form.message,
        "date": datetime.utcnow().isoformat(),
        "isRead": False,
        "reply": None,
    }
    messages.insert(0, new_msg)
    _save(_MESSAGES_FILE, messages)
    return {"success": True, "message": "Mesajınız alındı!"}


@router.get("/messages")
async def list_messages():
    return _load(_MESSAGES_FILE, [])


# ── Search History ──────────────────────────────────────────────────────────
class HistoryPayload(BaseModel):
    items: List[Dict[str, Any]]


@router.get("/history")
async def get_history():
    return _load(_HISTORY_FILE, [])


@router.post("/history")
async def save_history(payload: HistoryPayload):
    _save(_HISTORY_FILE, payload.items)
    return {"success": True, "count": len(payload.items)}


@router.delete("/history/{item_id}")
async def delete_history_item(item_id: str):
    items = _load(_HISTORY_FILE, [])
    new_items = [i for i in items if str(i.get("id")) != str(item_id)]
    _save(_HISTORY_FILE, new_items)
    return {"success": True}
