# dependencies.py
from fastapi import Depends, HTTPException, status, Header
from utils.jwt import decode_access_token

def get_current_user(token: str = Header(..., alias="Authorization")):
    if not token.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = token.split(" ")[1]

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    return payload  # возвращаем payload — там есть email и role


def admin_only(payload: dict = Depends(get_current_user)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload
