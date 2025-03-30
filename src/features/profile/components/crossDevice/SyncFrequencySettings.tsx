import React, { useState } from 'react';

// Define types for clarity
type SyncFrequencyOption = 'realtime' | 'automatic' | 'manual' | 'scheduled';
type SyncIntervalOption = '15m' | '30m' | '1h' | '3h' | '12h' | 'daily';
type NetworkRestriction = 'wifi' | 'mobile' | 'charging';

const SyncFrequencySettings: React.FC = () => {
  // Local state for this section
  const [syncFrequency, setSyncFrequency] = useState<SyncFrequencyOption>('automatic');
  const [syncInterval, setSyncInterval] = useState<SyncIntervalOption>('30m'); // Default if scheduled
  const [networkRestrictions, setNetworkRestrictions] = useState<NetworkRestriction[]>([
    'wifi', 'charging'
  ]);

  const toggleRestriction = (restriction: NetworkRestriction) => {
    setNetworkRestrictions(prev =>
      prev.includes(restriction) ? prev.filter(r => r !== restriction) : [...prev, restriction]
    );
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Sync Frequency</h3>
      <p className="settings-form-description">Configure how often MagicMuse synchronizes content</p>

      <div className="space-y-4 mt-4">
        {/* Sync Frequency Dropdown */}
        <div>
          <label className="settings-label">Sync Frequency</label>
          <select
            className="settings-select"
            value={syncFrequency}
            onChange={(e) => setSyncFrequency(e.target.value as SyncFrequencyOption)}
          >
            <option value="realtime">Real-time (Continuous)</option>
            <option value="automatic">Automatic (Based on activity)</option>
            <option value="manual">Manual (Only when triggered)</option>
            <option value="scheduled">Scheduled (At specific intervals)</option>
          </select>
        </div>

        {/* Sync Interval (Conditional) */}
        {syncFrequency === 'scheduled' && (
          <div>
            <label className="settings-label">Sync Interval</label>
            <select
              className="settings-select"
              value={syncInterval}
              onChange={(e) => setSyncInterval(e.target.value as SyncIntervalOption)}
            >
              <option value="15m">Every 15 minutes</option>
              <option value="30m">Every 30 minutes</option>
              <option value="1h">Every hour</option>
              <option value="3h">Every 3 hours</option>
              <option value="12h">Every 12 hours</option>
              <option value="daily">Once a day</option>
            </select>
          </div>
        )}

        {/* Network Restrictions */}
        <div>
          <label className="settings-label">Network Restrictions</label>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={networkRestrictions.includes('wifi')} onChange={() => toggleRestriction('wifi')} />
              <span className="ml-2 text-sm">Sync on Wi-Fi</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={networkRestrictions.includes('mobile')} onChange={() => toggleRestriction('mobile')} />
              <span className="ml-2 text-sm">Sync on mobile data</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={networkRestrictions.includes('charging')} onChange={() => toggleRestriction('charging')} />
              <span className="ml-2 text-sm">Sync when charging</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncFrequencySettings;