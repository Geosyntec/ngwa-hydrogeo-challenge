/**
 * Registration API: POST /api/register
 * Creates account and sends verification email (backend uses Mailjet).
 */

import { getApiUrl } from '../app/apiConfig'

export type RegisterPayload = {
  email: string
  password: string
}

export type RegisterResponse = {
  ok: boolean
  message: string
}

export type RegisterError = {
  message: string
}

function getMessage(data: { detail?: string | unknown; message?: string }): string {
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg
  return data.message ?? 'Registration failed.'
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const base = getApiUrl()
  const res = await fetch(`${base}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
    credentials: 'include',
  })

  const data = await res.json().catch(() => ({}))
  const message = getMessage(data)

  if (!res.ok) {
    const err: RegisterError = { message }
    return Promise.reject(err)
  }

  return { ok: true, message: data.message ?? 'Verification email has been sent.' }
}

export type ResendVerificationPayload = {
  email: string
}

export async function resendVerification(
  payload: ResendVerificationPayload
): Promise<RegisterResponse> {
  const base = getApiUrl()
  const res = await fetch(`${base}/api/resend-verification`, {
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

  return { ok: true, message: data.message ?? 'A new verification email has been sent.' }
}

export type VerifyEmailPayload = {
  token: string
}

export type VerifyEmailResponse = {
  ok: boolean
  message: string
}

export type VerifyEmailError = {
  message: string
  expired?: boolean
}

export async function verifyEmail(payload: VerifyEmailPayload): Promise<VerifyEmailResponse> {
  const base = getApiUrl()
  const res = await fetch(`${base}/api/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: payload.token }),
    credentials: 'include',
  })

  const data = await res.json().catch(() => ({}))
  const message = getMessage(data)
  const expired =
    res.status === 400 && (data.detail === 'expired' || message.toLowerCase().includes('expired'))

  if (!res.ok) {
    const err: VerifyEmailError = { message, expired }
    return Promise.reject(err)
  }

  return { ok: true, message: data.message ?? 'Your email is verified.' }
}
