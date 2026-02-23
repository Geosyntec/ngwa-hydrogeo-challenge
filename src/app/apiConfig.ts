/**
 * Base URL for the backend API.
 * - Development: set VITE_API_URL in .env (e.g. http://localhost:8000) or it defaults to that.
 * - Production: leave VITE_API_URL unset (or empty) for same-origin; or set to your API origin.
 */
export function getApiUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (url !== undefined && url !== '' && typeof url === 'string') {
    return String(url).replace(/\/$/, '')
  }
  if (import.meta.env.PROD) return '' // same origin when frontend is served by the backend
  return 'http://localhost:8000'
}
