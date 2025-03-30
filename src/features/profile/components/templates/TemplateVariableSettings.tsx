import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlusCircle } from 'lucide-react';

// Reusable component for variable row
const VariableRow: React.FC<{ name: string; value: string; }> = ({ name, value }) => (
  <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
    <div>
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-[#3d3d3a] truncate">{value}</p> {/* Added truncate */}
    </div>
    {/* TODO: Add Edit functionality */}
    <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
  </div>
);

const TemplateVariableSettings: React.FC = () => {
  // Local state for this section
  const [enableVariables, setEnableVariables] = useState(true);
  const [promptForValues, setPromptForValues] = useState(true);

  // Placeholder for custom variables (would likely be fetched/managed globally)
  const customVariables = [
    { id: 'comp', name: '{company_name}', value: 'Acme Corporation' },
    { id: 'email', name: '{contact_email}', value: 'contact@acmecorp.com' },
    { id: 'legal', name: '{legal_disclaimer}', value: 'Standard legal text...' },
  ];

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Template Variables</h3>
      <p className="settings-form-description">Configure dynamic content variables for templates</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enableVariables}
              onChange={() => setEnableVariables(!enableVariables)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable template variables</span>
        </div>

        {enableVariables && (
          <>
            <div>
              <label className="settings-label">Custom Variables</label>
              <div className="space-y-2">
                {customVariables.map(variable => (
                  <VariableRow key={variable.id} name={variable.name} value={variable.value} />
                ))}
              </div>
              {/* TODO: Add functionality to add/edit variables */}
              <Button variant="outline" size="sm" className="mt-2">
                <PlusCircle size={16} className="mr-1" /> Add Variable
              </Button>
            </div>

            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={promptForValues}
                  onChange={() => setPromptForValues(!promptForValues)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Prompt for variable values when using template</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TemplateVariableSettings;