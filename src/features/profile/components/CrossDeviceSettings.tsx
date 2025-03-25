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
import { Smartphone, Laptop, Monitor, RefreshCw, AlertTriangle } from 'lucide-react';

const CrossDeviceSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Sync Settings
  const [syncFrequency, setSyncFrequency] = useState('automatic');
  const [contentPriority, setContentPriority] = useState('recent');
  const [devicesExpanded, setDevicesExpanded] = useState(false);
  const [conflictResolution, setConflictResolution] = useState('ask');
  
  // Handle Sync Settings Update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Cross-device synchronization settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save synchronization settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Device Synchronization</CardTitle>
        <CardDescription>
          Configure how MagicMuse synchronizes across your devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-form-section">
          <h3 className="settings-form-title">Device-Specific UI Preferences</h3>
          <p className="settings-form-description">Customize UI settings for different devices</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable device-specific preferences</span>
            </div>
            
            <div>
              <div className="mb-3">
                <label className="settings-label">Current Device: Desktop</label>
                <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                  <Monitor size={20} className="mr-2 text-[#3d3d3a]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Windows PC</p>
                    <p className="text-xs text-[#3d3d3a]">Last synced: Just now</p>
                  </div>
                  <div className="text-xs text-green-600 bg-green-100 py-1 px-2 rounded-full">Current</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center mb-2 justify-between">
                  <h4 className="text-sm font-medium">Other Devices</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setDevicesExpanded(!devicesExpanded)}
                  >
                    {devicesExpanded ? 'Show Less' : 'Show All'}
                  </Button>
                </div>
                
                <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                  <Smartphone size={20} className="mr-2 text-[#3d3d3a]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">iPhone 13</p>
                    <p className="text-xs text-[#3d3d3a]">Last synced: 2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    Settings
                  </Button>
                </div>
                
                <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                  <Laptop size={20} className="mr-2 text-[#3d3d3a]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">MacBook Pro</p>
                    <p className="text-xs text-[#3d3d3a]">Last synced: Yesterday</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    Settings
                  </Button>
                </div>
                
                {devicesExpanded && (
                  <>
                    <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                      <Laptop size={20} className="mr-2 text-[#3d3d3a]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Work Laptop</p>
                        <p className="text-xs text-[#3d3d3a]">Last synced: 3 days ago</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        Settings
                      </Button>
                    </div>
                    
                    <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                      <Smartphone size={20} className="mr-2 text-[#3d3d3a]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">iPad Pro</p>
                        <p className="text-xs text-[#3d3d3a]">Last synced: 1 week ago</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        Settings
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <Button variant="outline" size="sm" className="flex items-center">
                <RefreshCw size={16} className="mr-1" />
                Sync All Devices Now
              </Button>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Sync Frequency</h3>
          <p className="settings-form-description">Configure how often MagicMuse synchronizes content</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Sync Frequency</label>
              <select 
                className="settings-select"
                value={syncFrequency}
                onChange={(e) => setSyncFrequency(e.target.value)}
              >
                <option value="realtime">Real-time (Continuous)</option>
                <option value="automatic">Automatic (Based on activity)</option>
                <option value="manual">Manual (Only when triggered)</option>
                <option value="scheduled">Scheduled (At specific intervals)</option>
              </select>
            </div>
            
            {syncFrequency === 'scheduled' && (
              <div>
                <label className="settings-label">Sync Interval</label>
                <select className="settings-select">
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every hour</option>
                  <option>Every 3 hours</option>
                  <option>Every 12 hours</option>
                  <option>Once a day</option>
                </select>
              </div>
            )}
            
            <div>
              <label className="settings-label">Network Restrictions</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Sync on Wi-Fi</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Sync on mobile data</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Sync when charging</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Content Prioritization</h3>
          <p className="settings-form-description">Configure which content syncs first</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Sync Priority</label>
              <select 
                className="settings-select"
                value={contentPriority}
                onChange={(e) => setContentPriority(e.target.value)}
              >
                <option value="recent">Recent documents first</option>
                <option value="starred">Starred items first</option>
                <option value="size">Smallest files first</option>
                <option value="custom">Custom priority rules</option>
              </select>
            </div>
            
            <div>
              <label className="settings-label">Storage Limits</label>
              <select className="settings-select">
                <option>No limit (Sync everything)</option>
                <option>Last 30 days of content</option>
                <option>Last 90 days of content</option>
                <option>Custom storage limit</option>
              </select>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Auto-cleanup old synced content</span>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Conflict Resolution</h3>
          <p className="settings-form-description">Configure how MagicMuse handles sync conflicts</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Conflict Resolution Strategy</label>
              <select 
                className="settings-select"
                value={conflictResolution}
                onChange={(e) => setConflictResolution(e.target.value)}
              >
                <option value="ask">Ask me every time</option>
                <option value="recent">Use most recent version</option>
                <option value="device">Prioritize specific devices</option>
                <option value="merge">Auto-merge when possible</option>
              </select>
            </div>
            
            {conflictResolution === 'device' && (
              <div>
                <label className="settings-label">Device Priority</label>
                <div className="space-y-2">
                  <div className="flex items-center p-2 bg-[#f9f7f1] rounded-md justify-between">
                    <div className="flex items-center">
                      <Monitor size={18} className="mr-2 text-[#3d3d3a]" />
                      <span className="text-sm">Windows PC</span>
                    </div>
                    <select className="text-sm py-1 px-2 border rounded bg-white">
                      <option>Highest</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center p-2 bg-[#f9f7f1] rounded-md justify-between">
                    <div className="flex items-center">
                      <Smartphone size={18} className="mr-2 text-[#3d3d3a]" />
                      <span className="text-sm">iPhone 13</span>
                    </div>
                    <select className="text-sm py-1 px-2 border rounded bg-white">
                      <option>Highest</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center p-2 bg-[#f9f7f1] rounded-md justify-between">
                    <div className="flex items-center">
                      <Laptop size={18} className="mr-2 text-[#3d3d3a]" />
                      <span className="text-sm">MacBook Pro</span>
                    </div>
                    <select className="text-sm py-1 px-2 border rounded bg-white">
                      <option>Highest</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Save conflict versions as separate files</span>
            </div>
            
            <div className="flex items-center p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <AlertTriangle size={20} className="mr-2 text-yellow-600" />
              <p className="text-sm text-yellow-800">3 conflicts waiting for resolution</p>
              <Button variant="outline" size="sm" className="ml-auto">
                Resolve Now
              </Button>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Device Capability Awareness</h3>
          <p className="settings-form-description">Configure how features adapt to different devices</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable capability-aware features</span>
            </div>
            
            <div>
              <label className="settings-label">Desktop-Only Features</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Show on capable mobile devices</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Show with performance warning</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Hide completely on mobile</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Handoff Between Devices</h3>
          <p className="settings-form-description">Configure continuity features between your devices</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable handoff between devices</span>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Remember cursor position and scroll state</span>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Transfer session state and UI layout</span>
            </div>
            
            <div>
              <label className="settings-label">Handoff Notification</label>
              <select className="settings-select">
                <option>Always notify</option>
                <option>Only notify for active documents</option>
                <option>Silent handoff</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => {
            setSyncFrequency('automatic');
            setContentPriority('recent');
            setConflictResolution('ask');
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

export default CrossDeviceSettings;
