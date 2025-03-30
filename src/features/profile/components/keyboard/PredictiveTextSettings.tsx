import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

// Define types for clarity
type PredictionLevel = 'minimal' | 'standard' | 'enhanced' | 'advanced';
type PredictionSource = 'common' | 'patterns' | 'context' | 'previous' | 'ai';

const PredictiveTextSettings: React.FC = () => {
  const [enablePredictiveText, setEnablePredictiveText] = useState(true);
  const [predictionLevel, setPredictionLevel] = useState<PredictionLevel>('standard');
  const [predictionSources, setPredictionSources] = useState<PredictionSource[]>([
    'common', 'patterns', 'context'
  ]);

  const toggleSource = (source: PredictionSource) => {
    setPredictionSources(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Predictive Text</h3>
      <p className="settings-form-description">Configure predictive text behavior</p>

      <div className="space-y-4 mt-4">
        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enablePredictiveText}
              onChange={() => setEnablePredictiveText(!enablePredictiveText)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Enable predictive text</span>
        </div>

        {enablePredictiveText && (
          <>
            <div>
              <label className="settings-label">Prediction Level</label>
              <select
                className="settings-select"
                value={predictionLevel}
                onChange={(e) => setPredictionLevel(e.target.value as PredictionLevel)}
              >
                <option value="minimal">Minimal (word completion only)</option>
                <option value="standard">Standard (word and short phrase)</option>
                <option value="enhanced">Enhanced (full sentence suggestions)</option>
                <option value="advanced">Advanced (context-aware suggestions)</option>
              </select>
            </div>

            <div>
              <label className="settings-label">Prediction Sources</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={predictionSources.includes('common')} onChange={() => toggleSource('common')} />
                  <span className="ml-2 text-sm">Common vocabulary</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={predictionSources.includes('patterns')} onChange={() => toggleSource('patterns')} />
                  <span className="ml-2 text-sm">Your writing patterns</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={predictionSources.includes('context')} onChange={() => toggleSource('context')} />
                  <span className="ml-2 text-sm">Current document context</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={predictionSources.includes('previous')} onChange={() => toggleSource('previous')} />
                  <span className="ml-2 text-sm">Your previous documents</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" checked={predictionSources.includes('ai')} onChange={() => toggleSource('ai')} />
                  <span className="ml-2 text-sm">Advanced AI suggestions</span>
                </label>
              </div>
            </div>

            {predictionSources.includes('ai') && ( // Show warning only if AI source is selected
              <div className="flex items-center p-3 bg-yellow-50 rounded-md border border-yellow-200">
                <AlertTriangle size={20} className="mr-2 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Using advanced AI suggestions for predictive text may increase resource usage and affect performance on slower devices.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PredictiveTextSettings;