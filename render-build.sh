#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Install platform-specific esbuild package for the current platform
echo "Installing platform-specific esbuild package..."
if [[ "$RENDER" == "true" ]]; then
  # On Render (Linux)
  npm install @esbuild/linux-x64
else
  # Detect platform and install appropriate package
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    npm install @esbuild/darwin-x64 @esbuild/darwin-arm64
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    npm install @esbuild/linux-x64
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    npm install @esbuild/win32-x64
  fi
fi

# Build the application
echo "Building the application..."
npm run build

echo "Build completed successfully!"
