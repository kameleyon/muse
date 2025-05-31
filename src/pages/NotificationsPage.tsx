import React, { useState, useEffect, useMemo } from 'react';
import { getNotificationsAPI, Notification, createNotificationAPI } from '@/services/notificationService';
import { format, parseISO, isSameDay, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Settings2, BellRing, Info, FileText, Zap, Star, Calendar, ChevronRight, BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import { supabase } from '@/services/supabase';

// Define filter types
type FilterType = 'All' | 'Product Updates' | 'New Features' | 'Tips & Guides' | 'Announcements';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  useEffect(() => {
    const fetchAllNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Create sample notification if none exist
        await createSampleNotification();
        
        const fetchedNotifications = await getNotificationsAPI();
        if (fetchedNotifications) {
          setNotifications(fetchedNotifications);
        } else {
          setError("Failed to load notifications.");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotifications();
  }, []);

  const createSampleNotification = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Check if we already have this notification
      const existing = await getNotificationsAPI({ limit: 1 });
      if (existing && existing.length > 0) return;

      // Create a sample Midjourney-style notification
      await createNotificationAPI(
        session.user.id,
        "Introducing AI-Powered Book Generation 2.0",
        "We've revolutionized how books are created with our latest AI models. Experience 40% faster generation, enhanced character development, and seamless plot structuring. Your stories just got more compelling.\n\nKey improvements:\n• Advanced narrative AI with improved dialogue generation\n• Smart chapter transitions that maintain story flow\n• Enhanced genre-specific writing styles\n• Real-time collaboration features for co-authors\n\nReady to create your next bestseller? Start a new book project today and experience the future of AI-assisted writing.",
        "product-update",
        "/new-book"
      );
    } catch (error) {
      console.error("Error creating sample notification:", error);
    }
  };

  // Filter notifications based on active filter
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'All') {
      return notifications;
    }
    
    return notifications.filter(notification => {
      const type = notification.type?.toLowerCase();
      switch (activeFilter) {
        case 'Product Updates':
          return type?.includes('product') || type?.includes('update') || type?.includes('system');
        case 'New Features':
          return type?.includes('feature') || type?.includes('new');
        case 'Tips & Guides':
          return type?.includes('tip') || type?.includes('guide') || type?.includes('help');
        case 'Announcements':
          return type?.includes('announcement') || type?.includes('news');
        default:
          return true;
      }
    });
  }, [notifications, activeFilter]);

  const getNotificationIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'product-update':
      case 'system': 
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'feature':
      case 'new': 
        return <Sparkles className="h-5 w-5 text-purple-500" />;
      case 'tip':
      case 'guide': 
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'announcement':
      case 'news': 
        return <BellRing className="h-5 w-5 text-orange-500" />;
      case 'achievement': 
        return <Star className="h-5 w-5 text-yellow-500" />;
      default: 
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'product-update':
      case 'system': 
        return 'Product Update';
      case 'feature':
      case 'new': 
        return 'New Feature';
      case 'tip':
      case 'guide': 
        return 'Tips & Guides';
      case 'announcement':
      case 'news': 
        return 'Announcement';
      case 'achievement': 
        return 'Achievement';
      default: 
        return 'Update';
    }
  };

  const getTypeBadgeStyle = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'product-update':
      case 'system': 
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'feature':
      case 'new': 
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'tip':
      case 'guide': 
        return 'bg-green-100 text-green-700 border-green-200';
      case 'announcement':
      case 'news': 
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'achievement': 
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: 
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDisplayDate = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'MMMM dd, yyyy');
    } catch {
      return "Invalid Date";
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return formatDisplayDate(timestamp);
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Updates & Announcements</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay up to date with the latest features, improvements, and announcements from MagicMuse
            </p>
          </div>
          
          {/* Filter Navigation */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {(['All', 'Product Updates', 'New Features', 'Tips & Guides', 'Announcements'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading updates...</span>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {filteredNotifications.map((notification, index) => (
              <article
                key={notification.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 ${
                  !notification.read ? 'ring-2 ring-blue-100' : ''
                }`}
              >
                {/* Article Header */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div>
                        <Badge className={`${getTypeBadgeStyle(notification.type)} text-xs font-medium border`}>
                          {getTypeLabel(notification.type)}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDisplayDate(notification.created_at)}
                          <span className="mx-2">•</span>
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    {!notification.read && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>

                  {/* Article Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {notification.title}
                  </h2>

                  {/* Article Content */}
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {notification.message.split('\n').map((paragraph, pIndex) => {
                      if (paragraph.trim().startsWith('•')) {
                        return (
                          <ul key={pIndex} className="my-4 space-y-2">
                            <li className="flex items-start">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              <span>{paragraph.replace('•', '').trim()}</span>
                            </li>
                          </ul>
                        );
                      }
                      if (paragraph.trim().endsWith(':')) {
                        return (
                          <h3 key={pIndex} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                            {paragraph}
                          </h3>
                        );
                      }
                      if (paragraph.trim()) {
                        return (
                          <p key={pIndex} className="mb-4">
                            {paragraph}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Call to Action */}
                  {notification.link && (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <a
                        href={notification.link}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 group"
                      >
                        Get Started
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BellRing className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
                <p className="text-gray-600">
                  {activeFilter === 'All' 
                    ? "You're all caught up! Check back later for new updates."
                    : `No ${activeFilter.toLowerCase()} to display. Try a different filter.`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;