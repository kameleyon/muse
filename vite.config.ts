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
        secure: false
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
          // Ensure React and related packages are in a single chunk
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/scheduler/') || 
              id.includes('node_modules/react-is/') || 
              id.includes('node_modules/prop-types/') || 
              id.includes('node_modules/object-assign/') ||
              id.includes('node_modules/use-sync-external-store/')) {
            return 'vendor-react';
          }
          
          // UI component libraries
          if (id.includes('node_modules/@radix-ui/') || 
              id.includes('node_modules/@headlessui/') || 
              id.includes('node_modules/lucide-react/')) {
            return 'vendor-ui';
          }
          
          // Chart libraries
          if (id.includes('node_modules/recharts/') || 
              id.includes('node_modules/chart.js/') || 
              id.includes('node_modules/d3/')) {
            return 'vendor-charts';
          }
          
          // Form libraries
          if (id.includes('node_modules/react-hook-form/') || 
              id.includes('node_modules/zod/')) {
            return 'vendor-forms';
          }
          
          // State management libraries
          if (id.includes('node_modules/redux/') || 
              id.includes('node_modules/zustand/') || 
              id.includes('node_modules/react-query/')) {
            return 'vendor-state';
          }
          
          // Auth libraries
          if (id.includes('node_modules/supabase/')) {
            return 'vendor-auth';
          }
          
          // Other node_modules
          if (id.includes('node_modules/')) {
            return 'vendor-others';
          }
          
          // App code by feature
          if (id.includes('/src/features/')) {
            const feature = id.split('/src/features/')[1].split('/')[0];
            return `feature-${feature}`;
          }
          
          // Pages
          if (id.includes('/src/pages/')) {
            return 'pages';
          }
          
          // Components
          if (id.includes('/src/components/')) {
            return 'components';
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
