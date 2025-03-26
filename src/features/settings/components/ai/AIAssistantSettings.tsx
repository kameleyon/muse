import React from 'react';
import { Button } from '@/components/ui/Button';

const AIAssistantSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Suggestion Frequency</h3>
        <p className="settings-form-description">Control how often the AI assistant provides suggestions</p>
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="settings-label">Suggestion Frequency</label>
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                defaultValue="3"
                className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#3d3d3a] mt-1">
                <span>Minimal</span>
                <span>Balanced</span>
                <span>Comprehensive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Tone Settings</h3>
        <p className="settings-form-description">Set the default tone for AI-generated content</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="settings-label">Default Tone</label>
            <select className="settings-input">
              <option>Professional</option>
              <option>Casual</option>
              <option>Academic</option>
              <option>Creative</option>
              <option>Technical</option>
              <option>Conversational</option>
            </select>
          </div>
          
          <div>
            <label className="settings-label">Content Complexity</label>
            <select className="settings-input">
              <option>Simple</option>
              <option>Standard</option>
              <option>Detailed</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">AI Content Generation</h3>
        <p className="settings-form-description">Balance between factual accuracy and creativity</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Factual Accuracy Priority</label>
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                defaultValue="4"
                className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#3d3d3a] mt-1">
                <span>Lower</span>
                <span>Balanced</span>
                <span>Higher</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="settings-label">Creativity Level</label>
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                defaultValue="3"
                className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#3d3d3a] mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Imaginative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Context Retention</h3>
        <p className="settings-form-description">Control how much context the AI remembers during your session</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Enable contextual awareness</span>
          </div>
          
          <div>
            <label className="settings-label">Context Window Size</label>
            <select className="settings-input">
              <option>Small (recent paragraphs only)</option>
              <option>Medium (current section)</option>
              <option>Large (entire document)</option>
              <option>Custom</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Topic Expertise</h3>
        <p className="settings-form-description">Configure specialized knowledge areas for the AI</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Specialized Domains</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Fiction Writing</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Academic</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Technical</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Business</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Marketing</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Creative</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="settings-label">Custom Knowledge Area</label>
            <input
              type="text"
              className="settings-input"
              placeholder="Enter specialized knowledge area (e.g., 'Medieval History')"
            />
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

export default AIAssistantSettings;
