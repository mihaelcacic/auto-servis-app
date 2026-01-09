
# Multi-stage build: build the Vite app with Node, serve with nginx in production
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies (use npm ci for reproducible builds)
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Remove default nginx website, copy built files
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

# SPA routing: fallback to index.html for unknown routes
COPY nginx.conf /etc/nginx/conf.d/default.template
EXPOSE 80
ENTRYPOINT ["/bin/sh", "-c", \
  "envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && \
   exec nginx -g 'daemon off;'"]