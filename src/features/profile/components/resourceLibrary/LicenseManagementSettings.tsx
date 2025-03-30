import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlusCircle } from 'lucide-react';

// Reusable component for license type row
const LicenseTypeRow: React.FC<{ name: string; description: string; }> = ({ name, description }) => (
  <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
    <div>
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-[#3d3d3a]">{description}</p>
    </div>
    <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
  </div>
);

const LicenseManagementSettings: React.FC = () => {
  // Local state for this section
  const [requireLicenseInfo, setRequireLicenseInfo] = useState(true);
  const [restrictUsage, setRestrictUsage] = useState(true);
  const [storeDocuments, setStoreDocuments] = useState(false);

  // Placeholder for license types (could be fetched or managed globally)
  const licenseTypes = [
    { id: 'std', name: 'Standard License', description: 'For internal use only' },
    { id: 'ext', name: 'Extended License', description: 'For commercial use' },
    { id: 'ent', name: 'Enterprise License', description: 'For unlimited organizational use' },
  ];

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">License Management</h3>
      <p className="settings-form-description">Configure how commercial assets licenses are managed</p>

      <div className="space-y-4 mt-4">
        <div>
          <label className="settings-label">License Types</label>
          <div className="space-y-2 mb-4">
            {licenseTypes.map(lt => (
              <LicenseTypeRow key={lt.id} name={lt.name} description={lt.description} />
            ))}
          </div>
          {/* TODO: Add functionality to add/edit license types */}
          <Button variant="outline" size="sm">
            <PlusCircle size={16} className="mr-1" /> Add License Type
          </Button>
        </div>

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={requireLicenseInfo}
              onChange={() => setRequireLicenseInfo(!requireLicenseInfo)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Require license information for new assets</span>
        </div>

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={restrictUsage}
              onChange={() => setRestrictUsage(!restrictUsage)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Restrict usage based on license terms</span>
        </div>

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={storeDocuments}
              onChange={() => setStoreDocuments(!storeDocuments)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Store license documents with assets</span>
        </div>
      </div>
    </div>
  );
};

export default LicenseManagementSettings;