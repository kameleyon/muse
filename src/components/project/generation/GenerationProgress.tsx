import React from 'react'; // Removed useState, useEffect
import { Card } from '@/components/ui/Card';

interface GenerationProgressProps {
   progress: number; // Percentage (0-100)
   statusText: string;
   // onCancel?: () => void; // Keep for potential future use
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ progress, statusText }) => {
  // Removed internal state and effects

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm"> 
      <h4 className="font-semibold text-neutral-dark text-lg mb-3">Generation Progress</h4>
      <div className="space-y-2">
        {/* Progress Bar */}
        <div className="w-full bg-neutral-light rounded-full h-2.5 dark:bg-gray-700">
          <div 
             className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
             style={{ width: `${progress}%` }} // Use progress prop
          ></div> 
        </div>
        {/* Status Text */}
        <p className="text-xs text-neutral-medium text-center"> 
          {statusText || 'Waiting to start...'} {/* Use statusText prop */}
        </p>
      </div>
       {/* Optional Cancel Button */}
       {/* <div className="flex justify-center mt-3">
          <Button variant="danger" size="sm" onClick={onCancel}>Cancel</Button>
       </div> */}
    </Card>
  );
};

export default GenerationProgress;