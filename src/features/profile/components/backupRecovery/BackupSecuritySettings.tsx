import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

// Define types for clarity
type EncryptionMethod = 'aes256' | 'aes256gcm' | 'custom';
type KeyManagement = 'magicmuse' | 'custom' | 'hsm';

const BackupSecuritySettings: React.FC = () => {
  // Local state for this section
  const [encryptedBackups, setEncryptedBackups] = useState(true);
  const [encryptionMethod, setEncryptionMethod] = useState<EncryptionMethod>('aes256');
  const [keyManagement, setKeyManagement] = useState<KeyManagement>('magicmuse');

  return (
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
            {/* Encryption Method */}
            <div>
              <label className="settings-label">Encryption Method</label>
              <select
                className="settings-select"
                value={encryptionMethod}
                onChange={(e) => setEncryptionMethod(e.target.value as EncryptionMethod)}
              >
                <option value="aes256">AES-256 (Standard)</option>
                <option value="aes256gcm">AES-256-GCM (Advanced)</option>
                <option value="custom">Custom</option> {/* TODO: Add custom input */}
              </select>
            </div>

            {/* Key Management */}
            <div>
              <label className="settings-label">Encryption Key Management</label>
              <select
                className="settings-select"
                value={keyManagement}
                onChange={(e) => setKeyManagement(e.target.value as KeyManagement)}
              >
                <option value="magicmuse">Managed by MagicMuse (Default)</option>
                <option value="custom">Custom key</option> {/* TODO: Add key input/upload */}
                <option value="hsm">Hardware security module</option> {/* TODO: Add HSM config */}
              </select>
            </div>

            {/* Warning for Custom Key Management */}
            {keyManagement === 'custom' && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-md border border-yellow-200">
                <AlertTriangle size={20} className="mr-2 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  If you choose custom key management, you'll be responsible for keeping your encryption keys safe. Lost keys mean permanently lost backups.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BackupSecuritySettings;