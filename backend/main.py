"""
FastAPI backend for the Hydrogeology Challenge app.
Run with: uvicorn backend.main:app --reload --port 8000
In production (e.g. Azure App Service), serves the built React app from backend/static.
"""
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI(title="Hydrogeology Challenge API")

# CORS: allow dev origins; in production the app is same-origin if served from this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Login ---
class LoginBody(BaseModel):
    username: str
    password: str | None = None


class LoginResponse(BaseModel):
    user: dict  # {"name": str}


# Same validation as former mock: known users require correct password; unknown users accepted.
MOCK_USERS = {"teacher": "demo", "teacher1": "demo", "admin": "admin"}


@app.post("/api/login", response_model=LoginResponse)
def login(body: LoginBody):
    username = (body.username or "").strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required.")
    key = username.lower()
    expected_password = MOCK_USERS.get(key)
    password = (body.password or "").strip()
    if expected_password is not None and password != expected_password:
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    return LoginResponse(user={"name": username})


@app.get("/api/ping")
def ping():
    """Health check: returns True if the API is up."""
    return True


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
