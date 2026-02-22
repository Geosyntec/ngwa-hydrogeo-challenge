# Backend (FastAPI)

Python FastAPI server. Used by the frontend when running `npm run dev`.

## Setup

From the project root:

```bash
pip install -r backend/requirements.txt
```

Or use a virtualenv:

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
# or: source .venv/bin/activate  # macOS/Linux
pip install -r backend/requirements.txt
```

## Run

- **With frontend:** `npm run dev` (starts both Vite and this backend).
- **Backend only:** `npm run dev:server` or `python -m uvicorn backend.main:app --reload --port 8000`

API base URL for the frontend: `http://localhost:8000` (override with `VITE_API_URL` in `.env`).
