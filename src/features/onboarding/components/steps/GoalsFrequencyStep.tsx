import React, { useState, useEffect } from 'react';
import { OnboardingData } from '../OnboardingModal';

interface GoalsFrequencyStepProps {
  onNext: () => void;
  onPrev: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

const goalOptions = [
  { id: 'productivity', label: 'Increase writing productivity' },
  { id: 'quality', label: 'Improve content quality' },
  { id: 'ideas', label: 'Generate new creative ideas' },
  { id: 'seo', label: 'Create SEO-optimized content' },
  { id: 'brand_voice', label: 'Maintain consistent brand voice' },
  { id: 'collaboration', label: 'Collaborate with team members' },
  { id: 'repurpose', label: 'Repurpose content across channels' },
  { id: 'learn', label: 'Learn new writing techniques' },
];

const frequencyOptions = [
  { id: 'daily', label: 'Daily' },
  { id: 'several_weekly', label: 'Several times a week' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'few_monthly', label: 'A few times a month' },
  { id: 'monthly_less', label: 'Monthly or less frequently' },
];

const GoalsFrequencyStep: React.FC<GoalsFrequencyStepProps> = ({ onNext, onPrev, updateData, data }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.mainGoals || []);
  const [selectedFrequency, setSelectedFrequency] = useState<string | undefined>(data.contentFrequency);

  const maxGoals = 3;

  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const goalId = event.target.value;
    const isChecked = event.target.checked;

    setSelectedGoals(prevGoals => {
      if (isChecked) {
        // Add goal if less than max allowed
        return prevGoals.length < maxGoals ? [...prevGoals, goalId] : prevGoals;
      } else {
        // Remove goal
        return prevGoals.filter(g => g !== goalId);
      }
    });
  };

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFrequency(event.target.value);
  };

  // Update parent data when values change, but exclude updateData from dependencies
  useEffect(() => {
    updateData({ mainGoals: selectedGoals, contentFrequency: selectedFrequency });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGoals, selectedFrequency]);
  // Intentionally removing updateData from the dependency array to prevent infinite loops

  const handleNext = () => {
    if (selectedGoals.length > 0 && selectedFrequency) {
      onNext();
    } else {
      alert("Please select at least one goal and your content frequency.");
    }
  };

  return (
    <div className="onboarding-step goals-frequency-step">
      <div> {/* Content container */}
        <h2>What are your main goals with MagicMuse?</h2>
        <p>(Select up to {maxGoals})</p>
        <div className="goal-options">
          {goalOptions.map(goal => (
            <label key={goal.id}>
              <input
                type="checkbox"
                value={goal.id}
                checked={selectedGoals.includes(goal.id)}
                onChange={handleGoalChange}
                disabled={selectedGoals.length >= maxGoals && !selectedGoals.includes(goal.id)}
              />
              {goal.label}
            </label>
          ))}
        </div>

        <h2 style={{ marginTop: '30px' }}>How often do you typically create content?</h2>
        <div className="frequency-options">
          {frequencyOptions.map(freq => (
            <label key={freq.id}>
              <input
                type="radio"
                name="frequency"
                value={freq.id}
                checked={selectedFrequency === freq.id}
                onChange={handleFrequencyChange}
              />
              {freq.label}
            </label>
          ))}
        </div>
      </div>

      <div className="onboarding-navigation">
        <button onClick={onPrev} className="secondary">
          Back
        </button>
        <button
          onClick={handleNext}
          className="primary"
          disabled={selectedGoals.length === 0 || !selectedFrequency}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GoalsFrequencyStep;
