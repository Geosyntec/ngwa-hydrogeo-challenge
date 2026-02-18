/**
 * Mock API: POST /api/logout (or equivalent session invalidation endpoint)
 * Simulates a logout request; no request body required.
 */

const MOCK_DELAY_MS = 200

/**
 * Simulates a logout request. Resolves after a short delay.
 * In production, this would invalidate the server session/token.
 */
export async function logout(): Promise<void> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
}
