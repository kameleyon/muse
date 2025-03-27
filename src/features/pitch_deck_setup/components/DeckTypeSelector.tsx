import React, { useState } from 'react';
import './DeckTypeSelector.css'; // Create this CSS file next

// Define the structure for a deck type
interface DeckType {
  id: string; // e.g., 'investment_pitch', 'sales_proposal'
  name: string;
  description: string;
  thumbnailUrl?: string; // Placeholder for visual thumbnail
  recommendedSections?: string[]; // Placeholder
  estimatedTime?: string; // Placeholder
  industryRelevance?: string[]; // Placeholder
}

// Placeholder data for deck types
const deckTypes: DeckType[] = [
  { id: 'investment_pitch', name: 'Investment Pitch', description: 'Secure funding from venture capitalists or investors.', thumbnailUrl: '/placeholders/investment.png' },
  { id: 'sales_proposal', name: 'Sales Proposal', description: 'Win new clients and close deals.', thumbnailUrl: '/placeholders/sales.png' },
  { id: 'partnership_proposal', name: 'Partnership Proposal', description: 'Form strategic alliances with other businesses.', thumbnailUrl: '/placeholders/partnership.png' },
  { id: 'business_proposal', name: 'Business Proposal', description: 'Outline general business opportunities.', thumbnailUrl: '/placeholders/business.png' },
  { id: 'project_proposal', name: 'Project Proposal', description: 'Get approval for a specific project initiative.', thumbnailUrl: '/placeholders/project.png' },
  { id: 'startup_pitch', name: 'Startup Pitch', description: 'Present your early-stage company vision.', thumbnailUrl: '/placeholders/startup.png' },
  { id: 'product_launch', name: 'Product Launch', description: 'Introduce a new product to the market.', thumbnailUrl: '/placeholders/launch.png' },
  { id: 'custom_proposal', name: 'Custom Proposal', description: 'Build your document from scratch.', thumbnailUrl: '/placeholders/custom.png' },
];

interface DeckTypeSelectorProps {
  projectId: string;
  onDeckTypeSelected: (projectId: string, deckTypeId: string) => void; // Callback when a type is selected
  // Add other necessary props, e.g., API service functions
}

const DeckTypeSelector: React.FC<DeckTypeSelectorProps> = ({ projectId, onDeckTypeSelected }) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectType = async (typeId: string) => {
    setSelectedTypeId(typeId);
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Call a service function to update the project's project_type
      console.log(`Updating project ${projectId} with type: ${typeId}`);
      // await projectService.updateProjectType(projectId, typeId);

      // Call the callback
      onDeckTypeSelected(projectId, typeId);

    } catch (err) {
      console.error('Error updating project type:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setSelectedTypeId(null); // Reset selection on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="deck-type-selector">
      <h2>Select Your Document Type</h2>
      <p>Choose the type of proposal or pitch deck you want to create. This helps tailor the structure and content suggestions.</p>
      {error && <p className="error-message">{error}</p>}
      <div className="deck-type-grid">
        {deckTypes.map((type) => (
          <div
            key={type.id}
            className={`deck-type-card ${selectedTypeId === type.id ? 'selected' : ''} ${isLoading ? 'disabled' : ''}`}
            onClick={() => !isLoading && handleSelectType(type.id)}
            role="button"
            tabIndex={isLoading ? -1 : 0}
            aria-pressed={selectedTypeId === type.id}
          >
            {/* Basic Thumbnail Placeholder */}
            <div className="thumbnail-placeholder">
              {/* In a real implementation, use type.thumbnailUrl */}
              <span>{type.name.substring(0, 1)}</span>
            </div>
            <h3>{type.name}</h3>
            <p>{type.description}</p>
            {/* TODO: Add more details like recommended sections, time, etc. on hover/focus */}
            {isLoading && selectedTypeId === type.id && <div className="loading-spinner"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckTypeSelector;