import React from 'react';

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onSkip }) => {
  return (
    <div className="onboarding-step welcome-step">
      <div> {/* Content container */}
        <h2>Welcome to MagicMuse!</h2>
        <p>
          We're excited to help you create exceptional content with the power of AI.
        </p>
        <p>
          Let's take a moment to personalize your experience so MagicMuse can better assist with your specific writing needs.
        </p>
      </div>

      <div className="onboarding-navigation">
        {/* Empty div for spacing to push buttons to the right */}
        <div></div>
        <div>
          <button onClick={onSkip} className="secondary skip" style={{ marginRight: '10px' }}>
            Skip Personalization
          </button>
          <button onClick={onNext} className="primary">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;
