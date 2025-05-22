import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/Button';
import { 
  FileText, FolderOpen, Zap, Plus, TrendingUp, 
  Lightbulb, Activity, AlertCircle, CheckCircle,
  BookOpen, Presentation
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/services/supabase';
import { bookService } from '@/lib/books';
//import MainLayout from '@/components/layout/MainLayout';
import '@/styles/dashboard/dashboard.css';

// Book interface
interface Book {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  status: string;
  created_at: string;
  updated_at: string;
  chapters?: any[];
}

// Project interface
interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  type: string | null;
  project_type: string;
  privacy: string;
  created_at: string;
  updated_at: string;
  status?: string;
}

// RecentItem - combines both book and project data
interface RecentItem {
  id: string;
  name: string;
  type: 'book' | 'project';
  typeName: string;
  lastModified: Date;
  description?: string | null;
}

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
  const [loading, setLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load books and projects data
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        try {
          // Load books
          const userBooks = await bookService.getUserBooks(user.id, 'self_improvement');
          setBooks(userBooks);
          
          // Load projects
          const { data: userProjects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
          
          if (projectsError) {
            throw new Error(projectsError.message);
          }
          
          setProjects(userProjects || []);
          
          // Combine books and projects for recent items
          const bookItems: RecentItem[] = userBooks.map(book => ({
            id: book.id,
            name: book.title || book.topic,
            type: 'book',
            typeName: 'Book',
            lastModified: new Date(book.updated_at),
            description: book.topic
          }));
          
          const projectItems: RecentItem[] = (userProjects || []).map(project => ({
            id: project.id,
            name: project.name,
            type: 'project',
            typeName: project.project_type || project.type || 'Project',
            lastModified: new Date(project.updated_at),
            description: project.description
          }));
          
          // Combine and sort by most recent first
          const combinedItems = [...bookItems, ...projectItems].sort((a, b) => 
            b.lastModified.getTime() - a.lastModified.getTime()
          );
          
          // Take only the 5 most recent items
          setRecentItems(combinedItems.slice(0, 5));
          
        } catch (err: any) {
          console.error('Error loading dashboard data:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [user]);

  // Calculate quick stats based on real data
  const quickStats: QuickStat[] = [
    { 
      label: 'Total Projects', 
      value: projects.length, 
      trend: 'up', 
      icon: <FolderOpen className="stat-icon" /> 
    },
    { 
      label: 'Books Created', 
      value: books.length, 
      trend: 'up', 
      icon: <BookOpen className="stat-icon" /> 
    },
    { 
      label: 'Content Items', 
      value: books.length + projects.length, 
      trend: 'up', 
      icon: <FileText className="stat-icon" /> 
    },
    { 
      label: 'Success Rate', 
      value: '100%', 
      trend: 'up', 
      icon: <TrendingUp className="stat-icon" /> 
    },
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
            {quickStats.map((stat, idx) => (
              <div key={`stat-${stat.label}-${idx}`} className="stat-card">
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
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-neutral-medium">Loading your content...</p>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-red-600 text-sm">Error loading content: {error}</p>
                    </div>
                  ) : recentItems.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-neutral-medium">No content yet. Start by creating a book or project!</p>
                    </div>
                  ) : recentItems.map((item, idx) => (
                    <div key={`item-${item.id}-${idx}`} className="file-card">
                      <div className="flex items-center space-x-3 mb-3">
                        {item.type === 'book' ? (
                          <BookOpen size={20} className="text-[#3d3d3a]" />
                        ) : (
                          <Presentation size={20} className="text-[#3d3d3a]" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-[#232321]">{item.name}</p>
                          <p className="text-sm text-secondary">
                            {formatDistanceToNow(item.lastModified)} ago • {item.typeName}
                          </p>
                          {item.description && (
                            <p className="text-xs text-neutral-medium mt-1 line-clamp-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="btn btn-outline w-full"
                        onClick={() => window.location.href = item.type === 'book' ? `/book/${item.id}/edit` : `/project/${item.id}`}
                      >
                        Open
                      </Button>
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
                {smartNotifications.map((notification, idx) => (
                  <div key={`smart-notification-item-${notification.id}-${idx}`} className="activity-item">
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
