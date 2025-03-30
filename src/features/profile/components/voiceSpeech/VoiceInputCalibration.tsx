import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Mic } from 'lucide-react';

// Define types for clarity
type AccentType = 'neutral' | 'american' | 'british' | 'australian' | 'indian' | 'custom';

const VoiceInputCalibration: React.FC = () => {
  // Local state for this section
  const [voiceInput, setVoiceInput] = useState(true);
  const [accentType, setAccentType] = useState<AccentType>('neutral');
  const [noiseFilteringLevel, setNoiseFilteringLevel] = useState(3); // Example initial value

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Voice Input Calibration</h3>
      <p className="settings-form-description">Configure how MagicMuse processes your voice input</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={voiceInput}
              onChange={() => setVoiceInput(!voiceInput)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable voice input</span>
        </div>

        {voiceInput && (
          <>
            {/* Microphone Test */}
            <div>
              <label className="settings-label">Microphone Test</label>
              <div className="flex items-center gap-4 p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                <Mic size={24} className="text-[#ae5630]" />
                <div className="flex-1">
                  {/* Example visualizer */}
                  <div className="h-2 bg-[#bcb7af] rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-[#ae5630]"></div>
                  </div>
                </div>
                {/* TODO: Implement actual mic test logic */}
                <Button variant="outline" size="sm">Test Mic</Button>
              </div>
            </div>

            {/* Accent Adaptation */}
            <div>
              <label className="settings-label">Accent Adaptation</label>
              <select
                className="settings-select"
                value={accentType}
                onChange={(e) => setAccentType(e.target.value as AccentType)}
              >
                <option value="neutral">General (Neutral Accent)</option>
                <option value="american">American English</option>
                <option value="british">British English</option>
                <option value="australian">Australian English</option>
                <option value="indian">Indian English</option>
                <option value="custom">Custom Adaptation</option>
              </select>
            </div>

            {/* Custom Accent Training (Conditional) */}
            {accentType === 'custom' && (
              <div>
                <label className="settings-label">Custom Accent Training</label>
                <div className="space-y-2">
                  <p className="text-xs text-[#3d3d3a]">Record yourself reading the following passages to help MagicMuse adapt to your accent.</p>
                  {/* TODO: Implement voice training flow */}
                  <Button variant="outline" size="sm">Start Voice Training</Button>
                </div>
              </div>
            )}

            {/* Background Noise Filtering */}
            <div>
              <label className="settings-label">Background Noise Filtering</label>
              <div className="mt-2">
                <input
                  type="range" min="1" max="5" step="1"
                  value={noiseFilteringLevel}
                  onChange={(e) => setNoiseFilteringLevel(Number(e.target.value))}
                  className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#3d3d3a] mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceInputCalibration;