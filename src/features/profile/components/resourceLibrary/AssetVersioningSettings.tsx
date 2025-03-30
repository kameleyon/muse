import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RefreshCw } from 'lucide-react';

// Define types for clarity
type VersionRetentionPolicy = 'all' | 'last5' | 'last30d' | 'custom';
type UpdateNotificationPolicy = 'ask' | 'always' | 'never';

const AssetVersioningSettings: React.FC = () => {
  const [assetVersioning, setAssetVersioning] = useState(true);
  const [retentionPolicy, setRetentionPolicy] = useState<VersionRetentionPolicy>('last5');
  const [propagateUpdates, setPropagateUpdates] = useState(true);
  const [updateNotification, setUpdateNotification] = useState<UpdateNotificationPolicy>('ask');

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Asset Version Control</h3>
      <p className="settings-form-description">Configure version control for resource assets</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={assetVersioning}
              onChange={() => setAssetVersioning(!assetVersioning)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable asset versioning</span>
        </div>

        {assetVersioning && (
          <>
            <div>
              <label className="settings-label">Version Storage</label>
              <select
                className="settings-select"
                value={retentionPolicy}
                onChange={(e) => setRetentionPolicy(e.target.value as VersionRetentionPolicy)}
              >
                <option value="all">Keep all versions</option>
                <option value="last5">Keep last 5 versions</option>
                <option value="last30d">Keep versions from last 30 days</option>
                <option value="custom">Custom retention policy</option>
              </select>
            </div>

            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={propagateUpdates}
                  onChange={() => setPropagateUpdates(!propagateUpdates)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Propagate updates to documents using this asset</span>
            </div>

            {propagateUpdates && ( // Only show notification setting if propagation is enabled
              <div>
                <label className="settings-label">Update Notification</label>
                <select
                  className="settings-select"
                  value={updateNotification}
                  onChange={(e) => setUpdateNotification(e.target.value as UpdateNotificationPolicy)}
                >
                  <option value="ask">Ask before updating</option>
                  <option value="always">Always update automatically</option>
                  <option value="never">Never update automatically</option>
                </select>
              </div>
            )}

            {/* Example display - data would come from backend */}
            <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
              <RefreshCw size={20} className="mr-2 text-[#3d3d3a]" />
              <div>
                <p className="text-sm font-medium">Asset Updates</p>
                <p className="text-xs text-[#3d3d3a]">5 documents using outdated assets</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Update All
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssetVersioningSettings;