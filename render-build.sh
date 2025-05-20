#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
yarn install

# Build the application
echo "Building the application..."
yarn build

echo "Build completed successfully!"
