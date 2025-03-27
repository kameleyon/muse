import React, { useState } from 'react';
import './GenerationSetup.css'; // Create this CSS file next

// Assuming these types are defined elsewhere or will be refined
// Define RequirementsData properly (copied from RequirementsForm.tsx)
interface RequirementsData {
  targetAudience: string;
  industry: string;
  scope: string;
  objective: string;
  differentiators: string;
  timeline: string; // Consider a more structured type later (e.g., Date range)
  budget: string; // Consider numeric range or structured type
  companyBackground: string;
  contentSource: 'ai_generated' | 'ai_enhanced' | 'user_created' | 'import' | 'collaboration';
}
interface DeckSection { id: string; title: string; enabled: boolean; /* ... */ }


interface GenerationSetupProps {
  projectId: string;
  deckTypeId: string;
  templateId: string;
  requirementsData: Partial<RequirementsData>; // Data from RequirementsForm
  structureData: DeckSection[]; // Data from StructurePlanner
  onStartGeneration: (projectId: string, generationConfig: any) => void; // Callback
}

// Placeholder for generation configuration
interface GenerationConfig {
  depth: 'brief' | 'standard' | 'detailed';
  tone: 'formal' | 'conversational' | 'persuasive' | 'technical';
  style?: string; // Could link back to template or be separate
  factCheck: boolean;
  includeVisuals: boolean; // Charts, tables, icons
  // Potentially add per-section overrides here later
}

const GenerationSetup: React.FC<GenerationSetupProps> = ({
  projectId,
  deckTypeId,
  templateId,
  requirementsData,
  structureData,
  onStartGeneration,
}) => {
  const [config, setConfig] = useState<GenerationConfig>({
    depth: 'standard',
    tone: 'persuasive',
    factCheck: true,
    includeVisuals: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfigChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox' && e.target instanceof HTMLInputElement;
    const newValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setConfig((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleConfirmAndGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Starting generation for project ${projectId} with config:`, config);
      // TODO: Potentially call a service function to validate/finalize setup before generation
      // await projectService.finalizeSetup(projectId, config);

      // Pass necessary data (including config) to the parent/orchestrator
      onStartGeneration(projectId, {
          config,
          requirements: requirementsData,
          structure: structureData.filter(s => s.enabled), // Only pass enabled sections
          deckTypeId,
          templateId,
      });

    } catch (err) {
       console.error('Error starting generation:', err);
       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
       setIsLoading(false); // Stop loading on error
    }
    // setIsLoading(false); // Loading state might be managed by parent during actual generation
  };

  const enabledSections = structureData.filter(s => s.enabled);

  return (
    <div className="generation-setup">
      <h2>Ready to Generate?</h2>
      <p>Review your setup and confirm generation preferences.</p>

      {error && <p className="error-message">{error}</p>}

      <div className="setup-review">
        {/* Section to review gathered requirements (simplified view) */}
        <div className="review-section">
          <h3>Requirements Summary</h3>
          <p><strong>Audience:</strong> {requirementsData?.targetAudience || 'N/A'}</p>
          <p><strong>Industry:</strong> {requirementsData?.industry || 'N/A'}</p>
          <p><strong>Objective:</strong> {requirementsData?.objective || 'N/A'}</p>
          {/* Add more key requirements */}
          <p><strong>Content Approach:</strong> {requirementsData?.contentSource?.replace(/_/g, ' ') || 'N/A'}</p>
          {/* TODO: Add button to go back and edit requirements */}
        </div>

        {/* Section to review planned structure */}
        <div className="review-section">
            <h3>Planned Structure ({enabledSections.length} Sections)</h3>
            <ul>
                {enabledSections.map(section => <li key={section.id}>{section.title}</li>)}
            </ul>
            {/* TODO: Add button to go back and edit structure */}
        </div>

         {/* Section to review selected template */}
         <div className="review-section">
            <h3>Selected Template</h3>
            <p>{templateId || 'Default'}</p> {/* TODO: Fetch template name */}
             {/* TODO: Add button to go back and edit template */}
         </div>
      </div>

      <div className="generation-config">
        <h3>Generation Preferences</h3>
         <div className="form-group">
            <label htmlFor="depth">Content Depth:</label>
            <select id="depth" name="depth" value={config.depth} onChange={handleConfigChange} disabled={isLoading}>
                <option value="brief">Brief</option>
                <option value="standard">Standard</option>
                <option value="detailed">Detailed</option>
            </select>
         </div>
         <div className="form-group">
            <label htmlFor="tone">Overall Tone:</label>
            <select id="tone" name="tone" value={config.tone} onChange={handleConfigChange} disabled={isLoading}>
                <option value="formal">Formal</option>
                <option value="conversational">Conversational</option>
                <option value="persuasive">Persuasive</option>
                <option value="technical">Technical</option>
            </select>
         </div>
         <div className="form-group checkbox-group">
             <input type="checkbox" id="factCheck" name="factCheck" checked={config.factCheck} onChange={handleConfigChange} disabled={isLoading} />
             <label htmlFor="factCheck">Enable Fact-Checking (for market data, stats)</label>
         </div>
          <div className="form-group checkbox-group">
             <input type="checkbox" id="includeVisuals" name="includeVisuals" checked={config.includeVisuals} onChange={handleConfigChange} disabled={isLoading} />
             <label htmlFor="includeVisuals">Suggest Visual Elements (Charts, Tables)</label>
         </div>
      </div>

       {/* TODO: Add AI Guidance Section */}
       <div className="ai-guidance">
            <h3>AI Guidance (Placeholder)</h3>
            <ul>
                <li>Tip: Ensure your 'Objective' is clear and measurable.</li>
                <li>Based on '{deckTypeId}', consider emphasizing the 'Problem/Opportunity'.</li>
                {/* Add dynamic tips */}
            </ul>
       </div>


      <button onClick={handleConfirmAndGenerate} disabled={isLoading} className="generate-button">
        {isLoading ? 'Preparing...' : 'Start AI Generation'}
      </button>
    </div>
  );
};

export default GenerationSetup;