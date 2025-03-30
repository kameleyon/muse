import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

// Reusable component for command row
const CommandRow: React.FC<{ command: string; description: string; }> = ({ command, description }) => (
  <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
    <div>
      <p className="text-sm font-medium">"{command}"</p>
      <p className="text-xs text-[#3d3d3a]">{description}</p>
    </div>
    {/* TODO: Add Edit functionality */}
    <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
  </div>
);

// Define types for clarity
type CommandSensitivity = 'low' | 'medium' | 'high';

const VoiceCommandSettings: React.FC = () => {
  // Local state for this section
  const [enableCommands, setEnableCommands] = useState(true);
  const [sensitivity, setSensitivity] = useState<CommandSensitivity>('medium');
  const [showFeedback, setShowFeedback] = useState(true);

  // Placeholder for custom commands (would likely be fetched/managed globally)
  const customCommands = [
    { id: 'cmd1', command: 'New paragraph', description: 'Inserts a new paragraph' },
    { id: 'cmd2', command: 'Save document', description: 'Saves the current document' },
    { id: 'cmd3', command: 'Apply heading style', description: 'Formats as heading' },
  ];

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Voice Command Customization</h3>
      <p className="settings-form-description">Configure custom voice commands</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enableCommands}
              onChange={() => setEnableCommands(!enableCommands)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable voice commands</span>
        </div>

        {enableCommands && (
          <>
            <div>
              <label className="settings-label">Command Sensitivity</label>
              <select
                className="settings-select"
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value as CommandSensitivity)}
              >
                <option value="low">Low (Fewer false activations)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (More responsive)</option>
              </select>
            </div>

            <div>
              <label className="settings-label">Custom Commands</label>
              <div className="space-y-2 mb-4">
                {customCommands.map(cmd => (
                  <CommandRow key={cmd.id} command={cmd.command} description={cmd.description} />
                ))}
              </div>
              {/* TODO: Add functionality to add/edit commands */}
              <Button variant="outline" size="sm">Add Custom Command</Button>
            </div>

            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={showFeedback}
                  onChange={() => setShowFeedback(!showFeedback)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Voice command confirmation feedback</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceCommandSettings;