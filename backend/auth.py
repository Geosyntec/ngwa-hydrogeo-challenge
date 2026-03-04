"""
Password hashing and verification for production login.

Uses bcrypt via passlib (salted, adaptive hashing). Store only the hash
in the database; never store or log plaintext passwords.
"""

from __future__ import annotations

from passlib.context import CryptContext

# bcrypt with default round cost (12). Do not lower for production.
_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(plain: str) -> str:
    """Return a salted, hashed version of the password for storage."""
    return _pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if the plain password matches the stored hash."""
    if not hashed or not plain:
        return False
    try:
        return _pwd_context.verify(plain, hashed)
    except Exception:
        return False
