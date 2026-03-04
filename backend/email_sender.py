"""
Send emails via Mailjet Send API v3.1.

Where to set secrets:
- Azure: Web App → Configuration → Application settings. Add names exactly:
  MAILJET_API_KEY, MAILJET_SECRET_KEY, MAILJET_FROM_EMAIL (MAILJET_FROM_NAME optional).
  Then Save and Restart the app so the process sees the new variables.
- Local: .env in project root (loaded by main.py via python-dotenv).

Names are case-sensitive. We also check MJ_APIKEY_PUBLIC / MJ_APIKEY_PRIVATE as fallbacks.
"""

from __future__ import annotations

import base64
import json
import logging
import os
import urllib.error
import urllib.request

logger = logging.getLogger(__name__)

MAILJET_SEND_URL = "https://api.mailjet.com/v3.1/send"


def _get_auth_header() -> str | None:
    api_key = (
        (os.environ.get("MAILJET_API_KEY") or "").strip()
    )
    secret = (
        (os.environ.get("MAILJET_SECRET_KEY") or "").strip()
    )
    if not api_key or not secret:
        return None
    raw = f"{api_key}:{secret}"
    return "Basic " + base64.b64encode(raw.encode()).decode()


def send_verification_email(to_email: str, verification_link: str) -> bool:
    """
    Send an email with the verification link. Returns True if sent, False if Mailjet not configured or send failed.
    """
    auth = _get_auth_header()
    if not auth:
        has_key = bool(
            (os.environ.get("MAILJET_API_KEY") or "").strip()
        )
        has_secret = bool(
            (os.environ.get("MAILJET_SECRET_KEY") or "").strip()
        )
        logger.warning(
            "Mailjet not configured: MAILJET_API_KEY set=%s, MAILJET_SECRET_KEY set=%s. "
            "Set both in Azure Application settings (exact names), then Restart the app.",
            has_key,
            has_secret,
        )
        return False

    from_email = (os.environ.get("MAILJET_FROM_EMAIL") or "").strip()
    from_name = (os.environ.get("MAILJET_FROM_NAME") or "Hydrogeology Challenge").strip()
    if not from_email:
        logger.warning("MAILJET_FROM_EMAIL not set. Skipping send.")
        return False

    body = {
        "Messages": [
            {
                "From": {"Email": from_email, "Name": from_name},
                "To": [{"Email": to_email.strip(), "Name": to_email.strip()}],
                "Subject": "Verify your email",
                "HTMLPart": (
                    f"<p>Please verify your email by clicking the link below. The link expires in 1 hour.</p>"
                    f"<p><a href=\"{verification_link}\">{verification_link}</a></p>"
                    f"<p>If you did not create an account, you can ignore this email.</p>"
                ),
            }
        ]
    }

    logger.info("Mailjet: sending verification email to %s (from %s)", to_email, from_email)

    req = urllib.request.Request(
        MAILJET_SEND_URL,
        data=json.dumps(body).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": auth,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            status = getattr(resp, "status", getattr(resp, "code", None))
            raw = resp.read()
            try:
                response_body = raw.decode("utf-8") if raw else ""
            except Exception:
                response_body = f"<{len(raw)} bytes>"
            if 200 <= (status or 0) < 300:
                logger.info(
                    "Mailjet send succeeded: status=%s, response=%s",
                    status,
                    response_body[:500] if response_body else "(empty)",
                )
                return True
            logger.warning(
                "Mailjet send non-2xx: status=%s, response=%s",
                status,
                response_body[:1000] if response_body else "(empty)",
            )
            return False
    except urllib.error.HTTPError as e:
        body_bytes = e.read()
        try:
            body_str = body_bytes.decode("utf-8") if body_bytes else ""
        except Exception:
            body_str = f"<{len(body_bytes)} bytes>"
        logger.warning(
            "Mailjet send HTTP error: code=%s, reason=%s, response=%s",
            e.code,
            getattr(e, "reason", ""),
            body_str[:1000] if body_str else "(empty)",
        )
        return False
    except urllib.error.URLError as e:
        logger.warning("Mailjet send URL error: %s", e.reason)
        return False
    except Exception as e:
        logger.exception("Mailjet send failed: %s", e)
        return False
