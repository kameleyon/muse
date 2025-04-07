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
            <select className="settings-select">
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
            <select className="settings-select">
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
          <div className="toggle-switch-container">
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Enable contextual awareness</span>
          </div>
          
          <div>
            <label className="settings-label">Context Window Size</label>
            <select className="settings-select">
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
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Citation Preferences</h3>
        <p className="settings-form-description">Configure citation style and source quality preferences</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="settings-label">Citation Style</label>
            <select className="settings-select">
              <option>APA (7th Edition)</option>
              <option>MLA (8th Edition)</option>
              <option>Chicago (17th Edition)</option>
              <option>Harvard</option>
              <option>IEEE</option>
              <option>Custom</option>
            </select>
          </div>
          
          <div>
            <label className="settings-label">Source Quality Priority</label>
            <select className="settings-select">
              <option>Academic Sources Only</option>
              <option>High-quality Publications</option>
              <option>Balanced Mix</option>
              <option>Diverse Sources</option>
              <option>All Available Sources</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">AI Intervention Timing</h3>
        <p className="settings-form-description">Control when the AI offers suggestions</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Suggestion Timing</label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="intervention-timing"
                  className="form-radio text-[#ae5630]"
                  defaultChecked
                />
                <span className="ml-2">Real-time (as you type)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="intervention-timing"
                  className="form-radio text-[#ae5630]"
                />
                <span className="ml-2">On pause (when you stop typing)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="intervention-timing"
                  className="form-radio text-[#ae5630]"
                />
                <span className="ml-2">On-demand only (when requested)</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="settings-label">Pause Threshold</label>
            <select className="settings-select">
              <option>Short (1 second)</option>
              <option>Medium (3 seconds)</option>
              <option>Long (5 seconds)</option>
              <option>Very Long (10 seconds)</option>
              <option>Custom</option>
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

export default AIAssistantSettings;
