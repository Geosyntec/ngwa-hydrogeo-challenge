"""
Azure PostgreSQL connection for the Hydrogeology Challenge backend.

Uses asyncpg for async connection pooling. Configure via environment:
- DATABASE_URL: full connection URI (postgresql://user:pass@host:port/dbname?sslmode=require)
  Use URL-encoded password if it contains @, #, :, etc.
- Or individual: POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
  Prefer this when the password has special characters; no URL encoding needed.

If no database config is set, or connection fails (e.g. DNS "name or service not known"),
the app runs without a DB (pool is None); routes that need the DB should check and return 503.
"""

from __future__ import annotations

import logging
import os
from typing import Any, AsyncIterator

import asyncpg

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Connection config (prefer discrete params to avoid URL encoding issues)
# ---------------------------------------------------------------------------


def _get_connection_kwargs() -> dict[str, Any] | None:
    """Build connection kwargs from POSTGRES_* env vars. Returns None if not configured."""
    host = os.environ.get("POSTGRES_HOST", "").strip()
    if not host:
        return None
    user = os.environ.get("POSTGRES_USER", "").strip()
    if not user:
        return None
    port = int(os.environ.get("POSTGRES_PORT", "5432").strip() or 5432)
    password = os.environ.get("POSTGRES_PASSWORD", "").strip()
    database = os.environ.get("POSTGRES_DB", "postgres").strip()
    # Azure PostgreSQL Flexible Server requires SSL; use True for Azure, False for local
    ssl = ".postgres.database.azure.com" in host
    return {
        "host": host,
        "port": port,
        "user": user,
        "password": password,
        "database": database,
        "ssl": ssl,
        "min_size": 1,
        "max_size": 10,
        "command_timeout": 60,
    }


def get_database_url() -> str | None:
    """Return DATABASE_URL from env if set (postgresql://...). For use when POSTGRES_* not used."""
    url = os.environ.get("DATABASE_URL", "").strip()
    if not url:
        return None
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://") :]
    return url


# ---------------------------------------------------------------------------
# Pool (created at app startup via lifespan)
# ---------------------------------------------------------------------------

Pool = asyncpg.Pool


async def create_pool() -> Pool | None:
    """
    Create an asyncpg connection pool from environment.
    Prefers POSTGRES_* (discrete params) to avoid password encoding issues.
    On connection failure (e.g. DNS error), logs and returns None so the app can start.
    """
    kwargs = _get_connection_kwargs()
    if kwargs:
        # Use discrete parameters (password can contain special characters)
        host = kwargs.pop("host")
        port = kwargs.pop("port")
        user = kwargs.pop("user")
        password = kwargs.pop("password")
        database = kwargs.pop("database")
        ssl = kwargs.pop("ssl")
        try:
            return await asyncpg.create_pool(
                host=host,
                port=port,
                user=user,
                password=password,
                database=database,
                ssl=ssl,
                min_size=kwargs.get("min_size", 1),
                max_size=kwargs.get("max_size", 10),
                command_timeout=kwargs.get("command_timeout", 60),
            )
        except (OSError, asyncpg.InvalidCatalogNameError, asyncpg.InvalidPasswordError) as e:
            logger.warning(
                "Database connection failed (app will run without DB): %s. "
                "Check POSTGRES_HOST (or DATABASE_URL host) is correct and reachable.",
                e,
            )
            return None

    url = get_database_url()
    if not url:
        return None
    try:
        return await asyncpg.create_pool(
            url,
            min_size=1,
            max_size=10,
            command_timeout=60,
        )
    except (OSError, asyncpg.InvalidCatalogNameError, asyncpg.InvalidPasswordError) as e:
        logger.warning(
            "Database connection failed (app will run without DB): %s. "
            "If your password has special characters, use POSTGRES_HOST, POSTGRES_USER, "
            "POSTGRES_PASSWORD, etc. instead of DATABASE_URL.",
            e,
        )
        return None


async def close_pool(pool: Pool | None) -> None:
    """Close the connection pool."""
    if pool is not None:
        await pool.close()


async def get_connection(pool: Pool | None) -> AsyncIterator[asyncpg.Connection | None]:
    """
    Yield a connection from the pool. Use as a FastAPI dependency.
    Yields None if the pool is not configured.
    """
    if pool is None:
        yield None
        return
    async with pool.acquire() as conn:
        yield conn
