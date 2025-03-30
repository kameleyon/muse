import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Save, Clock } from 'lucide-react';

// Define types for clarity
type RPOOption = 'minimal' | 'low' | 'standard' | 'custom';
type RTOOption = 'rapid' | 'standard' | 'economical' | 'custom';

const DisasterRecoverySettings: React.FC = () => {
  // Local state for this section
  const [rpo, setRpo] = useState<RPOOption>('standard');
  const [rto, setRto] = useState<RTOOption>('standard');
  const [lastBackupTime, setLastBackupTime] = useState('Today at 2:15 PM (42 minutes ago)'); // Example, would be dynamic

  // TODO: Implement backup/restore logic
  const handleCreateBackup = () => console.log("Manual backup initiated...");
  const handleRestoreBackup = () => console.log("Restore from backup initiated...");

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Disaster Recovery</h3>
      <p className="settings-form-description">Configure one-click disaster recovery options</p>

      <div className="space-y-4 mt-4">
        {/* RPO */}
        <div>
          <label className="settings-label">Recovery Point Objective (RPO)</label>
          <select
            className="settings-select"
            value={rpo}
            onChange={(e) => setRpo(e.target.value as RPOOption)}
          >
            <option value="minimal">Minimal data loss (&lt; 15 minutes)</option>
            <option value="low">Low data loss (&lt; 1 hour)</option>
            <option value="standard">Standard (&lt; 24 hours)</option>
            <option value="custom">Custom</option> {/* TODO: Add custom input */}
          </select>
          <p className="text-xs text-[#3d3d3a] mt-1">
            Shorter RPO requires more frequent backups and more storage
          </p>
        </div>

        {/* RTO */}
        <div>
          <label className="settings-label">Recovery Time Objective (RTO)</label>
          <select
            className="settings-select"
            value={rto}
            onChange={(e) => setRto(e.target.value as RTOOption)}
          >
            <option value="rapid">Rapid (&lt; 1 hour)</option>
            <option value="standard">Standard (&lt; 8 hours)</option>
            <option value="economical">Economical (&lt; 24 hours)</option>
            <option value="custom">Custom</option> {/* TODO: Add custom input */}
          </select>
          <p className="text-xs text-[#3d3d3a] mt-1">
            Shorter RTO requires additional resources and may increase costs
          </p>
        </div>

        {/* Manual Actions */}
        <div>
          <label className="settings-label">Manual Backup & Restore</label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCreateBackup}>
              <Save size={16} className="mr-1" /> Create Backup Now
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestoreBackup}>
              Restore from Backup
            </Button>
          </div>
        </div>

        {/* Last Backup Info */}
        <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
          <Clock size={20} className="mr-2 text-[#3d3d3a]" />
          <div>
            <p className="text-sm font-medium">Last Backup</p>
            <p className="text-xs text-[#3d3d3a]">{lastBackupTime}</p>
          </div>
          {/* Optionally add a "View Backups" button */}
        </div>
      </div>
    </div>
  );
};

export default DisasterRecoverySettings;