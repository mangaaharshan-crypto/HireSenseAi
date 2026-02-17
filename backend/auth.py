from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import aiosqlite
import uuid

from config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None


async def get_user_by_email(email: str):
    from database import get_db
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT id, email, hashed_password, full_name FROM users WHERE email = ?",
            (email.lower(),),
        )
        row = await cursor.fetchone()
        if row:
            return {"id": row[0], "email": row[1], "hashed_password": row[2], "full_name": row[3]}
        return None
    finally:
        await db.close()


async def create_user(email: str, hashed_password: str, full_name: str) -> dict:
    from database import get_db
    db = await get_db()
    try:
        user_id = str(uuid.uuid4())
        await db.execute(
            "INSERT INTO users (id, email, hashed_password, full_name, created_at) VALUES (?, ?, ?, ?, ?)",
            (user_id, email.lower(), hashed_password, full_name, datetime.utcnow().isoformat()),
        )
        await db.commit()
        return {"id": user_id, "email": email.lower(), "full_name": full_name}
    finally:
        await db.close()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"user_id": payload["sub"], "email": payload.get("email", "")}
