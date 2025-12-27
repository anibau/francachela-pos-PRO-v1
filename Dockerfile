# =========================
# BUILDER
# =========================
FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig*.json ./

# 👉 Aquí NO se omite dev
RUN npm ci

COPY src ./src

RUN npm run build

# =========================
# RUNNER (producción)
# =========================
FROM node:18-alpine AS runner

RUN apk add --no-cache dumb-init

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

WORKDIR /app

# Copiamos solo lo necesario
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

RUN mkdir -p uploads sessions logs \
 && chown -R nestjs:nodejs uploads sessions logs

USER nestjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["dumb-init", "node", "dist/main.js"]


