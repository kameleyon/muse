#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
# Use npx directly to ensure we're using the right vite
npx tsc --noEmit && npx vite build

echo "✅ Build completed successfully!"
