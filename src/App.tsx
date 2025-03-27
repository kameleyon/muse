import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Loading from './components/common/Loading';
import { AuthModalProvider } from './context/AuthModalContext';
import AuthInit from './components/auth/AuthInit';
import ChatPanel from './components/chat/ChatPanel';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy loaded components
const AuthModalContainer = lazy(() => import('./components/auth/AuthModalContainer'));
const MainLayout = lazy(() => import('./components/layout/MainLayout'));

// Lazy loaded pages with named chunks for better code splitting
const Landing = lazy(() => import(/* webpackChunkName: "landing" */ './pages/Landing'));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard'));
const Auth = lazy(() => import(/* webpackChunkName: "auth" */ './pages/Auth'));
const ContentGenerator = lazy(() => import(/* webpackChunkName: "content-generator" */ './pages/ContentGenerator'));
const ContentLibrary = lazy(() => import(/* webpackChunkName: "content-library" */ './pages/ContentLibrary'));
const ProjectEditor = lazy(() => import(/* webpackChunkName: "project-editor" */ './pages/ProjectEditor')); // Added ProjectEditor
const Chat = lazy(() => import(/* webpackChunkName: "chat" */ './pages/Chat'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './pages/Profile'));
const Settings = lazy(() => import(/* webpackChunkName: "settings" */ './pages/Settings'));
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
            
            {/* Dashboard routes */}
            <Route 
              path="/dashboard" 
              element={
                <Suspense fallback={<Loading />}>
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                </Suspense>
              } 
            />
            
            {/* Content Generator routes */}
            <Route 
              path="/generator" 
              element={
                <Suspense fallback={<Loading />}>
                  <ProtectedRoute>
                    <MainLayout>
                      <ContentGenerator />
                    </MainLayout>
                  </ProtectedRoute>
                </Suspense>
              } 
            />
            
            {/* Content Library routes */}
            <Route 
              path="/projects" 
              element={
                <Suspense fallback={<Loading />}>
                  <ProtectedRoute>
                    <MainLayout>
                      <ContentLibrary />
                    </MainLayout>
                  </ProtectedRoute>
                </Suspense>
              }
            />
            {/* Individual Project Editor route */}
            <Route
              path="/projects/:projectId" // Added dynamic route
              element={
                <Suspense fallback={<Loading />}>
                  <ProtectedRoute>
                    <MainLayout>
                      <ProjectEditor />
                    </MainLayout>
                  </ProtectedRoute>
                </Suspense>
              }
            />
            
            <Route
              path="/library"
              element={<Navigate to="/projects" replace />}
            />

            {/* Chat with MagicMuse */}
            <Route 
              path="/chat" 
              element={
                <Suspense fallback={<Loading />}>
                  <ProtectedRoute>
                    <MainLayout>
                      <Chat />
                    </MainLayout>
                  </ProtectedRoute>
                </Suspense>
              } 
            />
            
            {/* Profile routes */}
            <Route 
              path="/profile/*" 
              element={
                <Suspense fallback={<Loading />}>
                  <ProtectedRoute>
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  </ProtectedRoute>
                </Suspense>
              } 
            />
            
            {/* Settings routes */}
            <Route 
              path="/settings" 
              element={
                <Suspense fallback={<Loading />}>
                  <ProtectedRoute>
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  </ProtectedRoute>
                </Suspense>
              } 
            />
            
            {/* Legacy /app routes - redirect to new routes */}
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
            <Route path="/app/generator" element={<Navigate to="/generator" replace />} />
            <Route path="/app/library" element={<Navigate to="/projects" replace />} />
            <Route path="/app/profile" element={<Navigate to="/profile" replace />} />
            <Route path="/app/profile/*" element={<Navigate to="/profile/*" replace />} />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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
