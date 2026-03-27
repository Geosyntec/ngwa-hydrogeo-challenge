/**
 * React Router `basename` for subdirectory deploys (must match Vite `base`, e.g. `/ngwa-dev/`).
 *
 * Order: optional `VITE_ROUTER_BASENAME` → `import.meta.env.BASE_URL` → infer `/ngwa-dev` from
 * `location.pathname` when the URL is under that prefix but the bundle was built with root `base`.
 * (Keeps `/ngwa-dev/scenario` working behind proxies or if a production-style build is served there.)
 */

/** Keep aligned with `vite.config.ts` staging `base` (without trailing slash). */
const STAGING_PATH_PREFIX = '/ngwa-dev'

function normalizeToBasename(raw: string | undefined): string | undefined {
  if (raw == null) return undefined
  let s = raw.trim()
  if (s === '' || s === '/' || s === './') return undefined
  if (s.endsWith('/')) s = s.slice(0, -1)
  if (s === '' || s === '/') return undefined
  return s.startsWith('/') ? s : `/${s}`
}

export function getRouterBasename(): string | undefined {
  const fromEnv = normalizeToBasename(import.meta.env.VITE_ROUTER_BASENAME)
  if (fromEnv) return fromEnv

  const fromVite = normalizeToBasename(import.meta.env.BASE_URL)
  if (fromVite) return fromVite

  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    if (path === STAGING_PATH_PREFIX || path.startsWith(`${STAGING_PATH_PREFIX}/`)) {
      return STAGING_PATH_PREFIX
    }
  }

  return undefined
}
