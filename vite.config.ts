import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Define environment variables for TypeScript
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_OPENROUTER_API_KEY: string;
  readonly VITE_DEFAULT_CONTENT_MODEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Custom plugin to handle raw query parameter security
const secureRawQueryPlugin = () => {
  return {
    name: 'secure-raw-query',
    configureServer(server) {
      // Add middleware to enforce deny restrictions for raw query parameter
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        
        // Check if using the ?raw query parameter
        if (url.searchParams.has('raw')) {
          const requestPath = url.pathname;
          
          // Apply deny patterns to raw requests
          const denyPatterns = [
            '.env', '.env.*', 
            '**/.git/**', '**/.github/**', '**/node_modules/**',
            '**/server/**', '**/docs/**', '**/.husky/**'
          ];
          
          // Check if the path matches any deny pattern
          const isDenied = denyPatterns.some(pattern => {
            if (pattern.includes('*')) {
              // Simple wildcard check
              const regexPattern = pattern
                .replace(/\./g, '\\.')
                .replace(/\*\*/g, '.*')
                .replace(/\*/g, '[^/]*');
              return new RegExp(`^${regexPattern}$`).test(requestPath);
            }
            return requestPath.includes(pattern);
          });
          
          if (isDenied) {
            res.statusCode = 403;
            res.end('Access Denied: This file cannot be accessed with raw parameter');
            return;
          }
        }
        
        next();
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    secureRawQueryPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },
  server: {
    port: 3000,
    hmr: {
      overlay: true
    },
    fs: {
      // Explicitly allow only specific directories
      allow: ['./src', './public'],
      
      // Strictly deny access to sensitive directories and files
      // Use case-insensitive patterns to prevent Windows bypass
      deny: [
        '**/.env', '**/.env.*', 
        '**/.git/**', '**/.github/**', 
        '**/node_modules/**',
        '**/server/**', 
        '**/docs/**', 
        '**/.husky/**'
      ],
      // Set strict mode to be more secure
      strict: true
    },
    cors: {
      // Restrict CORS to only allowed origins in development
      origin: (origin, callback) => {
        // In development, only allow localhost and the application origin
        const allowedOrigins = [
          'http://localhost:3000', 
          'http://127.0.0.1:3000'
        ];
        
        // Check if the origin is allowed or if it's a same-site request (origin is null/undefined)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('CORS policy violation'), false);
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    }
  },
  preview: {
    port: 4000,
    host: true,
    allowedHosts: ['.onrender.com']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          'vendor-ui': [
            '@headlessui/react', 
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-icons',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'lucide-react'
          ],
          'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-auth': ['@supabase/supabase-js'],
          'vendor-state': ['@reduxjs/toolkit', 'react-redux', 'zustand', '@tanstack/react-query'],
          'vendor-utils': ['date-fns', 'uuid', 'axios', 'marked']
        }
      }
    },
    // Increase the warning limit for now (while also implementing chunking)
    chunkSizeWarningLimit: 1000
  }
});
