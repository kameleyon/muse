import React from 'react';
import { Button } from '@/components/ui/Button';

const RemindersSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <h3 className="settings-form-title">Project Deadline Reminders</h3>
        <p className="settings-form-description">Configure reminders for project deadlines</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Enable project deadline reminders</span>
          </div>
          
          <div>
            <label className="settings-label">Reminder Schedule</label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">1 week before deadline</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">3 days before deadline</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">1 day before deadline</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Day of deadline</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Past deadline (daily until completed)</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="settings-label">Notification Channels</label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">In-app notifications</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Email</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Calendar integration</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Regular Usage Reminders</h3>
        <p className="settings-form-description">Configure reminders to encourage regular use of MagicMuse</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Enable regular usage reminders</span>
          </div>
          
          <div>
            <label className="settings-label">Reminder Frequency</label>
            <select className="settings-input">
              <option>Daily</option>
              <option>Every 3 days</option>
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Custom</option>
            </select>
          </div>
          
          <div>
            <label className="settings-label">Preferred Time</label>
            <select className="settings-input">
              <option>Morning (9:00 AM)</option>
              <option>Midday (12:00 PM)</option>
              <option>Afternoon (3:00 PM)</option>
              <option>Evening (7:00 PM)</option>
              <option>Custom</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Smart Reminders</h3>
        <p className="settings-form-description">Configure AI-driven smart reminders based on your work patterns</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ae5630]"></div>
            </label>
            <span className="toggle-label">Enable smart reminders</span>
          </div>
          
          <div>
            <label className="settings-label">Smart Reminder Types</label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Productivity time suggestions</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Project progress reminders</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Content improvement suggestions</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                <span className="ml-2 text-sm">Abandoned draft follow-ups</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-footer">
        <Button variant="outline" className="mr-2">
          Reset to Default
        </Button>
        <Button variant="primary" className="text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default RemindersSettings;
