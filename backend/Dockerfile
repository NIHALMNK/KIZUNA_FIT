# ==========================================
# KizunaFit Backend - Multi-Stage Dockerfile
# ==========================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace manifests and tsconfigs
COPY package.json package-lock.json tsconfig.base.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies for compilation (ignore husky prepare in container)
RUN npm ci --ignore-scripts

# Copy backend source code and build assets
COPY backend/tsconfig.json ./backend/
COPY backend/src ./backend/src
COPY backend/scripts ./backend/scripts

# Compile TypeScript and copy Handlebars email templates
RUN npm run build -w backend

# ==========================================
# Stage 2: Production Runtime
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root application user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy workspace manifests for production-only dependencies
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install production dependencies only and clean workspace artifacts
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force && \
    rm -rf frontend

# Copy compiled backend artifacts from builder
COPY --from=builder --chown=nodejs:nodejs /app/backend/dist ./backend/dist

# Switch to non-root user
USER nodejs

WORKDIR /app/backend

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/v1/health || exit 1

CMD ["node", "dist/bootstrap/http/server.js"]
