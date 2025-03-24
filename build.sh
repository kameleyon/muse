#!/bin/bash

# Exit on error
set -e

# Install dependencies
npm install

# Ensure binaries are executable
chmod +x node_modules/.bin/*

# Install vite and typescript globally
npm install -g vite typescript @vitejs/plugin-react

# Run the build
npm run build
