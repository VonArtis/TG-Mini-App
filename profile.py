from fastapi import APIRouter, Header
from pydantic import BaseModel
from firebase_admin import firestore
from utils.jwt_utils import verify_token

router = APIRouter()
db = firestore.client()

class Preferences(BaseModel):
    user_id: str
    theme: str = "dark"
    onboarding_complete: bool = False

def require_auth(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    data = verify_token(token)
    if not data:
        raise Exception("Unauthorized")
    return data["user_id"]

@router.post("/")
def save_preferences(prefs: Preferences, authorization: str = Header(...)):
    require_auth(authorization)
    ref = db.collection("users").document(prefs.user_id)
    ref.set({"preferences": prefs.dict()}, merge=True)
    return {"status": "saved"}

@router.get("/{user_id}")
def get_preferences(user_id: str, authorization: str = Header(...)):
    require_auth(authorization)
    ref = db.collection("users").document(user_id).get()
    if ref.exists:
        return ref.to_dict().get("preferences", {})
    return {"error": "not found"}
