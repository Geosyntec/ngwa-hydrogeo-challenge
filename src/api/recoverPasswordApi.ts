/**
 * POST /api/recover-password — sends password reset email via Mailjet when the account exists.
 */

import { getApiUrl } from '../app/apiConfig'

export type RecoverPasswordPayload = {
  email: string
}

export type RecoverPasswordResponse = {
  ok: boolean
  message: string
}

function getMessage(data: { detail?: string | unknown; message?: string }): string {
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg
  return data.message ?? 'Request failed.'
}

export async function recoverPassword(
  payload: RecoverPasswordPayload,
): Promise<RecoverPasswordResponse> {
  const base = getApiUrl()
  const res = await fetch(`${base}/api/recover-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: payload.email.trim().toLowerCase() }),
    credentials: 'include',
  })

  const data = await res.json().catch(() => ({}))
  const message = getMessage(data)

  if (!res.ok) {
    return Promise.reject({ message })
  }

  return {
    ok: true,
    message: data.message ?? message,
  }
}
