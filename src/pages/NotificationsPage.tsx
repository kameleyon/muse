import React, { useState, useEffect, useMemo } from 'react';
import { getNotificationsAPI, Notification, createNotificationAPI, markNotificationAsReadAPI } from '@/services/notificationService';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Settings2 } from 'lucide-react';
import { supabase } from '@/services/supabase';

// Define filter types
type FilterType = 'All' | 'Announcements' | 'Information' | 'Changelog';

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
          
          // Mark all unread notifications as read when the page is viewed
          const unreadNotifications = fetchedNotifications.filter(n => !n.read);
          for (const notification of unreadNotifications) {
            await markNotificationAsReadAPI(notification.id);
          }
          
          // Update local state to reflect read status
          if (unreadNotifications.length > 0) {
            setNotifications(prev => 
              prev.map(n => ({ ...n, read: true }))
            );
          }
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
        "Faster V7, ideas ranking party, and better moderation",
        "Hi everyone! A few announcements today:\n\nNew feature ranking party!\n\nPlease help us rank what features should be on our roadmap and what's most important to you.\n\nHow does this work?\n\n• Go to magicmuse.com/ideas\n• You'll see 5 ideas and get 25 points\n• Allocate the 25 points among the 5 ideas based on what you think to be most valuable (if it's 2x more valuable to you, give it 2x more points)\n• Do it a bunch of times (more helps!)\n• Click leaderboard and see how the community's votes are ranking all the features together! (it should converge in a few days)\n\nMagicMuse V7 book generation is now ~40% faster!\n\n• Fast mode jobs render-time are reduced from 36 to 22 seconds\n• Turbo job render-time are reduced from 13 seconds to 9\n\nThis is part of our 'final optimization' pass before making V7 default for the whole community and are necessary to prevent us from running out of GPUs.\n\nAs always, if you want to make your model 'take more time' try --q 2 and --q 4 (more updates will be coming in the future to these settings.\n\nNote: Omni-reference jobs remain the same. Non-default settings may take longer (as before).\n\nWe've upgraded the AI moderation in the editor.",
        "announcement",
        "/ideas"
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
        case 'Announcements':
          return type?.includes('announcement') || type?.includes('news');
        case 'Information':
          return type?.includes('info') || type?.includes('tip');
        case 'Changelog':
          return type?.includes('changelog') || type?.includes('update');
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

  const formatDisplayTime = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'h:mm aa');
    } catch {
      return "Invalid Time";
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'announcement':
        return 'Announcement';
      case 'info':
      case 'information':
        return 'Information';
      case 'changelog':
      case 'update':
        return 'Changelog';
      default:
        return 'Announcement';
    }
  };

  return (
    <div className="min-h-screen bg-white w-full rounded-2xl shadow-sm px-4 pb-16">
      {/* Header with navigation */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-8">
          {/* Filter Navigation */}
          <div className="flex items-center space-x-8 pl-56 mt-16">
            {(['All', 'Announcements', 'Information', 'Changelog'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          {/* Settings Icon */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
            <span className="ml-3 text-gray-500">Loading...</span>
          </div>
        )}
        
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-12">
            {filteredNotifications.map((notification, index) => (
              <article key={notification.id} className="flex space-x-4">
                {/* Left side - Date and metadata */}
                <div className="flex-shrink-0 w-250 text-right space-x-36 border-r border-secondary/20 pr-36">
                  <div className="text-sm text-gray-500 mb-1">
                    {formatDisplayDate(notification.created_at)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDisplayTime(notification.created_at)}
                  </div>
                  <div className="mt-2">
                    {!notification.read && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-neutral-white">
                        ✳ New
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/70 text-neutral-light">
                       {getTypeLabel(notification.type)}
                    </span>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="w-full">
                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {notification.title}
                  </h2>

                  {/* Content */}
                  <div className="text-gray-700 text-sm leading-relaxed space-y-4 ">
                    {notification.message.split('\n').map((paragraph, pIndex) => {
                      if (paragraph.trim() === '') return null;
                      
                      if (paragraph.trim().startsWith('•')) {
                        return (
                          <div key={pIndex} className="ml-4">
                            <span className="text-gray-600">
                              {paragraph}
                            </span>
                          </div>
                        );
                      }
                      
                      if (paragraph.trim().endsWith('!') && paragraph.length < 50) {
                        return (
                          <div key={pIndex} className="font-semibold text-gray-900">
                            {paragraph}
                          </div>
                        );
                      }
                      
                      return (
                        <p key={pIndex} className="text-gray-700">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Remove link section - full content is displayed above */}
                </div>
              </article>
            ))}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500">No notifications to display.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;