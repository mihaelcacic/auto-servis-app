
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
COPY nginx.dev.conf /etc/nginx/nginx.dev.conf
COPY nginx.prod.conf /etc/nginx/nginx.prod.conf

EXPOSE 80

# Check DOCKER_ENV at startup and move the correct file to default.conf
CMD ["/bin/sh", "-c", " \
    if [ \"$PROD_DEPLOY\" = \"true\" ]; then \
    echo 'Using Production Configuration'; \
    cp /etc/nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf; \
    else \
    echo 'Using Development Configuration'; \
    cp /etc/nginx/nginx.dev.conf /etc/nginx/conf.d/default.conf; \
    fi && \
    exec nginx -g 'daemon off;'"]