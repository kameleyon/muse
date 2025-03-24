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

  const stats = [
    {
      title: 'Total Projects',
      value: 12,
      change: '+2 from last month',
      icon: <FolderOpen size={20} color="#3d3d3a" />
    },
    {
      title: 'Active Projects',
      value: 3,
      change: 'No change',
      icon: <FileText size={20} color="#3d3d3a" />
    },
    {
      title: 'Completed Projects',
      value: 9,
      change: '+1 this week',
      icon: <FileText size={20} color="#3d3d3a" />
    },
    {
      title: 'Team Members',
      value: 5,
      change: '+2 new members',
      icon: <Users size={20} color="#3d3d3a" />
    }
  ];

  const activities: RecentActivityProps['activities'] = [
    { id: 'act1', type: 'project_created' as ActivityType, title: 'New Project Created', timestamp: new Date().toISOString() },
    { id: 'act2', type: 'template_used' as ActivityType, title: 'Character Template', timestamp: new Date().toISOString() },
    { id: 'act3', type: 'tokens_purchased' as ActivityType, amount: '1000 tokens', timestamp: new Date().toISOString() },
    { id: 'act4', type: 'team_joined' as ActivityType, title: 'Writing Team', timestamp: new Date().toISOString() },
    { id: 'act5', type: 'project_created' as ActivityType, title: 'Sci-Fi Story Outline', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ];

  const tokenUsage = {
    used: 7500,
    total: 10000,
    percentage: 75
  };
  
  // Sample data for charts
  const monthlyContentData = [
    { name: 'Jan', documents: 4, edits: 8 },
    { name: 'Feb', documents: 3, edits: 5 },
    { name: 'Mar', documents: 5, edits: 9 },
    { name: 'Apr', documents: 7, edits: 12 },
    { name: 'May', documents: 2, edits: 4 },
    { name: 'Jun', documents: 6, edits: 10 },
    { name: 'Jul', documents: 8, edits: 14 }
  ];
  
  const weeklyContentData = [
    { name: 'Mon', documents: 2, edits: 4 },
    { name: 'Tue', documents: 3, edits: 6 },
    { name: 'Wed', documents: 1, edits: 2 },
    { name: 'Thu', documents: 4, edits: 8 },
    { name: 'Fri', documents: 3, edits: 5 },
    { name: 'Sat', documents: 0, edits: 1 },
    { name: 'Sun', documents: 1, edits: 2 }
  ];
  
  const contentTypeData = [
    { name: 'Blog Posts', value: 8 },
    { name: 'Social Media', value: 15 },
    { name: 'Email', value: 5 },
    { name: 'Scripts', value: 2 },
    { name: 'Stories', value: 10 }
  ];
  
  const COLORS = ['#ae5630', '#6d371f', '#bcb7af', '#1a1918', '#3d3d3a'];

  const recentProjects: RecentProjectsProps['projects'] = [
    { id: 'proj1', title: 'Fantasy Novel', date: new Date().toISOString(), views: 12, status: 'Draft' },
    { id: 'proj2', title: 'Character Profiles', date: new Date().toISOString(), views: 8, status: 'Published' },
    { id: 'proj3', title: 'World Building', date: new Date().toISOString(), views: 15, status: 'Draft' },
    { id: 'proj4', title: 'Plot Outline', date: new Date().toISOString(), views: 5, status: 'Draft' }
  ];

  const handleViewTypeChange = (type: 'month' | 'week' | 'year') => {
    setViewType(type);
  };

  const getChartData = () => {
    return viewType === 'week' ? weeklyContentData : monthlyContentData;
  };

  return (
    <div className="bg-[#EDEAE2] min-h-screen">
      
      
      {/* Dashboard Content */}
      <div className="px-1 sm:px-5 py-8 w-full sm:max-w-8xl mx-auto">
        {/* Welcome Section */}
        <WelcomeSection 
          userName={userName}
          draftCount={3} 
          publishedCount={8}
        />
        
        {/* Horizontal Navigation Menu */}
        <NavigationMenu items={navigationItems} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Stats and Charts */}
          <div className="col-span-12 lg:col-span-8">
            {/* Recent Files */}
            <Card className="shadow-sm sm:shadow-md hover:shadow-lg transition-shadow mb-6 bg-white border border-neutral-light rounded-2xl">
              <div className="p-4 border-b border-neutral-light/40 ">
                <h2 className="text-xl font-comfortaa text-[#1a1918]">Recent Files</h2>
              </div>
              <div className="p-4">
                <RecentProjects projects={recentProjects} />
              </div>
            </Card>
            {/* Statistics Section */}
            <Card className="mb-6 overflow-hidden shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
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
                <DashboardStats stats={stats} viewType={viewType} onViewTypeChange={handleViewTypeChange} />
                
                {/* Recharts Area Chart */}
                <div className="mt-6 bg-neutral-white rounded-xl p-4 sm:p-6 border border-neutral-light/40">
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
                <div className="mt-6 p-4 bg-white/20 rounded-xl">
                  <h3 className="text-lg font-comfortaa mb-4 text-[#1a1918]">Content Types Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={180} className="sm:h-[250px]">
                      <BarChart
                        data={contentTypeData}
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
                          data={contentTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {contentTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
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
            
            {/* Token Usage */}
            <Card className="mb-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-xl font-comfortaa text-[#1a1918]">Token Usage</h2>
              </div>
              <div className="p-4">
                <TokenUsage {...tokenUsage} />
              </div>
            </Card>
            
            {/* Quick Actions */}
            <Card className="mb-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-xl font-comfortaa text-[#1a1918]">Quick Actions</h2>
              </div>
              <div className="p-4">
                <QuickActions />
              </div>
            </Card>
          </div>
          
          {/* Right Column - Activity and Tips */}
          <div className="col-span-12 lg:col-span-4">
            {/* Recent Activity */}
            <Card className="mb-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-xl font-comfortaa text-[#1a1918]">Recent Activity</h2>
              </div>
              <div className="p-4">
                <RecentActivity activities={activities} />
              </div>
            </Card>
            
            {/* Tips of the Day */}
            <Card className="mb-6 shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-xl font-comfortaa text-[#1a1918]">Tip of the Day</h2>
              </div>
              <div className="p-4">
                <TipOfTheDay />
              </div>
            </Card>
            
            {/* Recent Files */}
            <Card className="shadow-sm sm:shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-xl font-comfortaa text-[#1a1918]">Recent Files</h2>
              </div>
              <div className="p-4">
                <RecentProjects projects={recentProjects} />
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
