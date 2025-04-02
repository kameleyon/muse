import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Simple progress bar component to replace the Progress import
const SimpleProgressBar = ({ value = 0, className = "" }) => {
  return (
    <div className={`w-full bg-neutral-light/30 rounded-full h-1.5 ${className}`}>
      <div 
        className="bg-primary rounded-full h-1.5" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

import { PhaseData } from '@/store/types';

interface GenerationProgressProps {
  progress: number;
  statusText: string;
  phaseData: PhaseData;
  onCancel: () => void;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({
  progress,
  statusText,
  phaseData,
  onCancel
}) => {
  // Get phase name for display
  const getPhaseName = (phase: string) => {
    const phases: Record<string, string> = {
      'researching': 'Research Phase',
      'content': 'Content Creation',
      'finalizing': 'Finalization'
    };
    
    return phases[phase] || phase;
  };
  
  // Get section name based on index
  const getSectionName = (index: number | undefined) => {
    if (index === undefined) return '';
    
    const sections = [
      'Introduction',
      'Main Body',
      'Supporting Examples',
      'Conclusion'
    ];
    
    return sections[index] || `Section ${index + 1}`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Generation Progress</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-neutral-dark">Overall Progress</span>
            <span className="text-sm text-primary">{progress}%</span>
          </div>
          <SimpleProgressBar value={progress} className="h-2" />
        </div>
        
        <div className="p-4 bg-neutral-light/10 rounded-md">
          <div className="flex justify-between mb-1">
            <h4 className="text-sm font-medium text-neutral-dark">
              {getPhaseName(phaseData.currentPhase)}
            </h4>
            <span className="text-xs text-primary">{phaseData.phaseProgress}%</span>
          </div>
          <SimpleProgressBar value={phaseData.phaseProgress} className="h-1.5 mb-4" />
          
          {phaseData.currentPhase === 'content' && phaseData.currentSection !== undefined && (
            <div className="text-xs text-neutral-muted flex justify-between">
              <span>Creating: {getSectionName(phaseData.currentSection)}</span>
              <span>{phaseData.currentSection + 1} of {phaseData.totalSections || 4}</span>
            </div>
          )}
        </div>
        
        <div>
          <div className="text-center mb-3">
            <div className="animate-pulse bg-neutral-light/30 text-primary rounded-full px-4 py-2 inline-block">
              <span className="text-sm font-medium">{statusText}</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={onCancel}
              size="sm"
            >
              Cancel Generation
            </Button>
          </div>
        </div>
        
        <div className="pt-4 border-t border-neutral-light/40">
          <h4 className="text-sm font-medium text-neutral-dark mb-2">Generation Notes:</h4>
          <ul className="text-xs text-neutral-muted space-y-1">
            <li>• AI is researching current best practices and domain knowledge</li>
            <li>• Content is being drafted based on your specifications</li>
            <li>• Images and visual elements will be suggested, not created</li>
            <li>• You can edit all content after generation is complete</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default GenerationProgress;
