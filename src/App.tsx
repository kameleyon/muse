import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Loading from './components/common/Loading';
import { AuthModalProvider } from './context/AuthModalContext';
import AuthInit from './components/auth/AuthInit';

// Lazy loaded components
const AuthModalContainer = lazy(() => import('./components/auth/AuthModalContainer'));
const Layout = lazy(() => import('./components/layout/Layout'));

// Lazy loaded pages with named chunks for better code splitting
const Landing = lazy(() => import(/* webpackChunkName: "landing" */ './pages/Landing'));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard'));
const Auth = lazy(() => import(/* webpackChunkName: "auth" */ './pages/Auth'));
const ContentGenerator = lazy(() => import(/* webpackChunkName: "content-generator" */ './pages/ContentGenerator'));
const ContentLibrary = lazy(() => import(/* webpackChunkName: "content-library" */ './pages/ContentLibrary'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './pages/Profile'));
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ './pages/NotFound'));

function App() {
  // Set favicon
  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.setAttribute('href', '/favicon.ico');
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = '/favicon.ico';
      document.head.appendChild(newFavicon);
    }
  }, []);

  return (
    <AuthModalProvider>
      {/* Initialize authentication state */}
      <AuthInit />
      
      <AnimatePresence mode="wait">
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Landing page as root */}
            <Route index element={<Landing />} />
            
            {/* Auth pages */}
            <Route path="/auth/*" element={<Auth />} />
            
            {/* App routes - protected by layout */}
            <Route 
              path="/app" 
              element={
                <Suspense fallback={<Loading />}>
                  <Layout />
                </Suspense>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="generator" element={<ContentGenerator />} />
              <Route path="library" element={<ContentLibrary />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      
      {/* Auth modal container - will be available throughout the app */}
      <Suspense fallback={null}>
        <AuthModalContainer />
      </Suspense>
    </AuthModalProvider>
  );
}

export default App;