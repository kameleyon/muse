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
import { Library, ImagePlus, Tag, Clock, RefreshCw, PlusCircle, Image, FileText, File, Database } from 'lucide-react';

const ResourceLibrarySettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Resource Library Settings
  const [resourceTracking, setResourceTracking] = useState(true);
  const [expirationReminders, setExpirationReminders] = useState(true);
  const [assetVersion, setAssetVersion] = useState(true);
  
  // Handle Resource Library Settings Update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Resource library settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save resource library settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Library Configuration</CardTitle>
        <CardDescription>
          Configure how digital assets are organized and managed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-form-section">
          <h3 className="settings-form-title">Asset Organization</h3>
          <p className="settings-form-description">Configure how resources are organized in the library</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Resource Categories</label>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <Image size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Images</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">✕</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <FileText size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Documents</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">✕</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <File size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Templates</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">✕</Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  className="settings-input"
                  placeholder="New category name"
                />
                <Button variant="outline" size="sm">
                  <PlusCircle size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            <div>
              <label className="settings-label">Resource Tagging</label>
              <div className="toggle-switch-container mb-2">
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Enable resource tagging</span>
              </div>
              
              <div className="space-y-2 mt-2">
                <label className="text-sm text-[#3d3d3a]">Common Tags</label>
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center bg-[#f9f7f1] px-2 py-1 rounded-md">
                    <Tag size={14} className="mr-1 text-[#3d3d3a]" />
                    <span className="text-xs">Logo</span>
                  </div>
                  <div className="inline-flex items-center bg-[#f9f7f1] px-2 py-1 rounded-md">
                    <Tag size={14} className="mr-1 text-[#3d3d3a]" />
                    <span className="text-xs">Brand</span>
                  </div>
                  <div className="inline-flex items-center bg-[#f9f7f1] px-2 py-1 rounded-md">
                    <Tag size={14} className="mr-1 text-[#3d3d3a]" />
                    <span className="text-xs">Template</span>
                  </div>
                  <div className="inline-flex items-center bg-[#f9f7f1] px-2 py-1 rounded-md">
                    <Tag size={14} className="mr-1 text-[#3d3d3a]" />
                    <span className="text-xs">Marketing</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                    <PlusCircle size={12} className="mr-1" />
                    Add Tag
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="settings-label">Metadata Fields</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Creation date</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Author/Creator</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">File size and type</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Description</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Usage rights</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Expiration date</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Usage Analytics</h3>
          <p className="settings-form-description">Configure resource usage tracking and analytics</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={resourceTracking}
                  onChange={() => setResourceTracking(!resourceTracking)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable resource usage tracking</span>
            </div>
            
            {resourceTracking && (
              <>
                <div>
                  <label className="settings-label">Track Usage In</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Documents</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Templates</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Shared content</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">External exports</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Usage Reports</label>
                  <select className="settings-select">
                    <option>None</option>
                    <option>Monthly Summary</option>
                    <option>Weekly Summary</option>
                    <option>Real-time Dashboard</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Track resource popularity for recommendations</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Digital Asset Expiration</h3>
          <p className="settings-form-description">Configure asset expiration monitoring and reminders</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={expirationReminders}
                  onChange={() => setExpirationReminders(!expirationReminders)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable asset expiration tracking</span>
            </div>
            
            {expirationReminders && (
              <>
                <div>
                  <label className="settings-label">Track License Types</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Stock images</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Fonts</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Audio/Music</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Premium icons/graphics</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Reminder Timing</label>
                  <select className="settings-select">
                    <option>1 week before expiration</option>
                    <option>2 weeks before expiration</option>
                    <option>1 month before expiration</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show visual indicators for expiring assets</span>
                </div>
                
                <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                  <Clock size={20} className="mr-2 text-[#3d3d3a]" />
                  <div>
                    <p className="text-sm font-medium">Asset Expiration</p>
                    <p className="text-xs text-[#3d3d3a]">3 assets expiring within 30 days</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Review
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">License Management</h3>
          <p className="settings-form-description">Configure how commercial assets licenses are managed</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">License Types</label>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">Standard License</p>
                    <p className="text-xs text-[#3d3d3a]">For internal use only</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">Extended License</p>
                    <p className="text-xs text-[#3d3d3a]">For commercial use</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">Enterprise License</p>
                    <p className="text-xs text-[#3d3d3a]">For unlimited organizational use</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <PlusCircle size={16} className="mr-1" />
                Add License Type
              </Button>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Require license information for new assets</span>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Restrict usage based on license terms</span>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Store license documents with assets</span>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Asset Version Control</h3>
          <p className="settings-form-description">Configure version control for resource assets</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={assetVersion}
                  onChange={() => setAssetVersion(!assetVersion)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable asset versioning</span>
            </div>
            
            {assetVersion && (
              <>
                <div>
                  <label className="settings-label">Version Storage</label>
                  <select className="settings-select">
                    <option>Keep all versions</option>
                    <option>Keep last 5 versions</option>
                    <option>Keep versions from last 30 days</option>
                    <option>Custom retention policy</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Propagate updates to documents using this asset</span>
                </div>
                
                <div>
                  <label className="settings-label">Update Notification</label>
                  <select className="settings-select">
                    <option>Ask before updating</option>
                    <option>Always update automatically</option>
                    <option>Never update automatically</option>
                  </select>
                </div>
                
                <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                  <RefreshCw size={20} className="mr-2 text-[#3d3d3a]" />
                  <div>
                    <p className="text-sm font-medium">Asset Updates</p>
                    <p className="text-xs text-[#3d3d3a]">5 documents using outdated assets</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Update All
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Storage & Import</h3>
          <p className="settings-form-description">Configure resource library storage and import options</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Storage Location</label>
              <select className="settings-select">
                <option>MagicMuse Cloud (Default)</option>
                <option>Google Drive</option>
                <option>Dropbox</option>
                <option>OneDrive</option>
                <option>Custom Storage</option>
              </select>
            </div>
            
            <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
              <Database size={20} className="mr-2 text-[#3d3d3a]" />
              <div className="flex-1">
                <p className="text-sm font-medium">Storage Usage</p>
                <p className="text-xs text-[#3d3d3a]">Using 8.2 GB of 25 GB allocated (Premium Plan)</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Upgrade
              </Button>
            </div>
            
            <div>
              <label className="settings-label">Bulk Import Settings</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Extract metadata from imported files</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Auto-categorize based on file type</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Auto-tag based on content analysis</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Prompt for metadata during import</span>
                </label>
              </div>
            </div>
            
            <div>
              <Button variant="outline" size="sm">
                <ImagePlus size={16} className="mr-1" />
                Import Resources
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
            setResourceTracking(true);
            setExpirationReminders(true);
            setAssetVersion(true);
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

export default ResourceLibrarySettings;
