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
import { PlusCircle, Folder, Tag, Share2, Building, File } from 'lucide-react';
import FileTemplateIcon from '@/components/icons/FileTemplate';

const TemplateSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Template Settings
  const [templateSharing, setTemplateSharing] = useState(true);
  const [defaultTemplate, setDefaultTemplate] = useState('blank');
  const [organizationTemplates, setOrganizationTemplates] = useState(true);
  
  // Handle Template Settings Update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Template settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save template settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Settings</CardTitle>
        <CardDescription>
          Configure how templates are created, organized, and shared
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-form-section">
          <h3 className="settings-form-title">Template Creation</h3>
          <p className="settings-form-description">Configure options for creating and saving templates</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Template Save Location</label>
              <select className="settings-select">
                <option>Personal Templates</option>
                <option>Team Templates</option>
                <option>Project-Specific Templates</option>
                <option>Ask Each Time</option>
              </select>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Save metadata with templates</span>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Include style information in templates</span>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Prompt for template name on Save As Template</span>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Template Organization</h3>
          <p className="settings-form-description">Configure how templates are categorized and displayed</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Template Categories</label>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <Folder size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Business</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">✕</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <Folder size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Creative Writing</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">✕</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <Folder size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Academic</span>
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
              <label className="settings-label">Template Sorting</label>
              <select className="settings-select">
                <option>Alphabetical</option>
                <option>Most Recently Used</option>
                <option>Most Frequently Used</option>
                <option>Date Created</option>
                <option>Custom Order</option>
              </select>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Allow tagging templates</span>
            </div>
            
            <div className="space-y-2 mt-2">
              <label className="settings-label">Common Tags</label>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center bg-[#f9f7f1] px-2 py-1 rounded-md">
                  <Tag size={14} className="mr-1 text-[#3d3d3a]" />
                  <span className="text-xs">Draft</span>
                </div>
                <div className="inline-flex items-center bg-[#f9f7f1] px-2 py-1 rounded-md">
                  <Tag size={14} className="mr-1 text-[#3d3d3a]" />
                  <span className="text-xs">Final</span>
                </div>
                <div className="inline-flex items-center bg-[#f9f7f1] px-2 py-1 rounded-md">
                  <Tag size={14} className="mr-1 text-[#3d3d3a]" />
                  <span className="text-xs">Approved</span>
                </div>
                <div className="inline-flex items-center bg-[#f9f7f1] px-2 py-1 rounded-md">
                  <Tag size={14} className="mr-1 text-[#3d3d3a]" />
                  <span className="text-xs">Important</span>
                </div>
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                  <PlusCircle size={12} className="mr-1" />
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Template Sharing</h3>
          <p className="settings-form-description">Configure how templates can be shared with others</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={templateSharing}
                  onChange={() => setTemplateSharing(!templateSharing)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable template sharing</span>
            </div>
            
            {templateSharing && (
              <>
                <div>
                  <label className="settings-label">Default Sharing Permissions</label>
                  <select className="settings-select">
                    <option>View Only</option>
                    <option>View and Use</option>
                    <option>View, Use, and Edit</option>
                    <option>Full Access (including resharing)</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Track template usage by others</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Notify when templates are shared with me</span>
                </div>
                
                <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                  <Share2 size={20} className="mr-2 text-[#3d3d3a]" />
                  <div>
                    <p className="text-sm font-medium">Template Gallery</p>
                    <p className="text-xs text-[#3d3d3a]">Publish your templates to the MagicMuse Template Gallery</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Explore
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Default Templates</h3>
          <p className="settings-form-description">Configure the default templates for new content</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Default New Document Template</label>
              <select 
                className="settings-select"
                value={defaultTemplate}
                onChange={(e) => setDefaultTemplate(e.target.value)}
              >
                <option value="blank">Blank Document</option>
                <option value="basic">Basic Document</option>
                <option value="business">Business Report</option>
                <option value="creative">Creative Writing</option>
                <option value="academic">Academic Paper</option>
                <option value="custom">Custom Template</option>
              </select>
            </div>
            
            {defaultTemplate === 'custom' && (
              <div>
                <label className="settings-label">Custom Template</label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center p-2 border border-[#ae5630] rounded-md bg-[#f9f7f1]">
                    <FileTemplateIcon size={16} className="mr-2 text-[#ae5630]" />
                    <span className="text-sm">Novel Chapter</span>
                    <span className="ml-auto text-xs text-[#3d3d3a]">Personal Template</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Select Different Template
                  </Button>
                </div>
              </div>
            )}
            
            <div>
              <label className="settings-label">Content Type Templates</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <File size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Blog Post</span>
                  </div>
                  <select className="text-xs py-1 px-2 border rounded bg-white">
                    <option>Blog Template</option>
                    <option>Blank Document</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <File size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Newsletter</span>
                  </div>
                  <select className="text-xs py-1 px-2 border rounded bg-white">
                    <option>Newsletter Template</option>
                    <option>Blank Document</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <File size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Report</span>
                  </div>
                  <select className="text-xs py-1 px-2 border rounded bg-white">
                    <option>Business Report</option>
                    <option>Blank Document</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="mt-2">
                <PlusCircle size={16} className="mr-1" />
                Add Content Type
              </Button>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Brand Templates</h3>
          <p className="settings-form-description">Configure organizational templates and enforcement options</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={organizationTemplates}
                  onChange={() => setOrganizationTemplates(!organizationTemplates)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable organization templates</span>
            </div>
            
            {organizationTemplates && (
              <>
                <div>
                  <label className="settings-label">Organization Selection</label>
                  <select className="settings-select">
                    <option>Acme Corporation</option>
                    <option>Personal Templates</option>
                    <option>+ Add Organization</option>
                  </select>
                </div>
                
                <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                  <Building size={20} className="mr-2 text-[#3d3d3a]" />
                  <div>
                    <p className="text-sm font-medium">Acme Corporation Templates</p>
                    <p className="text-xs text-[#3d3d3a]">12 templates available</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Manage
                  </Button>
                </div>
                
                <div>
                  <label className="settings-label">Template Enforcement Level</label>
                  <select className="settings-select">
                    <option>Optional (Recommended but not required)</option>
                    <option>Preferred (Default but can be changed)</option>
                    <option>Required (Cannot override organization templates)</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Sync organization template updates automatically</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Template Variables</h3>
          <p className="settings-form-description">Configure dynamic content variables for templates</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable template variables</span>
            </div>
            
            <div>
              <label className="settings-label">Custom Variables</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">{"{company_name}"}</p>
                    <p className="text-xs text-[#3d3d3a]">Acme Corporation</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">{"{contact_email}"}</p>
                    <p className="text-xs text-[#3d3d3a]">contact@acmecorp.com</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">{"{legal_disclaimer}"}</p>
                    <p className="text-xs text-[#3d3d3a]">Standard legal text...</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="mt-2">
                <PlusCircle size={16} className="mr-1" />
                Add Variable
              </Button>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Prompt for variable values when using template</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => {
            setTemplateSharing(true);
            setDefaultTemplate('blank');
            setOrganizationTemplates(true);
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

export default TemplateSettings;
