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
import { History, Save, AlertTriangle, Clock, Archive } from 'lucide-react';

const VersionHistorySettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Version History Settings
  const [autoVersioning, setAutoVersioning] = useState('moderate');
  const [namedVersions, setNamedVersions] = useState(true);
  const [comparisonView, setComparisonView] = useState('side-by-side');
  const [storageLimit, setStorageLimit] = useState('standard');
  
  // Handle Version History Settings Update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Version history settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save version history settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History Management</CardTitle>
        <CardDescription>
          Configure how MagicMuse tracks and manages document versions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-form-section">
          <h3 className="settings-form-title">Auto-Versioning</h3>
          <p className="settings-form-description">Configure how often MagicMuse creates automatic versions</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Auto-Versioning Frequency</label>
              <select 
                className="settings-select"
                value={autoVersioning}
                onChange={(e) => setAutoVersioning(e.target.value)}
              >
                <option value="minimal">Minimal (Major changes only)</option>
                <option value="moderate">Moderate (Regular intervals)</option>
                <option value="frequent">Frequent (All changes)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            {autoVersioning === 'moderate' && (
              <div>
                <label className="settings-label">Version Creation Interval</label>
                <select className="settings-select">
                  <option>Every 10 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every hour</option>
                  <option>Every session</option>
                </select>
              </div>
            )}
            
            {autoVersioning === 'custom' && (
              <div className="space-y-4">
                <div>
                  <label className="settings-label">Time-Based Versioning</label>
                  <select className="settings-select">
                    <option>Disabled</option>
                    <option>Every 10 minutes</option>
                    <option>Every 30 minutes</option>
                    <option>Every hour</option>
                    <option>Every day</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Change-Based Versioning</label>
                  <select className="settings-select">
                    <option>Disabled</option>
                    <option>After 10 changes</option>
                    <option>After 50 changes</option>
                    <option>After 100 changes</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Create version when sharing document</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Named Version Points</h3>
          <p className="settings-form-description">Configure how you create significant milestone versions</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={namedVersions}
                  onChange={() => setNamedVersions(!namedVersions)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable named version points</span>
            </div>
            
            {namedVersions && (
              <>
                <div>
                  <label className="settings-label">Default Version Prefixes</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Draft</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Review</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Final</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Published</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Custom Version Prefix</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="settings-input"
                      placeholder="e.g., Milestone"
                    />
                    <Button variant="outline" size="sm">Add</Button>
                  </div>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Add timestamp to version names</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Version Comparison</h3>
          <p className="settings-form-description">Configure how versions are displayed when comparing</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Comparison View</label>
              <select 
                className="settings-select"
                value={comparisonView}
                onChange={(e) => setComparisonView(e.target.value)}
              >
                <option value="side-by-side">Side-by-Side</option>
                <option value="inline">Inline Changes</option>
                <option value="unified">Unified View</option>
                <option value="combined">Combined (Side-by-Side + Inline)</option>
              </select>
            </div>
            
            <div>
              <label className="settings-label">Change Highlighting</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Highlight added content</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Highlight removed content</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Highlight modified content</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Highlight formatting changes</span>
                </label>
              </div>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Show author information for changes</span>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Restoration Points</h3>
          <p className="settings-form-description">Configure restoration point creation and management</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Create restoration points automatically</span>
            </div>
            
            <div>
              <label className="settings-label">Restoration Point Frequency</label>
              <select className="settings-select">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Before major changes</option>
              </select>
            </div>
            
            <div>
              <label className="settings-label">Quick Restore Access</label>
              <select className="settings-select">
                <option>Last 5 versions</option>
                <option>Last 10 versions</option>
                <option>Last 30 days</option>
                <option>All versions</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Version Storage</h3>
          <p className="settings-form-description">Configure how much version history is stored</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Storage Allocation</label>
              <select 
                className="settings-select"
                value={storageLimit}
                onChange={(e) => setStorageLimit(e.target.value)}
              >
                <option value="minimal">Minimal (Latest 10 versions)</option>
                <option value="standard">Standard (30 days of history)</option>
                <option value="extended">Extended (90 days of history)</option>
                <option value="unlimited">Unlimited (All history)</option>
              </select>
              <p className="text-xs text-[#3d3d3a] mt-1">
                {storageLimit === 'unlimited' && "Available on Premium and Team plans only"}
              </p>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Preserve named versions indefinitely</span>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Notify before automatic version cleanup</span>
            </div>
            
            <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
              <Archive size={20} className="mr-2 text-[#3d3d3a]" />
              <div className="flex-1">
                <p className="text-sm font-medium">Current Version Storage</p>
                <p className="text-xs text-[#3d3d3a]">Using 0.8 GB of 2 GB allocated (Premium Plan)</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Manage
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => {
            setAutoVersioning('moderate');
            setNamedVersions(true);
            setComparisonView('side-by-side');
            setStorageLimit('standard');
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

export default VersionHistorySettings;
