import aiosqlite
from config import settings


DB_PATH = settings.database_url.replace("sqlite+aiosqlite:///", "")


async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                full_name TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        await db.commit()


async def get_db():
    return await aiosqlite.connect(DB_PATH)
