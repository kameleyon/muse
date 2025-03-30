import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Share2 } from 'lucide-react';

// Define types for clarity
type DefaultSharingPermission = 'view' | 'use' | 'edit' | 'full';

const TemplateSharingSettings: React.FC = () => {
  // Local state for this section
  const [templateSharing, setTemplateSharing] = useState(true);
  const [defaultPermission, setDefaultPermission] = useState<DefaultSharingPermission>('use');
  const [trackUsage, setTrackUsage] = useState(true);
  const [notifyOnShare, setNotifyOnShare] = useState(true);

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Template Sharing</h3>
      <p className="settings-form-description">Configure how templates can be shared with others</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={templateSharing}
              onChange={() => setTemplateSharing(!templateSharing)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable template sharing</span>
        </div>

        {templateSharing && (
          <>
            <div>
              <label className="settings-label">Default Sharing Permissions</label>
              <select
                className="settings-select"
                value={defaultPermission}
                onChange={(e) => setDefaultPermission(e.target.value as DefaultSharingPermission)}
              >
                <option value="view">View Only</option>
                <option value="use">View and Use</option>
                <option value="edit">View, Use, and Edit</option>
                <option value="full">Full Access (including resharing)</option>
              </select>
            </div>

            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={trackUsage}
                  onChange={() => setTrackUsage(!trackUsage)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Track template usage by others</span>
            </div>

            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifyOnShare}
                  onChange={() => setNotifyOnShare(!notifyOnShare)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Notify when templates are shared with me</span>
            </div>

            {/* Example display - could link to gallery */}
            <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
              <Share2 size={20} className="mr-2 text-[#3d3d3a]" />
              <div>
                <p className="text-sm font-medium">Template Gallery</p>
                <p className="text-xs text-[#3d3d3a]">Publish your templates to the MagicMuse Template Gallery</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Explore
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TemplateSharingSettings;