/**
 * Mock API: POST /register
 * Accepts email and password; simulates sending a verification email.
 */

export type RegisterPayload = {
  email: string
  password: string
}

export type RegisterResponse = {
  ok: boolean
  message: string
}

const MOCK_DELAY_MS = 500

/**
 * Simulates registration. Resolves with success; in a real app this would
 * create the account and send a verification email.
 */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
  const email = (payload.email || '').trim()
  if (!email) {
    return Promise.reject({ message: 'Email is required.' })
  }
  // eslint-disable-next-line no-console
  console.log('[mock] POST /register', { email, passwordLength: payload.password?.length })
  return { ok: true, message: 'Verification email has been sent.' }
}
