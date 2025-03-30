import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Building } from 'lucide-react';

// Define types for clarity
type EnforcementLevel = 'optional' | 'preferred' | 'required';

const BrandTemplateSettings: React.FC = () => {
  // Local state for this section
  const [organizationTemplates, setOrganizationTemplates] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('acme'); // Example org ID
  const [enforcementLevel, setEnforcementLevel] = useState<EnforcementLevel>('preferred');
  const [syncUpdates, setSyncUpdates] = useState(true);

  // Placeholder org data (would likely come from user profile/API)
  const organizations = [
    { id: 'acme', name: 'Acme Corporation', templateCount: 12 },
    { id: 'personal', name: 'Personal Templates' },
  ];

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Brand Templates</h3>
      <p className="settings-form-description">Configure organizational templates and enforcement options</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={organizationTemplates}
              onChange={() => setOrganizationTemplates(!organizationTemplates)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable organization templates</span>
        </div>

        {organizationTemplates && (
          <>
            <div>
              <label className="settings-label">Organization Selection</label>
              <select
                className="settings-select"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
              >
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
                <option value="add">+ Add Organization</option> {/* Placeholder */}
              </select>
            </div>

            {/* Example display - data would be dynamic */}
            {selectedOrg !== 'personal' && selectedOrg !== 'add' && (
               <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                 <Building size={20} className="mr-2 text-[#3d3d3a]" />
                 <div>
                   <p className="text-sm font-medium">
                     {organizations.find(o => o.id === selectedOrg)?.name} Templates
                   </p>
                   <p className="text-xs text-[#3d3d3a]">
                     {organizations.find(o => o.id === selectedOrg)?.templateCount} templates available
                   </p>
                 </div>
                 {/* TODO: Link to actual management page */}
                 <Button variant="outline" size="sm" className="ml-auto">
                   Manage
                 </Button>
               </div>
            )}

            <div>
              <label className="settings-label">Template Enforcement Level</label>
              <select
                className="settings-select"
                value={enforcementLevel}
                onChange={(e) => setEnforcementLevel(e.target.value as EnforcementLevel)}
              >
                <option value="optional">Optional (Recommended but not required)</option>
                <option value="preferred">Preferred (Default but can be changed)</option>
                <option value="required">Required (Cannot override organization templates)</option>
              </select>
            </div>

            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={syncUpdates}
                  onChange={() => setSyncUpdates(!syncUpdates)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Sync organization template updates automatically</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrandTemplateSettings;