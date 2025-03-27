import React, { useState, useEffect } from 'react';
import './GenerationProgress.css'; // Create this CSS file next

// Define the structure for a generation stage/step
interface GenerationStage {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  details?: string; // Optional details or error messages
}

// Example stages based on the plan
const initialStages: GenerationStage[] = [
  { id: 'analyze_benchmarks', label: 'Analyzing industry benchmarks...', status: 'pending' },
  { id: 'research_data', label: 'Researching market data...', status: 'pending' },
  { id: 'craft_narrative', label: 'Crafting compelling narrative...', status: 'pending' },
  { id: 'develop_visuals', label: 'Developing data visualizations...', status: 'pending' },
  { id: 'create_structure', label: 'Creating slide structure...', status: 'pending' },
  { id: 'optimize_messaging', label: 'Optimizing messaging for target audience...', status: 'pending' },
  // Add more stages as needed
];

interface GenerationProgressProps {
  projectId: string;
  generationConfig: any; // Config passed from GenerationSetup
  onGenerationComplete: (projectId: string) => void; // Callback when generation finishes
  onGenerationError: (projectId:string, error: Error) => void; // Callback on error
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({
  projectId,
  generationConfig,
  onGenerationComplete,
  onGenerationError,
}) => {
  const [stages, setStages] = useState<GenerationStage[]>(initialStages);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(-1);
  const [overallProgress, setOverallProgress] = useState<number>(0); // Percentage 0-100
  const [error, setError] = useState<string | null>(null);

  // Simulate generation progress
  useEffect(() => {
    let isMounted = true;
    setError(null);

    const runGeneration = async () => {
      for (let i = 0; i < initialStages.length; i++) {
        if (!isMounted) return; // Stop if component unmounted

        // Update current stage to 'in_progress'
        setCurrentStageIndex(i);
        setStages(prev => prev.map((stage, index) =>
          index === i ? { ...stage, status: 'in_progress' } : stage
        ));

        // Simulate work being done for this stage
        const delay = 1000 + Math.random() * 1500; // Random delay per stage
        await new Promise(resolve => setTimeout(resolve, delay));

        // Simulate potential error
        // if (i === 2 && Math.random() > 0.8) {
        //   const errorMsg = "Failed to craft narrative: AI model timeout.";
        //   if (!isMounted) return;
        //   setStages(prev => prev.map((stage, index) =>
        //     index === i ? { ...stage, status: 'error', details: errorMsg } : stage
        //   ));
        //   setError(errorMsg);
        //   onGenerationError(projectId, new Error(errorMsg));
        //   return; // Stop generation on error
        // }

        // Update current stage to 'completed'
        if (!isMounted) return;
        setStages(prev => prev.map((stage, index) =>
          index === i ? { ...stage, status: 'completed' } : stage
        ));

        // Update overall progress
        const progress = Math.round(((i + 1) / initialStages.length) * 100);
        setOverallProgress(progress);
      }

      // Generation complete
      if (isMounted) {
        console.log(`Generation complete for project ${projectId}`);
        onGenerationComplete(projectId);
      }
    };

    runGeneration();

    // Cleanup function
    return () => {
      isMounted = false;
      console.log("GenerationProgress unmounted or generation cancelled.");
      // TODO: Add logic here to cancel the actual AI generation process if possible
    };
  }, [projectId, generationConfig, onGenerationComplete, onGenerationError]); // Rerun if props change (though likely shouldn't during generation)


  return (
    <div className="generation-progress">
      <h2>Generating Your Document...</h2>
      <p>MagicMuse is working its magic. This may take a few moments.</p>

      {/* Overall Progress Bar */}
      <div className="overall-progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${overallProgress}%` }}
        >
          {overallProgress > 10 && `${overallProgress}%`}
        </div>
      </div>

      {/* Stages List */}
      <ul className="stage-list">
        {stages.map((stage, index) => (
          <li key={stage.id} className={`stage-item status-${stage.status}`}>
            <span className="status-icon">
              {stage.status === 'pending' && '⏳'}
              {stage.status === 'in_progress' && <div className="spinner"></div>}
              {stage.status === 'completed' && '✅'}
              {stage.status === 'error' && '❌'}
            </span>
            <span className="stage-label">{stage.label}</span>
            {stage.status === 'error' && stage.details && (
              <span className="error-details">: {stage.details}</span>
            )}
          </li>
        ))}
      </ul>

      {error && (
        <div className="error-message">
          <p>An error occurred during generation:</p>
          <p>{error}</p>
          {/* TODO: Add retry or cancel options */}
        </div>
      )}

      {/* TODO: Add real-time preview section (optional/advanced) */}
      {/* <div className="real-time-preview">
        <h3>Live Preview (Placeholder)</h3>
        <p>See content appear as it's generated...</p>
      </div> */}

      {/* TODO: Add Pause/Cancel buttons */}
       <div className="generation-controls">
           <button disabled={!!error || overallProgress === 100}>Pause</button>
           <button disabled={!!error || overallProgress === 100}>Cancel</button>
       </div>

    </div>
  );
};

export default GenerationProgress;