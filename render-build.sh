#!/usr/bin/env bash
# Exit on error
set -e

# Install dependencies properly
npm ci --include=dev --no-audit

# Skip husky install in CI environment
export HUSKY=0

# Build the application
npm run build
