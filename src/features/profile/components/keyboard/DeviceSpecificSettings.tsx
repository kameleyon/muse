import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Laptop, Smartphone, Tablet } from 'lucide-react';

// Reusable component for device configuration row
const DeviceConfigRow: React.FC<{ icon: React.ElementType; name: string; isCurrent?: boolean; }> = ({ icon: Icon, name, isCurrent }) => (
  <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
    <div className="flex items-center">
      <Icon size={16} className="mr-2 text-[#3d3d3a]" />
      <span className="text-sm">{name}</span>
    </div>
    {isCurrent ? (
      <Button variant="outline" size="sm" className="h-7">Current</Button>
    ) : (
      <Button variant="ghost" size="sm" className="h-7">Configure</Button>
    )}
  </div>
);

const DeviceSpecificSettings: React.FC = () => {
  const [autoAdapt, setAutoAdapt] = useState(true); // Local state for auto-adapt toggle

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Device-Specific Settings</h3>
      <p className="settings-form-description">Configure input behavior for different device types</p>

      <div className="space-y-4 mt-4">
        <div>
          <label className="settings-label">Current Device</label>
          <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
            <Laptop size={20} className="mr-2 text-[#3d3d3a]" />
            <p className="text-sm">Windows Desktop / Laptop</p> {/* Example, could be dynamic */}
          </div>
        </div>

        <div>
          <label className="settings-label">Device Configurations</label>
          <div className="space-y-2">
            <DeviceConfigRow icon={Laptop} name="Desktop/Laptop" isCurrent />
            <DeviceConfigRow icon={Tablet} name="Tablet" />
            <DeviceConfigRow icon={Smartphone} name="Mobile" />
          </div>
        </div>

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={autoAdapt}
              onChange={() => setAutoAdapt(!autoAdapt)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Automatically adapt interface for device type</span>
        </div>
      </div>
    </div>
  );
};

export default DeviceSpecificSettings;