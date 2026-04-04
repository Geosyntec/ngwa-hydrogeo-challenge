"""
FastAPI backend for the Hydrogeology Challenge app.
Run with: uvicorn backend.main:app --reload --port 8000
In production (e.g. Azure App Service), serves the built React app from backend/static.
"""
import os
import re
import secrets
import uuid as uuid_mod
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from fastapi import Depends, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.database import create_pool, close_pool, get_connection, Pool
from backend.auth import verify_password, hash_password
from backend.email_sender import send_verification_email

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


class LoginUserOut(BaseModel):
    """Logged-in user for the client (email + stable id for teacher links)."""

    name: str
    id: str


class LoginResponse(BaseModel):
    user: LoginUserOut


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
        "SELECT id, email, password_hash, verified FROM users WHERE LOWER(email) = LOWER($1)",
        username,
    )
    if not row or not row["password_hash"]:
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    if not verify_password(password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    if not row["verified"]:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before signing in. Check your inbox for the verification link.",
        )

    return LoginResponse(
        user=LoginUserOut(name=row["email"], id=str(row["id"]))
    )


# --- Register & email verification ---
def _verification_base_url() -> str:
    base = (os.environ.get("VERIFICATION_BASE_URL") or "").strip().rstrip("/")
    if base:
        return base
    return "http://localhost:5173"  # dev default

EMAIL_RE = re.compile(r"^[^@]+@[^@]+\.[^@]+$")


class RegisterBody(BaseModel):
    email: str
    password: str


class RegisterResponse(BaseModel):
    ok: bool
    message: str


@app.post("/api/register", response_model=RegisterResponse)
async def register(body: RegisterBody, conn=Depends(get_db)):
    if conn is None:
        raise HTTPException(status_code=503, detail="Registration is unavailable (database not configured).")
    email = (body.email or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    if not EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Invalid email format.")
    password = (body.password or "").strip()
    if not password:
        raise HTTPException(status_code=400, detail="Password is required.")

    existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1", email)
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    password_hash = hash_password(password)
    user_id = await conn.fetchval(
        "INSERT INTO users (email, password_hash, verified) VALUES ($1, $2, false) RETURNING id",
        email,
        password_hash,
    )
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    await conn.execute(
        "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
        user_id,
        token,
        expires_at,
    )
    base = _verification_base_url()
    link = f"{base}/verify-email?token={token}"
    send_verification_email(email, link)

    return RegisterResponse(ok=True, message="Verification email has been sent. Please check your inbox.")


class VerifyEmailBody(BaseModel):
    token: str


class VerifyEmailResponse(BaseModel):
    ok: bool
    message: str


@app.post("/api/verify-email", response_model=VerifyEmailResponse)
async def verify_email(body: VerifyEmailBody, conn=Depends(get_db)):
    if conn is None:
        raise HTTPException(status_code=503, detail="Verification is unavailable (database not configured).")
    token = (body.token or "").strip()
    if not token:
        raise HTTPException(status_code=400, detail="Token is required.")

    row = await conn.fetchrow(
        "SELECT id, user_id, expires_at FROM email_verification_tokens WHERE token = $1",
        token,
    )
    now = datetime.now(timezone.utc)
    if not row or row["expires_at"] <= now:
        raise HTTPException(status_code=400, detail="expired")

    await conn.execute("UPDATE users SET verified = true WHERE id = $1", row["user_id"])
    await conn.execute("DELETE FROM email_verification_tokens WHERE id = $1", row["id"])

    return VerifyEmailResponse(ok=True, message="Your email is verified. You can sign in now.")


class ResendVerificationBody(BaseModel):
    email: str


@app.post("/api/resend-verification", response_model=RegisterResponse)
async def resend_verification(body: ResendVerificationBody, conn=Depends(get_db)):
    if conn is None:
        raise HTTPException(status_code=503, detail="Resend is unavailable (database not configured).")
    email = (body.email or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")

    user = await conn.fetchrow("SELECT id, verified FROM users WHERE email = $1", email)
    if not user:
        return RegisterResponse(ok=True, message="If an account exists, a new verification email has been sent.")
    if user["verified"]:
        return RegisterResponse(ok=True, message="This account is already verified. You can sign in.")

    await conn.execute("DELETE FROM email_verification_tokens WHERE user_id = $1", user["id"])
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    await conn.execute(
        "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
        user["id"],
        token,
        expires_at,
    )
    base = _verification_base_url()
    link = f"{base}/verify-email?token={token}"
    send_verification_email(email, link)

    return RegisterResponse(ok=True, message="A new verification email has been sent.")


# --- Classes (DB-backed) ---
@app.get("/api/classes")
async def get_classes(
    teacher: str | None = None,
    teacherID: str | None = Query(None, alias="teacherID"),
    conn=Depends(get_db),
):
    """Return classes keyed by class name. Pass `teacher` (email) or `teacherID` (user UUID)."""
    if conn is None:
        raise HTTPException(status_code=503, detail="Database not configured.")
    teacher_uuid = None
    if teacherID and str(teacherID).strip():
        try:
            teacher_uuid = uuid_mod.UUID(str(teacherID).strip())
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid teacherID (expected UUID).")
    elif teacher and str(teacher).strip():
        teacher_email = str(teacher).strip().lower()
        user = await conn.fetchrow(
            "SELECT id FROM users WHERE LOWER(email) = $1", teacher_email
        )
        if not user:
            return {}
        teacher_uuid = user["id"]
    else:
        return {}
    rows = await conn.fetch(
        "SELECT id, name FROM classes WHERE teacher_id = $1 ORDER BY name",
        teacher_uuid,
    )
    # Test flow uses `teacherID` + GET /api/class-students per class; skip N+1 student queries here.
    skip_embedded_roster = bool(teacherID and str(teacherID).strip())
    result = {}
    for row in rows:
        class_id = str(row["id"])
        class_name = row["name"]
        if skip_embedded_roster:
            stud_list = []
        else:
            students = await conn.fetch(
                "SELECT id, first_name, last_name FROM students WHERE class_id = $1 ORDER BY created_at",
                row["id"],
            )
            stud_list = [
                {
                    "id": str(s["id"]),
                    "first_name": s["first_name"] or "",
                    "last_name": s["last_name"] or "",
                }
                for s in students
            ]
        result[class_name] = {"classId": class_id, "students": stud_list}
    return result


@app.get("/api/class-students")
async def get_class_students(
    classId: str = Query(..., alias="classId"),
    conn=Depends(get_db),
):
    """Roster for a class (used by test verification UI after a class is selected)."""
    if conn is None:
        raise HTTPException(status_code=503, detail="Database not configured.")
    try:
        cid = uuid_mod.UUID(str(classId).strip())
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid classId (expected UUID).")
    rows = await conn.fetch(
        "SELECT id, first_name, last_name FROM students WHERE class_id = $1 ORDER BY created_at",
        cid,
    )
    return {
        "students": [
            {
                "id": str(s["id"]),
                "first_name": s["first_name"] or "",
                "last_name": s["last_name"] or "",
            }
            for s in rows
        ]
    }


class CreateClassStudent(BaseModel):
    first_name: str
    last_name: str


class CreateClassBody(BaseModel):
    teacherId: str
    name: str
    students: list[CreateClassStudent] = []


class CreateClassResponse(BaseModel):
    ok: bool
    classId: str | None = None
    message: str | None = None


@app.post("/api/classes", response_model=CreateClassResponse)
async def create_class(body: CreateClassBody, conn=Depends(get_db)):
    """Create a new class for the teacher; optionally add students."""
    if conn is None:
        raise HTTPException(status_code=503, detail="Database not configured.")
    teacher_email = (body.teacherId or "").strip().lower()
    if not teacher_email:
        raise HTTPException(status_code=400, detail="Teacher is required.")
    name = (body.name or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Class name is required.")
    user = await conn.fetchrow(
        "SELECT id FROM users WHERE LOWER(email) = $1", teacher_email
    )
    if not user:
        raise HTTPException(status_code=404, detail="Teacher not found.")
    # Unique per teacher: (teacher_id, name)
    existing = await conn.fetchrow(
        "SELECT id FROM classes WHERE teacher_id = $1 AND name = $2",
        user["id"],
        name,
    )
    if existing:
        raise HTTPException(status_code=409, detail="A class with that name already exists.")
    row = await conn.fetchrow(
        "INSERT INTO classes (teacher_id, name) VALUES ($1, $2) RETURNING id",
        user["id"],
        name,
    )
    class_id = row["id"]
    for s in body.students:
        first = (s.first_name or "").strip()
        last = (s.last_name or "").strip()
        if first or last:
            await conn.execute(
                "INSERT INTO students (class_id, first_name, last_name) VALUES ($1, $2, $3)",
                class_id,
                first,
                last,
            )
    return CreateClassResponse(ok=True, classId=str(class_id), message="Class created.")


class UpdateClassStudent(BaseModel):
    id: str | None = None
    first_name: str
    last_name: str


class UpdateClassBody(BaseModel):
    classId: str
    teacherId: str  # teacher email
    students: list[UpdateClassStudent]
    authToken: str | None = None


class UpdateClassResponse(BaseModel):
    ok: bool
    message: str | None = None


@app.post("/api/update-class", response_model=UpdateClassResponse)
async def update_class(body: UpdateClassBody, conn=Depends(get_db)):
    if conn is None:
        raise HTTPException(status_code=503, detail="Database not configured.")
    teacher_email = (body.teacherId or "").strip().lower()
    if not teacher_email:
        raise HTTPException(status_code=400, detail="Teacher is required.")
    user = await conn.fetchrow(
        "SELECT id FROM users WHERE LOWER(email) = $1", teacher_email
    )
    if not user:
        raise HTTPException(status_code=404, detail="Teacher not found.")
    class_row = await conn.fetchrow(
        "SELECT id FROM classes WHERE id = $1 AND teacher_id = $2",
        body.classId,
        user["id"],
    )
    if not class_row:
        raise HTTPException(status_code=404, detail="Class not found.")
    class_id = class_row["id"]

    keep_ids = []
    for s in body.students:
        first = (s.first_name or "").strip()
        last = (s.last_name or "").strip()
        if not first and not last:
            continue
        if s.id and not s.id.startswith("new-"):
            try:
                keep_ids.append(uuid_mod.UUID(s.id))
            except ValueError:
                pass

    # Delete students in this class that are not in the payload's keep list
    if keep_ids:
        await conn.execute(
            "DELETE FROM students WHERE class_id = $1 AND NOT (id = ANY($2))",
            class_id,
            keep_ids,
        )
    else:
        await conn.execute("DELETE FROM students WHERE class_id = $1", class_id)

    # Update existing or insert new
    for s in body.students:
        first = (s.first_name or "").strip()
        last = (s.last_name or "").strip()
        if not first and not last:
            continue
        if s.id and not s.id.startswith("new-"):
            try:
                sid = uuid_mod.UUID(s.id)
                if sid in keep_ids:
                    await conn.execute(
                        "UPDATE students SET first_name = $1, last_name = $2 WHERE id = $3 AND class_id = $4",
                        first,
                        last,
                        sid,
                        class_id,
                    )
            except ValueError:
                await conn.execute(
                    "INSERT INTO students (class_id, first_name, last_name) VALUES ($1, $2, $3)",
                    class_id,
                    first,
                    last,
                )
        else:
            await conn.execute(
                "INSERT INTO students (class_id, first_name, last_name) VALUES ($1, $2, $3)",
                class_id,
                first,
                last,
            )

    return UpdateClassResponse(ok=True, message="Class updated.")


@app.delete("/api/classes")
async def delete_class(classId: str, teacher: str, conn=Depends(get_db)):
    """Delete a class; teacher is the user's email (must own the class)."""
    if conn is None:
        raise HTTPException(status_code=503, detail="Database not configured.")
    teacher_email = (teacher or "").strip().lower()
    if not teacher_email:
        raise HTTPException(status_code=400, detail="Teacher is required.")
    user = await conn.fetchrow(
        "SELECT id FROM users WHERE LOWER(email) = $1", teacher_email
    )
    if not user:
        raise HTTPException(status_code=404, detail="Teacher not found.")
    result = await conn.execute(
        "DELETE FROM classes WHERE id = $1 AND teacher_id = $2",
        classId,
        user["id"],
    )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Class not found.")
    return {"ok": True, "message": "Class deleted."}


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
