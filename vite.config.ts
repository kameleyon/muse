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
      // Ensure React is properly bundled
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Dynamic chunking based on patterns
          if (id.includes('node_modules')) {
            // Ensure all React and React DOM related packages are in the same chunk
            if (id.includes('react') || 
                id.includes('scheduler') || 
                id.includes('react-dom') || 
                id.includes('react-is') || 
                id.includes('prop-types') || 
                id.includes('object-assign') ||
                id.includes('use-sync-external-store')) {
              return 'vendor-react';
            }
            if (id.includes('@radix-ui') || id.includes('@headlessui') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            if (id.includes('recharts') || id.includes('chart.js') || id.includes('d3')) {
              return 'vendor-charts';
            }
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'vendor-forms';
            }
            if (id.includes('redux') || id.includes('zustand') || id.includes('react-query')) {
              return 'vendor-state';
            }
            if (id.includes('supabase')) {
              return 'vendor-auth';
            }
            return 'vendor-others'; // All other node_modules
          }
          
          // Chunk app code by feature
          if (id.includes('/src/features/')) {
            const feature = id.split('/src/features/')[1].split('/')[0];
            return `feature-${feature}`;
          }
          if (id.includes('/src/pages/')) {
            return 'pages';
          }
          if (id.includes('/src/components/')) {
            return 'components';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true, // Split CSS to load only what's needed
    reportCompressedSize: false, // Disable compressed size reporting to speed up build
    assetsInlineLimit: 4096 // Inline assets smaller than 4kb
  }
});
