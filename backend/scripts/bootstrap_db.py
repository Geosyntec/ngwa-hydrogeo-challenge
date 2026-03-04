"""
Bootstrap database tables for the Hydrogeology Challenge app.

Schema is derived from the mock APIs:
- users: teachers (login); used by GET /api/classes?teacher=...
- classes: teacher's classes with display name; used with students for roster
- students: roster rows (first_name, last_name); id is the "studentId" used in get-grades and submit-grades
- grade_submissions: one row per submit; get-grades returns latest per student

Run from repo root with DATABASE_URL or POSTGRES_* set:
  python -m backend.scripts.bootstrap_db

Optional: --seed to insert demo users and classes (passwords match current mock).
"""

from __future__ import annotations

import argparse
import asyncio
import os
import sys
from pathlib import Path

# Ensure repo root is on path when run as script
_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

from dotenv import load_dotenv
load_dotenv(_REPO_ROOT / ".env")

import asyncpg


# ---------------------------------------------------------------------------
# Schema (matches mock: users, classes, students, grade_submissions)
# ---------------------------------------------------------------------------

SCHEMA_SQL = """
-- Teachers (and admins); login uses username + password_hash
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username   TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Classes belong to a teacher; name is display name (e.g. "Hydrogeology 101")
CREATE TABLE IF NOT EXISTS classes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, name)
);

CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);

-- Roster: students in a class (first_name, last_name). Row id is the "studentId" in get-grades / submit-grades
CREATE TABLE IF NOT EXISTS students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);

-- One row per grade submission; get-grades returns latest per student
CREATE TABLE IF NOT EXISTS grade_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  scenario_id     TEXT NOT NULL,
  selected_wells  JSONB NOT NULL DEFAULT '[]',
  answers         JSONB NOT NULL DEFAULT '{}',
  flow_right      INT NOT NULL,
  flow_total      INT NOT NULL,
  gradient_right  INT NOT NULL,
  gradient_total  INT NOT NULL,
  velocity_right  INT NOT NULL,
  velocity_total  INT NOT NULL,
  percentage      INT NOT NULL,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grade_submissions_student_id ON grade_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_grade_submissions_submitted_at ON grade_submissions(submitted_at DESC);
"""


def get_database_url() -> str | None:
    url = os.environ.get("DATABASE_URL", "").strip()
    if url:
        if url.startswith("postgres://"):
            url = "postgresql://" + url[len("postgres://") :]
        return url or None
    host = os.environ.get("POSTGRES_HOST", "").strip()
    if not host:
        return None
    port = os.environ.get("POSTGRES_PORT", "5432").strip()
    user = os.environ.get("POSTGRES_USER", "").strip()
    password = os.environ.get("POSTGRES_PASSWORD", "").strip()
    dbname = os.environ.get("POSTGRES_DB", "postgres").strip()
    if not user:
        return None
    ssl_mode = "require" if ".postgres.database.azure.com" in host else "prefer"
    return f"postgresql://{user}:{password}@{host}:{port}/{dbname}?sslmode={ssl_mode}"


# Demo users: passwords are hashed with bcrypt (teacher/demo, teacher1/demo, admin/admin)
def _seed_users_sql() -> str:
    from passlib.context import CryptContext
    pwd = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)
    h_demo = pwd.hash("demo").replace("'", "''")  # escape for SQL
    h_admin = pwd.hash("admin").replace("'", "''")
    return f"""
INSERT INTO users (id, username, password_hash) VALUES
  ('11111111-1111-1111-1111-111111111101', 'teacher', '{h_demo}'),
  ('11111111-1111-1111-1111-111111111102', 'teacher1', '{h_demo}'),
  ('11111111-1111-1111-1111-111111111103', 'admin', '{h_admin}')
ON CONFLICT (username) DO NOTHING;
"""


# Seed classes and students (SQL only)
SEED_CLASSES_AND_STUDENTS_SQL = """
-- Seed classes for teacher (id 11111111-1111-1111-1111-111111111101)
INSERT INTO classes (id, teacher_id, name) VALUES
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'Hydrogeology 101'),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', 'Groundwater Lab'),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111101', 'Advanced Aquifer Analysis')
ON CONFLICT (teacher_id, name) DO NOTHING;

-- Seed students for Hydrogeology 101
INSERT INTO students (id, class_id, first_name, last_name) VALUES
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'Alice', 'Smith'),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'Bob', 'Jones'),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', 'Carol', 'White'),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222201', 'David', 'Brown')
ON CONFLICT (id) DO NOTHING;

-- Seed students for Groundwater Lab
INSERT INTO students (id, class_id, first_name, last_name) VALUES
  ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222202', 'Eve', 'Davis'),
  ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222202', 'Frank', 'Miller'),
  ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222202', 'Grace', 'Wilson')
ON CONFLICT (id) DO NOTHING;

-- Seed students for Advanced Aquifer Analysis
INSERT INTO students (id, class_id, first_name, last_name) VALUES
  ('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222203', 'Henry', 'Taylor'),
  ('33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222203', 'Ivy', 'Anderson'),
  ('33333333-3333-3333-3333-33333333330a', '22222222-2222-2222-2222-222222222203', 'Jack', 'Thomas'),
  ('33333333-3333-3333-3333-33333333330b', '22222222-2222-2222-2222-222222222203', 'Kate', 'Martinez'),
  ('33333333-3333-3333-3333-33333333330c', '22222222-2222-2222-2222-222222222203', 'Leo', 'Garcia')
ON CONFLICT (id) DO NOTHING;
"""


async def run() -> None:
    parser = argparse.ArgumentParser(description="Bootstrap DB tables for Hydrogeology Challenge")
    parser.add_argument("--seed", action="store_true", help="Insert demo users, classes, and students")
    args = parser.parse_args()

    url = get_database_url()
    if not url:
        print("DATABASE_URL or POSTGRES_* env vars not set.", file=sys.stderr)
        sys.exit(1)

    print("Connecting to database...")
    conn = await asyncpg.connect(url)
    try:
        # One-time migration: replace class_students (name) with students (first_name, last_name)
        has_old = await conn.fetchval(
            """SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'class_students'"""
        )
        if has_old:
            print("Migrating from class_students to students...")
            await conn.execute("DROP TABLE IF EXISTS grade_submissions")
            await conn.execute("DROP TABLE IF EXISTS class_students")
        print("Creating tables...")
        await conn.execute(SCHEMA_SQL)
        print("Tables created (or already exist).")

        if args.seed:
            print("Seeding demo data...")
            await conn.execute(_seed_users_sql())
            await conn.execute(SEED_CLASSES_AND_STUDENTS_SQL)
            print("Seed complete.")
    finally:
        await conn.close()

    print("Bootstrap done.")


if __name__ == "__main__":
    asyncio.run(run())
