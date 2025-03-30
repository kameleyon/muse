import React, { useState } from 'react';

// Define types for clarity
type BackupFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly' | 'custom';
type BackupRetention = 'last5' | 'last10' | '30d' | 'all';
// Add types for custom schedule if needed

const AutomatedBackupSettings: React.FC = () => {
  // Local state for this section
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState<BackupFrequency>('daily');
  const [backupRetention, setBackupRetention] = useState<BackupRetention>('last10'); // Example default

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Automated Backups</h3>
      <p className="settings-form-description">Configure automated backup scheduling</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={autoBackup}
              onChange={() => setAutoBackup(!autoBackup)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable automated backups</span>
        </div>

        {autoBackup && (
          <>
            {/* Backup Frequency */}
            <div>
              <label className="settings-label">Backup Frequency</label>
              <select
                className="settings-select"
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value as BackupFrequency)}
              >
                <option value="realtime">Real-time (Continuous)</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom Schedule</option>
              </select>
            </div>

            {/* Custom Schedule (Conditional) */}
            {backupFrequency === 'custom' && (
              <div>
                <label className="settings-label">Custom Schedule</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#3d3d3a] mb-1 block">Days</label>
                    {/* TODO: Implement custom day selection */}
                    <select className="settings-select">
                      <option>Every day</option>
                      <option>Weekdays</option>
                      <option>Weekends</option>
                      <option>Custom days</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#3d3d3a] mb-1 block">Time</label>
                    {/* TODO: Implement custom time selection */}
                    <select className="settings-select">
                      <option>12:00 AM</option>
                      <option>6:00 AM</option>
                      <option>12:00 PM</option>
                      <option>6:00 PM</option>
                      <option>Custom time</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Retention */}
            <div>
              <label className="settings-label">Backup Retention</label>
              <select
                className="settings-select"
                value={backupRetention}
                onChange={(e) => setBackupRetention(e.target.value as BackupRetention)}
              >
                <option value="last5">Keep last 5 backups</option>
                <option value="last10">Keep last 10 backups</option>
                <option value="30d">Keep 30 days of backups</option>
                <option value="all">Keep all backups</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AutomatedBackupSettings;