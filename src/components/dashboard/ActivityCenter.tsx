import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNotificationsAPI, Notification } from '@/services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { ActivityType } from './RecentActivity';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Clock, Filter, CheckCircle } from 'lucide-react';

// Define the activity item interface
interface ActivityItem {
  id: string;
  type: ActivityType;
  timestamp: string;
  title?: string;
  amount?: string;
}

// Define the props for the ActivityCenter component
interface ActivityCenterProps {
  activities: ActivityItem[];
}

// Define the priority levels for notifications
type PriorityLevel = 'high' | 'medium' | 'low';

// Extend the notification type to include priority
interface EnhancedNotification extends Notification {
  priority: PriorityLevel;
}

const ActivityCenter: React.FC<ActivityCenterProps> = ({ activities }) => {
  // State for notifications
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filter
  const [activeFilter, setActiveFilter] = useState<'all' | 'files' | 'comments' | 'system'>('all');
  
  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedNotifications = await getNotificationsAPI({ limit: 5 });
        if (fetchedNotifications) {
          // Enhance notifications with priority
          const enhancedNotifications = fetchedNotifications.map(notification => {
            // Determine priority based on content (this is a simple example)
            let priority: PriorityLevel = 'medium';
            if (notification.title.toLowerCase().includes('urgent') || 
                notification.message.toLowerCase().includes('deadline')) {
              priority = 'high';
            } else if (notification.title.toLowerCase().includes('completed') || 
                      notification.message.toLowerCase().includes('success')) {
              priority = 'low';
            }
            return { ...notification, priority };
          });
          setNotifications(enhancedNotifications);
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

    fetchNotifications();
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return timestamp.split('T')[0];
    }
  };

  // Get priority indicator color
  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-400';
      case 'low':
        return 'bg-neutral-300';
      default:
        return 'bg-neutral-300';
    }
  };

  // Filter activities and notifications
  const getFilteredItems = () => {
    if (activeFilter === 'all') {
      return [...activities, ...notifications];
    } else if (activeFilter === 'files') {
      return activities.filter(activity => 
        activity.type === 'project_created' || activity.type === 'project_completed'
      );
    } else if (activeFilter === 'comments') {
      // Filter notifications that might be comments
      return notifications.filter(notification => 
        notification.title.toLowerCase().includes('comment') || 
        notification.message.toLowerCase().includes('comment')
      );
    } else if (activeFilter === 'system') {
      // Filter system notifications and activities
      const systemActivities = activities.filter(activity => 
        activity.type === 'tokens_purchased' || activity.type === 'team_joined'
      );
      const systemNotifications = notifications.filter(notification => 
        !notification.title.toLowerCase().includes('comment') && 
        !notification.message.toLowerCase().includes('comment')
      );
      return [...systemActivities, ...systemNotifications];
    }
    return [];
  };

  // Sort all items by timestamp
  const sortedItems = getFilteredItems().sort((a, b) => {
    const dateA = new Date(a.timestamp || (a as EnhancedNotification).created_at);
    const dateB = new Date(b.timestamp || (b as EnhancedNotification).created_at);
    return dateB.getTime() - dateA.getTime();
  });

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-white border border-neutral-light/30 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-neutral-light/40 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-heading text-secondary mb-0 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Activity Center
            {unreadCount > 0 && (
              <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>
        
        {/* Filter tabs with pill design */}
        <div className="mt-3 bg-white/80 rounded-full p-1 flex space-x-1 shadow-sm border border-neutral-light/30">
          <Button 
            variant={activeFilter === 'all' ? 'primary' : 'ghost'} 
            size="sm"
            onClick={() => setActiveFilter('all')}
            className={`rounded-full px-3 ${activeFilter === 'all' ? 'shadow-md' : ''}`}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === 'files' ? 'primary' : 'ghost'} 
            size="sm"
            onClick={() => setActiveFilter('files')}
            className={`rounded-full px-3 ${activeFilter === 'files' ? 'shadow-md' : ''}`}
          >
            Files
          </Button>
          <Button 
            variant={activeFilter === 'comments' ? 'primary' : 'ghost'} 
            size="sm"
            onClick={() => setActiveFilter('comments')}
            className={`rounded-full px-3 ${activeFilter === 'comments' ? 'shadow-md' : ''}`}
          >
            Comments
          </Button>
          <Button 
            variant={activeFilter === 'system' ? 'primary' : 'ghost'} 
            size="sm"
            onClick={() => setActiveFilter('system')}
            className={`rounded-full px-3 ${activeFilter === 'system' ? 'shadow-md' : ''}`}
          >
            System
          </Button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {loading && (
          <div className="text-center py-6">
            <p className="text-neutral-medium">Loading activities...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && sortedItems.length === 0 && (
          <div className="text-center py-6">
            <p className="text-neutral-medium">No activities found</p>
          </div>
        )}

        {!loading && !error && sortedItems.length > 0 && (
          <div className="space-y-0">
            {sortedItems.map((item, index) => {
              // Determine if this is a notification or activity
              const isNotification = 'created_at' in item;
              
              if (isNotification) {
                const notification = item as EnhancedNotification;
                return (
                  <div 
                    key={notification.id} 
                    className="p-4 border-b border-neutral-light/20 hover:bg-neutral-light/10 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-3 w-3 rounded-full mt-1.5 ${getPriorityColor(notification.priority)}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-semibold text-sm text-secondary">{notification.title}</h4>
                          <span className="text-xs text-neutral-medium whitespace-nowrap">
                            {formatTimestamp(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-medium mt-1">{notification.message}</p>
                        <div className="flex mt-2 space-x-2">
                          <Button variant="outline" size="sm">Reply</Button>
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Mark as Read</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                const activity = item as ActivityItem;
                return (
                  <div 
                    key={activity.id} 
                    className="p-4 border-b border-neutral-light/20 hover:bg-neutral-light/10 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-neutral-light/20">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm text-secondary">
                            {activity.type === 'project_created' && (
                              <>Created a new project <span className="font-medium">{activity.title}</span></>
                            )}
                            {activity.type === 'template_used' && (
                              <>Used the <span className="font-medium">{activity.title}</span> template</>
                            )}
                            {activity.type === 'tokens_purchased' && (
                              <>Purchased <span className="font-medium">{activity.amount}</span></>
                            )}
                            {activity.type === 'team_joined' && (
                              <>Joined team <span className="font-medium">{activity.title}</span></>
                            )}
                            {activity.type === 'project_completed' && (
                              <>Completed project <span className="font-medium">{activity.title}</span></>
                            )}
                          </p>
                          <span className="text-xs text-neutral-medium whitespace-nowrap">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                        <div className="flex mt-2 space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-neutral-light/40 text-center">
        <Link to="/notifications" className="text-primary text-sm hover:underline">
          View All Activity
        </Link>
      </div>
    </Card>
  );
};

export default ActivityCenter;
