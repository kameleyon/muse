import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlusCircle, Keyboard } from 'lucide-react';

// Reusable component for displaying a shortcut row
const ShortcutRow: React.FC<{ action: string; description: string; keys: string[]; }> = ({ action, description, keys }) => (
  <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
    <div>
      <p className="text-sm font-medium">{action}</p>
      <p className="text-xs text-[#3d3d3a]">{description}</p>
    </div>
    <div className="flex gap-1 items-center"> {/* Added items-center */}
      {keys.map((key, index) => (
        <div key={index} className="px-2 py-1 bg-white border border-[#bcb7af] rounded text-sm">{key}</div>
      ))}
      <Button variant="ghost" size="sm" className="h-6 ml-1">Edit</Button>
    </div>
  </div>
);

const ShortcutSettings: React.FC = () => {
  const [customShortcuts, setCustomShortcuts] = useState(true);
  const [showTooltips, setShowTooltips] = useState(true); // Local state for tooltip toggle

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Keyboard Shortcuts</h3>
      <p className="settings-form-description">Configure custom keyboard shortcuts for common actions</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={customShortcuts}
              onChange={() => setCustomShortcuts(!customShortcuts)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable custom keyboard shortcuts</span>
        </div>

        {customShortcuts && (
          <>
            <div>
              <label className="settings-label">Common Actions</label>
              <div className="space-y-2 mb-4">
                <ShortcutRow action="New Document" description="Creates a new document" keys={['Ctrl', 'N']} />
                <ShortcutRow action="Save Document" description="Saves the current document" keys={['Ctrl', 'S']} />
                <ShortcutRow action="AI Suggestions" description="Triggers AI assistance" keys={['Alt', 'Space']} />
              </div>

              <Button variant="outline" size="sm">
                <PlusCircle size={16} className="mr-1" />
                Add Custom Shortcut
              </Button>
            </div>

            <div>
              <label className="settings-label">Preset Configurations</label>
              <select className="settings-select">
                <option>MagicMuse Default</option>
                <option>Word Processor Style</option>
                <option>Code Editor Style</option>
                <option>Custom Configuration</option>
              </select>
            </div>

            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={showTooltips}
                  onChange={() => setShowTooltips(!showTooltips)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Show keyboard shortcuts in tooltips</span>
            </div>

            <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
              <Keyboard size={20} className="mr-2 text-[#3d3d3a]" />
              <div>
                <p className="text-sm font-medium">Keyboard Shortcuts Reference</p>
                <p className="text-xs text-[#3d3d3a]">View all available keyboard shortcuts</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                View All
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShortcutSettings;