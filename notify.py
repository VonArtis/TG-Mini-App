from fastapi import APIRouter
import os
import requests
from pydantic import BaseModel

router = APIRouter()
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

class NotifyRequest(BaseModel):
    telegram_id: str
    message: str

@router.post("/")
def send_notification(payload: NotifyRequest):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    res = requests.post(url, json={
        "chat_id": payload.telegram_id,
        "text": payload.message
    })
    return {"status": "sent", "telegram_response": res.json()}
