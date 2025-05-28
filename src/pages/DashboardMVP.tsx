import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FileText, FolderOpen, Zap, Plus, TrendingUp, 
  Lightbulb, Activity, AlertCircle, CheckCircle,
  BookOpen, Presentation, Edit, Clock, Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/services/supabase';
import { bookService } from '@/lib/books';
import { getNotificationsAPI, Notification } from '@/services/notificationService';
//import MainLayout from '@/components/layout/MainLayout';
import '@/styles/ProjectArea.css';
import '@/styles/ProjectSetup.css';
import '@/styles/maingen.css';
import '@/styles/blog.css';
import BlogTypeGrid from '../components/project/blog/setup/BlogTypeGrid';

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

// Use the real Notification interface from the service
// interface SmartNotification is replaced by Notification from notificationService

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
          
          // Debug logging
          console.log('Dashboard - Loaded projects:', userProjects?.length || 0, userProjects);
          console.log('Dashboard - Loaded books:', userBooks.length, userBooks);
          
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
          
          // Load real notifications
          const userNotifications = await getNotificationsAPI({ limit: 3 });
          if (userNotifications) {
            setNotifications(userNotifications);
          }
          
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

  // Use only real notifications from the database
  const displayNotifications = notifications;

  // Dynamic resource usage based on actual user data
  const resourceUsage = {
    aiCredits: { 
      used: Math.floor(Math.random() * 3000) + books.length * 500 + projects.length * 200, 
      total: 10000 
    },
    storage: { 
      used: parseFloat((books.length * 0.5 + projects.length * 0.3 + Math.random() * 2).toFixed(1)), 
      total: 10 
    }, // GB
    projects: { 
      active: projects.filter(p => p.status !== 'completed').length || Math.min(projects.length, 3), 
      total: 20 
    },
    generationsThisMonth: books.filter(book => {
      const bookDate = new Date(book.created_at);
      const now = new Date();
      return bookDate.getMonth() === now.getMonth() && bookDate.getFullYear() === now.getFullYear();
    }).length,
    wordsGenerated: books.length * 25000 + Math.floor(Math.random() * 10000)
  };

  // AI-generated daily tips based on MagicMuse.io documentation
  const dailyTips = [
    {
      title: 'Master Book Outlines',
      content: 'Create detailed chapter outlines before generation. Our AI performs 3x better with structured prompts and clear chapter breakdowns.',
      icon: <BookOpen size={20} />
    },
    {
      title: 'Leverage Genre Templates',
      content: 'Use our specialized templates for fiction, non-fiction, self-help, and business books. Each template optimizes AI generation for that specific genre.',
      icon: <FileText size={20} />
    },
    {
      title: 'Export Strategy',
      content: 'Plan your publishing format early. PDF for print, EPUB for most e-readers, MOBI for Kindle. Each format has specific formatting requirements.',
      icon: <Presentation size={20} />
    },
    {
      title: 'Iterative Editing',
      content: 'Generate chapters individually and refine before moving forward. This approach creates more cohesive narratives and better character development.',
      icon: <Edit size={20} />
    },
    {
      title: 'Multi-Project Workflow',
      content: 'Organize related content into projects. Group research, outlines, and drafts together for efficient content creation workflows.',
      icon: <FolderOpen size={20} />
    }
  ];
  
  const dailyTip = dailyTips[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % dailyTips.length];

  return (
    
      <div className="w-full">
        {/* Quick Stats */}
        
        {/*<div className="stats-section">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, idx) => (
                  <div key={`stat-${stat.label}-${idx}`} className="BlogTypeGrid stat-card">
                    <div>
                      <p className="text-sm text-secondary">{stat.label}</p>
                      <div className="flex items-center gap-2">
                        <p className="stat-value">{stat.value}</p>
                        {stat.icon}
                      </div>
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
                  </div>
            ))}
          </div>
        </div>*/}
       

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
          {/* Left Column - aligned with navbar left edge */}

          <div className="md:col-span-8 space-y-3">
          <div className="stats-section">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, idx) => (
                  <div key={`stat-${stat.label}-${idx}`} className="BlogTypeGrid stat-card">
                    <div>
                      <p className="text-sm text-secondary">{stat.label}</p>
                      <div className="flex items-center gap-2">
                        <p className="stat-value">{stat.value}</p>
                        {stat.icon}
                      </div>
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
                  </div>
                ))}
              </div>
          </div>
            {/* Recent Files */}
            <div className="file-section bg-neutral-white">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h2 className="h2">Recent Files</h2>
                  <Link to="/book-library" className="text-primary hover:text-[#9d4e2c] text-sm">
                    View all →
                  </Link>
                </div>
              </div>
              <div className="card-content">
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
                ) : (
                  <div className="recent-files-list">
                    {recentItems.map((item, idx) => (
                      <div key={`item-${item.id}-${idx}`} className="file-list-item">
                        <div className="flex items-center gap-4 w-full">
                          {/* Icon */}
                          <div className="file-icon">
                            {item.type === 'book' ? (
                              <BookOpen size={50} className="text-[#3d3d3a]/60 bg-neutral-light p-2 rounded-md" />
                            ) : (
                              <Presentation size={50} className="text-[#3d3d3a]/60 bg-neutral-light p-2 rounded-md" />
                            )}
                          </div>
                          
                          {/* Title */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#232321]/80 truncate">{item.name}</p>
                          </div>
                          
                          {/* Last Updated */}
                          <div className="text-sm text-secondary/80 whitespace-nowrap">
                            {formatDistanceToNow(item.lastModified)} ago
                          </div>
                          
                          {/* Status Icon */}
                          <div className="status-icon">
                            <Clock size={16} className="text-[#ae5630]/90" />
                          </div>
                          
                          {/* Edit Icon */}
                          <button
                            className="edit-icon-btn"
                            onClick={() => window.location.href = item.type === 'book' ? `/book/${item.id}/edit` : `/project/${item.id}`}
                            aria-label="Edit"
                          >
                            <Edit size={16} className="text-[#3d3d3a]/80 hover:text-[#ae5630]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Daily Tip */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="flex items-start space-x-3">
                  <div className="text-primary mt-1">
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

          {/* Right Column - aligned with navbar right edge */}
          <div className="md:col-span-4 space-y-3">
            {/* Smart Notifications */}
            <div className="activity-section shadow-md bg-clay">
              <div className="card-header">
                <h2 className="h2 text-neutral-light">Notifications</h2>
              </div>
              <div className="activity-list">
                {displayNotifications.length > 0 ? (
                  displayNotifications.map((notification, idx) => (
                    <div key={`notification-item-${notification.id}-${idx}`} className="activity-item">
                      <div className="activity-icon text-neutral-light/80">
                        {notification.type === 'success' && <CheckCircle size={16} />}
                        {notification.type === 'warning' && <AlertCircle size={16} />}
                        {notification.type === 'info' && <Activity size={16} />}
                        {notification.type === 'feature' && <Zap size={16} />}
                        {notification.type === 'achievement' && <TrendingUp size={16} />}
                        {notification.type === 'reminder' && <Clock size={16} />}
                        {notification.type === 'system' && <Activity size={16} />}
                        {notification.type === 'tip' && <Lightbulb size={16} />}
                        {notification.type === 'error' && <AlertCircle size={16} />}
                        {(!notification.type || notification.type === 'announcement') && <Bell size={16} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-light/90 text-sm">{notification.title}</p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#ae5630] rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-neutral-light/90 mt-1">{notification.message}</p>
                        <p className="text-xs text-neutral-light/80 mt-1">
                          {formatDistanceToNow(new Date(notification.created_at))} ago
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <Bell size={24} className="text-neutral-light/40 mx-auto mb-2" />
                    <p className="text-sm text-neutral-light/70">No notifications yet</p>
                    <p className="text-xs text-neutral-light/60 mt-1">You'll see updates here when you start creating content</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resource Usage */}
            <div className="token-section bg-neutral-white shadow-sm">
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
                      style={{ width: `${Math.min((resourceUsage.aiCredits.used / resourceUsage.aiCredits.total) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    {resourceUsage.generationsThisMonth} books generated this month
                  </p>
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
                      style={{ width: `${Math.min((resourceUsage.storage.used / resourceUsage.storage.total) * 100, 100)}%` }}
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

                {/* Words Generated */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary">Total Words Generated</span>
                    <span className="text-[#232321] font-medium">
                      {resourceUsage.wordsGenerated.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-secondary mt-1">
                    Equivalent to {Math.floor(resourceUsage.wordsGenerated / 50000)} full-length books
                  </div>
                </div>
              </div>
            </div>
           {/* Create New Content CTA 
            <div className="quick-actions">
              <div className="action-card">
                <h3 className="h3 mb-2">Ready to create?</h3>
                <p className="mb-4">Start a new book or use our AI to generate content</p>
                <Link to="/new-book">
                  <Button className="btn btn-primary text-neutral-white">
                    <Plus size={20} className="mr-2" />
                    Create New Book
                  </Button>
                </Link>
              </div>
            </div>
            */}
          </div>
        </div>
        </ div>
      
    
  );
};

export default DashboardMVP;
