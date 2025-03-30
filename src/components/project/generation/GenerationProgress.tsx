import React from 'react';
import { Card } from '@/components/ui/Card';
import { Search, FileText, BarChart, CheckCircle, Loader, Play } from 'lucide-react'; // Added Loader and Play
// Import the centralized GenerationPhase type
import { GenerationPhase } from '@/store/types'; 

interface GenerationProgressProps {
  progress: number; // Overall percentage (0-100)
  statusText: string;
  phaseData?: {
    currentPhase: GenerationPhase; // Use imported type
    phaseProgress: number; // Progress within the current phase (0-100)
    currentSlide?: number;
    totalSlides?: number;
  };
  onCancel?: () => void;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({
  progress,
  statusText,
  phaseData = {
    currentPhase: 'idle', // Default to idle
    phaseProgress: 0
  },
  onCancel
}) => {
  // Function to render the appropriate phase icon
  const renderPhaseIcon = (phase: GenerationPhase) => {
    switch (phase) {
      case 'idle':
        return <Play size={16} className="text-neutral-400" />; // Icon for idle state
      case 'preparing':
        return <Loader size={16} className="text-neutral-500 animate-spin" />; // Icon for preparing
      case 'researching': // Corrected phase name
        return <Search size={16} className="text-blue-500" />;
      case 'content':
        return <FileText size={16} className="text-green-500" />;
      case 'visuals':
        return <BarChart size={16} className="text-purple-500" />;
      case 'finalizing':
        return <CheckCircle size={16} className="text-amber-500" />;
      case 'complete':
         return <CheckCircle size={16} className="text-primary" />; // Icon for complete
    }
  };

  // Function to get the appropriate color for the phase progress bar
  const getPhaseColor = (phase: GenerationPhase) => {
    switch (phase) {
      case 'idle': return 'bg-neutral-300';
      case 'preparing': return 'bg-neutral-400';
      case 'researching': return 'bg-blue-500'; // Corrected phase name
      case 'content': return 'bg-green-500';
      case 'visuals': return 'bg-purple-500';
      case 'finalizing': return 'bg-amber-500';
      case 'complete': return 'bg-primary';
    }
  };

  // Function to get human-readable phase name
  const getPhaseName = (phase: GenerationPhase) => {
    switch (phase) {
      case 'idle': return 'Idle';
      case 'preparing': return 'Preparing...';
      case 'researching': return 'Researching'; // Corrected phase name
      case 'content': return 'Generating Content';
      case 'visuals': return 'Creating Visuals';
      case 'finalizing': return 'Finalizing';
      case 'complete': return 'Complete';
    }
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3">Generation Progress</h4>
      <div className="space-y-3">
        {/* Phase Indicator */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 font-medium text-sm">
            {renderPhaseIcon(phaseData.currentPhase)}
            <span>{getPhaseName(phaseData.currentPhase)}</span>
          </div>
          
          {/* Show slide progress if in content or visuals phase */}
          {(phaseData.currentPhase === 'content' || phaseData.currentPhase === 'visuals') && 
            phaseData.currentSlide && phaseData.totalSlides && (
            <div className="bg-neutral-100 px-2 py-1 rounded text-xs font-medium">
              Slide {phaseData.currentSlide} of {phaseData.totalSlides}
            </div>
          )}
        </div>
        
        {/* Main Progress Bar */}
        <div className="w-full bg-neutral-light rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Phase Progress Bar (smaller) */}
        {phaseData.currentPhase !== 'idle' && phaseData.currentPhase !== 'complete' && ( // Don't show phase bar if idle or complete
          <div className="w-full bg-neutral-light/50 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ease-out ${getPhaseColor(phaseData.currentPhase)}`}
              style={{ width: `${phaseData.phaseProgress}%` }}
            ></div>
          </div>
        )}
        
        {/* Progress Steps */}
        <div className="flex justify-between items-center mt-3">
          {/* Use 'researching' for comparison */}
          <div className={`flex flex-col items-center ${phaseData.currentPhase === 'researching' || progress >= 25 ? 'progress-step-icon-active' : 'progress-step-icon-inactive'}`}>
            <Search size={14} />
            <span className="text-xs mt-1">Research</span>
          </div>
          <div className={`flex flex-col items-center ${phaseData.currentPhase === 'content' || progress >= 50 ? 'progress-step-icon-active' : 'progress-step-icon-inactive'}`}>
            <FileText size={14} />
            <span className="text-xs mt-1">Content</span>
          </div>
          <div className={`flex flex-col items-center ${phaseData.currentPhase === 'visuals' || progress >= 75 ? 'progress-step-icon-active' : 'progress-step-icon-inactive'}`}>
            <BarChart size={14} />
            <span className="text-xs mt-1">Visuals</span>
          </div>
          <div className={`flex flex-col items-center ${phaseData.currentPhase === 'finalizing' || progress >= 100 ? 'progress-step-icon-active' : 'progress-step-icon-inactive'}`}>
            <CheckCircle size={14} />
            <span className="text-xs mt-1">Finalize</span>
          </div>
        </div>
        
        {/* Status Text */}
        <p className="text-xs text-neutral-medium text-center mt-2">
          {statusText || 'Preparing generation...'}
        </p>
      </div>
      
      {/* Cancel Button */}
      {onCancel && phaseData.currentPhase !== 'complete' && phaseData.currentPhase !== 'idle' && ( // Show cancel only during active generation
        <div className="flex justify-center mt-3">
          <button 
            onClick={onCancel}
            className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100 transition-colors"
          >
            Cancel Generation
          </button>
        </div>
      )}
    </Card>
  );
};

export default GenerationProgress;