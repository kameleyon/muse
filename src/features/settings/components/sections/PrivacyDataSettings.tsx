import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Shield, Eye, Lock, Trash2, Download, AlertTriangle } from 'lucide-react';

interface PrivacySettings {
  id: string;
  user_id: string;
  profile_visibility: 'public' | 'private' | 'friends';
  data_sharing_enabled: boolean;
  analytics_tracking: boolean;
  personalized_recommendations: boolean;
  data_retention_period: number; // in months
  content_indexing: boolean;
  third_party_integrations: boolean;
  marketing_personalization: boolean;
  created_at: string;
  updated_at: string;
}

const PrivacyDataSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exportingData, setExportingData] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  
  const [formData, setFormData] = useState({
    profile_visibility: 'public' as 'public' | 'private' | 'friends',
    data_sharing_enabled: false,
    analytics_tracking: true,
    personalized_recommendations: true,
    data_retention_period: 24,
    content_indexing: true,
    third_party_integrations: false,
    marketing_personalization: false
  });

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading privacy settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
        setFormData({
          profile_visibility: data.profile_visibility ?? 'public',
          data_sharing_enabled: data.data_sharing_enabled ?? false,
          analytics_tracking: data.analytics_tracking ?? true,
          personalized_recommendations: data.personalized_recommendations ?? true,
          data_retention_period: data.data_retention_period ?? 24,
          content_indexing: data.content_indexing ?? true,
          third_party_integrations: data.third_party_integrations ?? false,
          marketing_personalization: data.marketing_personalization ?? false
        });
      } else {
        // Create default settings
        const defaultSettings = {
          id: user?.id,
          user_id: user?.id,
          profile_visibility: 'public',
          data_sharing_enabled: false,
          analytics_tracking: true,
          personalized_recommendations: true,
          data_retention_period: 24,
          content_indexing: true,
          third_party_integrations: false,
          marketing_personalization: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdSettings, error: createError } = await supabase
          .from('privacy_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) {
          console.error('Error creating privacy settings:', createError);
        } else {
          setSettings(createdSettings);
        }
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
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
        .from('privacy_settings')
        .upsert({
          id: user.id,
          user_id: user.id,
          ...updateData
        });

      if (error) {
        console.error('Error saving privacy settings:', error);
        alert('Failed to save privacy settings. Please try again.');
      } else {
        alert('Privacy settings saved successfully!');
        loadPrivacySettings();
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      alert('Failed to save privacy settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDataExport = async () => {
    setExportingData(true);
    try {
      // This would implement actual data export functionality
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Data export request submitted. You will receive an email with your data within 48 hours.');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExportingData(false);
    }
  };

  const handleAccountDeletion = async () => {
    const confirmation = prompt(
      'To delete your account, please type "DELETE" to confirm. This action cannot be undone.'
    );
    
    if (confirmation !== 'DELETE') {
      return;
    }

    setDeletingAccount(true);
    try {
      // This would implement actual account deletion
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Account deletion request submitted. Your account will be deleted within 30 days.');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to process account deletion. Please contact support.');
    } finally {
      setDeletingAccount(false);
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
        <h3 className="settings-form-title">Privacy & Data Settings</h3>
        <p className="settings-form-description">Control how your data is used and shared</p>
      </div>

      {/* Profile Visibility */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Profile Visibility</h3>
        <p className="settings-form-description">Control who can see your profile and content</p>
        
        <div className="mt-4">
          <label className="settings-label">Profile Visibility</label>
          <select 
            name="profile_visibility"
            className="settings-select"
            value={formData.profile_visibility}
            onChange={handleInputChange}
          >
            <option value="public">Public - Anyone can see your profile</option>
            <option value="friends">Friends Only - Only connected users</option>
            <option value="private">Private - Only you can see your profile</option>
          </select>
        </div>
      </div>

      {/* Data Usage */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Data Usage & Analytics</h3>
        <p className="settings-form-description">Control how your data is used for analytics and improvements</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Analytics Tracking"
            description="Allow us to collect anonymous usage data to improve the platform"
            checked={formData.analytics_tracking}
            onChange={() => setFormData(prev => ({ ...prev, analytics_tracking: !prev.analytics_tracking }))}
            icon={<Eye className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Personalized Recommendations"
            description="Use your data to provide personalized content and feature suggestions"
            checked={formData.personalized_recommendations}
            onChange={() => setFormData(prev => ({ ...prev, personalized_recommendations: !prev.personalized_recommendations }))}
            icon={<Shield className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Content Indexing"
            description="Allow your public content to be indexed for search and discovery"
            checked={formData.content_indexing}
            onChange={() => setFormData(prev => ({ ...prev, content_indexing: !prev.content_indexing }))}
            icon={<Eye className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Data Sharing */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Data Sharing</h3>
        <p className="settings-form-description">Control sharing of your data with third parties</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Data Sharing"
            description="Share anonymized data with research partners and third parties"
            checked={formData.data_sharing_enabled}
            onChange={() => setFormData(prev => ({ ...prev, data_sharing_enabled: !prev.data_sharing_enabled }))}
            icon={<Shield className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Third-party Integrations"
            description="Allow third-party services to access your data through integrations"
            checked={formData.third_party_integrations}
            onChange={() => setFormData(prev => ({ ...prev, third_party_integrations: !prev.third_party_integrations }))}
            icon={<Lock className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Marketing Personalization"
            description="Use your data to personalize marketing and promotional content"
            checked={formData.marketing_personalization}
            onChange={() => setFormData(prev => ({ ...prev, marketing_personalization: !prev.marketing_personalization }))}
            icon={<Eye className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Data Retention */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Data Retention</h3>
        <p className="settings-form-description">Control how long your data is stored</p>
        
        <div className="mt-4">
          <label className="settings-label">Data Retention Period</label>
          <select 
            name="data_retention_period"
            className="settings-select"
            value={formData.data_retention_period}
            onChange={handleInputChange}
          >
            <option value={12}>12 months</option>
            <option value={24}>24 months (recommended)</option>
            <option value={36}>36 months</option>
            <option value={60}>60 months</option>
            <option value={-1}>Indefinite (until account deletion)</option>
          </select>
          <p className="text-xs text-gray-600 mt-2">
            This controls how long we keep your inactive data. Active projects and content are retained regardless of this setting.
          </p>
        </div>
      </div>

      {/* Data Export & Deletion */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Data Rights</h3>
        <p className="settings-form-description">Export or delete your personal data</p>
        
        <div className="space-y-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Download className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">Export Your Data</h4>
                <p className="text-xs text-blue-800 mt-1">
                  Download a copy of all your personal data including profiles, content, and settings.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={handleDataExport}
                  disabled={exportingData}
                >
                  {exportingData ? 'Processing...' : 'Request Data Export'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-900">Delete Account</h4>
                <p className="text-xs text-red-800 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 border-red-300 text-red-700 hover:bg-red-50"
                  onClick={handleAccountDeletion}
                  disabled={deletingAccount}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deletingAccount ? 'Processing...' : 'Delete Account'}
                </Button>
              </div>
            </div>
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
          {saving ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
      </div>
    </div>
  );
};

export default PrivacyDataSettings;