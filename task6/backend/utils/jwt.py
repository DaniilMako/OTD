# utils/jwt.py
from datetime import datetime, timedelta
from jose import JWTError, jwt

# python -c "import secrets; print(secrets.token_urlsafe(32))"
SECRET_KEY = "kwnahryzGobWfD1zjcwXc809wIB0eJ13u4ospV9YKfM"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
