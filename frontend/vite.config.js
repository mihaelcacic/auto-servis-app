import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// Use Vite's loadEnv to read .env files for the current mode (development/production)
// This merges .env, .env.local, .env.development, etc. according to Vite conventions.
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // also attempt to load the repository root .env (one level up) so a single .env at repo root
  // can be used without duplicating files in frontend/ (useful in your setup)
  const rootEnv = loadEnv(mode, path.resolve(process.cwd(), '..'), '')

  // Resolve host/port from env (support both VITE_ and non-prefixed vars)
  const host = env.VITE_HOST_FRONTEND || env.HOST_FRONTEND || rootEnv.VITE_HOST_FRONTEND || rootEnv.HOST_FRONTEND || 'localhost'
  const port = parseInt(env.VITE_PORT_FRONTEND || env.PORT_FRONTEND || rootEnv.VITE_PORT_FRONTEND || rootEnv.PORT_FRONTEND || '3000', 10)

  // Backend URL for dev proxy. Preference order:
  // 1) frontend env (VITE_BACKEND_URL), 2) frontend BACKEND_URL, 3) repo root VITE_BACKEND_URL, 4) repo root BACKEND_URL, 5) fallback
  const BACKEND_URL = env.VITE_BACKEND_URL || env.BACKEND_URL || rootEnv.VITE_BACKEND_URL || rootEnv.BACKEND_URL || 'http://localhost:8080'

  console.log(`vite: dev server host=${host} port=${port} proxy /api -> ${BACKEND_URL}`)

  return defineConfig({
    plugins: [react()],
    server: {
      host,
      port,
      proxy: {
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
