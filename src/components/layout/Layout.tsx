import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Toast } from '../ui/Toast';
import ModalManager from '../common/ModalManager';

const Layout: React.FC = () => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { toasts } = useSelector((state: RootState) => state.ui);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-neutral-white dark:bg-secondary overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || !isMobile) && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`fixed inset-y-0 left-0 z-30 w-64 lg:relative lg:z-auto`}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => {
            // Dispatch close sidebar action
          }}
        />
      )}
      
      {/* Modal Manager */}
      <ModalManager />
    </div>
  );
};

export default Layout;
