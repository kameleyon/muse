import React from 'react';
import { Button } from '@/components/ui/Button';

const ContentPrivacySettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Default Visibility</h3>
        <p className="settings-form-description">Configure the default privacy settings for new documents</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Default Document Visibility</label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  className="form-radio text-[#ae5630]"
                  defaultChecked
                />
                <span className="ml-2">Private (only you can access)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  className="form-radio text-[#ae5630]"
                />
                <span className="ml-2">Team (only your team members can access)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  className="form-radio text-[#ae5630]"
                />
                <span className="ml-2">Public (anyone with the link can view)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Data Retention</h3>
        <p className="settings-form-description">Configure how long your content is stored</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Content Retention Policy</label>
            <select className="settings-input">
              <option>Standard (retain indefinitely)</option>
              <option>Extended Archive (backup for 7 years)</option>
              <option>Regulatory Compliance (varies by content type)</option>
              <option>Custom Retention</option>
            </select>
          </div>
          
          <div>
            <label className="settings-label">Automatic Content Archiving</label>
            <select className="settings-input">
              <option>Never archive automatically</option>
              <option>Archive after 1 year of inactivity</option>
              <option>Archive after 2 years of inactivity</option>
              <option>Archive after 3 years of inactivity</option>
              <option>Custom timeframe</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Notify before automatic archiving</span>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Encryption Options</h3>
        <p className="settings-form-description">Configure encryption for sensitive content</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Enable end-to-end encryption for sensitive documents</span>
          </div>
          
          <div>
            <label className="settings-label">Encryption Level</label>
            <select className="settings-input">
              <option>Standard (AES-256)</option>
              <option>High (AES-256 with additional protections)</option>
              <option>Maximum (Multi-layered encryption)</option>
            </select>
          </div>
          
          <div className="text-xs text-[#3d3d3a] bg-[#f9f7f1] p-3 rounded-md border border-[#bcb7af]">
            <p>⚠️ Note: End-to-end encrypted documents cannot be accessed by MagicMuse support and cannot be recovered if the password is lost under certain recovery settings.</p>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Content Classification</h3>
        <p className="settings-form-description">Configure automatic content classification for privacy levels</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Enable automatic content classification</span>
          </div>
          
          <div>
            <label className="settings-label">Classification Rules</label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Detect personal information</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Detect financial information</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Detect confidential business information</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Detect medical information</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="settings-label">Action on Detection</label>
            <select className="settings-input">
              <option>Notify only (no automatic changes)</option>
              <option>Automatically set to Private</option>
              <option>Automatically encrypt document</option>
              <option>Ask for confirmation</option>
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

export default ContentPrivacySettings;
