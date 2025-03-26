import React from 'react';
import { Button } from '@/components/ui/Button';

const CollaborationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Default Sharing Settings</h3>
        <p className="settings-form-description">Configure default permissions when sharing content</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Default Permission Level</label>
            <select className="settings-input">
              <option>View only</option>
              <option>Comment</option>
              <option>Suggest edits</option>
              <option>Edit</option>
              <option>Full access (edit and share)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Allow recipients to download shared content</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Allow recipients to copy shared content</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Allow recipients to share with others</span>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Comment Permissions</h3>
        <p className="settings-form-description">Configure how comments work in shared documents</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Default Comment Settings</label>
            <select className="settings-input">
              <option>Anyone with access can comment</option>
              <option>Only specific permission levels can comment</option>
              <option>Only team members can comment</option>
              <option>Comments disabled by default</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Allow comment reactions</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Allow comment threading/replies</span>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Team Access Controls</h3>
        <p className="settings-form-description">Configure access levels for team members</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Team Members</label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#ae5630] flex items-center justify-center text-white text-sm mr-2">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-[#3d3d3a]">john.doe@example.com</p>
                  </div>
                </div>
                <select className="text-sm py-1 px-2 border rounded bg-white">
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#6d371f] flex items-center justify-center text-white text-sm mr-2">
                    JS
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jane Smith</p>
                    <p className="text-xs text-[#3d3d3a]">jane.smith@example.com</p>
                  </div>
                </div>
                <select className="text-sm py-1 px-2 border rounded bg-white">
                  <option>Admin</option>
                  <option selected>Editor</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <Button variant="outline" size="sm">
              Invite New Team Member
            </Button>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">External Collaborator Limitations</h3>
        <p className="settings-form-description">Set access limitations for external collaborators</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Require authentication for external access</span>
          </div>
          
          <div>
            <label className="settings-label">External Domain Restrictions</label>
            <select className="settings-input">
              <option>Allow all domains</option>
              <option>Allow specific domains only</option>
              <option>Block specific domains</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-footer">
        <Button variant="outline" className="mr-2">
          Reset to Default
        </Button>
        <Button variant="primary" className="text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default CollaborationSettings;
