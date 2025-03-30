import React, { useState } from 'react';
import { Headphones } from 'lucide-react';

// Define types for clarity
type NoiseCancellationLevel = 'off' | 'low' | 'medium' | 'high' | 'adaptive';

const NoiseFilteringSettings: React.FC = () => {
  // Local state for this section
  const [cancellationLevel, setCancellationLevel] = useState<NoiseCancellationLevel>('medium');
  const [enableAgc, setEnableAgc] = useState(true);
  const [enableEchoCancellation, setEnableEchoCancellation] = useState(true);
  const [pauseOnNoise, setPauseOnNoise] = useState(true);

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Noise Filtering</h3>
      <p className="settings-form-description">Configure background noise handling</p>

      <div className="space-y-4 mt-4">
        <div>
          <label className="settings-label">Noise Cancellation Level</label>
          <select
            className="settings-select"
            value={cancellationLevel}
            onChange={(e) => setCancellationLevel(e.target.value as NoiseCancellationLevel)}
          >
            <option value="off">Off</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="adaptive">Adaptive</option>
          </select>
        </div>

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enableAgc}
              onChange={() => setEnableAgc(!enableAgc)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Automatic gain control</span>
        </div>

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enableEchoCancellation}
              onChange={() => setEnableEchoCancellation(!enableEchoCancellation)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Echo cancellation</span>
        </div>

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={pauseOnNoise}
              onChange={() => setPauseOnNoise(!pauseOnNoise)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Pause dictation when background noise is high</span>
        </div>

        {/* Pro Tip */}
        <div className="p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
          <p className="text-sm font-medium flex items-center">
            <Headphones size={16} className="mr-2 text-[#3d3d3a]" /> Pro Tip
          </p>
          <p className="text-xs text-[#3d3d3a] mt-1">
            For best dictation results, use a noise-cancelling headset microphone in a quiet environment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoiseFilteringSettings;