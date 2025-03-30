import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Database, ImagePlus } from 'lucide-react';

// Define types for clarity
type StorageLocation = 'magicmuse' | 'gdrive' | 'dropbox' | 'onedrive' | 'custom';
type BulkImportSetting = 'extractMetadata' | 'autoCategorize' | 'autoTag' | 'promptMetadata';

const StorageImportSettings: React.FC = () => {
  const [storageLocation, setStorageLocation] = useState<StorageLocation>('magicmuse');
  const [bulkImportSettings, setBulkImportSettings] = useState<BulkImportSetting[]>([
    'extractMetadata', 'autoCategorize'
  ]);

  const toggleBulkSetting = (setting: BulkImportSetting) => {
    setBulkImportSettings(prev =>
      prev.includes(setting) ? prev.filter(s => s !== setting) : [...prev, setting]
    );
  };

  // Placeholder storage usage data
  const storageUsage = { used: 8.2, total: 25, unit: 'GB', plan: 'Premium Plan' };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Storage & Import</h3>
      <p className="settings-form-description">Configure resource library storage and import options</p>

      <div className="space-y-4 mt-4">
        <div>
          <label className="settings-label">Storage Location</label>
          <select
            className="settings-select"
            value={storageLocation}
            onChange={(e) => setStorageLocation(e.target.value as StorageLocation)}
          >
            <option value="magicmuse">MagicMuse Cloud (Default)</option>
            <option value="gdrive">Google Drive</option>
            <option value="dropbox">Dropbox</option>
            <option value="onedrive">OneDrive</option>
            <option value="custom">Custom Storage</option>
          </select>
        </div>

        {/* Example display - data would come from backend */}
        <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
          <Database size={20} className="mr-2 text-[#3d3d3a]" />
          <div className="flex-1">
            <p className="text-sm font-medium">Storage Usage</p>
            <p className="text-xs text-[#3d3d3a]">
              Using {storageUsage.used} {storageUsage.unit} of {storageUsage.total} {storageUsage.unit} allocated ({storageUsage.plan})
            </p>
          </div>
          <Button variant="outline" size="sm" className="text-xs h-7">
            Upgrade
          </Button>
        </div>

        <div>
          <label className="settings-label">Bulk Import Settings</label>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={bulkImportSettings.includes('extractMetadata')} onChange={() => toggleBulkSetting('extractMetadata')} />
              <span className="ml-2 text-sm">Extract metadata from imported files</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={bulkImportSettings.includes('autoCategorize')} onChange={() => toggleBulkSetting('autoCategorize')} />
              <span className="ml-2 text-sm">Auto-categorize based on file type</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={bulkImportSettings.includes('autoTag')} onChange={() => toggleBulkSetting('autoTag')} />
              <span className="ml-2 text-sm">Auto-tag based on content analysis</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={bulkImportSettings.includes('promptMetadata')} onChange={() => toggleBulkSetting('promptMetadata')} />
              <span className="ml-2 text-sm">Prompt for metadata during import</span>
            </label>
          </div>
        </div>

        <div>
          <Button variant="outline" size="sm">
            <ImagePlus size={16} className="mr-1" /> Import Resources
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StorageImportSettings;