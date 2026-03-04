# Azure App Service deployment

This workflow builds the frontend, copies it into `backend/static`, and deploys the app to Azure App Service (Linux, Python).

## If you see the default Azure placeholder page

The app only runs if the **Startup Command** is set. The workflow sets it automatically via Azure CLI. If you still see the default page:

1. In **Azure Portal** → your Web App → **Configuration** → **General settings**.
2. Set **Startup Command** to: `bash startup.sh`
3. Save and restart the app (Overview → **Restart**).

Optionally set **Application settings** → `WEBSITES_PORT` = `8000` if your stack uses it.

## Oryx build disabled (pre-built venv)

The workflow **does not use Oryx** to build the app. It creates a Python virtual environment (`antenv`) on the Linux runner, installs dependencies into it, and includes it in the deployment zip. The app setting `SCM_DO_BUILD_DURING_DEPLOYMENT=false` is set so Azure skips the Oryx build step. This avoids Oryx venv creation failures on the App Service side.

At runtime, **the container’s own Python** is used (not the venv’s `bin/python`), with `PYTHONPATH` set to `antenv/lib/pythonX.Y/site-packages`. That avoids GLIBC mismatches: the venv’s Python binary was built on the runner’s newer glibc; the container’s Python matches the App Service image. The App Service runtime must be **Python 3.11** to match the version used in the workflow and the deployed site-packages.

## Prerequisites

1. **Azure Web App**  
   Create a Linux App Service with runtime **Python 3.11** (must match the workflow so `antenv/lib/python3.11/site-packages` exists).

2. **Secrets** (GitHub repo → Settings → Secrets and variables → Actions):
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: contents of the Web App’s **Download publish profile** (from Azure Portal → your Web App → Overview → Get publish profile).

3. **Variable** (if your workflow uses it):
   - `AZURE_WEBAPP_NAME`: your Web App name (e.g. `my-hydro-app`).

## App Service configuration

- **Startup Command:**  
  `bash startup.sh`  
  (At each app start, the script runs the database bootstrap (tables only, no seed) when `DATABASE_URL` is set, then starts `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`. Azure sets `PORT`.)

- **General Settings:**  
  If your platform uses a default port, set **Application Settings** → `WEBSITES_PORT` = `8000` (or leave unset if `PORT` is provided).

- **Database:**  
  Configure PostgreSQL via **Application settings** (e.g. `DATABASE_URL` or `POSTGRES_*`). See [DATABASE-AZURE.md](DATABASE-AZURE.md) for Azure PostgreSQL setup and dev machine access.

- **Email verification (Mailjet):**  
  In **Configuration → Application settings**, add these names **exactly** (case-sensitive):
  - **MAILJET_API_KEY** – your Mailjet API key
  - **MAILJET_SECRET_KEY** – your Mailjet Secret key
  - **MAILJET_FROM_EMAIL** – sender address (must be allowed in Mailjet)
  - **MAILJET_FROM_NAME** (optional) – sender display name  
  Then **Save** and **Restart** the Web App so the process picks up the new variables. If emails are still skipped, check Log stream for a warning that shows which of the two (API key / Secret key) is not set.

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
