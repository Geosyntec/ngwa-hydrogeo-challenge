/**
 * Login API: POST /api/login
 * Calls the backend; credentials are validated against the database (hashed passwords).
 */

import { getApiUrl } from '../app/apiConfig'

export type LoginCredentials = {
  username: string
  password: string
}

export type LoginResponse = {
  user: { name: string }
}

export type LoginError = {
  message: string
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const base = getApiUrl()
  const res = await fetch(`${base}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: credentials.username.trim(),
      password: credentials.password,
    }),
    credentials: 'include',
  })

  const data = await res.json().catch(() => ({}))
  const message =
    typeof data.detail === 'string'
      ? data.detail
      : Array.isArray(data.detail) && data.detail[0]?.msg
        ? data.detail[0].msg
        : data.message ?? 'Sign in failed.'

  if (!res.ok) {
    const err: LoginError = { message }
    return Promise.reject(err)
  }

  if (!data.user?.name) {
    return Promise.reject({ message: 'Invalid response from server.' })
  }

  return { user: { name: data.user.name } }
}
