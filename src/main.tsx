import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import { store, persistor } from './store/store';
import Loading from './components/common/Loading';

// Import styles in a single chunk
import './styles/index.css';

// Configure query client with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Disable automatic refetching on window focus
      refetchOnReconnect: true, // Only refetch when reconnecting
      gcTime: 1000 * 60 * 30, // Cache for 30 minutes (formerly cacheTime)
    },
  },
});

// Add performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  import('web-vitals').then(({ onCLS, onFID, onLCP, onTTFB }) => {
    // Function to log metrics
    const logMetric = ({ name, value }: { name: string, value: number }) => {
      console.log(`[Web Vitals] ${name}: ${Math.round(value * 100) / 100}`);
    };
    
    // Register all metrics
    onCLS(logMetric);
    onFID(logMetric);
    onLCP(logMetric);
    onTTFB(logMetric);
  });
}

// Create root outside of render to avoid multiple rerenders
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

// Define NetworkInformation interface for type safety
interface NetworkInformation {
  effectiveType?: string;
  saveData?: boolean;
}

// Add preload hints for critical assets - disabled due to warnings
// Uncomment and fix paths if preloading is needed
/*
const addPreloadHints = () => {
  const preloadLinks = [
    // Use correct font paths that match your project structure
    { href: '/fonts/comfortaa-v40-latin-regular.woff2', as: 'font', type: 'font/woff2' },
    { href: '/fonts/questrial-v18-latin-regular.woff2', as: 'font', type: 'font/woff2' },
  ];
  
  preloadLinks.forEach(({ href, as, type, crossorigin }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    if (as) link.setAttribute('as', as);
    if (type) link.setAttribute('type', type);
    if (crossorigin) link.setAttribute('crossorigin', crossorigin);
    document.head.appendChild(link);
  });
};

// Add preload hints when appropriate
if ('connection' in navigator && 
    ((navigator as any).connection as NetworkInformation).effectiveType !== 'slow-2g' && 
    ((navigator as any).connection as NetworkInformation).saveData !== true) {
  // addPreloadHints(); // Disabled until paths are verified
}
*/

// Wrap app with providers
const AppWithProviders = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={<Loading fullScreen />} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  </React.StrictMode>
);

// Conditionally render with or without StrictMode
const ProductionApp = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={<Loading fullScreen />} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </QueryClientProvider>
);

// Render the app
if (process.env.NODE_ENV === 'production') {
  root.render(<ProductionApp />);
} else {
  root.render(<AppWithProviders />);
}
