import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { Link } from 'react-router-dom';
import { getNotificationsAPI, Notification } from '@/services/notificationService'; // Import API function and type
import { formatDistanceToNow } from 'date-fns'; // For relative time formatting

// Removed NotificationsPanelProps interface

const NotificationsPanel: React.FC = () => { // Removed props
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch latest 5 notifications (adjust limit as needed)
        const fetchedNotifications = await getNotificationsAPI({ limit: 5 });
        if (fetchedNotifications) {
          setNotifications(fetchedNotifications);
        } else {
          // Error handled by addToast in the service, maybe set local error too
          setError("Failed to load notifications.");
        }
      } catch (err) {
        console.error("Error fetching notifications in component:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []); // Fetch on mount

  // Calculate unread count based on fetched state
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      // Fallback to original string or a placeholder
      // For the image format '2025-04-04T03:16:51.100Z', we might need a different formatter
      // Let's try a simple split for now, assuming ISO format
      return timestamp.split('T')[0]; // Just show the date part as fallback
    }
  };

  return (
    <div className="py-2">
      {/* Add Loading and Error states */}
      {loading && <p className="text-center text-neutral-medium p-4">Loading notifications...</p>}
      {error && <p className="text-center text-red-500 p-4">{error}</p>}


      {!loading && !error && ( // Only render list if not loading and no error
        // Removed Fragment wrapper below
          notifications.length > 0 ? (
            <div className="space-y-3">
            {notifications.map((notification) => (
              <div
              key={notification.id} 
              className={`p-3  bg-white/20 rounded-xl border border-neutral-light`}
            >
                <div className="flex justify-between items-start"> {/* Use items-start */}
                  <div> {/* Wrap title and message */}
                  <span className="text-xs text-neutral-medium whitespace-nowrap mb-2 font-bold">{formatTimestamp(notification.created_at)}</span>
                    <h4 className="font-semibold text-xs text-secondary">{notification.title}</h4>
                    <p className="text-xs text-neutral-medium mt-1">{notification.message}</p>
                  </div>
                  {/* Use formatted timestamp */}
                 
              </div>
            </div>
          ))}
          
          <div className="text-center mt-4">
            {/* Updated link to point to the new page */}
            <Link to="/notifications" className="text-primary text-sm hover:underline"> 
                View all notifications
              </Link>
            </div>
          </div>
          ) : (
            // This is the "No new notifications" block
            <div className="text-center py-6">
              <p className="text-neutral-medium">No new notifications</p>
              {/* Updated link to point to the new page */}
              <Link to="/notifications" className="text-primary text-sm block mt-2 hover:underline"> 
                View all notifications
              </Link>
            </div>
          )
        // Removed Fragment wrapper below
      )} {/* Correctly closed conditional rendering block */}
    </div>
  );
};

export default NotificationsPanel;
