#!/usr/bin/env bash
# Exit on error
set -o errexit

# Print each command for debugging
set -o xtrace

# Set environment variables to skip husky installation
export CI=true
export HUSKY=0
export NODE_ENV=production

# Install dependencies properly with legacy peer deps
npm install --include=dev --no-audit --legacy-peer-deps

# Ensure critical dependencies are installed
npm install @tailwindcss/typography --save --no-audit
npm install rollup-plugin-visualizer --save-dev --no-audit

# Use the simplified production config that doesn't require vite-plugin-pwa
echo "Using production Vite config"
cp vite.config.production.ts vite.config.ts

# Build the application with explicit vite path
echo "Building application..."
npx tsc --noEmit && npx vite build

# Output success message
echo "Build completed successfully"
