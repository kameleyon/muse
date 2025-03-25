import React from 'react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsPanelProps {
  notifications: Notification[];
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="py-2">
      
      
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 rounded-xl border ${!notification.read ? 'bg-white/30 border-neutral-light' : 'bg-transparent border-neutral-light'}`}
            >
              <div className="flex justify-between">
                <h2 className="font-medium text-secondary">{notification.title}</h2>
                <span className="text-xs text-neutral-medium">{notification.timestamp}</span>
              </div>
              <p className="text-sm text-neutral-medium mt-1">{notification.message}</p>
            </div>
          ))}
          
          <div className="text-center mt-4">
            <Link to="/notifications" className="text-primary text-sm hover:underline">
              View all notifications
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-neutral-medium">No new notifications</p>
          <Link to="/notifications" className="text-primary text-sm block mt-2 hover:underline">
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
