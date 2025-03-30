import React, { useState } from 'react';

// Define types for clarity
type UsageReportFrequency = 'none' | 'monthly' | 'weekly' | 'realtime';
type UsageTrackingScope = 'documents' | 'templates' | 'shared' | 'exports';

const UsageAnalyticsSettings: React.FC = () => {
  const [resourceTracking, setResourceTracking] = useState(true);
  const [trackingScope, setTrackingScope] = useState<UsageTrackingScope[]>([
    'documents', 'templates', 'shared'
  ]);
  const [reportFrequency, setReportFrequency] = useState<UsageReportFrequency>('monthly');
  const [trackPopularity, setTrackPopularity] = useState(true);

  const toggleScope = (scope: UsageTrackingScope) => {
    setTrackingScope(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Usage Analytics</h3>
      <p className="settings-form-description">Configure resource usage tracking and analytics</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={resourceTracking}
              onChange={() => setResourceTracking(!resourceTracking)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable resource usage tracking</span>
        </div>

        {resourceTracking && (
          <>
            <div>
              <label className="settings-label">Track Usage In</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={trackingScope.includes('documents')} onChange={() => toggleScope('documents')} />
                  <span className="ml-2 text-sm">Documents</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={trackingScope.includes('templates')} onChange={() => toggleScope('templates')} />
                  <span className="ml-2 text-sm">Templates</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={trackingScope.includes('shared')} onChange={() => toggleScope('shared')} />
                  <span className="ml-2 text-sm">Shared content</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={trackingScope.includes('exports')} onChange={() => toggleScope('exports')} />
                  <span className="ml-2 text-sm">External exports</span>
                </label>
              </div>
            </div>

            <div>
              <label className="settings-label">Usage Reports</label>
              <select
                className="settings-select"
                value={reportFrequency}
                onChange={(e) => setReportFrequency(e.target.value as UsageReportFrequency)}
              >
                <option value="none">None</option>
                <option value="monthly">Monthly Summary</option>
                <option value="weekly">Weekly Summary</option>
                <option value="realtime">Real-time Dashboard</option>
              </select>
            </div>

            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={trackPopularity}
                  onChange={() => setTrackPopularity(!trackPopularity)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Track resource popularity for recommendations</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UsageAnalyticsSettings;