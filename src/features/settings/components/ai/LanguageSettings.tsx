import React from 'react';
import { Button } from '@/components/ui/Button';

const LanguageSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Primary Language</h3>
        <p className="settings-form-description">Set your primary working language for MagicMuse</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Primary Language</label>
            <select className="settings-input">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>English (Australia)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese (Simplified)</option>
              <option>Japanese</option>
              <option>Korean</option>
              <option>Portuguese</option>
              <option>Russian</option>
              <option>Arabic</option>
              <option>Hindi</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Use system language</span>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Secondary Languages</h3>
        <p className="settings-form-description">Add additional languages for multilingual users</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Secondary Languages</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Spanish</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">French</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">German</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Italian</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Portuguese</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Chinese</span>
              </label>
            </div>
          </div>
          
          <div>
            <Button variant="outline" size="sm">
              Add Other Language
            </Button>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Regional Variants</h3>
        <p className="settings-form-description">Configure region-specific language preferences</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">English Variant</label>
            <select className="settings-input">
              <option>American English (US)</option>
              <option>British English (UK)</option>
              <option>Australian English</option>
              <option>Canadian English</option>
              <option>Indian English</option>
            </select>
          </div>
          
          <div>
            <label className="settings-label">Spanish Variant</label>
            <select className="settings-input">
              <option>European Spanish (Spain)</option>
              <option>Latin American Spanish</option>
              <option>Mexican Spanish</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Apply regional spelling conventions</span>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Translation Preferences</h3>
        <p className="settings-form-description">Configure how MagicMuse handles translations</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Default Translation Target</label>
            <select className="settings-input">
              <option>Primary Language</option>
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese (Simplified)</option>
            </select>
          </div>
          
          <div>
            <label className="settings-label">Translation Style</label>
            <select className="settings-input">
              <option>Literal (closest possible translation)</option>
              <option>Natural (idiomatic, flowing language)</option>
              <option>Formal (professional, conservative)</option>
              <option>Casual (conversational, relaxed)</option>
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

export default LanguageSettings;
