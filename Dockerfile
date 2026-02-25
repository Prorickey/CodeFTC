# ---- deps ----
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- builder ----
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate
RUN bun run build

# ---- runner ----
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Standalone Next.js output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Install only production dependencies (needed for prisma CLI + adapter at runtime)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Prisma: config, schema, migrations, generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Lesson content (read at runtime by server)
COPY --from=builder /app/content ./content

# Entrypoint
COPY docker/nextjs/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
