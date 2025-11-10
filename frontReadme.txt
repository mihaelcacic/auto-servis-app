# General
SPRING_APPLICATION_NAME=auto-servis-app
DOCKER_ENV=true

# --- FRONTEND (Vite) ---
VITE_BACKEND_URL=http://localhost:8080
# Optional explicit API base (overrides relative '/api')
#VITE_API_BASE=

# FRONTEND server settings
HOST_FRONTEND=0.0.0.0
PORT_FRONTEND=5173
PORT_NGINX_FRONTEND=80

# --- BACKEND ---
HOST_BACKEND=0.0.0.0
PORT_BACKEND=8080
# Used by docker/nginx to proxy requests to backend (container-to-container)
BACKEND_URL=http://backend:8080

# URL that frontend uses (for OAuth redirects, etc.)
FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:8080

# --- DATABASE (Postgres) ---
# If Postgres runs in Docker, set the URL to jdbc:postgresql://postgres:5432/bregmotors
# If Postgres runs on host but container needs to reach it, use host.docker.internal
SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5433/bregmotors
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# --- GOOGLE OAUTH2 ---
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Notes:
# - For local dev using Vite, set VITE_BACKEND_URL appropriately and run `npm run dev`.
# - For containerized testing, prefer using relative '/api' in the frontend and ensure
#   nginx proxies /api -> ${BACKEND_URL} (backend service name) in the built image.
