import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Header from './Header';
import LandingFooter from '@/components/landing/LandingFooter';
import { Toast } from '../ui/Toast';
import ModalManager from '../common/ModalManager';

const Layout: React.FC = () => {
  const { toasts } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex flex-col h-screen bg-neutral-white overflow-hidden">
      {/* Main Content - No Sidebar */}
      <Header />
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
      <LandingFooter />

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
          />
        ))}
      </div>
      
      {/* Modal Manager */}
      <ModalManager />
    </div>
  );
};

export default Layout;
