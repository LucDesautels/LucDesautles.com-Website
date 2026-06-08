# syntax=docker/dockerfile:1.7

# ── Stage 1: build the static Astro site ─────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the source and build
COPY . .
RUN npm run build

# ── Stage 2: serve via Caddy (auto-HTTPS via Let's Encrypt) ──────────────────
FROM caddy:2-alpine AS runner
WORKDIR /srv

# Caddy config and the built static files
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /srv

EXPOSE 80 443
