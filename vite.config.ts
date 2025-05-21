import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// Create a mock PWA plugin to avoid build errors
const mockPwaPlugin = () => ({
  name: 'vite-plugin-pwa-mock',
  // Empty plugin that does nothing
});

// Check if PWA is disabled via environment variable
const isPwaDisabled = process.env.VITE_PLUGIN_PWA_DISABLED === 'true';
if (isPwaDisabled) {
  console.log('PWA functionality is disabled via VITE_PLUGIN_PWA_DISABLED environment variable');
}

// Define environment variables for TypeScript
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_OPENROUTER_API_KEY: string;
  readonly VITE_DEFAULT_CONTENT_MODEL: string;
  readonly VITE_PLUGIN_PWA_DISABLED?: string;
  // Add all missing environment variables from TypeScript errors
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_API_KEY?: string;
  readonly VITE_MARKET_RESEARCH_MODEL?: string;
  readonly VITE_BOOK_STRUCTURE_MODEL?: string;
  readonly VITE_CONTENT_GENERATOR_MODEL?: string;
  readonly VITE_DEFAULT_CHAT_MODEL?: string;
  readonly VITE_DEFAULT_RESEARCH_MODEL?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats-visualizer.html', // Output file path changed to avoid PWA precaching
      open: false, // Don't open automatically, let the user decide
      gzipSize: true, // Show gzip size
      brotliSize: true, // Show brotli size
    }),
    // Only include PWA plugin if not explicitly disabled
    ...(!isPwaDisabled ? [
      mockPwaPlugin()
    ] : []),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-is'],
    // exclude: ['react-scroll'], // Removed react-scroll exclusion
    force: true,
    esbuildOptions: {
      // Ensure proper bundling of JSX
      jsx: 'automatic',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment'
    }
  },
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
    proxy: {
      '/api': {
        target: 'http://localhost:9998',
        changeOrigin: true,
        secure: false,
        // Do not rewrite the path as we need to keep the /api prefix
        // rewrite: (path) => path.replace(/^\/api/, ''),
        onProxyReq: (proxyReq) => {
          console.log('Proxying request:', proxyReq.path);
        },
        onError: (err, req, res) => {
          console.error('Proxy error:', err);
        }
      }
    }
  },
  preview: {
    port: 4000,
    host: true,
    allowedHosts: ['.onrender.com']
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development', // Only enable sourcemaps in development
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production', // Remove console.logs in production
        drop_debugger: true
      }
    },
    commonjsOptions: {
      // Ensure React is properly bundled, and try processing react-scroll here
      include: [/node_modules/, /react-scroll/], 
      transformMixedEsModules: true
    },
    rollupOptions: {
      // Ensure React is loaded before other modules
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        // Enabled manualChunks for better code splitting
        manualChunks: (id) => {
          // React core and UI libraries that depend on React
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/scheduler/') || 
              id.includes('node_modules/react-is/') || 
              id.includes('node_modules/prop-types/') || 
              id.includes('node_modules/object-assign/') ||
              id.includes('node_modules/use-sync-external-store/')) {
            return 'vendor-react-core';
          }
          
          // UI component libraries - split into smaller chunks
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-radix-ui';
          }
          
          if (id.includes('node_modules/@headlessui/')) {
            return 'vendor-headless-ui';
          }
          
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-lucide-icons';
          }
          
          // Chart libraries - split by library
          if (id.includes('node_modules/recharts/')) {
            return 'vendor-recharts';
          }
          
          if (id.includes('node_modules/chart.js/')) {
            return 'vendor-chartjs';
          }
          
          if (id.includes('node_modules/d3/')) {
            return 'vendor-d3';
          }
          
          // Form libraries
          if (id.includes('node_modules/react-hook-form/') || 
              id.includes('node_modules/zod/')) {
            return 'vendor-forms';
          }
          
          // State management libraries - split by library
          if (id.includes('node_modules/redux/') ||
              id.includes('node_modules/@reduxjs/')) {
            return 'vendor-redux';
          }
          
          if (id.includes('node_modules/zustand/')) {
            return 'vendor-zustand';
          }
          
          if (id.includes('node_modules/@tanstack/react-query') ||
              id.includes('node_modules/react-query/')) {
            return 'vendor-react-query';
          }
          
          // Auth libraries
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase';
          }
          
          // Animation libraries
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-framer-motion';
          }
          
          // Document processing - Split docx
          if (id.includes('node_modules/docx/')) {
            return 'vendor-docx';
          }
          if (id.includes('node_modules/jspdf/') ||
              id.includes('node_modules/html2pdf') || // html2pdf often includes jspdf & html2canvas
              id.includes('node_modules/html2canvas/')) {
            return 'vendor-pdf-generation';
          }

          // Markdown processing
          if (id.includes('node_modules/marked/') ||
              id.includes('node_modules/react-markdown/') ||
              id.includes('node_modules/remark-') ||
              id.includes('node_modules/rehype-') ||
              id.includes('node_modules/micromark/') ||
              id.includes('node_modules/mdast-') ||
              id.includes('node_modules/turndown/')) {
            return 'vendor-markdown';
          }
          
          // Date handling
          if (id.includes('node_modules/date-fns/')) {
            return 'vendor-date-fns';
          }
          
          // Rich text editor and dependencies
          if (id.includes('node_modules/@tiptap/') || id.includes('node_modules/prosemirror-')) {
            return 'vendor-tiptap-prosemirror';
          }
          
          // Routing
          if (id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-router-dom/')) {
            return 'vendor-router';
          }
          
          // HTTP client
          if (id.includes('node_modules/axios/')) {
            return 'vendor-axios';
          }
          
          // Utility libraries
          if (id.includes('node_modules/clsx/') ||
              id.includes('node_modules/class-variance-authority/') ||
              id.includes('node_modules/tailwind-merge/')) {
            return 'vendor-styling-utils';
          }

          // Specific large libraries often caught in 'others'
          if (id.includes('node_modules/lodash-es/')) {
            return 'vendor-lodash-es';
          }

          if (id.includes('node_modules/react-scroll/')) {
            return 'vendor-react-scroll';
          }

          // Moment.js (often large and sometimes pulled in transitively)
          if (id.includes('node_modules/moment/')) {
            return 'vendor-moment';
          }

          // Syntax highlighting
          if (id.includes('node_modules/highlight.js/')) {
            return 'vendor-highlightjs';
          }

          // Lodash (non-ES version)
          if (id.includes('node_modules/lodash/')) {
            return 'vendor-lodash';
          }

          // Other node_modules - catch remaining libraries
          if (id.includes('node_modules/')) {
            // Keep this less specific catch-all last
            return 'vendor-others';
          }

          // App code by feature
          if (id.includes('/src/features/')) {
            const feature = id.split('/src/features/')[1].split('/')[0];
            return `feature-${feature}`;
          }
          
          // Split components by type
          if (id.includes('/src/components/')) {
            const componentType = id.split('/src/components/')[1].split('/')[0];
            // Group smaller component categories together
            if (['common', 'icons', 'ui'].includes(componentType)) {
              return 'components-common';
            }
            return `components-${componentType}`;
          }
          
          // Pages - split by page type if possible
          if (id.includes('/src/pages/')) {
            if (id.includes('/src/pages/auth/')) {
              return 'pages-auth';
            }
            return 'pages-main';
          }
          
          // Default chunk
          return undefined;
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Keep warning limit, but chunks should be smaller now
    cssCodeSplit: true, // Split CSS to load only what's needed
    reportCompressedSize: false, // Disable compressed size reporting to speed up build
    assetsInlineLimit: 4096 // Inline assets smaller than 4kb
  }
});
