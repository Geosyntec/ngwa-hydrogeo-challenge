/**
 * Base URL for the backend API.
 * Set VITE_API_URL in .env (e.g. http://localhost:8000) or it defaults for dev.
 */
export function getApiUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (url && typeof url === 'string') return url.replace(/\/$/, '')
  return 'http://localhost:8000'
}
