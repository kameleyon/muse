import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, BookOpen } from 'lucide-react';

// Scenarios for the animation
const SCENARIOS = [
  {
    title: 'Blog Article Generation',
    icon: <FileText size={20} />,
    steps: [
      'Selecting blog topic: "AI in Healthcare"',
      'Selecting tone: "Professional"',
      'Selecting length: "Medium (1000 words)"',
      'Generating outline...',
      'Writing introduction...',
      'Developing main points...',
      'Crafting conclusion...',
      'Final blog post complete!'
    ]
  },
  {
    title: 'Document Analysis',
    icon: <Upload size={20} />,
    steps: [
      'Uploading document: "quarterly_report.pdf"',
      'Analyzing document structure...',
      'Identifying key insights...',
      'Comparing with industry benchmarks...',
      'Generating suggestions for improvement...',
      'Highlighting important areas...',
      'Analysis complete!'
    ]
  },
  {
    title: 'Creative Fiction',
    icon: <BookOpen size={20} />,
    steps: [
      'Selecting genre: "Science Fiction"',
      'Creating protagonist profile...',
      'Developing setting: "Distant future, terraformed Mars"',
      'Generating plot outline...',
      'Writing opening scene...',
      'Developing character arcs...',
      'Crafting dialogue...',
      'Story complete!'
    ]
  }
];

const TypingAnimation: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  // Handle typing animation
  useEffect(() => {
    const scenario = SCENARIOS[currentScenario];
    const currentText = scenario.steps[currentStep] || '';
    
    if (isTyping && text.length < currentText.length) {
      // Typing effect
      const timeoutId = setTimeout(() => {
        setText(currentText.substring(0, text.length + 1));
      }, 40);
      return () => clearTimeout(timeoutId);
    } else if (isTyping && text.length === currentText.length) {
      // Pause at the end of typing
      const timeoutId = setTimeout(() => {
        setIsTyping(false);
      }, 1500);
      return () => clearTimeout(timeoutId);
    } else if (!isTyping) {
      // Move to next step or scenario
      const timeoutId = setTimeout(() => {
        if (currentStep < scenario.steps.length - 1) {
          // Next step in current scenario
          setCurrentStep(currentStep + 1);
          setText('');
          setIsTyping(true);
        } else {
          // Next scenario
          setCurrentScenario((currentScenario + 1) % SCENARIOS.length);
          setCurrentStep(0);
          setText('');
          setIsTyping(true);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [currentScenario, currentStep, text, isTyping]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Scenario header */}
      <div className="mb-4 p-2 bg-secondary/60 rounded-md flex items-center">
        <div className="p-1.5 bg-primary/20 rounded-md mr-2 text-primary">
          {SCENARIOS[currentScenario].icon}
        </div>
        <h3 className="text-primary font-heading text-sm sm:text-base">
          {SCENARIOS[currentScenario].title}
        </h3>
      </div>
      
      {/* Content area */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScenario}-${currentStep}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 bg-secondary/40 rounded-md p-3 font-mono text-xs sm:text-sm text-neutral-light"
          >
            <div className="flex items-start">
              <span className="text-primary mr-2">&gt;</span>
              <span>{text}</span>
              {showCursor && (
                <span className="ml-0.5 inline-block w-2 h-4 bg-primary animate-pulse"></span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Progress indicator */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-neutral-medium">Step {currentStep + 1}/{SCENARIOS[currentScenario].steps.length}</div>
          <div className="flex space-x-1">
            {SCENARIOS.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${
                  index === currentScenario ? 'bg-primary' : 'bg-neutral-medium/30'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingAnimation;