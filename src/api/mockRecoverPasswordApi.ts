/**
 * Mock API: POST /recover-password (forgot password)
 * Accepts email; simulates sending a password reset link.
 */

export type RecoverPasswordPayload = {
  email: string
}

export type RecoverPasswordResponse = {
  ok: boolean
  message: string
}

const MOCK_DELAY_MS = 400

/**
 * Simulates forgot-password request. Resolves with success; in a real app
 * this would send a reset link to the email.
 */
export async function recoverPassword(
  payload: RecoverPasswordPayload
): Promise<RecoverPasswordResponse> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
  const email = (payload.email || '').trim()
  if (!email) {
    return Promise.reject({ message: 'Email is required.' })
  }
  // eslint-disable-next-line no-console
  console.log('[mock] POST /recover-password', { email })
  return { ok: true, message: 'If an account exists, a password reset link has been sent.' }
}
