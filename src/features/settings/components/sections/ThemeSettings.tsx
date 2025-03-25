import React from 'react';
import { Button } from '@/components/ui/Button';
import { Check as CheckIcon, PlusCircle } from 'lucide-react';

const ThemeSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Theme Selection</h3>
        <p className="settings-form-description">Choose your preferred visual theme</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="relative cursor-pointer group">
            <div className="rounded-md overflow-hidden border-2 border-[#ae5630] shadow-sm">
              <div className="h-24 bg-[#EDEAE2]">
                <div className="h-6 bg-[#1a1918]"></div>
                <div className="p-2">
                  <div className="w-1/2 h-3 bg-[#ae5630] rounded mb-2"></div>
                  <div className="w-full h-2 bg-[#3d3d3a] rounded opacity-20 mb-1"></div>
                  <div className="w-full h-2 bg-[#3d3d3a] rounded opacity-20 mb-1"></div>
                </div>
              </div>
              <div className="p-2 text-center text-sm font-medium">Light Theme</div>
            </div>
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#ae5630] flex items-center justify-center text-white">
              <CheckIcon size={12} />
            </div>
          </div>
          
          <div className="relative cursor-pointer group">
            <div className="rounded-md overflow-hidden border-2 border-transparent hover:border-[#ae5630] shadow-sm transition-all">
              <div className="h-24 bg-[#1a1918]">
                <div className="h-6 bg-[#000000]"></div>
                <div className="p-2">
                  <div className="w-1/2 h-3 bg-[#ae5630] rounded mb-2"></div>
                  <div className="w-full h-2 bg-[#edeae2] rounded opacity-20 mb-1"></div>
                  <div className="w-full h-2 bg-[#edeae2] rounded opacity-20 mb-1"></div>
                </div>
              </div>
              <div className="p-2 text-center text-sm font-medium">Dark Theme</div>
            </div>
          </div>
          
          <div className="relative cursor-pointer group">
            <div className="rounded-md overflow-hidden border-2 border-transparent hover:border-[#ae5630] shadow-sm transition-all">
              <div className="h-24 bg-gradient-to-b from-[#EDEAE2] to-[#1a1918]">
                <div className="h-6 bg-[#1a1918]"></div>
                <div className="p-2">
                  <div className="w-1/2 h-3 bg-[#ae5630] rounded mb-2"></div>
                  <div className="w-full h-2 bg-[#3d3d3a] rounded opacity-20 mb-1"></div>
                  <div className="w-full h-2 bg-[#3d3d3a] rounded opacity-20 mb-1"></div>
                </div>
              </div>
              <div className="p-2 text-center text-sm font-medium">System Default</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Color Scheme</h3>
        <p className="settings-form-description">Customize your theme colors</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="settings-label">
              Primary Color
            </label>
            <div className="color-picker-container">
              <input
                type="color"
                className="color-picker"
                defaultValue="#ae5630"
              />
              <input
                type="text"
                className="settings-input"
                defaultValue="#ae5630"
              />
            </div>
          </div>
          
          <div>
            <label className="settings-label">
              Secondary Color
            </label>
            <div className="color-picker-container">
              <input
                type="color"
                className="color-picker"
                defaultValue="#6d371f"
              />
              <input
                type="text"
                className="settings-input"
                defaultValue="#6d371f"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Custom Themes</h3>
        <p className="settings-form-description">Create and save custom theme presets</p>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="new-theme-preset-card">
            <div className="text-center">
              <PlusCircle size={24} className="mx-auto text-[#3d3d3a]" />
              <span className="text-sm block mt-1">New Theme</span>
            </div>
          </div>
          
          <div className="theme-preset-card">
            <div className="w-full h-full bg-gradient-to-br from-[#2a9d8f] to-[#264653]">
              <div className="theme-preset-name">
                <span>Ocean Breeze</span>
              </div>
            </div>
          </div>
          
          <div className="theme-preset-card">
            <div className="w-full h-full bg-gradient-to-br from-[#f4a261] to-[#e76f51]">
              <div className="theme-preset-name">
                <span>Sunset</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Time-Based Themes</h3>
        <p className="settings-form-description">Automatically switch themes based on time of day</p>
        
        <div className="space-y-4 mt-4">
          <div className="toggle-switch-container">
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Enable automatic theme switching</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="settings-label">
                Day Theme (6:00 AM - 6:00 PM)
              </label>
              <select className="settings-select">
                <option>Light Theme</option>
                <option>Ocean Breeze</option>
                <option>Sunset</option>
              </select>
            </div>
            
            <div>
              <label className="settings-label">
                Night Theme (6:00 PM - 6:00 AM)
              </label>
              <select className="settings-select">
                <option>Dark Theme</option>
                <option>Ocean Breeze</option>
                <option>Sunset</option>
              </select>
            </div>
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

export default ThemeSettings;