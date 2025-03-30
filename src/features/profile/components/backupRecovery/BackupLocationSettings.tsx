import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; // Import Input
import { Cloud, HardDrive } from 'lucide-react';

// Define types for clarity
type BackupLocationOption = 'cloud' | 'gdrive' | 'dropbox' | 'local';

const BackupLocationSettings: React.FC = () => {
  // Local state for this section
  const [backupLocation, setBackupLocation] = useState<BackupLocationOption>('cloud');
  const [localPath, setLocalPath] = useState('C:\\Backups\\MagicMuse'); // Example default
  const [enableSecondary, setEnableSecondary] = useState(true); // Example default

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Backup Location</h3>
      <p className="settings-form-description">Configure where your backups are stored</p>

      <div className="space-y-4 mt-4">
        {/* Primary Location Radio Buttons */}
        <div>
          <label className="settings-label">Primary Backup Location</label>
          <div className="space-y-2">
            {/* Cloud */}
            <label className="inline-flex items-center">
              <input type="radio" name="backup-location" className="form-radio text-[#ae5630]" checked={backupLocation === 'cloud'} onChange={() => setBackupLocation('cloud')} />
              <span className="ml-2 flex items-center">
                <Cloud size={16} className="mr-1 text-[#3d3d3a]" /> MagicMuse Cloud (Default)
              </span>
            </label>
            {/* Google Drive */}
            <label className="inline-flex items-center">
              <input type="radio" name="backup-location" className="form-radio text-[#ae5630]" checked={backupLocation === 'gdrive'} onChange={() => setBackupLocation('gdrive')} />
              <span className="ml-2">Google Drive</span> {/* TODO: Add GDrive Icon */}
            </label>
            {/* Dropbox */}
            <label className="inline-flex items-center">
              <input type="radio" name="backup-location" className="form-radio text-[#ae5630]" checked={backupLocation === 'dropbox'} onChange={() => setBackupLocation('dropbox')} />
              <span className="ml-2">Dropbox</span> {/* TODO: Add Dropbox Icon */}
            </label>
            {/* Local Storage */}
            <label className="inline-flex items-center">
              <input type="radio" name="backup-location" className="form-radio text-[#ae5630]" checked={backupLocation === 'local'} onChange={() => setBackupLocation('local')} />
              <span className="ml-2 flex items-center">
                <HardDrive size={16} className="mr-1 text-[#3d3d3a]" /> Local Storage
              </span>
            </label>
          </div>
        </div>

        {/* Local Path Input (Conditional) */}
        {backupLocation === 'local' && (
          <div>
            <label className="settings-label">Local Backup Path</label>
            <div className="flex gap-2">
              <Input
                type="text"
                className="settings-input"
                placeholder="C:\Backups\MagicMuse"
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
              />
              {/* TODO: Implement file browser logic */}
              <Button variant="outline" size="sm">Browse</Button>
            </div>
          </div>
        )}

        {/* Secondary Location Toggle */}
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enableSecondary}
              onChange={() => setEnableSecondary(!enableSecondary)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Create secondary backup location</span>
          {/* TODO: Add secondary location selection if enabled */}
        </div>
      </div>
    </div>
  );
};

export default BackupLocationSettings;