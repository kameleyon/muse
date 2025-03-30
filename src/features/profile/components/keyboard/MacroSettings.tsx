import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlusCircle } from 'lucide-react';

// Reusable component for displaying a macro row
const MacroRow: React.FC<{ name: string; description: string; }> = ({ name, description }) => (
  <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
    <div>
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-[#3d3d3a]">{description}</p>
    </div>
    <div className="flex gap-1">
      <Button variant="ghost" size="sm" className="h-6">Run</Button>
      <Button variant="ghost" size="sm" className="h-6">Edit</Button>
    </div>
  </div>
);

const MacroSettings: React.FC = () => {
  const [macroCreation, setMacroCreation] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(true); // Local state for confirmation toggle

  // Placeholder state for trigger options (could be managed here or passed as props)
  const [triggerOptions, setTriggerOptions] = useState({
    keyboard: true,
    menu: true,
    voice: false,
    automatic: false,
  });

  const handleTriggerChange = (option: keyof typeof triggerOptions) => {
    setTriggerOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Macro Creation</h3>
      <p className="settings-form-description">Configure automated macros for repeated actions</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={macroCreation}
              onChange={() => setMacroCreation(!macroCreation)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable macro creation</span>
        </div>

        {macroCreation && (
          <>
            <div>
              <label className="settings-label">Saved Macros</label>
              <div className="space-y-2 mb-4">
                <MacroRow name="Format Heading" description="Applies heading style with numbered format" />
                <MacroRow name="Insert Template Block" description="Inserts standard content block" />
                <MacroRow name="Prepare for Export" description="Formats document for export" />
              </div>

              <Button variant="outline" size="sm">
                <PlusCircle size={16} className="mr-1" />
                Create New Macro
              </Button>
            </div>

            <div>
              <label className="settings-label">Macro Trigger Options</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={triggerOptions.keyboard} onChange={() => handleTriggerChange('keyboard')} />
                  <span className="ml-2 text-sm">Keyboard shortcuts</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={triggerOptions.menu} onChange={() => handleTriggerChange('menu')} />
                  <span className="ml-2 text-sm">Menu selection</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={triggerOptions.voice} onChange={() => handleTriggerChange('voice')} />
                  <span className="ml-2 text-sm">Voice command</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={triggerOptions.automatic} onChange={() => handleTriggerChange('automatic')} />
                  <span className="ml-2 text-sm">Automatic (based on context)</span>
                </label>
              </div>
            </div>

            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={showConfirmation}
                  onChange={() => setShowConfirmation(!showConfirmation)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Show confirmation before running macros</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MacroSettings;