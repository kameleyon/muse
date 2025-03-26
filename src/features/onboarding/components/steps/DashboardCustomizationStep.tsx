import React, { useState, useEffect } from 'react';
import { OnboardingData } from '../OnboardingModal';

interface DashboardCustomizationStepProps {
  onComplete: () => void; // Renamed from onNext for clarity on the final step
  onPrev: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  isLoading: boolean; // Add isLoading prop
  error: string | null; // Add error prop (optional usage here)
}

const assistanceOptions = [
  { id: 'full_creation', label: 'Full Creation', description: 'Generate complete content drafts from prompts' },
  { id: 'collaborative', label: 'Collaborative', description: 'Work side-by-side with suggestions as you write' },
  { id: 'enhancement', label: 'Enhancement', description: 'Focus on improving your existing content' },
  { id: 'research_ideas', label: 'Research & Ideas', description: 'Help with research and ideation, you handle the writing' },
];

// Destructure isLoading and error from props
const DashboardCustomizationStep: React.FC<DashboardCustomizationStepProps> = ({ onComplete, onPrev, updateData, data, isLoading, error }) => {
  const [selectedAssistance, setSelectedAssistance] = useState<string | undefined>(data.aiAssistanceLevel);

  const handleAssistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAssistance(event.target.value);
  };

  // Update parent data only on mount and when selectedAssistance changes
  // But exclude updateData from dependencies to prevent infinite loop
  useEffect(() => {
    updateData({ aiAssistanceLevel: selectedAssistance });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAssistance]);
  // Intentionally excluded updateData from deps to prevent infinite loop

  const handleFinish = () => {
    if (!selectedAssistance) {
      alert("Please select how you'd like MagicMuse to assist you.");
      return;
    }
    // onComplete will trigger the data saving logic in the parent modal
    onComplete();
  };

  // Placeholder for dashboard preview - replace with actual components later
  const renderDashboardPreview = () => {
    return (
      <div style={{ border: '1px dashed #ccc', padding: '15px', marginTop: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <h4>Your Personalized Dashboard Preview:</h4>
        <ul>
          <li>Quick access for: {data.primaryContentPurpose || 'General'}</li>
          <li>Suggested templates for: {data.industry || 'Various Fields'}</li>
          <li>Goals focus: {data.mainGoals?.join(', ') || 'Productivity'}</li>
          {/* Add more dynamic elements based on 'data' */}
        </ul>
        <p><i>(This is a simplified preview)</i></p>
      </div>
    );
  };

  return (
    <div className="onboarding-step dashboard-customization-step">
      <div> {/* Content container */}
        <h2>How would you like MagicMuse to assist you?</h2>
        <div className="assistance-options" style={{ marginBottom: '25px' }}>
          {assistanceOptions.map(opt => (
            <label key={opt.id} style={{ display: 'block', marginBottom: '10px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="assistanceLevel"
                value={opt.id}
                checked={selectedAssistance === opt.id}
                onChange={handleAssistanceChange}
                style={{ marginRight: '8px' }}
              />
              <strong>{opt.label}:</strong> {opt.description}
            </label>
          ))}
        </div>

        <h2>Your MagicMuse workspace is ready!</h2>
        <p>We've customized your dashboard based on your preferences. Here's a glimpse:</p>

        {renderDashboardPreview()}

      </div>

      <div className="onboarding-navigation">
        {/* Disable Back button while loading */}
        <button onClick={onPrev} className="secondary" disabled={isLoading}>
          Back
        </button>
        {/* Disable Finish button while loading and show loading text */}
        <button
          onClick={handleFinish}
          className="primary"
          disabled={!selectedAssistance || isLoading} // Disable if no selection OR loading
        >
          {isLoading ? 'Saving...' : 'Explore Your Dashboard'}
        </button>
        {/* Display error specific to this step if needed, though parent handles general error */}
        {/* {error && <p className="step-error">{error}</p>} */}
      </div>
    </div>
  );
};

export default DashboardCustomizationStep;
