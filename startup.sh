#!/usr/bin/env bash
# Azure App Service startup: use PORT from environment (Azure sets this).
# Run from repo root so that "backend.main" resolves.
PORT=${PORT:-8000}
exec uvicorn backend.main:app --host 0.0.0.0 --port "$PORT"
