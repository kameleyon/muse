import React, { useState, useEffect } from 'react';
import { OnboardingData } from '../OnboardingModal';

interface EnvironmentIndustryStepProps {
  onNext: () => void;
  onPrev: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

const industries = [
  'Technology', 'Education', 'Healthcare', 'Finance', 'Marketing/Advertising',
  'Entertainment/Media', 'Retail/E-commerce', 'Professional Services', 'Other'
];

const EnvironmentIndustryStep: React.FC<EnvironmentIndustryStepProps> = ({ onNext, onPrev, updateData, data }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | undefined>(data.industry);
  const [customIndustry, setCustomIndustry] = useState<string>(data.customIndustry || '');
  // Use correct property names for state, matching OnboardingData
  const [formal, setFormal] = useState<number>(data.writingStyle?.formal ?? 50);
  const [technical, setTechnical] = useState<number>(data.writingStyle?.technical ?? 50);
  const [traditional, setTraditional] = useState<number>(data.writingStyle?.traditional ?? 50);
  const [detailed, setDetailed] = useState<number>(data.writingStyle?.detailed ?? 50);

  const handleIndustryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedIndustry(value);
    if (value !== 'Other') {
      setCustomIndustry(''); // Clear custom input if not 'Other'
    }
  };

  // Update parent data only when component mounts and when values change
  // But exclude updateData from dependencies to prevent infinite loop
  useEffect(() => {
    const dataToUpdate = {
      industry: selectedIndustry,
      customIndustry: selectedIndustry === 'Other' ? customIndustry : undefined,
      writingStyle: {
        formal,
        technical,
        traditional,
        detailed,
      }
    };
    updateData(dataToUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndustry, customIndustry, formal, technical, traditional, detailed]);
  // Intentionally removing updateData from dependencies

  const handleNext = () => {
    if (!selectedIndustry || (selectedIndustry === 'Other' && !customIndustry)) {
      alert("Please select your industry or specify if 'Other'.");
      return;
    }
    onNext();
  };

  return (
    <div className="onboarding-step environment-industry-step">
      <div> {/* Content container */}
        <h2>Let's customize your writing environment.</h2>

        <div className="industry-selection" style={{ marginBottom: '25px' }}>
          <label htmlFor="industry-select" className="industry-label">
            What industry or field do you primarily write for?
          </label>
          <select
            id="industry-select"
            value={selectedIndustry || ''}
            onChange={handleIndustryChange}
            className="industry-select"
          >
            <option value="" disabled>Select an industry</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          {selectedIndustry === 'Other' && (
            <input
              type="text"
              placeholder="Please specify your industry"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              className="industry-input"
            />
          )}
        </div>

        <div>
          <h3>How would you describe your preferred writing style?</h3>
          {/* Sliders - Use correct state variables */}
          <div className="style-slider">
            <label>Formality</label> {/* Label text is fine */}
            <input type="range" min="0" max="100" value={formal} onChange={(e) => setFormal(Number(e.target.value))} />
            <div className="slider-labels"><span>Formal</span><span>Conversational</span></div>
          </div>
          <div className="style-slider">
            <label>Technicality</label> {/* Changed label slightly */}
            <input type="range" min="0" max="100" value={technical} onChange={(e) => setTechnical(Number(e.target.value))} />
            <div className="slider-labels"><span>Technical</span><span>Accessible</span></div>
          </div>
          <div className="style-slider">
            <label>Style</label> {/* Changed label slightly */}
            <input type="range" min="0" max="100" value={traditional} onChange={(e) => setTraditional(Number(e.target.value))} />
            <div className="slider-labels"><span>Traditional</span><span>Innovative</span></div>
          </div>
          <div className="style-slider">
            <label>Detail Level</label> {/* Changed label slightly */}
            <input type="range" min="0" max="100" value={detailed} onChange={(e) => setDetailed(Number(e.target.value))} />
            <div className="slider-labels"><span>Detailed</span><span>Concise</span></div>
          </div>
        </div>
      </div>

      <div className="onboarding-navigation">
        <button onClick={onPrev} className="secondary">
          Back
        </button>
        <button
          onClick={handleNext}
          className="primary"
          disabled={!selectedIndustry || (selectedIndustry === 'Other' && !customIndustry)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EnvironmentIndustryStep;
