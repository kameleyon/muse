import React, { useState } from 'react';
import { OnboardingData } from '../OnboardingModal'; // Import the data interface

interface ContentPurposeStepProps {
  onNext: () => void;
  onPrev: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

const contentPurposes = [
  {
    title: 'Professional Writing',
    details: 'Business documents, Marketing content, Digital & social media, Blog content',
    id: 'professional',
  },
  {
    title: 'Creative Writing',
    details: 'Fiction, Screenwriting, Poetry & literary',
    id: 'creative',
  },
  {
    title: 'Academic & Educational',
    details: 'Research papers, Educational content, Student materials',
    id: 'academic',
  },
  {
    title: 'Technical & Specialized',
    details: 'Technical documentation, Legal writing, Medical & scientific',
    id: 'technical',
  },
  {
    title: 'Journalism & Media',
    details: 'News content, Feature articles, Editorials',
    id: 'journalism',
  },
  {
    title: 'Other Specialized Areas',
    details: 'Select this if your area isn\'t listed', // Simplified for now
    id: 'other',
  },
];

const ContentPurposeStep: React.FC<ContentPurposeStepProps> = ({ onNext, onPrev, updateData, data }) => {
  const [selectedPurpose, setSelectedPurpose] = useState<string | undefined>(data.primaryContentPurpose);

  const handleSelect = (purposeId: string) => {
    setSelectedPurpose(purposeId);
    updateData({ primaryContentPurpose: purposeId });
  };

  const handleNext = () => {
    // Optional: Add validation to ensure a selection is made
    if (selectedPurpose) {
      onNext();
    } else {
      // Handle error state - e.g., show a message
      alert("Please select a primary content purpose.");
    }
  };

  return (
    <div className="onboarding-step content-purpose-step">
      <div> {/* Content container */}
        <h2>What type of content do you primarily create?</h2>
        <p>(You can access all features later, this helps us personalize your dashboard)</p>

        <div className="visual-selection-grid">
          {contentPurposes.map((purpose) => (
            <div
              key={purpose.id}
              className={`grid-item ${selectedPurpose === purpose.id ? 'selected' : ''}`}
              onClick={() => handleSelect(purpose.id)}
            >
              <h4>{purpose.title}</h4>
              <p>{purpose.details}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="onboarding-navigation">
        <button onClick={onPrev} className="secondary">
          Back
        </button>
        <button onClick={handleNext} className="primary" disabled={!selectedPurpose}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ContentPurposeStep;
