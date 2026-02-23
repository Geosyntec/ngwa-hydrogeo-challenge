/// <reference types="vite/client" />

// So TypeScript recognizes our .env variable
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}
