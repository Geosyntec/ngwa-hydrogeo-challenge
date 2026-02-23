# Azure App Service deployment

This workflow builds the frontend, copies it into `backend/static`, and deploys the app to Azure App Service (Linux, Python).

## If you see the default Azure placeholder page

The app only runs if the **Startup Command** is set. The workflow sets it automatically via Azure CLI. If you still see the default page:

1. In **Azure Portal** → your Web App → **Configuration** → **General settings**.
2. Set **Startup Command** to: `bash startup.sh`
3. Save and restart the app (Overview → **Restart**).

Optionally set **Application settings** → `WEBSITES_PORT` = `8000` if your stack uses it.

## Prerequisites

1. **Azure Web App**  
   Create a Linux App Service with runtime **Python 3.11** (or 3.10).

2. **Secrets** (GitHub repo → Settings → Secrets and variables → Actions):
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: contents of the Web App’s **Download publish profile** (from Azure Portal → your Web App → Overview → Get publish profile).

3. **Variable:**
   - `AZURE_WEBAPP_NAME`: your Web App name (e.g. `my-hydro-app`).

## App Service configuration

- **Startup Command:**  
  `bash startup.sh`  
  (The script is at the repo root and runs `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`. Azure sets `PORT`.)

- **General Settings:**  
  If your platform uses a default port, set **Application Settings** → `WEBSITES_PORT` = `8000` (or leave unset if `PORT` is provided).

## Local deploy prep

From the repo root:

```bash
npm run build:azure
```

This builds the frontend and copies `dist/` → `backend/static/`. Then run the backend locally to test:

```bash
cd backend && uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000`; the SPA and `/api/*` should work.

## Workflow trigger

The workflow runs on **push to `main`** (see `on` in `.github/workflows/azure-deploy.yml`). Change the branch if you use something other than `main`.
