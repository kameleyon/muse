import React, { useState } from 'react';

// Define types for clarity
type BackupPriorityItem = 'documents' | 'templates' | 'settings' | 'analytics';
type ProjectSelection = 'all' | 'active' | 'starred' | 'custom';

const BackupPrioritizationSettings: React.FC = () => {
  // Local state for this section
  const [priorityItems, setPriorityItems] = useState<BackupPriorityItem[]>([
    'documents', 'templates', 'settings' // Default priorities
  ]);
  const [projectSelection, setProjectSelection] = useState<ProjectSelection>('all');

  const togglePriorityItem = (item: BackupPriorityItem) => {
    setPriorityItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Content Prioritization</h3>
      <p className="settings-form-description">Configure which content is prioritized for backup</p>

      <div className="space-y-4 mt-4">
        {/* Backup Priority Checkboxes */}
        <div>
          <label className="settings-label">Backup Priority</label>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={priorityItems.includes('documents')} onChange={() => togglePriorityItem('documents')} />
              <span className="ml-2 text-sm">Documents and projects</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={priorityItems.includes('templates')} onChange={() => togglePriorityItem('templates')} />
              <span className="ml-2 text-sm">Templates and resources</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={priorityItems.includes('settings')} onChange={() => togglePriorityItem('settings')} />
              <span className="ml-2 text-sm">User preferences and settings</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={priorityItems.includes('analytics')} onChange={() => togglePriorityItem('analytics')} />
              <span className="ml-2 text-sm">Analytics and usage data</span>
            </label>
          </div>
        </div>

        {/* Project Selection Dropdown */}
        <div>
          <label className="settings-label">Project Selection</label>
          <select
            className="settings-select"
            value={projectSelection}
            onChange={(e) => setProjectSelection(e.target.value as ProjectSelection)}
          >
            <option value="all">All projects</option>
            <option value="active">Active projects only</option>
            <option value="starred">Starred projects only</option>
            <option value="custom">Custom selection</option> {/* TODO: Add custom selection UI */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BackupPrioritizationSettings;