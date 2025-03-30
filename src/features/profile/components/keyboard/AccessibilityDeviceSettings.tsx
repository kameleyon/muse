import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

// Define types for clarity
type AccessibilityDevice = 'screenReader' | 'switchControl' | 'altKeyboard' | 'eyeTracking' | 'voiceControl';

const AccessibilityDeviceSettings: React.FC = () => {
  const [enableAccessibilitySupport, setEnableAccessibilitySupport] = useState(true);
  const [supportedDevices, setSupportedDevices] = useState<AccessibilityDevice[]>([
    'screenReader', 'switchControl', 'altKeyboard', 'eyeTracking', 'voiceControl' // Default all enabled
  ]);

  const toggleDevice = (device: AccessibilityDevice) => {
    setSupportedDevices(prev =>
      prev.includes(device) ? prev.filter(d => d !== device) : [...prev, device]
    );
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Accessibility Devices</h3>
      <p className="settings-form-description">Configure support for accessibility input devices</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enableAccessibilitySupport}
              onChange={() => setEnableAccessibilitySupport(!enableAccessibilitySupport)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable accessibility device support</span>
        </div>

        {enableAccessibilitySupport && (
          <>
            <div>
              <label className="settings-label">Supported Devices</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={supportedDevices.includes('screenReader')} onChange={() => toggleDevice('screenReader')} />
                  <span className="ml-2 text-sm">Screen readers</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={supportedDevices.includes('switchControl')} onChange={() => toggleDevice('switchControl')} />
                  <span className="ml-2 text-sm">Switch controls</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={supportedDevices.includes('altKeyboard')} onChange={() => toggleDevice('altKeyboard')} />
                  <span className="ml-2 text-sm">Alternative keyboards</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={supportedDevices.includes('eyeTracking')} onChange={() => toggleDevice('eyeTracking')} />
                  <span className="ml-2 text-sm">Eye tracking devices</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={supportedDevices.includes('voiceControl')} onChange={() => toggleDevice('voiceControl')} />
                  <span className="ml-2 text-sm">Voice control</span>
                </label>
              </div>
            </div>

            <div>
              <Button variant="outline" size="sm">
                Accessibility Device Setup Guide
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccessibilityDeviceSettings;