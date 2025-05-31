import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Github, Slack, FileText, Cloud, Link, Check, X, ExternalLink } from 'lucide-react';

interface ConnectedService {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  connected: boolean;
  api_key?: string;
  last_sync?: string;
  status: 'connected' | 'disconnected' | 'error';
}

interface IntegrationSettings {
  id: string;
  user_id: string;
  google_drive_enabled: boolean;
  google_drive_api_key?: string;
  dropbox_enabled: boolean;
  dropbox_api_key?: string;
  github_enabled: boolean;
  github_api_key?: string;
  slack_enabled: boolean;
  slack_webhook_url?: string;
  notion_enabled: boolean;
  notion_api_key?: string;
  auto_sync_enabled: boolean;
  sync_frequency: 'real_time' | 'hourly' | 'daily';
  backup_to_cloud: boolean;
  export_format: 'markdown' | 'docx' | 'pdf' | 'html';
  created_at: string;
  updated_at: string;
}

const ConnectedServicesSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [settings, setSettings] = useState<IntegrationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    google_drive_enabled: false,
    google_drive_api_key: '',
    dropbox_enabled: false,
    dropbox_api_key: '',
    github_enabled: false,
    github_api_key: '',
    slack_enabled: false,
    slack_webhook_url: '',
    notion_enabled: false,
    notion_api_key: '',
    auto_sync_enabled: true,
    sync_frequency: 'daily' as 'real_time' | 'hourly' | 'daily',
    backup_to_cloud: true,
    export_format: 'markdown' as 'markdown' | 'docx' | 'pdf' | 'html'
  });

  const [services, setServices] = useState<ConnectedService[]>([
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: <Cloud className="h-6 w-6" />,
      description: 'Sync your books and documents to Google Drive',
      connected: false,
      status: 'disconnected'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: <Cloud className="h-6 w-6" />,
      description: 'Backup your content to Dropbox automatically',
      connected: false,
      status: 'disconnected'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <Github className="h-6 w-6" />,
      description: 'Version control for your writing projects',
      connected: false,
      status: 'disconnected'
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: <Slack className="h-6 w-6" />,
      description: 'Get notifications about your writing progress',
      connected: false,
      status: 'disconnected'
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: <FileText className="h-6 w-6" />,
      description: 'Export your content to Notion databases',
      connected: false,
      status: 'disconnected'
    }
  ]);

  useEffect(() => {
    if (user) {
      loadIntegrationSettings();
    }
  }, [user]);

  const loadIntegrationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('integration_settings')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading integration settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
        setFormData({
          google_drive_enabled: data.google_drive_enabled ?? false,
          google_drive_api_key: data.google_drive_api_key ?? '',
          dropbox_enabled: data.dropbox_enabled ?? false,
          dropbox_api_key: data.dropbox_api_key ?? '',
          github_enabled: data.github_enabled ?? false,
          github_api_key: data.github_api_key ?? '',
          slack_enabled: data.slack_enabled ?? false,
          slack_webhook_url: data.slack_webhook_url ?? '',
          notion_enabled: data.notion_enabled ?? false,
          notion_api_key: data.notion_api_key ?? '',
          auto_sync_enabled: data.auto_sync_enabled ?? true,
          sync_frequency: data.sync_frequency ?? 'daily',
          backup_to_cloud: data.backup_to_cloud ?? true,
          export_format: data.export_format ?? 'markdown'
        });

        // Update services status based on settings
        setServices(prev => prev.map(service => ({
          ...service,
          connected: getServiceConnectionStatus(service.id, data),
          status: getServiceConnectionStatus(service.id, data) ? 'connected' : 'disconnected'
        })));
      } else {
        // Create default settings
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Error loading integration settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceConnectionStatus = (serviceId: string, data: any) => {
    switch (serviceId) {
      case 'google-drive': return data.google_drive_enabled && data.google_drive_api_key;
      case 'dropbox': return data.dropbox_enabled && data.dropbox_api_key;
      case 'github': return data.github_enabled && data.github_api_key;
      case 'slack': return data.slack_enabled && data.slack_webhook_url;
      case 'notion': return data.notion_enabled && data.notion_api_key;
      default: return false;
    }
  };

  const createDefaultSettings = async () => {
    const defaultSettings = {
      id: user?.id,
      user_id: user?.id,
      google_drive_enabled: false,
      dropbox_enabled: false,
      github_enabled: false,
      slack_enabled: false,
      notion_enabled: false,
      auto_sync_enabled: true,
      sync_frequency: 'daily',
      backup_to_cloud: true,
      export_format: 'markdown',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdSettings, error: createError } = await supabase
      .from('integration_settings')
      .insert(defaultSettings)
      .select()
      .single();

    if (createError) {
      console.error('Error creating integration settings:', createError);
    } else {
      setSettings(createdSettings);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    const enabledField = `${serviceId.replace('-', '_')}_enabled` as keyof typeof formData;
    setFormData(prev => ({
      ...prev,
      [enabledField]: !prev[enabledField]
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
        .from('integration_settings')
        .upsert({
          id: user.id,
          user_id: user.id,
          ...updateData
        });

      if (error) {
        console.error('Error saving integration settings:', error);
        alert('Failed to save integration settings. Please try again.');
      } else {
        alert('Integration settings saved successfully!');
        loadIntegrationSettings();
      }
    } catch (error) {
      console.error('Error saving integration settings:', error);
      alert('Failed to save integration settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (serviceId: string) => {
    // This would implement actual API testing
    alert(`Testing connection to ${serviceId}... (This would test the actual API connection)`);
  };

  const ServiceCard = ({ service }: { service: ConnectedService }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1 text-gray-600">
            {service.icon}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">{service.name}</h4>
            <p className="text-xs text-gray-600 mt-1">{service.description}</p>
            
            {service.connected && (
              <div className="flex items-center mt-2 text-xs text-green-600">
                <Check className="h-3 w-3 mr-1" />
                Connected {service.last_sync && `• Last sync: ${service.last_sync}`}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {service.connected && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTestConnection(service.id)}
            >
              Test
            </Button>
          )}
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={service.connected}
              onChange={() => handleServiceToggle(service.id)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
      
      {service.connected && (
        <div className="mt-4 space-y-3">
          {service.id === 'google-drive' && (
            <input
              type="password"
              name="google_drive_api_key"
              placeholder="Google Drive API Key"
              className="settings-input text-xs"
              value={formData.google_drive_api_key}
              onChange={handleInputChange}
            />
          )}
          {service.id === 'dropbox' && (
            <input
              type="password"
              name="dropbox_api_key"
              placeholder="Dropbox API Key"
              className="settings-input text-xs"
              value={formData.dropbox_api_key}
              onChange={handleInputChange}
            />
          )}
          {service.id === 'github' && (
            <input
              type="password"
              name="github_api_key"
              placeholder="GitHub Personal Access Token"
              className="settings-input text-xs"
              value={formData.github_api_key}
              onChange={handleInputChange}
            />
          )}
          {service.id === 'slack' && (
            <input
              type="password"
              name="slack_webhook_url"
              placeholder="Slack Webhook URL"
              className="settings-input text-xs"
              value={formData.slack_webhook_url}
              onChange={handleInputChange}
            />
          )}
          {service.id === 'notion' && (
            <input
              type="password"
              name="notion_api_key"
              placeholder="Notion API Key"
              className="settings-input text-xs"
              value={formData.notion_api_key}
              onChange={handleInputChange}
            />
          )}
        </div>
      )}
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
        <h3 className="settings-form-title">Connected Services</h3>
        <p className="settings-form-description">Connect and manage external services and integrations</p>
      </div>

      {/* Connected Services */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Available Integrations</h3>
        <p className="settings-form-description">Connect external services to enhance your workflow</p>
        
        <div className="grid grid-cols-1 gap-4 mt-4">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Sync Settings */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Sync & Backup Settings</h3>
        <p className="settings-form-description">Configure how your data syncs with connected services</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="auto_sync_enabled"
                checked={formData.auto_sync_enabled}
                onChange={handleInputChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="text-sm">Enable automatic sync</span>
          </div>
          
          <div>
            <label className="settings-label">Sync Frequency</label>
            <select 
              name="sync_frequency"
              className="settings-select"
              value={formData.sync_frequency}
              onChange={handleInputChange}
            >
              <option value="real_time">Real-time</option>
              <option value="hourly">Every hour</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="backup_to_cloud"
                checked={formData.backup_to_cloud}
                onChange={handleInputChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="text-sm">Automatically backup to connected cloud services</span>
          </div>
        </div>
      </div>

      {/* Export Settings */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Export Settings</h3>
        <p className="settings-form-description">Configure default export format for connected services</p>
        
        <div className="mt-4">
          <label className="settings-label">Default Export Format</label>
          <select 
            name="export_format"
            className="settings-select"
            value={formData.export_format}
            onChange={handleInputChange}
          >
            <option value="markdown">Markdown (.md)</option>
            <option value="docx">Word Document (.docx)</option>
            <option value="pdf">PDF (.pdf)</option>
            <option value="html">HTML (.html)</option>
          </select>
        </div>
      </div>

      {/* Help Section */}
      <div className="settings-form-section">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Need Help Setting Up Integrations?</h4>
              <p className="text-xs text-blue-800 mt-1">
                Visit our integration guides for step-by-step instructions on connecting each service.
              </p>
              <Button variant="outline" size="sm" className="mt-3 text-blue-700 border-blue-300">
                View Integration Guides
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => setFormData({
            google_drive_enabled: false,
            google_drive_api_key: '',
            dropbox_enabled: false,
            dropbox_api_key: '',
            github_enabled: false,
            github_api_key: '',
            slack_enabled: false,
            slack_webhook_url: '',
            notion_enabled: false,
            notion_api_key: '',
            auto_sync_enabled: true,
            sync_frequency: 'daily',
            backup_to_cloud: true,
            export_format: 'markdown'
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

export default ConnectedServicesSettings;
