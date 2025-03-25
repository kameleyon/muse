import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Smartphone, Database, Battery, Zap, Bell } from 'lucide-react';

const MobileSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mobile Settings
  const [dataUsage, setDataUsage] = useState('balanced');
  const [contentQuality, setContentQuality] = useState('balanced');
  const [offlineMode, setOfflineMode] = useState(true);
  const [batteryOptimization, setBatteryOptimization] = useState('adaptive');
  
  // Handle Mobile Settings Update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Mobile settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save mobile settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mobile-Specific Configuration</CardTitle>
        <CardDescription>
          Customize your MagicMuse experience on mobile devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-form-section">
          <h3 className="settings-form-title">Mobile Data Usage</h3>
          <p className="settings-form-description">Control how MagicMuse uses mobile data</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Data Usage Limit</label>
              <select 
                className="settings-select"
                value={dataUsage}
                onChange={(e) => setDataUsage(e.target.value)}
              >
                <option value="minimal">Minimal (Most conservative)</option>
                <option value="balanced">Balanced (Moderate data usage)</option>
                <option value="unrestricted">Unrestricted (Highest quality)</option>
              </select>
            </div>
            
            <div>
              <label className="settings-label">Content Quality on Mobile Data</label>
              <select
                className="settings-select"
                value={contentQuality}
                onChange={(e) => setContentQuality(e.target.value)}
              >
                <option value="low">Low (Fastest loading)</option>
                <option value="balanced">Balanced (Optimized for mobile)</option>
                <option value="high">High (Same as Wi-Fi)</option>
              </select>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Auto-reduce quality on slow connections</span>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Pause non-essential syncing on mobile data</span>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Touch Interface</h3>
          <p className="settings-form-description">Customize the mobile touch experience</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Touch Target Size</label>
              <select className="settings-select">
                <option>Normal</option>
                <option>Large</option>
                <option>Extra Large (Accessibility)</option>
              </select>
            </div>
            
            <div>
              <label className="settings-label">Gesture Customization</label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">Swipe left</p>
                    <p className="text-xs text-[#3d3d3a]">Current: Delete item</p>
                  </div>
                  <select className="text-sm py-1 px-2 border rounded bg-white">
                    <option>Delete item</option>
                    <option>Archive item</option>
                    <option>Mark as favorite</option>
                    <option>Custom action</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">Swipe right</p>
                    <p className="text-xs text-[#3d3d3a]">Current: Quick actions</p>
                  </div>
                  <select className="text-sm py-1 px-2 border rounded bg-white">
                    <option>Quick actions</option>
                    <option>Share</option>
                    <option>Edit</option>
                    <option>Custom action</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">Long press</p>
                    <p className="text-xs text-[#3d3d3a]">Current: Selection mode</p>
                  </div>
                  <select className="text-sm py-1 px-2 border rounded bg-white">
                    <option>Selection mode</option>
                    <option>Context menu</option>
                    <option>Preview</option>
                    <option>Custom action</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Offline Content</h3>
          <p className="settings-form-description">Configure how MagicMuse works offline on mobile devices</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={offlineMode}
                  onChange={() => setOfflineMode(!offlineMode)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable offline mode</span>
            </div>
            
            <div>
              <label className="settings-label">Content Prioritization</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Recently viewed documents</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Starred/favorited content</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">All active projects</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Template library</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="settings-label">Offline Storage Limit</label>
              <select className="settings-select">
                <option>250 MB</option>
                <option>500 MB</option>
                <option>1 GB</option>
                <option>2 GB</option>
                <option>5 GB</option>
                <option>Unlimited (Device storage dependent)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Mobile Notifications</h3>
          <p className="settings-form-description">Configure how notifications appear on mobile devices</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Notification Grouping</label>
              <select className="settings-select">
                <option>Group by project</option>
                <option>Group by type</option>
                <option>Group by priority</option>
                <option>No grouping</option>
              </select>
            </div>
            
            <div>
              <label className="settings-label">Notification Priority</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <Bell size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Comments and feedback</span>
                  </div>
                  <select className="text-sm py-1 px-2 border rounded bg-white">
                    <option>High</option>
                    <option>Normal</option>
                    <option>Low</option>
                    <option>Off</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <Bell size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Due dates and reminders</span>
                  </div>
                  <select className="text-sm py-1 px-2 border rounded bg-white">
                    <option>High</option>
                    <option>Normal</option>
                    <option>Low</option>
                    <option>Off</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <Bell size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">System updates</span>
                  </div>
                  <select className="text-sm py-1 px-2 border rounded bg-white">
                    <option>High</option>
                    <option>Normal</option>
                    <option>Low</option>
                    <option>Off</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Battery Optimization</h3>
          <p className="settings-form-description">Configure power-saving features for mobile devices</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Battery Mode</label>
              <select 
                className="settings-select"
                value={batteryOptimization}
                onChange={(e) => setBatteryOptimization(e.target.value)}
              >
                <option value="maximum">Maximum Performance</option>
                <option value="adaptive">Adaptive (Balance of battery and performance)</option>
                <option value="battery">Battery Saver (Extended battery life)</option>
              </select>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Auto-enable battery saver when below 20%</span>
            </div>
            
            <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
              <Battery size={20} className="mr-2 text-[#3d3d3a]" />
              <div>
                <p className="text-sm font-medium">Battery Usage</p>
                <p className="text-xs text-[#3d3d3a]">MagicMuse typically uses 2-5% of battery per hour of active use</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => {
            setDataUsage('balanced');
            setContentQuality('balanced');
            setOfflineMode(true);
            setBatteryOptimization('adaptive');
          }}
        >
          Reset to Default
        </Button>
        <Button 
          variant="primary" 
          className="text-white"
          isLoading={isLoading}
          onClick={handleSaveSettings}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MobileSettings;
