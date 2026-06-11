#!/bin/bash

set -e

echo "🚀 Kahoot STDM - Starting..."

# Ensure database directory exists
mkdir -p /app/data

# Run Prisma migrations (creates tables if they don't exist)
echo "📦 Running database migrations..."
npx prisma migrate deploy

echo "✅ Database ready"
echo "✅ Starting Next.js server..."
exec npm start
