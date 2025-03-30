import React, { useState } from 'react';

// Define types for clarity
type DesktopFeatureHandling = 'show' | 'warn' | 'hide';

const CapabilityAwarenessSettings: React.FC = () => {
  // Local state for this section
  const [enableCapabilityAwareness, setEnableCapabilityAwareness] = useState(true);
  const [desktopFeatureHandling, setDesktopFeatureHandling] = useState<Record<DesktopFeatureHandling, boolean>>({
    show: false,
    warn: true, // Default to warn
    hide: false,
  });

  // Handler to ensure only one checkbox is selected for desktop feature handling
  const handleDesktopFeatureChange = (option: DesktopFeatureHandling) => {
    setDesktopFeatureHandling({
      show: option === 'show',
      warn: option === 'warn',
      hide: option === 'hide',
    });
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Device Capability Awareness</h3>
      <p className="settings-form-description">Configure how features adapt to different devices</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enableCapabilityAwareness}
              onChange={() => setEnableCapabilityAwareness(!enableCapabilityAwareness)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable capability-aware features</span>
        </div>

        {enableCapabilityAwareness && (
          <div>
            <label className="settings-label">Desktop-Only Features on Mobile</label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-[#ae5630]"
                  checked={desktopFeatureHandling.show}
                  onChange={() => handleDesktopFeatureChange('show')}
                />
                <span className="ml-2 text-sm">Show on capable mobile devices</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-[#ae5630]"
                  checked={desktopFeatureHandling.warn}
                  onChange={() => handleDesktopFeatureChange('warn')}
                />
                <span className="ml-2 text-sm">Show with performance warning</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-[#ae5630]"
                  checked={desktopFeatureHandling.hide}
                  onChange={() => handleDesktopFeatureChange('hide')}
                />
                <span className="ml-2 text-sm">Hide completely on mobile</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CapabilityAwarenessSettings;