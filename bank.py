from fastapi import APIRouter
import requests
import os

router = APIRouter()
TELLER_API_KEY = os.getenv("TELLER_API_KEY")

def teller_headers():
    return {
        "Authorization": f"Basic {TELLER_API_KEY}",
        "Accept": "application/json"
    }

@router.get("/accounts")
def get_accounts():
    return requests.get("https://api.teller.io/accounts", headers=teller_headers()).json()

@router.get("/balance")
def get_balance():
    res = requests.get("https://api.teller.io/accounts", headers=teller_headers())
    accounts = res.json()
    return {"accounts": [acct for acct in accounts if "balance" in acct]}

@router.post("/webhook/teller")
def teller_webhook(payload: dict):
    return {"status": "received"}
