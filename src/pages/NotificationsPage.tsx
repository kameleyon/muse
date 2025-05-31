import React, { useState, useEffect, useMemo } from 'react';
import { getNotificationsAPI, Notification, createNotificationAPI } from '@/services/notificationService';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, Calendar, Clock, Filter } from 'lucide-react';
import { supabase } from '@/services/supabase';

// Define filter types
type FilterType = 'All' | 'Updates' | 'Features' | 'Announcements';

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

      // Create a sample notification
      await createNotificationAPI(
        session.user.id,
        "Enhanced AI Generation Models",
        "We've upgraded our core AI systems with improved narrative consistency and character development. The new models show significant improvements in dialogue quality and story pacing.\n\nGeneration speed has been increased by 35% while maintaining quality. These updates are now live across all book creation tools.",
        "update",
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
        case 'Updates':
          return type?.includes('update') || type?.includes('product');
        case 'Features':
          return type?.includes('feature') || type?.includes('new');
        case 'Announcements':
          return type?.includes('announcement') || type?.includes('news');
        default:
          return true;
      }
    });
  }, [notifications, activeFilter]);

  const formatDisplayDate = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'MMM dd, yyyy');
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
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-white">Updates</h1>
              <p className="text-zinc-400 text-sm mt-1">Latest announcements and improvements</p>
            </div>
            
            {/* Filter Pills */}
            <div className="flex items-center space-x-2">
              {(['All', 'Updates', 'Features', 'Announcements'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    activeFilter === filter
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
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
      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="ml-3 text-zinc-400">Loading updates...</span>
          </div>
        )}
        
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-1">
            {filteredNotifications.map((notification, index) => (
              <article
                key={notification.id}
                className="group relative bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 transition-all duration-200 overflow-hidden"
              >
                {/* Main Content */}
                <div className="p-6">
                  {/* Header with date and type */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-zinc-500 text-xs font-mono">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        {formatDisplayDate(notification.created_at)}
                      </div>
                      <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                      <div className="text-zinc-500 text-xs font-mono">
                        {formatRelativeTime(notification.created_at)}
                      </div>
                    </div>
                    
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-medium text-white mb-3 group-hover:text-zinc-100">
                    {notification.title}
                  </h2>

                  {/* Content */}
                  <div className="text-zinc-300 text-sm leading-relaxed space-y-3">
                    {notification.message.split('\n').map((paragraph, pIndex) => {
                      if (paragraph.trim() === '') return null;
                      
                      if (paragraph.trim().startsWith('•')) {
                        return (
                          <div key={pIndex} className="flex items-start pl-4">
                            <span className="w-1 h-1 bg-zinc-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-zinc-400">
                              {paragraph.replace('•', '').trim()}
                            </span>
                          </div>
                        );
                      }
                      
                      return (
                        <p key={pIndex} className={paragraph.trim().endsWith(':') ? 'text-zinc-200 font-medium' : ''}>
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Action link */}
                  {notification.link && (
                    <div className="mt-6 pt-4 border-t border-zinc-800">
                      <a
                        href={notification.link}
                        className="inline-flex items-center text-sm text-white hover:text-zinc-300 transition-colors group/link"
                      >
                        <span className="font-medium">Try it now</span>
                        <ArrowUpRight className="ml-1 h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-20">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-5 w-5 text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No updates found</h3>
                <p className="text-zinc-400">
                  {activeFilter === 'All' 
                    ? "You're all caught up."
                    : `No ${activeFilter.toLowerCase()} to display.`
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