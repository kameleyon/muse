import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Link } from 'react-router-dom';

import LandingFooter from '@/components/landing/LandingFooter';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import NavigationMenu from '@/components/dashboard/NavigationMenu';
import ChatPanel from '@/components/chat/ChatPanel';
import ChatToggleButton from '@/components/chat/ChatToggleButton';

import { 
  Home, 
  FolderOpen, 
  FileText, 
  Bookmark, 
  Users, 
  Bell, 
  Settings, 
  LogOut
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface AuthState {
  user: {
    email?: string;
  };
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useSelector<RootState, AuthState>((state: RootState) => state.auth as AuthState);
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
  
  // Sample project stats - in a real app these would be fetched from an API
  const draftCount = 3;
  const publishedCount = 8;
  
  return (
    <div className="bg-[#EDEAE2] min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#1a1918]/80 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <img src="/mmlogolight.png" alt="MagicMuse Logo" className="h-8 w-auto mr-3" />
            <span className="text-3xl font-comfortaa hidden md:inline">magicmuse</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-questrial inline">{userName}</span>
          <div className="w-8 h-8 rounded-full bg-[#ae5630] flex items-center justify-center">
            <span className="text-sm font-medium">{userName[0]?.toUpperCase()}</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <WelcomeSection 
            userName={userName}
            draftCount={draftCount} 
            publishedCount={publishedCount}
          />
          
          {/* Navigation Menu */}
          <NavigationMenu items={navigationItems} />
          
          {/* Page Content */}
          <main>
            {children}
          </main>
        </div>
      </div>
      
      {/* AI Chat Panel and Toggle Button */}
      <ChatToggleButton />
      <ChatPanel />
      
      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default MainLayout;
