"""
Azure PostgreSQL connection for the Hydrogeology Challenge backend.

Uses asyncpg for async connection pooling. Configure via environment:
- DATABASE_URL: full connection URI (postgresql://user:pass@host:port/dbname?sslmode=require)
- Or individual: POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

If no database config is set, the app runs without a DB (pool is None); routes that need
the DB should check and return 503 or handle gracefully.
"""

from __future__ import annotations

import os
from typing import AsyncIterator

import asyncpg

# ---------------------------------------------------------------------------
# Connection URL
# ---------------------------------------------------------------------------


def get_database_url() -> str | None:
    """Build or return the PostgreSQL connection URL from environment."""
    url = os.environ.get("DATABASE_URL", "").strip()
    if url:
        # Ensure postgresql:// for asyncpg (it accepts postgresql://)
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

    # Azure PostgreSQL Flexible Server: require SSL
    ssl_mode = "require" if ".postgres.database.azure.com" in host else "prefer"
    return (
        f"postgresql://{user}:{password}@{host}:{port}/{dbname}?sslmode={ssl_mode}"
    )


# ---------------------------------------------------------------------------
# Pool (created at app startup via lifespan)
# ---------------------------------------------------------------------------

Pool = asyncpg.Pool


async def create_pool() -> Pool | None:
    """Create an asyncpg connection pool from environment. Returns None if not configured."""
    url = get_database_url()
    print(f"Database URL: {url}")
    if not url:
        return None
    
    return await asyncpg.create_pool(
        url,
        min_size=1,
        max_size=10,
        command_timeout=60,
    )


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
