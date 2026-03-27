/// <reference types="vite/client" />

// So TypeScript recognizes our .env variable
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  /** Optional; overrides basename when set (e.g. `/ngwa-dev`). Prefer matching Vite `base`. */
  readonly VITE_ROUTER_BASENAME?: string
}
