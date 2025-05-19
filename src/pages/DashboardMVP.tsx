import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FileText, FolderOpen, Zap, Plus, TrendingUp, 
  Lightbulb, Activity, AlertCircle, CheckCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { dashboardStats } from '@/data/dashboardSampleData';

// Smart Notification type
interface SmartNotification {
  id: string;
  priority: 'high' | 'medium' | 'low';
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Quick Stat type
interface QuickStat {
  label: string;
  value: number | string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

const DashboardMVP: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Sample data for MVP
  const recentFiles = [
    { id: '1', name: 'Marketing Strategy Q1', type: 'document', lastModified: new Date(), size: '2.3 MB' },
    { id: '2', name: 'Product Launch Plan', type: 'pitch', lastModified: new Date(Date.now() - 86400000), size: '1.5 MB' },
    { id: '3', name: 'User Research Report', type: 'document', lastModified: new Date(Date.now() - 172800000), size: '4.1 MB' },
    { id: '4', name: 'Blog Post: AI Trends', type: 'blog', lastModified: new Date(Date.now() - 259200000), size: '856 KB' },
    { id: '5', name: 'Sales Presentation', type: 'pitch', lastModified: new Date(Date.now() - 345600000), size: '3.2 MB' },
  ];

  const quickStats: QuickStat[] = [
    { label: 'Total Projects', value: 12, trend: 'up', icon: <FolderOpen size={20} />, color: 'text-[#ae5630]' }, // terracotta
    { label: 'AI Credits Used', value: '2,450', trend: 'stable', icon: <Zap size={20} />, color: 'text-[#9d4e2c]' }, // terracotta-light
    { label: 'Content Created', value: '34', trend: 'up', icon: <FileText size={20} />, color: 'text-[#3d3d3a]' }, // olive
    { label: 'Success Rate', value: '94%', trend: 'up', icon: <TrendingUp size={20} />, color: 'text-[#ae5630]' }, // terracotta
  ];

  const smartNotifications: SmartNotification[] = [
    {
      id: '1',
      priority: 'high',
      type: 'success',
      title: 'AI Credits Refilled',
      message: 'Your monthly AI credits have been reset to 10,000',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      priority: 'medium',
      type: 'warning',
      title: 'Storage Almost Full',
      message: 'You\'ve used 85% of your storage. Consider upgrading.',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: '3',
      priority: 'low',
      type: 'info',
      title: 'New Feature Available',
      message: 'Try our new pitch deck builder for stunning presentations',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
  ];

  const resourceUsage = {
    aiCredits: { used: 2450, total: 10000 },
    storage: { used: 8.5, total: 10 }, // GB
    projects: { active: 3, total: 20 },
  };

  const dailyTip = {
    title: 'Pro Tip: Use Templates',
    content: 'Start with our pre-built templates to create content 3x faster. Find them in the Create New dropdown.',
    icon: <Lightbulb size={16} />,
  };

  return (
    <div className="bg-[#EDEAE2] w-full">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#3d3d3a]">{stat.label}</p>
                <p className="text-2xl font-bold text-[#232321] mt-1">{stat.value}</p>
                {stat.trend && (
                  <p className={`text-xs mt-1 ${
                    stat.trend === 'up' ? 'text-[#3d3d3a]' : // olive for positive
                    stat.trend === 'down' ? 'text-[#ae5630]' : // terracotta for negative
                    'text-[#30302e]' // charcoal for neutral
                  }`}>
                    {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'} 
                    {stat.trend === 'up' ? ' Increasing' : stat.trend === 'down' ? ' Decreasing' : ' Stable'}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg bg-[#faf9f5] ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Files */}
          <Card>
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#232321]">Recent Files</h2>
                <Link to="/projects" className="text-[#ae5630] hover:text-[#9d4e2c] text-sm">
                  View all →
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          Modified {formatDistanceToNow(file.lastModified)} ago • {file.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Open</Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Create New Content CTA */}
          <Card className="bg-gradient-to-r from-[#ae5630] to-[#9d4e2c] text-white">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Ready to create?</h3>
              <p className="mb-4">Start a new project or use our AI to generate content</p>
              <Link to="/generator">
                <Button variant="secondary" size="lg" className="bg-[#faf9f5] text-[#ae5630] hover:bg-[#edeae2]">
                  <Plus size={20} className="mr-2" />
                  Create New Content
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Smart Notifications */}
          <Card>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#232321]">Notifications</h2>
            </div>
            <div className="p-4 space-y-3">
              {smartNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    notification.read ? 'bg-[#faf9f5]' : 'bg-[#faf9f5]' // cream for both states
                  } hover:bg-[#edeae2]`}
                >
                  <div className="flex items-start space-x-3">
                    {notification.type === 'success' && <CheckCircle size={16} className="text-[#3d3d3a] mt-0.5" />}
                    {notification.type === 'warning' && <AlertCircle size={16} className="text-[#9d4e2c] mt-0.5" />}
                    {notification.type === 'info' && <Activity size={16} className="text-[#ae5630] mt-0.5" />}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(notification.timestamp)} ago
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Resource Usage */}
          <Card>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#232321]">Resource Usage</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* AI Credits */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">AI Credits</span>
                  <span className="text-gray-900 font-medium">
                    {resourceUsage.aiCredits.used.toLocaleString()} / {resourceUsage.aiCredits.total.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#ae5630] h-2 rounded-full"
                    style={{ width: `${(resourceUsage.aiCredits.used / resourceUsage.aiCredits.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Storage */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Storage</span>
                  <span className="text-gray-900 font-medium">
                    {resourceUsage.storage.used} GB / {resourceUsage.storage.total} GB
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#9d4e2c] h-2 rounded-full"
                    style={{ width: `${(resourceUsage.storage.used / resourceUsage.storage.total) * 100}%` }}
                  />
                </div>
                {resourceUsage.storage.used / resourceUsage.storage.total > 0.8 && (
                  <p className="text-xs text-[#ae5630] mt-1">Running low on storage</p>
                )}
              </div>

              {/* Projects */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="text-gray-900 font-medium">
                    {resourceUsage.projects.active} / {resourceUsage.projects.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#3d3d3a] h-2 rounded-full"
                    style={{ width: `${(resourceUsage.projects.active / resourceUsage.projects.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Daily Tip */}
          <Card className="bg-gradient-to-br from-[#faf9f5] to-[#edeae2] border-[#ae5630]">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#faf9f5] rounded-lg">
                  {dailyTip.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{dailyTip.title}</h3>
                  <p className="text-sm text-gray-700">{dailyTip.content}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardMVP;