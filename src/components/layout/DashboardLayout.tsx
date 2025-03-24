import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Link } from 'react-router-dom';
import LandingFooter from '@/components/landing/LandingFooter';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  return (
    <div className="min-h-screen bg-neutral-white flex flex-col">
      {/* Header - No Sidebar */}
      <header className="bg-white border-b border-neutral-light/40 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-secondary flex items-center justify-center text-neutral-white rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-secondary font-heading">MagicMuse</h1>
            </Link>
          </div>
          
          {/* Navigation Links in Header */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-neutral-medium hover:text-primary px-3 py-2">
              Dashboard
            </Link>
            <Link to="/generator" className="text-neutral-medium hover:text-primary px-3 py-2">
              Content Generator
            </Link>
            <Link to="/projects" className="text-neutral-medium hover:text-primary px-3 py-2">
              Content Library
            </Link>
            <Link to="/profile/settings" className="text-neutral-medium hover:text-primary px-3 py-2">
              Settings
            </Link>
            
            {/* User avatar */}
            <div className="flex items-center ml-4">
              <div className="h-8 w-8 rounded-full bg-primary text-neutral-white flex items-center justify-center">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <span className="ml-2 text-neutral-medium">{user?.email || 'arcamadraconi@gmail.com'}</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content - No sidebar */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Landing Footer instead of regular Footer */}
      <LandingFooter />
    </div>
  );
};

export default DashboardLayout;
