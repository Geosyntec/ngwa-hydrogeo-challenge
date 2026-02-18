/**
 * Mock API: POST /api/login (or equivalent auth endpoint)
 * Accepts username + optional password and returns user info on success.
 */

export type LoginCredentials = {
  username: string
  password?: string
}

export type LoginResponse = {
  user: { name: string }
}

export type LoginError = {
  message: string
}

const MOCK_DELAY_MS = 400

/** Mock users: password is optional; any non-empty username succeeds for now. */
const MOCK_USERS: Record<string, string | undefined> = {
  teacher: 'demo',
  teacher1: 'demo',
  admin: 'admin',
}

/**
 * Simulates a login request. Resolves with user info for valid credentials,
 * rejects with a message for invalid/missing username or wrong password.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))

  const username = (credentials.username || '').trim()
  if (!username) {
    const err: LoginError = { message: 'Username is required.' }
    return Promise.reject(err)
  }

  const expectedPassword = MOCK_USERS[username.toLowerCase()]
  const password = credentials.password ?? ''

  if (expectedPassword !== undefined && password !== expectedPassword) {
    const err: LoginError = { message: 'Invalid username or password.' }
    return Promise.reject(err)
  }

  return { user: { name: username } }
}
