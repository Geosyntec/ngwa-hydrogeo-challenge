"""
FastAPI backend for the Hydrogeology Challenge app.
Run with: uvicorn backend.main:app --reload --port 8000
In production (e.g. Azure App Service), serves the built React app from backend/static.
"""
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.database import create_pool, close_pool, get_connection, Pool
from backend.auth import verify_password

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create DB pool at startup, close at shutdown."""
    app.state.db_pool = await create_pool()
    yield
    await close_pool(app.state.db_pool)


app = FastAPI(title="Hydrogeology Challenge API", lifespan=lifespan)


async def get_db(request: Request):
    """FastAPI dependency: yield a DB connection from the app pool."""
    pool: Pool | None = getattr(request.app.state, "db_pool", None)
    async for conn in get_connection(pool):
        yield conn


# CORS: allow dev origins; in production the app is same-origin if served from this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Login (DB-backed, hashed passwords) ---
class LoginBody(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    user: dict  # {"name": str}  # name is the username as stored for display


@app.post("/api/login", response_model=LoginResponse)
async def login(body: LoginBody, conn=Depends(get_db)):
    if conn is None:
        raise HTTPException(
            status_code=503,
            detail="Login is unavailable (database not configured).",
        )
    username = (body.username or "").strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required.")
    password = (body.password or "").strip()
    if not password:
        raise HTTPException(status_code=400, detail="Password is required.")

    row = await conn.fetchrow(
        "SELECT id, username, password_hash FROM users WHERE LOWER(username) = LOWER($1)",
        username,
    )
    if not row or not row["password_hash"]:
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    if not verify_password(password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    return LoginResponse(user={"name": row["username"]})


@app.get("/api/ping")
def ping():
    """Health check: returns True if the API is up."""
    return True


@app.get("/api/db-ping")
async def db_ping(conn=Depends(get_db)):
    """Health check: returns True if the database is reachable. 503 if DB not configured."""
    if conn is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    try:
        await conn.fetchval("SELECT 1")
        return True
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database error: {e!s}") from e


# Production: serve React build from backend/static (created by build:azure)
_static_dir = Path(__file__).resolve().parent / "static"
if _static_dir.is_dir():
    @app.middleware("http")
    async def spa_fallback(request, call_next):
        response = await call_next(request)
        if response.status_code == 404 and not request.url.path.startswith("/api/"):
            index_path = _static_dir / "index.html"
            if index_path.exists():
                return FileResponse(index_path)
        return response

    app.mount("/", StaticFiles(directory=str(_static_dir), html=True), name="static")
