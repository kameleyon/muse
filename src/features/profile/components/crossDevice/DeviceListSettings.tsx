import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Smartphone, Laptop, Monitor, RefreshCw } from 'lucide-react';

// Reusable component for device row
const DeviceRow: React.FC<{ icon: React.ElementType; name: string; lastSync: string; isCurrent?: boolean; }> =
  ({ icon: Icon, name, lastSync, isCurrent }) => (
    <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
      <Icon size={20} className="mr-2 text-[#3d3d3a]" />
      <div className="flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-[#3d3d3a]">Last synced: {lastSync}</p>
      </div>
      {isCurrent ? (
        <div className="text-xs text-green-600 bg-green-100 py-1 px-2 rounded-full">Current</div>
      ) : (
        <Button variant="outline" size="sm" className="text-xs h-7">Settings</Button>
      )}
    </div>
);

const DeviceListSettings: React.FC = () => {
  // Local state for this section
  const [enableDevicePrefs, setEnableDevicePrefs] = useState(true);
  const [devicesExpanded, setDevicesExpanded] = useState(false);

  // Placeholder device data (would come from API/store)
  const devices = [
    { id: 'd1', type: 'desktop', name: 'Windows PC', lastSync: 'Just now', isCurrent: true, icon: Monitor },
    { id: 'd2', type: 'mobile', name: 'iPhone 13', lastSync: '2 hours ago', icon: Smartphone },
    { id: 'd3', type: 'laptop', name: 'MacBook Pro', lastSync: 'Yesterday', icon: Laptop },
    { id: 'd4', type: 'laptop', name: 'Work Laptop', lastSync: '3 days ago', icon: Laptop },
    { id: 'd5', type: 'mobile', name: 'iPad Pro', lastSync: '1 week ago', icon: Smartphone }, // Changed icon to Smartphone for consistency
  ];

  const currentDevice = devices.find(d => d.isCurrent);
  const otherDevices = devices.filter(d => !d.isCurrent);

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Device-Specific UI Preferences</h3>
      <p className="settings-form-description">Customize UI settings for different devices</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enableDevicePrefs}
              onChange={() => setEnableDevicePrefs(!enableDevicePrefs)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable device-specific preferences</span>
        </div>

        {enableDevicePrefs && (
          <>
            {/* Current Device Display */}
            {currentDevice && (
              <div className="mb-3">
                <label className="settings-label">Current Device</label>
                <DeviceRow
                  icon={currentDevice.icon}
                  name={currentDevice.name}
                  lastSync={currentDevice.lastSync}
                  isCurrent
                />
              </div>
            )}

            {/* Other Devices List */}
            <div className="space-y-3">
              <div className="flex items-center mb-2 justify-between">
                <h4 className="text-sm font-medium">Other Devices</h4>
                {otherDevices.length > 2 && ( // Only show toggle if more than 2 other devices
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDevicesExpanded(!devicesExpanded)}
                  >
                    {devicesExpanded ? 'Show Less' : `Show All (${otherDevices.length})`}
                  </Button>
                )}
              </div>

              {/* Display first 2 devices always */}
              {otherDevices.slice(0, 2).map(device => (
                <DeviceRow
                  key={device.id}
                  icon={device.icon}
                  name={device.name}
                  lastSync={device.lastSync}
                />
              ))}

              {/* Display remaining devices if expanded */}
              {devicesExpanded && otherDevices.slice(2).map(device => (
                 <DeviceRow
                   key={device.id}
                   icon={device.icon}
                   name={device.name}
                   lastSync={device.lastSync}
                 />
               ))}
            </div>

            {/* Sync Now Button */}
            <div>
              {/* TODO: Implement sync logic */}
              <Button variant="outline" size="sm" className="flex items-center">
                <RefreshCw size={16} className="mr-1" /> Sync All Devices Now
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeviceListSettings;