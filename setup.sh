#!/bin/bash

echo "🎯 Setup Kahoot STDM"
echo "===================="
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize database
echo ""
echo "🗂️ Initializing database..."
rm -f prisma/dev.db prisma/dev.db-journal prisma/migrations
node scripts/init-db.js

# Build
echo ""
echo "🔨 Building project..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Ready to start! Use:"
echo "   npm run dev"
echo ""
echo "📋 Login to admin:"
echo "   URL: http://localhost:3000/admin/login"
echo "   Password: admin123"
echo ""
echo "🎮 Test quiz:"
echo "   URL: http://localhost:3000/quiz/SANTE2026"
