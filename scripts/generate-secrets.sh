#!/bin/bash

echo "🔐 Generating secure secrets for production..."
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=\"$JWT_SECRET\""

# Generate another random secret for good measure
API_SECRET=$(openssl rand -base64 32)
echo "API_SECRET=\"$API_SECRET\""

echo ""
echo "✅ Copy these values to your .env.production file"
echo ""
echo "To create .env.production:"
echo "  cp .env.production.example .env.production"
echo "  nano .env.production  # paste the values above"
