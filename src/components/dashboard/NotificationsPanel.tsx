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
    <div className="bg-neutral-white rounded-lg p-6 border border-neutral-light/40 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-heading text-secondary">Notifications</h2>
        <span className="bg-neutral-light/30 text-neutral-medium text-xs px-2 py-1 rounded-full">
          {unreadCount} new
        </span>
      </div>
      
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 rounded-md border ${!notification.read ? 'bg-neutral-light/20 border-primary/20' : 'bg-transparent border-neutral-light/30'}`}
            >
              <div className="flex justify-between">
                <h3 className="font-medium text-secondary">{notification.title}</h3>
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
