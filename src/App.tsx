import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { setNavigate } from './utils/navigation';
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
const Chat = lazy(() => import(/* webpackChunkName: "chat" */ './pages/Chat'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './pages/Profile'));
const Settings = lazy(() => import(/* webpackChunkName: "settings" */ './pages/Settings'));
// Removed NewProject import
const ProjectSetup = lazy(() => import(/* webpackChunkName: "project-setup" */ './pages/ProjectSetup')); // Added ProjectSetup page
const PdfExport = lazy(() => import(/* webpackChunkName: "pdf-export" */ './pages/PdfExport')); // Added PdfExport page
const PdfExportTest = lazy(() => import(/* webpackChunkName: "pdf-export-test" */ './pages/PdfExportTest')); // Added PdfExportTest page
const ChartTest = lazy(() => import(/* webpackChunkName: "chart-test" */ './pages/ChartTest')); // Added ChartTest page
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ './pages/NotFound'));

function App() {
  // Initialize navigation utility
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  
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

            {/* Project Setup Route */}
            <Route
              path="/project/:projectId/setup"
              element={
                <Suspense fallback={<Loading />}>
                  <ProtectedRoute>
                    <MainLayout>
                      <ProjectSetup />
                    </MainLayout>
                  </ProtectedRoute>
                </Suspense>
              }
            />
            
            {/* PDF Export Routes */}
            <Route
              path="/pdf-export"
              element={
                <Suspense fallback={<Loading />}>
                  <PdfExport />
                </Suspense>
              }
            />
            <Route
              path="/pdf-export-test"
              element={
                <Suspense fallback={<Loading />}>
                  <PdfExportTest />
                </Suspense>
              }
            />
            
            {/* Chart Test Route - for development/testing */}
            <Route
              path="/chart-test"
              element={
                <Suspense fallback={<Loading />}>
                  <ChartTest />
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
