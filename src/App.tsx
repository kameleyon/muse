import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useThemeStore from './store/themeStore';
import Layout from './components/layout/Layout';
import Loading from './components/common/Loading';
import { AuthModalProvider } from './context/AuthModalContext';
import AuthModalContainer from './components/auth/AuthModalContainer';
import AuthInit from './components/auth/AuthInit';

// Lazy loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Auth = lazy(() => import('./pages/Auth'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const ContentLibrary = lazy(() => import('./pages/ContentLibrary'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { theme } = useThemeStore();

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
            <Route path="/app" element={<Layout />}>
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
      <AuthModalContainer />
    </AuthModalProvider>
  );
}

export default App;