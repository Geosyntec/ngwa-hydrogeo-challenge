# Azure PostgreSQL and dev machine access

The backend uses **asyncpg** to connect to PostgreSQL. It reads configuration from environment variables (or a `.env` file in development via `python-dotenv`).

## Environment variables

Use **one** of these:

**Option A – connection string (recommended for Azure)**  
Azure Portal gives you a connection string; use it as-is. The app accepts both `postgres://` and `postgresql://` and will enforce SSL for Azure hosts.

```bash
DATABASE_URL=postgresql://USER:PASSWORD@YOUR-SERVER.postgres.database.azure.com:5432/DATABASE?sslmode=require
```

**Option B – individual variables**

```bash
POSTGRES_HOST=your-server.postgres.database.azure.com
POSTGRES_PORT=5432
POSTGRES_USER=your_admin_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
```

If the host contains `.postgres.database.azure.com`, the app forces `sslmode=require`. For local Postgres you can leave SSL as default (`prefer`).

## Bootstrap tables

On **Azure App Service**, the startup script (`startup.sh`) runs the bootstrap (tables only, no seed) automatically when `DATABASE_URL` is set, so tables are created or updated on each app start. No workflow or runner access to the DB is required.

For **local or one-off** setup, from the repo root:

```bash
# Create tables only
python -m backend.scripts.bootstrap_db

# Create tables and seed demo users/classes/students (teacher/demo, teacher1/demo, admin/admin)
python -m backend.scripts.bootstrap_db --seed
```

Tables created:

| Table | Purpose |
|-------|--------|
| `users` | Teachers/admins; login (username, password_hash). |
| `classes` | Classes belonging to a teacher (teacher_id, name). |
| `students` | Roster (first_name, last_name); row `id` is the student ID used in get-grades / submit-grades. |
| `grade_submissions` | One row per submit; stores scenario_id, selected_wells, answers (JSONB), grade counts, percentage. |

`--seed` inserts demo users (teacher/demo, teacher1/demo, admin/admin) with **bcrypt-hashed** passwords, plus class rosters. Login is DB-backed; use the same credentials to sign in after seeding.

## Creating Azure PostgreSQL (Flexible Server)

1. **Create the server**  
   Azure Portal → Create a resource → **Azure Database for PostgreSQL** → **Flexible server**.  
   - Region: same as your App Service (or nearby).  
   - PostgreSQL version: 15 or 16.  
   - Compute + storage: pick a size (e.g. Burstable B1ms for dev).  
   - Authentication: **PostgreSQL authentication** (username + password).  
   - Set admin username and password and note them.

2. **Networking – allow access**

   - **Networking** tab → **Firewall rules**.
   - **Allow public access from any Azure service within Azure to this server**: set to **Yes** so your App Service can connect.
   - To allow your **dev machine**:
     - Add a rule, e.g. name `DevMachine`, start IP = your public IP, end IP = same (or use a range).
     - To get your IP: search “what is my ip” or use Azure’s **Add current client IP address** if the portal offers it.
   - Save. Changes can take a minute.

3. **TLS/SSL**  
   Flexible Server uses TLS by default. Keep **Enforce SSL connection** enabled (the app uses `sslmode=require` for Azure hosts).

4. **Connection string**  
   In the server’s **Overview** or **Connection strings**, copy the **ADO.NET** or **Connection string** value. It looks like:

   ```
   Host=your-server.postgres.database.azure.com; Port=5432; Database=yourdb; Username=user; Password=...; Ssl Mode=Require;
   ```

   Convert to URL form for `DATABASE_URL`:

   ```
   postgresql://user:password@your-server.postgres.database.azure.com:5432/yourdb?sslmode=require
   ```

   (Replace `user`, `password`, `your-server`, `yourdb` with your values; ensure the password is URL-encoded if it contains special characters.)

## Connecting from your dev machine

1. **Firewall**  
   Add a firewall rule that allows your dev machine’s **public IP** (see step 2 above). If your IP changes (e.g. home vs office), add a new rule or a range.

2. **Env vars or `.env`**  
   In your project root (or wherever you run the backend), set `DATABASE_URL` or the `POSTGRES_*` variables. If you use a `.env` file, the app loads it on startup when you run locally.

3. **Test**  
   From the repo root (with venv activated and deps installed):

   ```bash
   cd backend
   uvicorn backend.main:app --reload --port 8000
   ```

   Then open:

   - `http://localhost:8000/api/ping` – should return `true` (API up).  
   - `http://localhost:8000/api/db-ping` – should return `true` if the database is configured and reachable; otherwise 503.

## App Service (production)

In Azure Web App → **Configuration** → **Application settings**, add:

- `DATABASE_URL` = your production connection string (with production DB and password), **or**
- The five `POSTGRES_*` variables.

Mark sensitive values as **Key vault references** if you use Key Vault. Restart the app after changing settings.

## Using the DB in code

In FastAPI route handlers, inject a connection with the `get_db` dependency:

```python
from fastapi import Depends
from backend.main import get_db
import asyncpg

@app.get("/api/example")
async def example(conn: asyncpg.Connection = Depends(get_db)):
    if conn is None:
        raise HTTPException(503, "Database not configured")
    row = await conn.fetchrow("SELECT ...")
    return {"data": dict(row)}
```

The pool is created at startup and closed at shutdown; no need to create it in routes.

## Troubleshooting

- **Connection timeouts from dev**  
  Check firewall: your public IP must be allowed. If you’re behind VPN or corporate NAT, use that egress IP in the rule.

- **SSL errors**  
  Use `sslmode=require` in the URL for Azure. The app sets this automatically when the host is `*.postgres.database.azure.com` if you use `POSTGRES_*` vars.

- **503 on `/api/db-ping`**  
  Either DB is not configured (`DATABASE_URL` / `POSTGRES_*` not set) or the server cannot reach the database (firewall, wrong host/credentials, or TLS issue). Check App Service logs and the connection string.

- **Password with special characters**  
  In `DATABASE_URL`, URL-encode the password (e.g. `@` → `%40`, `#` → `%23`). Or use the separate `POSTGRES_PASSWORD` variable so the shell doesn’t interpret special characters.
