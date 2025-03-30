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

interface Project {
  id: string;
  title: string;
  date: string;
  views: number;
  status: 'Draft' | 'Published';
}

interface RecentProjectsProps {
  projects: Project[];
}
import { 
  Home, FolderOpen, FileText, Bookmark, Users, Bell, Settings, LogOut, 
  BarChart2, Calendar, Clock, TrendingUp
} from 'lucide-react';
// Import sample data
import {
  dashboardStats,
  recentActivities,
  sampleNotifications,
  sampleTokenUsage,
  monthlyContentData as sampleMonthlyContentData, // Alias to avoid naming conflict
  weeklyContentData as sampleWeeklyContentData,   // Alias to avoid naming conflict
  contentTypeData as sampleContentTypeData,       // Alias to avoid naming conflict
  chartColors,
  recentProjectsData
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
      <div className=" py-4 w-full mx-auto">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Stats and Charts */}
          <div className="col-span-12 lg:col-span-8">
            {/* Recent Files */}
            <Card className="shadow-sm sm:shadow-md hover:shadow-lg transition-shadow mb-6 bg-white border border-neutral-light rounded-2xl">
              <div className="p-4 border-b border-neutral-light/40 flex justify-between items-center">
                <h2 className="text-xl font-bold font-heading text-secondary mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Recent Files
                </h2>
                <a href="/files" className="text-primary text-sm hover:underline">
                  View all
                </a>
              </div>
              <div className="p-4">
                <RecentProjects projects={recentProjectsData} /> {/* Use imported data */}
              </div>
            </Card>

            {/* Tips of the Day */}
            <Card className="mb-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="px-4 border-b border-neutral-light/40 bg-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold font-heading text-secondary mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Tip of the Day
                </h2>
              </div>
              <div className="py-2">
                <TipOfTheDay />
              </div>
            </Card>

            {/* Token Usage */}
            <Card className="mb-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow ">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold font-heading text-secondary mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Token Usage
                </h2>
                <Button variant="outline" size="sm">Top Up</Button>
              </div>

              <div className="p-4">
                <TokenUsage {...sampleTokenUsage} /> {/* Use imported data */}
              </div>
            </Card>


            {/* Statistics Section */}
            <Card className="mb-6 overflow-hidden shadow-sm sm:shadow-md hover:shadow-lg transition-shadow bg-[#bcb7af]/30 border border-neutral-light rounded-2xl">
              <div className="border-b border-neutral-light/40 p-4 bg-white/5">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-comfortaa text-[#1a1918] flex items-center">
                    <BarChart2 size={20} className="mr-2 text-[#ae5630]" />
                    Statistics
                  </h2>
                  <div className="flex gap-2">
                    <Button 
                      variant={viewType === 'month' ? 'primary' : 'outline'} 
                      size="sm"
                      onClick={() => handleViewTypeChange('month')}
                      className={viewType === 'month' ? 'text-[#faf9f5]' : ''}
                    >
                      <Calendar size={14} className="mr-1 md:mr-2" />
                      <span className="hidden md:inline">Month</span>
                    </Button>
                    <Button 
                      variant={viewType === 'week' ? 'primary' : 'outline'} 
                      size="sm"
                      onClick={() => handleViewTypeChange('week')}
                      className={viewType === 'week' ? 'text-[#faf9f5]' : ''}
                    >
                      <Clock size={14} className="mr-1 md:mr-2" />
                      <span className="hidden md:inline">Week</span>
                    </Button>
                    <Button 
                      variant={viewType === 'year' ? 'primary' : 'outline'} 
                      size="sm"
                      onClick={() => handleViewTypeChange('year')}
                      className={viewType === 'year' ? 'text-[#faf9f5]' : ''}
                    >
                      <TrendingUp size={14} className="mr-1 md:mr-2" />
                      <span className="hidden md:inline">Year</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className=" max-w-full">
                <DashboardStats stats={dashboardStats} viewType={viewType} onViewTypeChange={handleViewTypeChange} /> {/* Use imported data */}

                {/* Recharts Area Chart */}
                <div className="mt-6 bg-white rounded-xl p-4 sm:p-6 border border-neutral-light/40">
                  <h3 className="text-lg font-comfortaa mb-4 text-[#1a1918]">Content Creation Trends</h3>
                  <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                    <AreaChart
                      data={getChartData()}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ae5630" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ae5630" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorEdits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6d371f" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6d371f" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#bcb7af" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#3d3d3a" />
                      <YAxis stroke="#3d3d3a" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#faf9f5', 
                          borderColor: '#bcb7af',
                          borderRadius: '0.375rem'
                        }} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="documents" 
                        stroke="#ae5630" 
                        fillOpacity={1} 
                        fill="url(#colorDocuments)" 
                        name="Documents"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="edits" 
                        stroke="#6d371f" 
                        fillOpacity={1} 
                        fill="url(#colorEdits)" 
                        name="Edits"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Recharts Bar Chart for Content Types */}
                <div className="mt-6 p-4 bg-white/80 rounded-xl">
                  <h3 className="text-lg font-comfortaa mb-4 text-[#1a1918]">Content Types Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={180} className="sm:h-[250px]">
                      <BarChart
                        data={sampleContentTypeData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#bcb7af" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#3d3d3a" />
                        <YAxis stroke="#3d3d3a" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#faf9f5', 
                            borderColor: '#bcb7af',
                            borderRadius: '0.375rem'
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="value" name="Content Count" fill="#ae5630" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={180} className="sm:h-[250px]">
                      <PieChart>
                        <Pie
                          data={sampleContentTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }: { name: string, percent: number }) => `${(percent * 100).toFixed(0)}%`} // Added types for label function
                        >
                          {sampleContentTypeData.map((entry, index) => ( // Use imported data
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} /> // Use imported colors
                          ))}
                        </Pie>
                        <Tooltip<number, string>
                          contentStyle={{
                            backgroundColor: '#faf9f5',
                            borderColor: '#bcb7af',
                            borderRadius: '0.375rem'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>
            
            
          </div>
          
          {/* Right Column - Activity and Tips */}
          <div className="col-span-12 lg:col-span-4">

            {/* Notifications */}
            <Card className="mb-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow bg-[#bcb7af]/30 border border-neutral-light rounded-2xl">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold font-heading text-secondary mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Notifications
                </h2>
                <span className="bg-neutral-light/80 text-neutral-medium text-xs px-2 py-1 rounded-full">
                  {sampleNotifications.filter(n => !n.read).length} new {/* Use imported data */}
                </span>
              </div>
              <div className="py-4">
                <NotificationsPanel notifications={sampleNotifications}/> {/* Use imported data */}
              </div>
            </Card>

            
            
            {/* Quick Actions */}
            <Card className="mb-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-xl font-bold font-heading text-secondary mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2 text-primary"
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
                  Quick Actions
                </h2>
              </div>
              <div className="p-4">
                <QuickActions />
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="mb-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow bg-[#bcb7af]/30 border border-neutral-light rounded-2xl">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold font-heading text-secondary mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recent Activity
                </h2>
                <a href="/activity" className="text-primary text-sm hover:underline">
                  View all
                </a>
              </div>
              <div className="py-4">
                <RecentActivity activities={recentActivities} /> {/* Use imported data */}
              </div>
            </Card>

            
            
            
            
            
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
