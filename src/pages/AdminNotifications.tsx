import React, { useState, useEffect } from 'react';
import { getNotificationsAPI, Notification, createNotificationAPI } from '@/services/notificationService';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit, Trash2, Save, X, Send } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/services/supabase';

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement',
    link: ''
  });

  // Load all notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No access token');
      }

      const response = await fetch('/api/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const endpoint = broadcastMode ? '/api/admin/notifications/broadcast' : '/api/admin/notifications';
      const body = broadcastMode 
        ? {
            title: formData.title,
            message: formData.message,
            type: formData.type,
            link: formData.link || undefined
          }
        : {
            userId: session.user?.id,
            title: formData.title,
            message: formData.message,
            type: formData.type,
            link: formData.link || undefined
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to create notification');
      }

      const result = await response.json();
      console.log('Notification created:', result);

      // Reset form
      setFormData({ title: '', message: '', type: 'announcement', link: '' });
      setShowCreateForm(false);
      setBroadcastMode(false);
      loadNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleUpdateNotification = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          message: formData.message,
          type: formData.type,
          link: formData.link || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update notification');
      }

      setEditingId(null);
      loadNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const startEditing = (notification: Notification) => {
    setEditingId(notification.id);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type || 'announcement',
      link: notification.link || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ title: '', message: '', type: 'announcement', link: '' });
  };

  const getTypeBadgeStyle = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'announcement':
        return 'bg-green-100 text-green-800';
      case 'info':
      case 'information':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'feature':
        return 'bg-indigo-100 text-indigo-800';
      case 'tip':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary/90">Notifications Admin</h1>
          <p className="text-gray-600 mt-2">Manage system notifications and announcements</p>
        </div>

        {/* Create New Button */}
        <div className="mb-6 flex space-x-4">
          <Button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setBroadcastMode(false);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Notification
          </Button>
          <Button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setBroadcastMode(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Broadcast to All Users
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {broadcastMode ? 'Broadcast Notification to All Users' : 'Create New Notification'}
              </CardTitle>
              {broadcastMode && (
                <p className="text-sm text-purple-600 mt-1">
                  This notification will be sent to all registered users
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Notification title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Notification message..."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="announcement">Announcement</option>
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="feature">Feature</option>
                  <option value="tip">Tip</option>
                  <option value="product-update">Product Update</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateNotification}
                  disabled={!formData.title || !formData.message}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {broadcastMode ? 'Broadcast' : 'Create'}
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false);
                    setBroadcastMode(false);
                  }}
                  variant="outline"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading notifications...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {editingId === notification.id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="announcement">Announcement</option>
                          <option value="info">Information</option>
                          <option value="warning">Warning</option>
                          <option value="error">Error</option>
                          <option value="feature">Feature</option>
                          <option value="tip">Tip</option>
                          <option value="product-update">Product Update</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                        <Input
                          value={formData.link}
                          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleUpdateNotification(notification.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={cancelEditing} variant="outline">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-secondary/90">{notification.title}</h3>
                            <Badge className={getTypeBadgeStyle(notification.type)}>
                              {notification.type || 'announcement'}
                            </Badge>
                            {!notification.read && (
                              <Badge className="bg-red-100 text-red-800">Unread</Badge>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                            {notification.message}
                          </p>
                          {notification.link && (
                            <p className="text-blue-600 text-sm">
                              Link: <a href={notification.link} target="_blank" rel="noopener noreferrer" className="underline">{notification.link}</a>
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Created: {format(parseISO(notification.created_at), 'MMM dd, yyyy h:mm aa')} • 
                            User: {notification.user_id}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            onClick={() => startEditing(notification)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteNotification(notification.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No notifications found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;