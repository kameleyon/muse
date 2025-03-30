import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Clock } from 'lucide-react';

// Define types for clarity
type LicenseType = 'stockImages' | 'fonts' | 'audio' | 'premiumGraphics';
type ReminderTiming = '1w' | '2w' | '1m' | 'custom';

const AssetExpirationSettings: React.FC = () => {
  const [expirationReminders, setExpirationReminders] = useState(true);
  const [trackedLicenses, setTrackedLicenses] = useState<LicenseType[]>([
    'stockImages', 'fonts', 'audio', 'premiumGraphics'
  ]);
  const [reminderTiming, setReminderTiming] = useState<ReminderTiming>('2w');
  const [showVisualIndicators, setShowVisualIndicators] = useState(true);

  const toggleLicenseType = (type: LicenseType) => {
    setTrackedLicenses(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Digital Asset Expiration</h3>
      <p className="settings-form-description">Configure asset expiration monitoring and reminders</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={expirationReminders}
              onChange={() => setExpirationReminders(!expirationReminders)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable asset expiration tracking</span>
        </div>

        {expirationReminders && (
          <>
            <div>
              <label className="settings-label">Track License Types</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={trackedLicenses.includes('stockImages')} onChange={() => toggleLicenseType('stockImages')} />
                  <span className="ml-2 text-sm">Stock images</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={trackedLicenses.includes('fonts')} onChange={() => toggleLicenseType('fonts')} />
                  <span className="ml-2 text-sm">Fonts</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={trackedLicenses.includes('audio')} onChange={() => toggleLicenseType('audio')} />
                  <span className="ml-2 text-sm">Audio/Music</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={trackedLicenses.includes('premiumGraphics')} onChange={() => toggleLicenseType('premiumGraphics')} />
                  <span className="ml-2 text-sm">Premium icons/graphics</span>
                </label>
              </div>
            </div>

            <div>
              <label className="settings-label">Reminder Timing</label>
              <select
                className="settings-select"
                value={reminderTiming}
                onChange={(e) => setReminderTiming(e.target.value as ReminderTiming)}
              >
                <option value="1w">1 week before expiration</option>
                <option value="2w">2 weeks before expiration</option>
                <option value="1m">1 month before expiration</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={showVisualIndicators}
                  onChange={() => setShowVisualIndicators(!showVisualIndicators)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Show visual indicators for expiring assets</span>
            </div>

            {/* Example display - data would come from backend */}
            <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
              <Clock size={20} className="mr-2 text-[#3d3d3a]" />
              <div>
                <p className="text-sm font-medium">Asset Expiration</p>
                <p className="text-xs text-[#3d3d3a]">3 assets expiring within 30 days</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Review
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssetExpirationSettings;