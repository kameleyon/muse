import React, { useState } from 'react';
import './RequirementsForm.css'; // Create this CSS file next

interface RequirementsFormProps {
  projectId: string;
  deckTypeId: string; // To potentially tailor the form fields
  onRequirementsComplete: (projectId: string, requirementsData: any) => void; // Callback
  // Add other necessary props, e.g., API service functions
}

// Placeholder for the structure of requirements data
interface RequirementsData {
  targetAudience: string;
  industry: string;
  scope: string;
  objective: string;
  differentiators: string;
  timeline: string; // Consider a more structured type later (e.g., Date range)
  budget: string; // Consider numeric range or structured type
  companyBackground: string;
  // Add fields for content source options (AI-gen, user-created, etc.)
  contentSource: 'ai_generated' | 'ai_enhanced' | 'user_created' | 'import' | 'collaboration';
  // Add fields for depth, tone, research requirements per section (maybe later)
}

const RequirementsForm: React.FC<RequirementsFormProps> = ({
  projectId,
  deckTypeId,
  onRequirementsComplete,
}) => {
  const [formData, setFormData] = useState<Partial<RequirementsData>>({
    contentSource: 'ai_generated', // Default value
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // TODO: Implement AI-assisted completion features ("Complete for me", suggestions)
  // TODO: Implement specific input types (dropdowns, timeline builder, etc.)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Validate formData
      console.log(`Submitting requirements for project ${projectId} (Deck Type: ${deckTypeId}):`, formData);

      // TODO: Call a service function to save requirements (e.g., update project's setup_details)
      // await projectService.updateProjectSetupDetails(projectId, formData, null); // Assuming templateId is handled elsewhere or not needed here

      // Call the callback
      onRequirementsComplete(projectId, formData);

    } catch (err) {
      console.error('Error submitting requirements:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="requirements-form">
      <h2>Gathering Requirements for: {deckTypeId.replace(/_/g, ' ')}</h2>
      <p>Provide details about your project to help MagicMuse generate tailored content.</p>
      <form onSubmit={handleSubmit}>
        {/* --- Core Information Fields (Placeholders) --- */}
        <div className="form-section">
          <h3>Core Information</h3>
          <div className="form-group">
            <label htmlFor="targetAudience">Target Audience/Client Profile:</label>
            <textarea
              id="targetAudience"
              name="targetAudience"
              rows={3}
              value={formData.targetAudience || ''}
              onChange={handleChange}
              placeholder="Describe who you are pitching to (e.g., investors, potential clients, partners)"
              disabled={isLoading}
            />
            {/* TODO: Add persona development aid button/link */}
          </div>
          <div className="form-group">
            <label htmlFor="industry">Industry/Sector:</label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry || ''}
              onChange={handleChange}
              placeholder="e.g., SaaS, Healthcare Technology, E-commerce"
              disabled={isLoading}
            />
             {/* TODO: Implement dropdown + auto-complete */}
          </div>
           <div className="form-group">
            <label htmlFor="scope">Project/Product/Service Scope:</label>
            <textarea
              id="scope"
              name="scope"
              rows={4}
              value={formData.scope || ''}
              onChange={handleChange}
              placeholder="Briefly describe what your pitch/proposal is about."
              disabled={isLoading}
            />
             {/* TODO: Add character count and AI suggestion button */}
          </div>
           <div className="form-group">
            <label htmlFor="objective">Primary Objective:</label>
            <input
              type="text"
              id="objective"
              name="objective"
              value={formData.objective || ''}
              onChange={handleChange}
              placeholder="e.g., Secure $5M funding, Win Client X contract, Form partnership with Company Y"
              disabled={isLoading}
            />
          </div>
          {/* Add other fields: differentiators, timeline, budget, company background */}
           <div className="form-group">
            <label htmlFor="differentiators">Key Differentiators/USPs:</label>
            <textarea
              id="differentiators"
              name="differentiators"
              rows={3}
              value={formData.differentiators || ''}
              onChange={handleChange}
              placeholder="What makes your offering unique? (Competitor comparison option coming soon)"
              disabled={isLoading}
            />
          </div>
           {/* TODO: Add Timeline (interactive builder), Budget (template spreadsheet link), Company Background (URL import) */}

        </div>

        {/* --- Content Source Options --- */}
        <div className="form-section">
          <h3>Content Generation Approach</h3>
           <div className="form-group">
            <label htmlFor="contentSource">How do you want to create the content?</label>
            <select
              id="contentSource"
              name="contentSource"
              value={formData.contentSource || 'ai_generated'}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="ai_generated">AI-Generated (MagicMuse writes most of it)</option>
              <option value="ai_enhanced">AI-Enhanced (Provide points, MagicMuse expands)</option>
              <option value="user_created">User-Created (Write yourself, MagicMuse assists)</option>
              <option value="import" disabled>Import Existing (Coming Soon)</option>
              <option value="collaboration" disabled>Team Collaboration (Coming Soon)</option>
            </select>
          </div>
           {/* TODO: Add per-section options for depth, tone, research */}
        </div>


        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Requirements & Continue'}
        </button>
      </form>
    </div>
  );
};

export default RequirementsForm;