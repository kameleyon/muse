import React, { useState } from 'react';

// Define types for clarity
type TemplateSaveLocation = 'personal' | 'team' | 'project' | 'ask';

const TemplateCreationSettings: React.FC = () => {
  // Local state for this section
  const [saveLocation, setSaveLocation] = useState<TemplateSaveLocation>('personal');
  const [saveMetadata, setSaveMetadata] = useState(true);
  const [includeStyle, setIncludeStyle] = useState(true);
  const [promptForName, setPromptForName] = useState(false);

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Template Creation</h3>
      <p className="settings-form-description">Configure options for creating and saving templates</p>

      <div className="space-y-4 mt-4">
        <div>
          <label className="settings-label">Template Save Location</label>
          <select
            className="settings-select"
            value={saveLocation}
            onChange={(e) => setSaveLocation(e.target.value as TemplateSaveLocation)}
          >
            <option value="personal">Personal Templates</option>
            <option value="team">Team Templates</option>
            <option value="project">Project-Specific Templates</option>
            <option value="ask">Ask Each Time</option>
          </select>
        </div>

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={saveMetadata}
              onChange={() => setSaveMetadata(!saveMetadata)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Save metadata with templates</span>
        </div>

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={includeStyle}
              onChange={() => setIncludeStyle(!includeStyle)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Include style information in templates</span>
        </div>

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={promptForName}
              onChange={() => setPromptForName(!promptForName)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Prompt for template name on Save As Template</span>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreationSettings;