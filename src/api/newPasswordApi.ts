/**
 * POST /api/new-password — completes password reset using token from the email link.
 */

import { getApiUrl } from '../app/apiConfig'

export type NewPasswordPayload = {
  email: string
  newPassword: string
  token?: string
}

export type NewPasswordResponse = {
  ok: boolean
  message: string
}

function getMessage(data: { detail?: string | unknown; message?: string }): string {
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg
  return data.message ?? 'Request failed.'
}

export async function setNewPassword(payload: NewPasswordPayload): Promise<NewPasswordResponse> {
  const email = (payload.email || '').trim()
  const token = (payload.token || '').trim()
  if (!email) {
    return Promise.reject({ message: 'Email is required.' })
  }
  if (!payload.newPassword) {
    return Promise.reject({ message: 'New password is required.' })
  }
  if (!token) {
    return Promise.reject({ message: 'Reset token is required.' })
  }

  const base = getApiUrl()
  const res = await fetch(`${base}/api/new-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.toLowerCase(),
      newPassword: payload.newPassword,
      token,
    }),
    credentials: 'include',
  })

  const data = await res.json().catch(() => ({}))
  const message = getMessage(data)

  if (!res.ok) {
    return Promise.reject({ message })
  }

  return { ok: true, message: data.message ?? message }
}
