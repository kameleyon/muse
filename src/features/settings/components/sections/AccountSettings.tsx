import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';

interface UserSettings {
  id: string;
  username?: string;
  default_landing_page: string;
  stay_logged_in: boolean;
  receive_account_emails: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

const AccountSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [formData, setFormData] = useState({
    username: '',
    default_landing_page: 'dashboard',
    stay_logged_in: true,
    receive_account_emails: true,
    two_factor_enabled: false
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
        setFormData({
          username: data.username || '',
          default_landing_page: data.default_landing_page || 'dashboard',
          stay_logged_in: data.stay_logged_in ?? true,
          receive_account_emails: data.receive_account_emails ?? true,
          two_factor_enabled: data.two_factor_enabled ?? false
        });
      } else {
        // Create settings if they don't exist
        const newSettings = {
          id: user?.id,
          user_id: user?.id,
          username: user?.email?.split('@')[0] || '',
          default_landing_page: 'dashboard',
          stay_logged_in: true,
          receive_account_emails: true,
          two_factor_enabled: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdSettings, error: createError } = await supabase
          .from('user_settings')
          .insert(newSettings)
          .select()
          .single();

        if (createError) {
          console.error('Error creating settings:', createError);
        } else {
          setSettings(createdSettings);
          setFormData({
            username: createdSettings.username || '',
            default_landing_page: createdSettings.default_landing_page || 'dashboard',
            stay_logged_in: createdSettings.stay_logged_in ?? true,
            receive_account_emails: createdSettings.receive_account_emails ?? true,
            two_factor_enabled: createdSettings.two_factor_enabled ?? false
          });
        }
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
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
        .from('user_settings')
        .upsert({
          id: user.id,
          user_id: user.id,
          ...updateData
        });

      if (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings. Please try again.');
      } else {
        alert('Settings saved successfully!');
        loadUserSettings();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.current_password || !passwordData.new_password) {
      alert('Please fill in all password fields.');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match.');
      return;
    }

    if (passwordData.new_password.length < 8) {
      alert('New password must be at least 8 characters long.');
      return;
    }

    setChangingPassword(true);
    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordData.current_password
      });

      if (signInError) {
        alert('Current password is incorrect.');
        setChangingPassword(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.new_password
      });

      if (updateError) {
        console.error('Error updating password:', updateError);
        alert('Failed to update password. Please try again.');
      } else {
        alert('Password updated successfully!');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

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
        <h3 className="settings-form-title">Account Information</h3>
        <p className="settings-form-description">Manage your account details</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="settings-label">Email Address</label>
            <input
              type="email"
              className="settings-input bg-gray-50"
              value={user?.email || ''}
              disabled
            />
            <p className="text-xs text-neutral-medium mt-1">
              To change your email, contact support
            </p>
          </div>
          
          <div>
            <label className="settings-label">Username</label>
            <input
              type="text"
              name="username"
              className="settings-input"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
            />
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Password</h3>
        <p className="settings-form-description">Update your password</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="current_password"
                className="settings-input pr-10"
                placeholder="Enter your current password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="settings-label">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="new_password"
                className="settings-input pr-10"
                placeholder="Enter new password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-neutral-medium mt-1">
              Minimum 8 characters
            </p>
          </div>
          
          <div>
            <label className="settings-label">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirm_password"
                className="settings-input pr-10"
                placeholder="Confirm new password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePasswordUpdate}
              disabled={changingPassword}
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Two-Factor Authentication</h3>
        <p className="settings-form-description">Add an extra layer of security to your account</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="two_factor_enabled"
                checked={formData.two_factor_enabled}
                onChange={handleInputChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="text-sm">Enable two-factor authentication</span>
            {formData.two_factor_enabled && (
              <Shield className="h-4 w-4 text-green-600" />
            )}
          </div>
          
          {!formData.two_factor_enabled && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">
                    Two-factor authentication is disabled
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Enable 2FA to secure your account with an additional verification step.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Account Preferences</h3>
        <p className="settings-form-description">Configure account behavior</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Default Landing Page</label>
            <select 
              name="default_landing_page"
              className="settings-select"
              value={formData.default_landing_page}
              onChange={handleInputChange}
            >
              <option value="dashboard">Dashboard</option>
              <option value="book-library">Book Library</option>
              <option value="new-book">New Book</option>
              <option value="generator">Content Generator</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="stay_logged_in"
                checked={formData.stay_logged_in}
                onChange={handleInputChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="text-sm">Stay logged in on this device</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="receive_account_emails"
                checked={formData.receive_account_emails}
                onChange={handleInputChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="text-sm">Receive account-related emails</span>
          </div>
        </div>
      </div>
      
      <div className="settings-footer">
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

export default AccountSettings;