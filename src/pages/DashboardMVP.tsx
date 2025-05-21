import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/Button';
import { 
  FileText, FolderOpen, Zap, Plus, TrendingUp, 
  Lightbulb, Activity, AlertCircle, CheckCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
//import MainLayout from '@/components/layout/MainLayout';
import '@/styles/dashboard/dashboard.css';

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
    { label: 'Total Projects', value: 12, trend: 'up', icon: <FolderOpen className="stat-icon" /> },
    { label: 'AI Credits Used', value: '2,450', trend: 'stable', icon: <Zap className="stat-icon" /> },
    { label: 'Content Created', value: '34', trend: 'up', icon: <FileText className="stat-icon" /> },
    { label: 'Success Rate', value: '94%', trend: 'up', icon: <TrendingUp className="stat-icon" /> },
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
    
      <div className="w-full">
        {/* Quick Stats */}
        <div className="stats-section">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                    {stat.trend && (
                      <p className={`text-xs mt-1 ${
                        stat.trend === 'up' ? 'text-[#3d3d3a]' :
                        stat.trend === 'down' ? 'text-[#ae5630]' :
                        'text-[#30302e]'
                      }`}>
                        {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'} 
                        {stat.trend === 'up' ? ' Increasing' : stat.trend === 'down' ? ' Decreasing' : ' Stable'}
                      </p>
                    )}
                  </div>
                  <div>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Files */}
            <div className="file-section">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h2 className="h2">Recent Files</h2>
                  <Link to="/book-library" className="text-primary hover:text-[#9d4e2c] text-sm">
                    View all →
                  </Link>
                </div>
              </div>
              <div className="card-content">
                <div className="recent-files">
                  {recentFiles.map((file) => (
                    <div key={file.id} className="file-card">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText size={20} className="text-[#3d3d3a]" />
                        <div className="flex-1">
                          <p className="font-medium text-[#232321]">{file.name}</p>
                          <p className="text-sm text-secondary">
                            {formatDistanceToNow(file.lastModified)} ago • {file.size}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="btn btn-outline w-full">Open</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Create New Content CTA */}
            <div className="quick-actions">
              <div className="action-card">
                <h3 className="h3 mb-2">Ready to create?</h3>
                <p className="mb-4">Start a new book or use our AI to generate content</p>
                <Link to="/new-book">
                  <Button className="btn btn-primary">
                    <Plus size={20} className="mr-2" />
                    Create New Book
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Smart Notifications */}
            <div className="activity-section">
              <div className="card-header">
                <h2 className="h2">Notifications</h2>
              </div>
              <div className="activity-list">
                {smartNotifications.map((notification) => (
                  <div key={notification.id} className="activity-item">
                    <div className="activity-icon">
                      {notification.type === 'success' && <CheckCircle size={16} />}
                      {notification.type === 'warning' && <AlertCircle size={16} />}
                      {notification.type === 'info' && <Activity size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#232321] text-sm">{notification.title}</p>
                      <p className="text-sm text-secondary mt-1">{notification.message}</p>
                      <p className="text-xs text-[#30302e] mt-1">
                        {formatDistanceToNow(notification.timestamp)} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Usage */}
            <div className="token-section">
              <div className="card-header">
                <h2 className="h2">Resource Usage</h2>
              </div>
              <div className="card-content space-y-4">
                {/* AI Credits */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary">AI Credits</span>
                    <span className="text-[#232321] font-medium">
                      {resourceUsage.aiCredits.used.toLocaleString()} / {resourceUsage.aiCredits.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-[#edeae2] rounded-full h-2">
                    <div 
                      className="bg-[#ae5630] h-2 rounded-full"
                      style={{ width: `${(resourceUsage.aiCredits.used / resourceUsage.aiCredits.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Storage */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary">Storage</span>
                    <span className="text-[#232321] font-medium">
                      {resourceUsage.storage.used} GB / {resourceUsage.storage.total} GB
                    </span>
                  </div>
                  <div className="w-full bg-[#edeae2] rounded-full h-2">
                    <div 
                      className="bg-[#9d4e2c] h-2 rounded-full"
                      style={{ width: `${(resourceUsage.storage.used / resourceUsage.storage.total) * 100}%` }}
                    />
                  </div>
                  {resourceUsage.storage.used / resourceUsage.storage.total > 0.8 && (
                    <p className="text-xs text-primary mt-1">Running low on storage</p>
                  )}
                </div>

                {/* Projects */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary">Active Projects</span>
                    <span className="text-[#232321] font-medium">
                      {resourceUsage.projects.active} / {resourceUsage.projects.total}
                    </span>
                  </div>
                  <div className="w-full bg-[#edeae2] rounded-full h-2">
                    <div 
                      className="bg-[#3d3d3a] h-2 rounded-full"
                      style={{ width: `${(resourceUsage.projects.active / resourceUsage.projects.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="flex items-start space-x-3">
                  <div className="text-primary">
                    {dailyTip.icon}
                  </div>
                  <div>
                    <h3 className="h3 mb-1">{dailyTip.title}</h3>
                    <p className="text-sm text-secondary">{dailyTip.content}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default DashboardMVP;