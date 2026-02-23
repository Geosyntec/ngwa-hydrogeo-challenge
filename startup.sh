#!/usr/bin/env bash
# Azure App Service startup: use PORT from environment (Azure sets this).
# Use the container's Python (matches container GLIBC) and our deployed packages
# from antenv's site-packages to avoid GLIBC mismatch from a pre-built venv binary.
set -e
APP_ROOT=/home/site/wwwroot
cd "$APP_ROOT"
# Match site-packages to container Python version (e.g. 3.11)
PYVER=$(python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
export PYTHONPATH="$APP_ROOT/antenv/lib/python$PYVER/site-packages"
PORT=${PORT:-8000}
exec python -m uvicorn backend.main:app --host 0.0.0.0 --port "$PORT"
