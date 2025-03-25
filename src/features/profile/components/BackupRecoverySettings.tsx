import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Save, Cloud, HardDrive, AlertTriangle, Clock, Lock } from 'lucide-react';

const BackupRecoverySettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Backup and Recovery Settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [backupLocation, setBackupLocation] = useState('cloud');
  const [encryptedBackups, setEncryptedBackups] = useState(true);
  
  // Handle Backup Settings Update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Backup and recovery settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save backup settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup and Recovery</CardTitle>
        <CardDescription>
          Configure how MagicMuse backs up and restores your content
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                <div>
                  <label className="settings-label">Backup Frequency</label>
                  <select 
                    className="settings-select"
                    value={backupFrequency}
                    onChange={(e) => setBackupFrequency(e.target.value)}
                  >
                    <option value="realtime">Real-time (Continuous)</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom Schedule</option>
                  </select>
                </div>
                
                {backupFrequency === 'custom' && (
                  <div>
                    <label className="settings-label">Custom Schedule</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-[#3d3d3a] mb-1 block">Days</label>
                        <select className="settings-select">
                          <option>Every day</option>
                          <option>Weekdays</option>
                          <option>Weekends</option>
                          <option>Custom days</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[#3d3d3a] mb-1 block">Time</label>
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
                
                <div>
                  <label className="settings-label">Backup Retention</label>
                  <select className="settings-select">
                    <option>Keep last 5 backups</option>
                    <option>Keep last 10 backups</option>
                    <option>Keep 30 days of backups</option>
                    <option>Keep all backups</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Backup Location</h3>
          <p className="settings-form-description">Configure where your backups are stored</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Primary Backup Location</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="backup-location" 
                    className="form-radio text-[#ae5630]" 
                    checked={backupLocation === 'cloud'}
                    onChange={() => setBackupLocation('cloud')}
                  />
                  <span className="ml-2 flex items-center">
                    <Cloud size={16} className="mr-1 text-[#3d3d3a]" />
                    MagicMuse Cloud (Default)
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="backup-location" 
                    className="form-radio text-[#ae5630]" 
                    checked={backupLocation === 'gdrive'}
                    onChange={() => setBackupLocation('gdrive')}
                  />
                  <span className="ml-2">Google Drive</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="backup-location" 
                    className="form-radio text-[#ae5630]" 
                    checked={backupLocation === 'dropbox'}
                    onChange={() => setBackupLocation('dropbox')}
                  />
                  <span className="ml-2">Dropbox</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="backup-location" 
                    className="form-radio text-[#ae5630]" 
                    checked={backupLocation === 'local'}
                    onChange={() => setBackupLocation('local')}
                  />
                  <span className="ml-2 flex items-center">
                    <HardDrive size={16} className="mr-1 text-[#3d3d3a]" />
                    Local Storage
                  </span>
                </label>
              </div>
            </div>
            
            {backupLocation === 'local' && (
              <div>
                <label className="settings-label">Local Backup Path</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="C:\Backups\MagicMuse"
                    defaultValue="C:\Backups\MagicMuse"
                  />
                  <Button variant="outline" size="sm">Browse</Button>
                </div>
              </div>
            )}
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Create secondary backup location</span>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Backup Security</h3>
          <p className="settings-form-description">Configure encryption and security for your backups</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={encryptedBackups}
                  onChange={() => setEncryptedBackups(!encryptedBackups)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable encrypted backups</span>
            </div>
            
            {encryptedBackups && (
              <>
                <div>
                  <label className="settings-label">Encryption Method</label>
                  <select className="settings-select">
                    <option>AES-256 (Standard)</option>
                    <option>AES-256-GCM (Advanced)</option>
                    <option>Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Encryption Key Management</label>
                  <select className="settings-select">
                    <option>Managed by MagicMuse (Default)</option>
                    <option>Custom key</option>
                    <option>Hardware security module</option>
                  </select>
                </div>
                
                <div className="flex items-center p-3 bg-yellow-50 rounded-md border border-yellow-200">
                  <AlertTriangle size={20} className="mr-2 text-yellow-600" />
                  <p className="text-sm text-yellow-800">If you choose custom key management, you'll be responsible for keeping your encryption keys safe. Lost keys mean permanently lost backups.</p>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Content Prioritization</h3>
          <p className="settings-form-description">Configure which content is prioritized for backup</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Backup Priority</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Documents and projects</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Templates and resources</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">User preferences and settings</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Analytics and usage data</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="settings-label">Project Selection</label>
              <select className="settings-select">
                <option>All projects</option>
                <option>Active projects only</option>
                <option>Starred projects only</option>
                <option>Custom selection</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Disaster Recovery</h3>
          <p className="settings-form-description">Configure one-click disaster recovery options</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Recovery Point Objective (RPO)</label>
              <select className="settings-select">
                <option>Minimal data loss (&lt; 15 minutes)</option>
                <option>Low data loss (&lt; 1 hour)</option>
                <option>Standard (&lt; 24 hours)</option>
                <option>Custom</option>
              </select>
              <p className="text-xs text-[#3d3d3a] mt-1">
                Shorter RPO requires more frequent backups and more storage
              </p>
            </div>
            
            <div>
              <label className="settings-label">Recovery Time Objective (RTO)</label>
              <select className="settings-select">
                <option>Rapid (&lt; 1 hour)</option>
                <option>Standard (&lt; 8 hours)</option>
                <option>Economical (&lt; 24 hours)</option>
                <option>Custom</option>
              </select>
              <p className="text-xs text-[#3d3d3a] mt-1">
                Shorter RTO requires additional resources and may increase costs
              </p>
            </div>
            
            <div>
              <label className="settings-label">Manual Backup</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Save size={16} className="mr-1" />
                  Create Backup Now
                </Button>
                <Button variant="outline" size="sm">
                  Restore from Backup
                </Button>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
              <Clock size={20} className="mr-2 text-[#3d3d3a]" />
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-xs text-[#3d3d3a]">Today at 2:15 PM (42 minutes ago)</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => {
            setAutoBackup(true);
            setBackupFrequency('daily');
            setBackupLocation('cloud');
            setEncryptedBackups(true);
          }}
        >
          Reset to Default
        </Button>
        <Button 
          variant="primary" 
          className="text-white"
          isLoading={isLoading}
          onClick={handleSaveSettings}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BackupRecoverySettings;
