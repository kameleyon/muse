import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Link } from 'react-router-dom';

import LandingFooter from '@/components/landing/LandingFooter';
import { 
  Home, FolderOpen, FileText, Bookmark, Users, Bell, Settings, LogOut
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userName = user?.email?.split('@')[0] || 'User';
  
  const navigationItems = [
    { path: '/dashboard', label: 'Home', icon: <Home size={20} color="#3d3d3a" /> },
    { path: '/projects', label: 'My Projects', icon: <FolderOpen size={20} color="#3d3d3a" /> },
    { path: '/templates', label: 'Templates', icon: <FileText size={20} color="#3d3d3a" /> },
    { path: '/bookmarks', label: 'Bookmarks', icon: <Bookmark size={20} color="#3d3d3a" /> },
    { path: '/team', label: 'Team', icon: <Users size={20} color="#3d3d3a" /> },
    { path: '/notifications', label: 'Notifications', icon: <Bell size={20} color="#3d3d3a" /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} color="#3d3d3a" /> },
    { path: '/logout', label: 'Logout', icon: <LogOut size={20} color="#3d3d3a" /> }
  ];
  
  return (
    <div className="bg-[#EDEAE2] min-h-screen">
      {/* Top Bar */}
      <div className="bg-[#1a1918]/80 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center">
          <img src="/mmlogolight.png" alt="MagicMuse Logo" className="h-8 w-auto mr-3" />
          <span className="text-3xl font-comfortaa hidden md:inline">magicmuse</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-questrial inline">{userName}</span>
          <div className="w-8 h-8 rounded-full bg-[#ae5630] flex items-center justify-center">
            <span className="text-sm font-medium">{userName[0]?.toUpperCase()}</span>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        
        
        {/* Main Content */}
        <main>
          {children}
        </main>
      </div>
      <LandingFooter />
      {/* Footer 
      <div className="mt-12 py-6 px-6 bg-[#1a1918] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-comfortaa mb-4">MagicMuse</h4>
              <p className="text-sm text-[#bcb7af]">Your AI-powered content creation platform</p>
            </div>
            <div>
              <h4 className="text-lg font-comfortaa mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-[#bcb7af]">
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-comfortaa mb-4">Contact</h4>
              <p className="text-sm text-[#bcb7af]">support@magicmuse.io</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[#3d3d3a] text-center text-sm text-[#bcb7af]">
            © {new Date().getFullYear()} MagicMuse. All rights reserved.
          </div>
        </div>
      </div>*/}
    </div>
  );
};

export default DashboardLayout;
