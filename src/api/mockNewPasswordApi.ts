/**
 * Mock API: POST /new-password
 * Accepts user email and new password (e.g. after following reset link).
 */

export type NewPasswordPayload = {
  email: string
  newPassword: string
  token?: string
}

export type NewPasswordResponse = {
  ok: boolean
  message: string
}

const MOCK_DELAY_MS = 500

/**
 * Simulates setting a new password. Resolves with success; in a real app
 * this would validate the token and update the password.
 */
export async function setNewPassword(
  payload: NewPasswordPayload
): Promise<NewPasswordResponse> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
  const email = (payload.email || '').trim()
  if (!email) {
    return Promise.reject({ message: 'Email is required.' })
  }
  if (!payload.newPassword) {
    return Promise.reject({ message: 'New password is required.' })
  }
  // eslint-disable-next-line no-console
  console.log('[mock] POST /new-password', { email, token: payload.token })
  return { ok: true, message: 'Password has been updated.' }
}
