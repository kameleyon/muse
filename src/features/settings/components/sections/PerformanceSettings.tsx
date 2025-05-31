import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Zap, Monitor, Database, Cpu, HardDrive, Wifi } from 'lucide-react';

interface PerformanceSettings {
  id: string;
  user_id: string;
  auto_save_enabled: boolean;
  auto_save_interval: number; // in seconds
  cache_enabled: boolean;
  cache_size_limit: number; // in MB
  preload_content: boolean;
  lazy_loading: boolean;
  image_compression: boolean;
  compression_quality: number; // 1-100
  background_sync: boolean;
  offline_mode: boolean;
  memory_optimization: boolean;
  animation_reduced: boolean;
  font_preloading: boolean;
  concurrent_operations: number;
  request_timeout: number; // in seconds
  created_at: string;
  updated_at: string;
}

const PerformanceSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [settings, setSettings] = useState<PerformanceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    auto_save_enabled: true,
    auto_save_interval: 30,
    cache_enabled: true,
    cache_size_limit: 100,
    preload_content: true,
    lazy_loading: true,
    image_compression: true,
    compression_quality: 80,
    background_sync: true,
    offline_mode: false,
    memory_optimization: true,
    animation_reduced: false,
    font_preloading: true,
    concurrent_operations: 3,
    request_timeout: 30
  });

  useEffect(() => {
    if (user) {
      loadPerformanceSettings();
    }
  }, [user]);

  const loadPerformanceSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('performance_settings')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading performance settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
        setFormData({
          auto_save_enabled: data.auto_save_enabled ?? true,
          auto_save_interval: data.auto_save_interval ?? 30,
          cache_enabled: data.cache_enabled ?? true,
          cache_size_limit: data.cache_size_limit ?? 100,
          preload_content: data.preload_content ?? true,
          lazy_loading: data.lazy_loading ?? true,
          image_compression: data.image_compression ?? true,
          compression_quality: data.compression_quality ?? 80,
          background_sync: data.background_sync ?? true,
          offline_mode: data.offline_mode ?? false,
          memory_optimization: data.memory_optimization ?? true,
          animation_reduced: data.animation_reduced ?? false,
          font_preloading: data.font_preloading ?? true,
          concurrent_operations: data.concurrent_operations ?? 3,
          request_timeout: data.request_timeout ?? 30
        });
      } else {
        // Create default settings
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Error loading performance settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    const defaultSettings = {
      id: user?.id,
      user_id: user?.id,
      auto_save_enabled: true,
      auto_save_interval: 30,
      cache_enabled: true,
      cache_size_limit: 100,
      preload_content: true,
      lazy_loading: true,
      image_compression: true,
      compression_quality: 80,
      background_sync: true,
      offline_mode: false,
      memory_optimization: true,
      animation_reduced: false,
      font_preloading: true,
      concurrent_operations: 3,
      request_timeout: 30,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdSettings, error: createError } = await supabase
      .from('performance_settings')
      .insert(defaultSettings)
      .select()
      .single();

    if (createError) {
      console.error('Error creating performance settings:', createError);
    } else {
      setSettings(createdSettings);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'range' || type === 'number' ? parseInt(value) : value
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
        .from('performance_settings')
        .upsert({
          id: user.id,
          user_id: user.id,
          ...updateData
        });

      if (error) {
        console.error('Error saving performance settings:', error);
        alert('Failed to save performance settings. Please try again.');
      } else {
        alert('Performance settings saved successfully!');
        loadPerformanceSettings();
      }
    } catch (error) {
      console.error('Error saving performance settings:', error);
      alert('Failed to save performance settings. Please try again.');
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
        <h3 className="settings-form-title">Performance Optimization</h3>
        <p className="settings-form-description">Configure performance settings to optimize your experience</p>
      </div>

      {/* Auto-Save Settings */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Auto-Save & Data</h3>
        <p className="settings-form-description">Control automatic saving and data management</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Auto-Save"
            description="Automatically save your work while writing"
            checked={formData.auto_save_enabled}
            onChange={() => setFormData(prev => ({ ...prev, auto_save_enabled: !prev.auto_save_enabled }))}
            icon={<HardDrive className="h-5 w-5" />}
          />
          
          {formData.auto_save_enabled && (
            <div>
              <label className="settings-label">Auto-Save Interval</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  name="auto_save_interval"
                  min="10"
                  max="300"
                  step="10"
                  value={formData.auto_save_interval}
                  onChange={handleInputChange}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-gray-600 min-w-[80px]">{formData.auto_save_interval} seconds</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cache & Storage */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Cache & Storage</h3>
        <p className="settings-form-description">Manage local storage and caching for better performance</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Enable Caching"
            description="Cache frequently used content for faster loading"
            checked={formData.cache_enabled}
            onChange={() => setFormData(prev => ({ ...prev, cache_enabled: !prev.cache_enabled }))}
            icon={<Database className="h-5 w-5" />}
          />
          
          {formData.cache_enabled && (
            <div>
              <label className="settings-label">Cache Size Limit</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  name="cache_size_limit"
                  min="50"
                  max="500"
                  step="25"
                  value={formData.cache_size_limit}
                  onChange={handleInputChange}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-gray-600 min-w-[60px]">{formData.cache_size_limit} MB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Loading */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Content Loading</h3>
        <p className="settings-form-description">Optimize how content is loaded and displayed</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Preload Content"
            description="Load content in advance for smoother navigation"
            checked={formData.preload_content}
            onChange={() => setFormData(prev => ({ ...prev, preload_content: !prev.preload_content }))}
            icon={<Zap className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Lazy Loading"
            description="Load images and content only when needed"
            checked={formData.lazy_loading}
            onChange={() => setFormData(prev => ({ ...prev, lazy_loading: !prev.lazy_loading }))}
            icon={<Monitor className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Font Preloading"
            description="Preload fonts for consistent text rendering"
            checked={formData.font_preloading}
            onChange={() => setFormData(prev => ({ ...prev, font_preloading: !prev.font_preloading }))}
            icon={<Monitor className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Image & Media */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Image & Media Optimization</h3>
        <p className="settings-form-description">Control image compression and media handling</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Image Compression"
            description="Compress images to reduce file size and improve loading"
            checked={formData.image_compression}
            onChange={() => setFormData(prev => ({ ...prev, image_compression: !prev.image_compression }))}
            icon={<Monitor className="h-5 w-5" />}
          />
          
          {formData.image_compression && (
            <div>
              <label className="settings-label">Compression Quality</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  name="compression_quality"
                  min="20"
                  max="100"
                  step="5"
                  value={formData.compression_quality}
                  onChange={handleInputChange}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-gray-600 min-w-[40px]">{formData.compression_quality}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Higher quality = larger file size</p>
            </div>
          )}
        </div>
      </div>

      {/* System Performance */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">System Performance</h3>
        <p className="settings-form-description">Advanced performance and accessibility options</p>
        
        <div className="space-y-4 mt-4">
          <ToggleSwitch
            label="Memory Optimization"
            description="Optimize memory usage for better performance"
            checked={formData.memory_optimization}
            onChange={() => setFormData(prev => ({ ...prev, memory_optimization: !prev.memory_optimization }))}
            icon={<Cpu className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Reduced Animations"
            description="Reduce animations for better performance and accessibility"
            checked={formData.animation_reduced}
            onChange={() => setFormData(prev => ({ ...prev, animation_reduced: !prev.animation_reduced }))}
            icon={<Monitor className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Background Sync"
            description="Sync data in the background for real-time updates"
            checked={formData.background_sync}
            onChange={() => setFormData(prev => ({ ...prev, background_sync: !prev.background_sync }))}
            icon={<Wifi className="h-5 w-5" />}
          />
          
          <ToggleSwitch
            label="Offline Mode"
            description="Enable offline functionality when possible"
            checked={formData.offline_mode}
            onChange={() => setFormData(prev => ({ ...prev, offline_mode: !prev.offline_mode }))}
            icon={<Database className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Network Settings */}
      <div className="settings-form-section">
        <h3 className="settings-form-title">Network Settings</h3>
        <p className="settings-form-description">Configure network-related performance options</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="settings-label">Concurrent Operations</label>
            <input
              type="number"
              name="concurrent_operations"
              min="1"
              max="10"
              value={formData.concurrent_operations}
              onChange={handleInputChange}
              className="settings-input"
            />
            <p className="text-xs text-gray-500 mt-1">Number of simultaneous network requests</p>
          </div>
          
          <div>
            <label className="settings-label">Request Timeout (seconds)</label>
            <input
              type="number"
              name="request_timeout"
              min="10"
              max="120"
              value={formData.request_timeout}
              onChange={handleInputChange}
              className="settings-input"
            />
            <p className="text-xs text-gray-500 mt-1">Time to wait before request fails</p>
          </div>
        </div>
      </div>
      
      <div className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => setFormData({
            auto_save_enabled: true,
            auto_save_interval: 30,
            cache_enabled: true,
            cache_size_limit: 100,
            preload_content: true,
            lazy_loading: true,
            image_compression: true,
            compression_quality: 80,
            background_sync: true,
            offline_mode: false,
            memory_optimization: true,
            animation_reduced: false,
            font_preloading: true,
            concurrent_operations: 3,
            request_timeout: 30
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

export default PerformanceSettings;
