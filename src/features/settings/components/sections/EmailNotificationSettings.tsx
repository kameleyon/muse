import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Mail, Bell, AlertTriangle, CheckCircle } from 'lucide-react';

interface NotificationSettings {
  id: string;
  email_notifications_enabled: boolean;
  book_generation_complete: boolean;
  collaboration_invites: boolean;
  system_updates: boolean;
  security_alerts: boolean;
  newsletter_subscribed: boolean;
  weekly_digest: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

const EmailNotificationSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    email_notifications_enabled: true,
    book_generation_complete: true,
    collaboration_invites: true,
    system_updates: true,
    security_alerts: true,
    newsletter_subscribed: false,
    weekly_digest: true,
    marketing_emails: false
  });

  useEffect(() => {
    if (user) {
      loadNotificationSettings();
    }
  }, [user]);

  const loadNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('email_notification_settings')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading notification settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
        setFormData({
          email_notifications_enabled: data.email_notifications_enabled ?? true,
          book_generation_complete: data.book_generation_complete ?? true,
          collaboration_invites: data.collaboration_invites ?? true,
          system_updates: data.system_updates ?? true,
          security_alerts: data.security_alerts ?? true,
          newsletter_subscribed: data.newsletter_subscribed ?? false,
          weekly_digest: data.weekly_digest ?? true,
          marketing_emails: data.marketing_emails ?? false
        });
      } else {
        // Create default settings
        const defaultSettings = {
          id: user?.id,
          user_id: user?.id,
          email_notifications_enabled: true,
          book_generation_complete: true,
          collaboration_invites: true,
          system_updates: true,
          security_alerts: true,
          newsletter_subscribed: false,
          weekly_digest: true,
          marketing_emails: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdSettings, error: createError } = await supabase
          .from('email_notification_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) {
          console.error('Error creating notification settings:', createError);
        } else {
          setSettings(createdSettings);
        }
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
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
        .from('email_notification_settings')
        .upsert({
          id: user.id,
          user_id: user.id,
          ...updateData
        });

      if (error) {
        console.error('Error saving notification settings:', error);
        alert('Failed to save settings. Please try again.');
      } else {
        alert('Email notification settings saved successfully!');
        loadNotificationSettings();
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setFormData({
      email_notifications_enabled: true,
      book_generation_complete: true,
      collaboration_invites: true,
      system_updates: true,
      security_alerts: true,
      newsletter_subscribed: false,
      weekly_digest: true,
      marketing_emails: false
    });
  };

  const ToggleSwitch = ({ label, description, checked, onChange, icon, required = false }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
    icon: React.ReactNode;
    required?: boolean;
  }) => (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-1 text-gray-600">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </h4>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={checked}
              onChange={onChange}
              disabled={required && checked}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-disabled:opacity-50"></div>
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
        <h3 className="settings-form-title">Email Notification Settings</h3>
        <p className="settings-form-description">Control which emails you receive from MagicMuse</p>
        
        {/* Master Toggle */}
        <div className="mt-6">
          <ToggleSwitch
            label="Enable Email Notifications"
            description="Master switch for all email notifications. Disable to stop all emails except critical security alerts."
            checked={formData.email_notifications_enabled}
            onChange={() => handleToggleChange('email_notifications_enabled')}
            icon={<Mail className="h-5 w-5" />}
          />
        </div>
        
        {!formData.email_notifications_enabled && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Email notifications are disabled
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  You will only receive critical security alerts. Other notification settings below are inactive.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content & Activity Notifications */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Content & Activity</h3>
        <p className="settings-form-description">Notifications about your content and activities</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Book Generation Complete"
            description="Get notified when your AI book generation is finished and ready for review."
            checked={formData.book_generation_complete && formData.email_notifications_enabled}
            onChange={() => handleToggleChange('book_generation_complete')}
            icon={<CheckCircle className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Collaboration Invites"
            description="Receive emails when someone invites you to collaborate on a project."
            checked={formData.collaboration_invites && formData.email_notifications_enabled}
            onChange={() => handleToggleChange('collaboration_invites')}
            icon={<Bell className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* System & Security */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">System & Security</h3>
        <p className="settings-form-description">Important updates and security notifications</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="System Updates"
            description="Important announcements about new features, maintenance, and service updates."
            checked={formData.system_updates && formData.email_notifications_enabled}
            onChange={() => handleToggleChange('system_updates')}
            icon={<Bell className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Security Alerts"
            description="Critical security notifications including login attempts and account changes."
            checked={formData.security_alerts}
            onChange={() => handleToggleChange('security_alerts')}
            icon={<AlertTriangle className="h-5 w-5" />}
            required={true}
          />
        </div>
      </div>

      {/* Marketing & Communication */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Marketing & Communication</h3>
        <p className="settings-form-description">Optional newsletters and promotional content</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Weekly Digest"
            description="A weekly summary of your activity and useful writing tips."
            checked={formData.weekly_digest && formData.email_notifications_enabled}
            onChange={() => handleToggleChange('weekly_digest')}
            icon={<Mail className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Newsletter Subscription"
            description="Monthly newsletter with writing insights, feature highlights, and success stories."
            checked={formData.newsletter_subscribed && formData.email_notifications_enabled}
            onChange={() => handleToggleChange('newsletter_subscribed')}
            icon={<Mail className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Marketing Emails"
            description="Promotional emails about new features, special offers, and events."
            checked={formData.marketing_emails && formData.email_notifications_enabled}
            onChange={() => handleToggleChange('marketing_emails')}
            icon={<Mail className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Current Email */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Email Address</h3>
        <p className="settings-form-description">Notifications will be sent to your account email</p>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            To change your email address, visit Account Settings or contact support
          </p>
        </div>
      </div>
      
      <div className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={handleResetToDefault}
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

export default EmailNotificationSettings;