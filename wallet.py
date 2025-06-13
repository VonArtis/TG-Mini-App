from fastapi import APIRouter
from eth_account.messages import encode_defunct
from eth_account import Account

router = APIRouter()

@router.post("/verify-signature")
def verify_signature(payload: dict):
    message = payload.get("message")
    signature = payload.get("signature")
    expected_address = payload.get("address")
    msg = encode_defunct(text=message)
    recovered = Account.recover_message(msg, signature=signature)
    return {
        "expected": expected_address,
        "recovered": recovered,
        "valid": recovered.lower() == expected_address.lower()
    }
