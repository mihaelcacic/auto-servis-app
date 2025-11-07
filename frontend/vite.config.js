import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Decide whether we are running inside Docker
const DOCKER_ENV = (process.env.DOCKER_ENV || "").toLowerCase() === "true";

if (!DOCKER_ENV) {
  // Load frontend/.env.dev.local when not in Docker (local development)
  const localEnvPath = path.resolve(__dirname, ".env.dev.local");
  if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath });
    console.log(`vite: loaded env from ${localEnvPath}`);
  } else {
    // fallback to standard dotenv behavior (.env, .env.development, etc.)
    dotenv.config();
    console.log("vite: loaded env from default .env (if present)");
  }
} else {
  console.log(
    "vite: running with DOCKER_ENV=true — using container environment variables"
  );
}

// Determine host and port for the dev server (do not hardcode values)
const host =
  process.env.HOST_FRONTEND || process.env.VITE_HOST_FRONTEND || "localhost";
const port = parseInt(
  process.env.PORT_FRONTEND || process.env.VITE_PORT_FRONTEND || "3000",
  10
);

// Proxy target for /api in dev. When running in Docker, prefer the backend service name.
const apiTarget = DOCKER_ENV
  ? `http://${
      process.env.BACKEND_HOST || process.env.HOST_BACKEND || "backend-run"
    }:${process.env.PORT_BACKEND || "8080"}`
  : process.env.VITE_API_TARGET || "http://localhost:8080";

console.log(
  `vite: dev server host=${host} port=${port} proxy /api -> ${apiTarget}`
);

export default defineConfig({
  plugins: [react()],
  server: {
    host,
    port,
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
