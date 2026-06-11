# Multi-stage build for optimized production image
FROM node:20-slim AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Install Prisma runtime dependencies and sqlite3
RUN apt-get update && apt-get install -y --no-install-recommends libssl3 ca-certificates sqlite3 && rm -rf /var/lib/apt/lists/*

# Copy runtime dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# Create data directory for SQLite
RUN mkdir -p /app/data

# Regenerate Prisma client in runtime to ensure it's properly initialized
RUN npx prisma generate --skip-engine-check || npx prisma generate

# Copy start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["/app/start.sh"]
