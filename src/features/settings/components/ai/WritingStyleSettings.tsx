import React from 'react';
import { Button } from '@/components/ui/Button';

const WritingStyleSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Personal Writing Style Learning</h3>
        <p className="settings-form-description">Configure how the AI learns and adapts to your writing style</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Enable writing style adaptation</span>
          </div>
          
          <div>
            <label className="settings-label">Learning Mode</label>
            <select className="settings-input">
              <option>Passive (learn from your writing)</option>
              <option>Interactive (ask for feedback)</option>
              <option>Manual (use uploaded samples)</option>
              <option>Hybrid (combination approach)</option>
            </select>
          </div>
          
          <div>
            <label className="settings-label">Sample Threshold</label>
            <select className="settings-input">
              <option>Minimal (500 words)</option>
              <option>Standard (2,000 words)</option>
              <option>Extensive (5,000+ words)</option>
              <option>Custom</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Terminology Preferences</h3>
        <p className="settings-form-description">Manage custom dictionaries and terminology preferences</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Custom Dictionary</label>
            <textarea
              className="settings-textarea"
              placeholder="Add custom terms and definitions (one per line in format: term:definition)"
            ></textarea>
          </div>
          
          <div>
            <label className="settings-label">Dictionary Upload</label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Upload Dictionary</Button>
              <span className="text-xs text-[#3d3d3a]">
                Supported formats: CSV, TXT, XLSX
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Apply custom terms to suggestions</span>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Voice and Tone Configuration</h3>
        <p className="settings-form-description">Align AI suggestions with your preferred voice and style</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Voice Characteristics</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-xs text-[#3d3d3a] mb-1 block">Formal vs. Casual</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  defaultValue="3"
                  className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-[#3d3d3a] mb-1 block">Serious vs. Playful</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  defaultValue="3"
                  className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-[#3d3d3a] mb-1 block">Reserved vs. Bold</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  defaultValue="3"
                  className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-[#3d3d3a] mb-1 block">Traditional vs. Innovative</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  defaultValue="3"
                  className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="settings-label">Style Guide Upload</label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Upload Style Guide</Button>
              <span className="text-xs text-[#3d3d3a]">
                Supported formats: PDF, DOCX, TXT
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Target Audience Configuration</h3>
        <p className="settings-form-description">Customize tone and style for your specific audience</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Primary Audience</label>
            <select className="settings-input">
              <option>General</option>
              <option>Technical Professionals</option>
              <option>Executives</option>
              <option>Academic</option>
              <option>Creative Readers</option>
              <option>Customers/Consumers</option>
              <option>Custom</option>
            </select>
          </div>
          
          <div>
            <label className="settings-label">Educational Level</label>
            <select className="settings-input">
              <option>General</option>
              <option>High School</option>
              <option>Undergraduate</option>
              <option>Graduate</option>
              <option>Field Expert</option>
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

export default WritingStyleSettings;
