import { useEffect, lazy, Suspense, useState, useCallback, memo } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { setNavigate } from './utils/navigation';
import { AnimatePresence } from 'framer-motion';
import Loading from './components/common/Loading';
import { AuthModalProvider } from './context/AuthModalContext';
import AuthInit from './components/auth/AuthInit';
import ChatPanel from './components/chat/ChatPanel';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Custom route config for better organization and performance
const routeConfig = [
  {
    path: '/',
    element: lazy(() => import('./pages/Landing')),
    auth: false
  },
  {
    path: '/auth/*',
    element: lazy(() => import('./pages/Auth')),
    auth: false
  },
  {
    path: '/dashboard',
    element: lazy(() => import('./pages/Dashboard')),
    auth: true
  },
  {
    path: '/generator',
    element: lazy(() => import('./pages/ContentGenerator')),
    auth: true
  },
  {
    path: '/projects',
    element: lazy(() => import('./pages/ContentLibrary')),
    auth: true
  },
  {
    path: '/chat',
    element: lazy(() => import('./pages/Chat')),
    auth: true
  },
  {
    path: '/profile/*',
    element: lazy(() => import('./pages/Profile')),
    auth: true
  },
  {
    path: '/settings',
    element: lazy(() => import('./pages/Settings')),
    auth: true
  },
  {
    path: '/project/:projectId/setup',
    element: lazy(() => import('./pages/ProjectSetup')),
    auth: true
  },
  {
    path: '/pdf-export',
    element: lazy(() => import('./pages/PdfExport')),
    auth: false
  },
  {
    path: '/pdf-export-test',
    element: lazy(() => import('./pages/PdfExportTest')),
    auth: false
  },
  {
    path: '/chart-test',
    element: lazy(() => import('./pages/ChartTest')),
    auth: false
  },
  {
    path: '/api', // New route for API docs
    element: lazy(() => import('./pages/ApiDocs')),
    auth: false
  },
  {
    path: '/notifications', // New route for Notifications page
    element: lazy(() => import('./pages/NotificationsPage')),
    auth: true // Requires authentication
  }
];

// Redirects for legacy routes
const redirects = [
  { from: '/library', to: '/projects' },
  { from: '/app', to: '/dashboard' },
  { from: '/app/generator', to: '/generator' },
  { from: '/app/library', to: '/projects' },
  { from: '/app/profile', to: '/profile' },
  { from: '/app/profile/*', to: '/profile/*' }
];

// Lazy loaded components with prefetching
const AuthModalContainer = lazy(() => import('./components/auth/AuthModalContainer'));
const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Prefetch important routes when idle
const prefetchImportantRoutes = () => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      import('./pages/Dashboard');
      import('./pages/ContentGenerator');
      import('./components/layout/MainLayout');
    });
  }
};

// Memoized layout component to prevent unnecessary re-renders
const MemoizedLayout = memo(({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
));

// Performance-optimized route component
const RouteWithSuspense = memo(({ 
  Component, 
  requireAuth = false 
}: { 
  Component: React.LazyExoticComponent<React.ComponentType<any>>, 
  requireAuth?: boolean 
}) => {
  const RouteContent = () => {
    const [isReady, setIsReady] = useState(false);
    
    // Use an effect to simulate proper loading state
    useEffect(() => {
      let mounted = true;
      
      // Small timeout to avoid flickering for fast loads
      const timer = setTimeout(() => {
        if (mounted) setIsReady(true);
      }, 50);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }, []);
    
    return (
      <Suspense fallback={<Loading />}>
        {!isReady ? <Loading /> : (
          requireAuth ? (
            <ProtectedRoute>
              <MemoizedLayout>
                <Component />
              </MemoizedLayout>
            </ProtectedRoute>
          ) : (
            <Component />
          )
        )}
      </Suspense>
    );
  };
  
  return <RouteContent />;
});

function App() {
  // Initialize navigation utility
  const navigate = useNavigate();
  
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  
  // Optimize favicon loading
  useEffect(() => {
    if (!document.querySelector("link[rel='icon']")) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = '/favicon.ico';
      document.head.appendChild(link);
    }
    
    // Prefetch important routes
    prefetchImportantRoutes();
  }, []);

  // Memoize the routes to prevent unnecessary re-renders
  const renderRoutes = useCallback(() => (
    <Routes>
      {/* Main routes from config */}
      {routeConfig.map(({ path, element: Component, auth }) => (
        <Route 
          key={path} 
          path={path} 
          element={<RouteWithSuspense Component={Component} requireAuth={auth} />} 
        />
      ))}
      
      {/* Redirects */}
      {redirects.map(({ from, to }) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}
      
      {/* Catch all */}
      <Route path="*" element={
        <Suspense fallback={<Loading />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  ), []);

  return (
    <AuthModalProvider>
      {/* Initialize authentication state */}
      <AuthInit />
      
      <AnimatePresence mode="wait">
        {renderRoutes()}
      </AnimatePresence>
      
      {/* Auth modal container - will be available throughout the app */}
      <Suspense fallback={null}>
        <AuthModalContainer />
      </Suspense>
      
      {/* Chat Panel - available throughout the app */}
      <ChatPanel />
    </AuthModalProvider>
  );
}

export default App;
