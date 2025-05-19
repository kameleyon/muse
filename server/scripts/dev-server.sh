#!/bin/bash

# Kill any process on port 9999
echo "Killing any process on port 9999..."
lsof -ti:9999 | xargs kill -9 2>/dev/null || true

# Start the server
echo "Starting development server..."
npm run dev