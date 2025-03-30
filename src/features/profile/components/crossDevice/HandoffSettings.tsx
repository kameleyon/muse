import React, { useState } from 'react';

// Define types for clarity
type HandoffNotificationOption = 'always' | 'active' | 'silent' | 'disabled';

const HandoffSettings: React.FC = () => {
  // Local state for this section
  const [enableHandoff, setEnableHandoff] = useState(true);
  const [rememberState, setRememberState] = useState(true);
  const [transferSession, setTransferSession] = useState(true);
  const [notificationOption, setNotificationOption] = useState<HandoffNotificationOption>('active');

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Handoff Between Devices</h3>
      <p className="settings-form-description">Configure continuity features between your devices</p>

      <div className="space-y-4 mt-4">
        {/* Enable Handoff */}
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enableHandoff}
              onChange={() => setEnableHandoff(!enableHandoff)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable handoff between devices</span>
        </div>

        {enableHandoff && (
          <>
            {/* Remember State */}
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={rememberState}
                  onChange={() => setRememberState(!rememberState)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Remember cursor position and scroll state</span>
            </div>

            {/* Transfer Session */}
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={transferSession}
                  onChange={() => setTransferSession(!transferSession)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Transfer session state and UI layout</span>
            </div>

            {/* Handoff Notification */}
            <div>
              <label className="settings-label">Handoff Notification</label>
              <select
                className="settings-select"
                value={notificationOption}
                onChange={(e) => setNotificationOption(e.target.value as HandoffNotificationOption)}
              >
                <option value="always">Always notify</option>
                <option value="active">Only notify for active documents</option>
                <option value="silent">Silent handoff</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HandoffSettings;