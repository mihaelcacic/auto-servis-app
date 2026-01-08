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

   // Determine host and port for the dev server (do not hardcode values)
  const host = process.env.HOST_FRONTEND || process.env.VITE_HOST_FRONTEND || "localhost";
  const port = parseInt(process.env.PORT_FRONTEND || process.env.VITE_PORT_FRONTEND || "5173");

  // Proxy target for /api in dev. When running in Docker, prefer the backend service name.
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

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
