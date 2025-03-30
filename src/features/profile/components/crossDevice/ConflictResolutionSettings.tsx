import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Smartphone, Laptop, Monitor, AlertTriangle } from 'lucide-react';

// Define types for clarity
type ConflictResolutionStrategy = 'ask' | 'recent' | 'device' | 'merge';
type DevicePriority = 'highest' | 'high' | 'medium' | 'low';

// Reusable component for device priority row
const DevicePriorityRow: React.FC<{ icon: React.ElementType; name: string; }> = ({ icon: Icon, name }) => (
  <div className="flex items-center p-2 bg-[#f9f7f1] rounded-md justify-between">
    <div className="flex items-center">
      <Icon size={18} className="mr-2 text-[#3d3d3a]" />
      <span className="text-sm">{name}</span>
    </div>
    {/* TODO: Manage priority state */}
    <select className="text-sm py-1 px-2 border rounded bg-white">
      <option>Highest</option>
      <option>High</option>
      <option>Medium</option>
      <option>Low</option>
    </select>
  </div>
);

const ConflictResolutionSettings: React.FC = () => {
  // Local state for this section
  const [conflictResolution, setConflictResolution] = useState<ConflictResolutionStrategy>('ask');
  const [saveConflictVersions, setSaveConflictVersions] = useState(true);

  // Placeholder device data (would come from API/store)
  const devices = [
    { id: 'd1', name: 'Windows PC', icon: Monitor },
    { id: 'd2', name: 'iPhone 13', icon: Smartphone },
    { id: 'd3', name: 'MacBook Pro', icon: Laptop },
  ];

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Conflict Resolution</h3>
      <p className="settings-form-description">Configure how MagicMuse handles sync conflicts</p>

      <div className="space-y-4 mt-4">
        {/* Strategy Dropdown */}
        <div>
          <label className="settings-label">Conflict Resolution Strategy</label>
          <select
            className="settings-select"
            value={conflictResolution}
            onChange={(e) => setConflictResolution(e.target.value as ConflictResolutionStrategy)}
          >
            <option value="ask">Ask me every time</option>
            <option value="recent">Use most recent version</option>
            <option value="device">Prioritize specific devices</option>
            <option value="merge">Auto-merge when possible</option>
          </select>
        </div>

        {/* Device Priority (Conditional) */}
        {conflictResolution === 'device' && (
          <div>
            <label className="settings-label">Device Priority</label>
            <div className="space-y-2">
              {devices.map(device => (
                <DevicePriorityRow key={device.id} icon={device.icon} name={device.name} />
              ))}
            </div>
          </div>
        )}

        {/* Save Conflict Versions Toggle */}
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={saveConflictVersions}
              onChange={() => setSaveConflictVersions(!saveConflictVersions)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Save conflict versions as separate files</span>
        </div>

        {/* Example Conflict Notification */}
        <div className="flex items-center p-3 bg-yellow-50 rounded-md border border-yellow-200">
          <AlertTriangle size={20} className="mr-2 text-yellow-600" />
          <p className="text-sm text-yellow-800">3 conflicts waiting for resolution</p>
          {/* TODO: Link to conflict resolution UI */}
          <Button variant="outline" size="sm" className="ml-auto">
            Resolve Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionSettings;