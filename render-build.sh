#!/usr/bin/env bash
# Exit on error
set -e

# Set environment variables to skip husky installation
export CI=true
export HUSKY=0

# Install dependencies properly
npm install --include=dev --no-audit

# Ensure tailwind typography plugin is installed
npm install @tailwindcss/typography --save

# Build the application
npm run build
