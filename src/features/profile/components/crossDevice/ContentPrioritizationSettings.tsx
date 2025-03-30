import React, { useState } from 'react';

// Define types for clarity
type SyncPriorityOption = 'recent' | 'starred' | 'size' | 'custom';
type StorageLimitOption = 'none' | '30d' | '90d' | 'custom';

const ContentPrioritizationSettings: React.FC = () => {
  // Local state for this section
  const [contentPriority, setContentPriority] = useState<SyncPriorityOption>('recent');
  const [storageLimit, setStorageLimit] = useState<StorageLimitOption>('none');
  const [autoCleanup, setAutoCleanup] = useState(true);

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Content Prioritization</h3>
      <p className="settings-form-description">Configure which content syncs first</p>

      <div className="space-y-4 mt-4">
        {/* Sync Priority */}
        <div>
          <label className="settings-label">Sync Priority</label>
          <select
            className="settings-select"
            value={contentPriority}
            onChange={(e) => setContentPriority(e.target.value as SyncPriorityOption)}
          >
            <option value="recent">Recent documents first</option>
            <option value="starred">Starred items first</option>
            <option value="size">Smallest files first</option>
            <option value="custom">Custom priority rules</option>
          </select>
        </div>

        {/* Storage Limits */}
        <div>
          <label className="settings-label">Storage Limits</label>
          <select
            className="settings-select"
            value={storageLimit}
            onChange={(e) => setStorageLimit(e.target.value as StorageLimitOption)}
          >
            <option value="none">No limit (Sync everything)</option>
            <option value="30d">Last 30 days of content</option>
            <option value="90d">Last 90 days of content</option>
            <option value="custom">Custom storage limit</option> {/* TODO: Add input for custom limit */}
          </select>
        </div>

        {/* Auto-cleanup */}
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={autoCleanup}
              onChange={() => setAutoCleanup(!autoCleanup)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Auto-cleanup old synced content</span>
        </div>
      </div>
    </div>
  );
};

export default ContentPrioritizationSettings;