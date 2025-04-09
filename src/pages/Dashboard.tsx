import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  WelcomeSection,
  NavigationMenu,
  DashboardStats,
  RecentActivity,
  TokenUsage,
  QuickActions,
  TipOfTheDay,
  ChartSection,
  NotificationsPanel,
  RecentProjects
} from '@/components/dashboard';

// Import enhanced dashboard components
import ActivityCenter from '@/components/dashboard/ActivityCenter';
import ProjectInsights from '@/components/dashboard/ProjectInsights';
import ContentPerformance from '@/components/dashboard/ContentPerformance';
import EnhancedQuickActions from '@/components/dashboard/EnhancedQuickActions';
import EnhancedTipOfTheDay from '@/components/dashboard/EnhancedTipOfTheDay';
import EnhancedTokenUsage from '@/components/dashboard/EnhancedTokenUsage';
import { 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
// Import interfaces from component files
import { ActivityType } from '@/components/dashboard/RecentActivity';
// Define the interfaces based on the component props
interface ActivityItem {
  id: string;
  type: ActivityType;
  timestamp: string;
  title?: string;
  amount?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

// Removed local Project and RecentProjectsProps interfaces
import {
  Home, FolderOpen, FileText, Bookmark, Users, Bell, Settings, LogOut, 
  BarChart2, Calendar, Clock, TrendingUp
} from 'lucide-react';
// Import sample data
import {
  dashboardStats,
  recentActivities,
  // Removed sampleNotifications import
  sampleTokenUsage,
  monthlyContentData as sampleMonthlyContentData, // Alias to avoid naming conflict
  weeklyContentData as sampleWeeklyContentData,   // Alias to avoid naming conflict
  contentTypeData as sampleContentTypeData,       // Alias to avoid naming conflict
  chartColors
  // Removed recentProjectsData import
} from '@/data/dashboardSampleData';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userName = user?.email?.split('@')[0] || 'User';
  const [viewType, setViewType] = useState<'month' | 'week' | 'year'>('month');

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

 // Removed inline stats definition - using imported dashboardStats

 // Removed inline activities definition - using imported recentActivities

 // Removed inline notifications definition - using imported sampleNotifications

 // Removed inline tokenUsage definition - using imported sampleTokenUsage

 // Removed inline chart data definitions - using imported sample data and chartColors

 // Removed inline recentProjects definition - using imported recentProjectsData

 const handleViewTypeChange = (type: 'month' | 'week' | 'year') => {
   setViewType(type);
  };

  const getChartData = () => {
    // Use the imported and aliased data
    return viewType === 'week' ? sampleWeeklyContentData : sampleMonthlyContentData;
  };

  return (
    <div className="bg-[#EDEAE2] min-h-screen">
      {/* Dashboard Content */}
      <div className="py-4 w-full mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Stats and Charts */}
          <div className="col-span-12 lg:col-span-8">
            {/* Recent Files */}
            <Card className="shadow-sm sm:shadow-md hover:shadow-lg transition-shadow mb-6 bg-white border border-neutral-light rounded-2xl">
              <div className="p-4 border-b border-neutral-light/40 flex justify-between items-center">
                <h2 className="text-xl font-bold font-heading text-secondary mb-4">
                  <FolderOpen className="h-5 w-5 inline-block mr-2 text-primary" />
                  Recent Files
                </h2>
                <a href="/files" className="text-primary text-sm hover:underline">
                  View all
                </a>
              </div>
              <div className="p-0 text-lg">
                <RecentProjects />
              </div>
            </Card>

            {/* Project Insights */}
            <ProjectInsights stats={dashboardStats} />

            {/* Content Performance */}
            <ContentPerformance 
              monthlyData={sampleMonthlyContentData}
              weeklyData={sampleWeeklyContentData}
              contentTypeData={sampleContentTypeData}
              chartColors={chartColors}
            />
          </div>
          
          {/* Right Column - Activity and Tools */}
          <div className="col-span-12 lg:col-span-4">
            {/* Activity Center */}
            <div className="mb-6">
              <ActivityCenter activities={recentActivities} />
            </div>
            
            {/* Quick Actions */}
            <div className="mb-6">
              <EnhancedQuickActions />
            </div>

            {/* Tip of the Day */}
            <div className="mb-6">
              <EnhancedTipOfTheDay />
            </div>

            {/* Token Usage */}
            <div className="mb-6">
              <EnhancedTokenUsage {...sampleTokenUsage} />
            </div>
          </div>
        </div>
      </div>
      
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

export default Dashboard;
