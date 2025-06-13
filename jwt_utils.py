import os
import jwt
from datetime import datetime, timedelta

JWT_SECRET = os.getenv("JWT_SECRET", "secret_key")
JWT_ALGORITHM = "HS256"

def create_token(user_id: str, expire_minutes: int = 60):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=expire_minutes),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
