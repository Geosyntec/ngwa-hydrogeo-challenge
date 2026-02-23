#!/usr/bin/env bash
# Azure App Service startup: use PORT from environment (Azure sets this).
# Use the deployed venv so uvicorn is found; run from wwwroot so backend.main resolves.
set -e
APP_ROOT=/home/site/wwwroot
cd "$APP_ROOT"
PORT=${PORT:-8000}
exec "$APP_ROOT/antenv/bin/python" -m uvicorn backend.main:app --host 0.0.0.0 --port "$PORT"
