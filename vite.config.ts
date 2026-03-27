import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Local `vite` and production builds use relative base `.` so assets and routes work.
// Use `npm run build:dev` (mode `staging`) when deploying under `/ngwa-dev/` on the dev site.
// Keep in sync with `src/app/routerBasename.ts` (STAGING_PATH_PREFIX).
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'staging' ? '/ngwa-dev/' : '.',
}))
