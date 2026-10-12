# -------------------------------------------------------------
# Multi-stage Dockerfile for LexiScan AI
# Optimized for Render Web Services & Containerized Environments
# -------------------------------------------------------------

# Stage 1: Build the client assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies required for vite build)
RUN npm install

# Copy application source
COPY . .

# Build Vite client production bundle to dist/
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000

# Copy package manifests and install only runtime dependencies
COPY package*.json ./
RUN npm install --omit=dev && npm install tsx

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy server code
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/server.ts ./server.ts

# Render routes traffic to PORT (default 10000)
EXPOSE 10000

# Start server using tsx
CMD ["npx", "tsx", "server.ts"]
