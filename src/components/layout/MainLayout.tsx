import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { completeLogout } from '@/utils/clearCache';

import LandingFooter from '@/components/landing/LandingFooter';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import NavigationMenu from '@/components/dashboard/NavigationMenu';
import { 
  Home, 
  FolderOpen, 
  FileText, 
  Bookmark, 
  Users, 
  Bell, 
  Settings, 
  LogOut,
  MessageSquare,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userName = user?.email?.split('@')[0] || 'User';
  const [isChatOpen, setIsChatOpen] = useState(false);
  
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
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
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
          <button 
            onClick={toggleChat}
            className="p-2 rounded-full hover:bg-[#ae5630]/20 transition-colors"
            aria-label="Open AI Chat"
          >
            <MessageSquare size={20} />
          </button>
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
      
      {/* AI Chat Panel */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="bg-[#1a1918] text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-comfortaa">AI Assistant</h2>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Close AI Chat"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-[#EDEAE2] p-3 rounded-lg max-w-[80%]">
                <p className="text-sm">Hi {userName}, how can I help you today?</p>
              </div>
              {/* Chat messages would go here */}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask me anything..."
                className="w-full border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae5630] focus:border-transparent"
              />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#ae5630] hover:text-[#6d371f] transition-colors"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default MainLayout;
