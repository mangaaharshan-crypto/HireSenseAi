import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
    database_url: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./hiresense.db")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:8081,http://localhost:19006")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days


settings = Settings()
