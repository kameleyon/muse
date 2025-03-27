import React, { useState } from 'react';
import './PitchDeckSetupForm.css'; // Create this CSS file next

interface PitchDeckSetupFormProps {
  userId: string; // Assuming userId is passed down
  onCreateProject: (projectId: string) => void; // Callback after project creation
  // Add other necessary props, e.g., API service functions
}

const PitchDeckSetupForm: React.FC<PitchDeckSetupFormProps> = ({ userId, onCreateProject }) => {
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectName.trim()) {
      setError('Project name cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual call to projectService.createProject
      console.log('Creating project with name:', projectName, 'for user:', userId);
      // const projectId = await projectService.createProject({
      //   userId: userId,
      //   projectName: projectName,
      //   projectType: 'pitch_deck_setup', // Temporary type, will be updated later
      //   initialModuleName: 'Pitch Deck Content',
      // });
      const mockProjectId = `proj_${Date.now()}`; // Placeholder
      console.log('Mock Project ID:', mockProjectId);

      // Call the callback function passed from the parent component
      onCreateProject(mockProjectId);

    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Implement upload/import functionality handlers

  return (
    <div className="pitch-deck-setup-form">
      <h2>Create New Pitch Deck / Proposal</h2>
      <form onSubmit={handleCreateProject}>
        <div className="form-group">
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g., Client X Pitch Deck"
            required
            disabled={isLoading}
          />
        </div>

        {/* Placeholder for Upload/Import Options */}
        <div className="form-group upload-options">
          <label>Start with existing content (Optional):</label>
          <button type="button" disabled={isLoading /* || !uploadFeatureEnabled */}>
            Upload File (PDF, PPTX, DOCX)
          </button>
          <button type="button" disabled={isLoading /* || !importFeatureEnabled */}>
            Import from Cloud (Drive, Dropbox...)
          </button>
          {/* Add more details/UI for upload/import later */}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isLoading || !projectName.trim()}>
          {isLoading ? 'Creating...' : 'Create Project & Continue'}
        </button>
      </form>
      {/* TODO: Add dismissible guided tutorial component here */}
    </div>
  );
};

export default PitchDeckSetupForm;