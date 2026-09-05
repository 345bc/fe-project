# ==========================================
# Dockerfile for apps/client
# Build context MUST be monorepo root:
#   docker build -f apps/client/Dockerfile -t fe-client .
# ==========================================

# 1. Prune monorepo for client app
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune client --docker

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
RUN npx turbo run build --filter=client

# 3. Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output & static assets
COPY --from=builder /app/apps/client/public ./apps/client/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/client/server.js"]
