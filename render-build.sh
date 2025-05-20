#!/usr/bin/env bash
# Exit on error
set -o errexit

# Print each command for debugging
set -o xtrace

# Set environment variables to skip husky installation
export CI=true
export HUSKY=0
export NODE_ENV=production

# Clear node_modules and lockfile to ensure a clean install
echo "Removing node_modules and lockfile for clean install"
rm -rf node_modules package-lock.json

# Do a clean npm install
echo "Installing dependencies..."
npm install --no-audit

# Explicitly ensure vite-plugin-pwa is installed
echo "Explicitly installing vite-plugin-pwa..."
npm install vite-plugin-pwa@0.14.7 --save --no-audit

# Use the configured PWA disabled flag from render.yaml or default to "false" if not set
if [ -z "$VITE_PLUGIN_PWA_DISABLED" ]; then
  echo "VITE_PLUGIN_PWA_DISABLED not set, defaulting to false"
  export VITE_PLUGIN_PWA_DISABLED=false
else
  echo "VITE_PLUGIN_PWA_DISABLED is set to $VITE_PLUGIN_PWA_DISABLED"
fi

# Verify vite-plugin-pwa installation
if [ -d "node_modules/vite-plugin-pwa" ]; then
  echo "vite-plugin-pwa is installed successfully"
else
  echo "WARN: vite-plugin-pwa installation may have failed"
fi

# List installed packages for debugging
echo "Listing installed packages:"
npm list vite-plugin-pwa

# Build the application using the installed version
echo "Building application..."
npx tsc --noEmit && npx vite build

# Output success message
echo "Build completed successfully"
