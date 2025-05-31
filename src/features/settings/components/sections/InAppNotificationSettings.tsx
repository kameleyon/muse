import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Bell, MessageSquare, Heart, Users, BookOpen, Zap } from 'lucide-react';

interface InAppSettings {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  sound_enabled: boolean;
  desktop_notifications: boolean;
  new_comments: boolean;
  collaboration_updates: boolean;
  system_announcements: boolean;
  feature_updates: boolean;
  book_generation_status: boolean;
  ai_suggestions: boolean;
  likes_and_reactions: boolean;
  mentions: boolean;
  notification_frequency: 'real_time' | 'hourly' | 'daily';
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  created_at: string;
  updated_at: string;
}

const InAppNotificationSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [settings, setSettings] = useState<InAppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    notifications_enabled: true,
    sound_enabled: true,
    desktop_notifications: true,
    new_comments: true,
    collaboration_updates: true,
    system_announcements: true,
    feature_updates: true,
    book_generation_status: true,
    ai_suggestions: true,
    likes_and_reactions: true,
    mentions: true,
    notification_frequency: 'real_time' as 'real_time' | 'hourly' | 'daily',
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00'
  });

  useEffect(() => {
    if (user) {
      loadInAppSettings();
    }
  }, [user]);

  const loadInAppSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('in_app_notification_settings')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading in-app notification settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
        setFormData({
          notifications_enabled: data.notifications_enabled ?? true,
          sound_enabled: data.sound_enabled ?? true,
          desktop_notifications: data.desktop_notifications ?? true,
          new_comments: data.new_comments ?? true,
          collaboration_updates: data.collaboration_updates ?? true,
          system_announcements: data.system_announcements ?? true,
          feature_updates: data.feature_updates ?? true,
          book_generation_status: data.book_generation_status ?? true,
          ai_suggestions: data.ai_suggestions ?? true,
          likes_and_reactions: data.likes_and_reactions ?? true,
          mentions: data.mentions ?? true,
          notification_frequency: data.notification_frequency ?? 'real_time',
          quiet_hours_enabled: data.quiet_hours_enabled ?? false,
          quiet_hours_start: data.quiet_hours_start ?? '22:00',
          quiet_hours_end: data.quiet_hours_end ?? '08:00'
        });
      } else {
        // Create default settings
        const defaultSettings = {
          id: user?.id,
          user_id: user?.id,
          notifications_enabled: true,
          sound_enabled: true,
          desktop_notifications: true,
          new_comments: true,
          collaboration_updates: true,
          system_announcements: true,
          feature_updates: true,
          book_generation_status: true,
          ai_suggestions: true,
          likes_and_reactions: true,
          mentions: true,
          notification_frequency: 'real_time',
          quiet_hours_enabled: false,
          quiet_hours_start: '22:00',
          quiet_hours_end: '08:00',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdSettings, error: createError } = await supabase
          .from('in_app_notification_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) {
          console.error('Error creating in-app notification settings:', createError);
        } else {
          setSettings(createdSettings);
        }
      }
    } catch (error) {
      console.error('Error loading in-app notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('in_app_notification_settings')
        .upsert({
          id: user.id,
          user_id: user.id,
          ...updateData
        });

      if (error) {
        console.error('Error saving in-app notification settings:', error);
        alert('Failed to save settings. Please try again.');
      } else {
        alert('In-app notification settings saved successfully!');
        loadInAppSettings();
      }
    } catch (error) {
      console.error('Error saving in-app notification settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({ label, description, checked, onChange, icon }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
    icon: React.ReactNode;
  }) => (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-1 text-gray-600">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{label}</h4>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={checked}
              onChange={onChange}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">In-App Notification Settings</h3>
        <p className="settings-form-description">Control notifications that appear within the application</p>
        
        {/* Master Toggle */}
        <div className="mt-6">
          <ToggleSwitch
            label="Enable In-App Notifications"
            description="Master switch for all in-app notifications"
            checked={formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, notifications_enabled: !prev.notifications_enabled }))}
            icon={<Bell className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* General Settings */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">General Settings</h3>
        <p className="settings-form-description">Basic notification preferences</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Sound Notifications"
            description="Play sound when notifications appear"
            checked={formData.sound_enabled && formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, sound_enabled: !prev.sound_enabled }))}
            icon={<Bell className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Desktop Notifications"
            description="Show system notifications even when browser is not active"
            checked={formData.desktop_notifications && formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, desktop_notifications: !prev.desktop_notifications }))}
            icon={<Bell className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Content & Collaboration */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Content & Collaboration</h3>
        <p className="settings-form-description">Notifications about your content and collaborations</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="New Comments"
            description="When someone comments on your content"
            checked={formData.new_comments && formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, new_comments: !prev.new_comments }))}
            icon={<MessageSquare className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Collaboration Updates"
            description="Changes and updates from collaborators on shared projects"
            checked={formData.collaboration_updates && formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, collaboration_updates: !prev.collaboration_updates }))}
            icon={<Users className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Likes and Reactions"
            description="When someone likes or reacts to your content"
            checked={formData.likes_and_reactions && formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, likes_and_reactions: !prev.likes_and_reactions }))}
            icon={<Heart className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Mentions"
            description="When you are mentioned in comments or content"
            checked={formData.mentions && formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, mentions: !prev.mentions }))}
            icon={<MessageSquare className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* System & Features */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">System & Features</h3>
        <p className="settings-form-description">System updates and feature notifications</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Book Generation Status"
            description="Updates on AI book generation progress and completion"
            checked={formData.book_generation_status && formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, book_generation_status: !prev.book_generation_status }))}
            icon={<BookOpen className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="AI Suggestions"
            description="Notifications when AI has suggestions for your content"
            checked={formData.ai_suggestions && formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, ai_suggestions: !prev.ai_suggestions }))}
            icon={<Zap className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="System Announcements"
            description="Important announcements from the MagicMuse team"
            checked={formData.system_announcements && formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, system_announcements: !prev.system_announcements }))}
            icon={<Bell className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Feature Updates"
            description="Notifications about new features and improvements"
            checked={formData.feature_updates && formData.notifications_enabled}
            onChange={() => setFormData(prev => ({ ...prev, feature_updates: !prev.feature_updates }))}
            icon={<Zap className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Timing Settings */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Timing & Frequency</h3>
        <p className="settings-form-description">Control when and how often you receive notifications</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Notification Frequency</label>
            <select 
              name="notification_frequency"
              className="settings-select"
              value={formData.notification_frequency}
              onChange={handleInputChange}
            >
              <option value="real_time">Real-time (immediate)</option>
              <option value="hourly">Hourly digest</option>
              <option value="daily">Daily summary</option>
            </select>
          </div>
          
          <ToggleSwitch
            label="Quiet Hours"
            description="Disable notifications during specified hours"
            checked={formData.quiet_hours_enabled}
            onChange={() => setFormData(prev => ({ ...prev, quiet_hours_enabled: !prev.quiet_hours_enabled }))}
            icon={<Bell className="h-5 w-5" />}
          />
          
          {formData.quiet_hours_enabled && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="settings-label">Start Time</label>
                <input
                  type="time"
                  name="quiet_hours_start"
                  className="settings-input"
                  value={formData.quiet_hours_start}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="settings-label">End Time</label>
                <input
                  type="time"
                  name="quiet_hours_end"
                  className="settings-input"
                  value={formData.quiet_hours_end}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => setFormData({
            notifications_enabled: true,
            sound_enabled: true,
            desktop_notifications: true,
            new_comments: true,
            collaboration_updates: true,
            system_announcements: true,
            feature_updates: true,
            book_generation_status: true,
            ai_suggestions: true,
            likes_and_reactions: true,
            mentions: true,
            notification_frequency: 'real_time',
            quiet_hours_enabled: false,
            quiet_hours_start: '22:00',
            quiet_hours_end: '08:00'
          })}
        >
          Reset to Default
        </Button>
        <Button 
          variant="primary" 
          className="text-white"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default InAppNotificationSettings;
