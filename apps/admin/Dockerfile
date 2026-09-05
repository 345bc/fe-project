# ==========================================
# Dockerfile for apps/admin
# Build context MUST be monorepo root:
#   docker build -f apps/admin/Dockerfile -t fe-admin .
# ==========================================

# 1. Prune monorepo for admin app
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune admin --docker

# 2. Build stage
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First copy pruned package definitions for caching
COPY --from=pruner /app/out/json/ .
RUN npm install

# Copy pruned source files
COPY --from=pruner /app/out/full/ .

# Build-time environment variables (e.g., API URLs)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build Next.js app
RUN npx turbo run build --filter=admin

# 3. Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output & static assets
COPY --from=builder /app/apps/admin/public ./apps/admin/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/admin/server.js"]
