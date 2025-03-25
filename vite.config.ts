import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
