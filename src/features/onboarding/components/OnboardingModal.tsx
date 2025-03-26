import React, { useState } from 'react'; // Import useState
import './OnboardingModal.css';
import { saveOnboardingData } from '../../../services/onboarding'; // Import the service
import WelcomeStep from './steps/WelcomeStep'; // Import the WelcomeStep component
import ContentPurposeStep from './steps/ContentPurposeStep'; // Import the ContentPurposeStep component
import GoalsFrequencyStep from './steps/GoalsFrequencyStep'; // Import the GoalsFrequencyStep component
import EnvironmentIndustryStep from './steps/EnvironmentIndustryStep'; // Import the EnvironmentIndustryStep component
import DashboardCustomizationStep from './steps/DashboardCustomizationStep'; // Import the DashboardCustomizationStep component

// Define interfaces for the data collected during onboarding
export interface OnboardingData {
  primaryContentPurpose?: string; // Step 2
  secondaryContentPurposes?: string[]; // Step 2 (if multiple allowed)
  mainGoals?: string[]; // Step 3
  contentFrequency?: string; // Step 3
  industry?: string; // Step 4
  customIndustry?: string; // Step 4 (if 'Other')
  writingStyle?: { // Step 4 - Align with service/backend
    formal: number;
    technical: number;
    traditional: number;
    detailed: number;
  };
  aiAssistanceLevel?: string; // Step 5
}

// Define the expected structure for the service call (matching service)
interface OnboardingPayload {
  primaryContentPurpose: string;
  mainGoals: string[];
  contentFrequency: string;
  industry: string;
  customIndustry?: string;
  writingStyle: {
    formal: number;
    technical: number;
    traditional: number;
    detailed: number;
  };
  aiAssistanceLevel: string;
}

interface OnboardingModalProps {
  onComplete: (data: OnboardingData) => void; // Pass data on completion
  onSkip: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  const totalSteps = 5; // Define the total number of steps

  // Function to update onboarding data
  const updateData = (newData: Partial<OnboardingData>) => {
    setOnboardingData(prevData => ({ ...prevData, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle final step completion - save data via API
      handleSaveData();
    }
  };

  // Function to handle saving data via API
  const handleSaveData = async () => {
    setIsLoading(true);
    setError(null);

    // Basic validation/type assertion before sending
    // Ensure required fields are present and have default values if needed
    const payload: OnboardingPayload = {
      primaryContentPurpose: onboardingData.primaryContentPurpose || 'Not Specified',
      mainGoals: onboardingData.mainGoals || [],
      contentFrequency: onboardingData.contentFrequency || 'Not Specified',
      industry: onboardingData.industry || 'Not Specified',
      customIndustry: onboardingData.customIndustry,
      writingStyle: onboardingData.writingStyle || { formal: 50, technical: 50, traditional: 50, detailed: 50 }, // Default slider values if needed
      aiAssistanceLevel: onboardingData.aiAssistanceLevel || 'Not Specified',
    };

    try {
      console.log("Attempting to save onboarding data:", payload);
      const result = await saveOnboardingData(payload);
      console.log("Onboarding data saved successfully:", result);
      // Continue with completion regardless of the specific response structure
      onComplete(onboardingData); // Call original onComplete (likely closes modal)
    } catch (err: any) {
      console.error("Failed to save onboarding data:", err);
      setError(err.message || 'An unexpected error occurred while saving your preferences.');
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={nextStep} onSkip={onSkip} />; // Use WelcomeStep
      case 2:
        return <ContentPurposeStep onNext={nextStep} onPrev={prevStep} updateData={updateData} data={onboardingData} />; // Use ContentPurposeStep
      case 3:
        return <GoalsFrequencyStep onNext={nextStep} onPrev={prevStep} updateData={updateData} data={onboardingData} />; // Use GoalsFrequencyStep
      case 4:
        return <EnvironmentIndustryStep onNext={nextStep} onPrev={prevStep} updateData={updateData} data={onboardingData} />; // Use EnvironmentIndustryStep
      case 5:
        // Pass loading and error state to the final step
        return <DashboardCustomizationStep
                  onComplete={nextStep} // Trigger handleSaveData via nextStep
                  onPrev={prevStep}
                  updateData={updateData}
                  data={onboardingData}
                  isLoading={isLoading} // Pass loading state
                  error={error} // Pass error state
               />;
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="onboarding-modal-backdrop">
      <div className="onboarding-modal-content">
        {/* Progress Indicator */}
        {/* Progress Indicator */}
        <div className="onboarding-progress">
          Step {currentStep} of {totalSteps}
          {isLoading && <span className="loading-indicator"> Saving...</span>}
        </div>

        {/* Display general error messages here */}
        {error && !isLoading && currentStep === totalSteps && (
          <div className="onboarding-error-message">{error}</div>
        )}

        {renderStep()}

        {/* Navigation buttons are within each step component */}
      </div>
    </div>
  );
};

export default OnboardingModal;
