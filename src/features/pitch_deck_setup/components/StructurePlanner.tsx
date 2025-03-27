import React, { useState, useEffect } from 'react';
// Consider using a drag-and-drop library like react-beautiful-dnd
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './StructurePlanner.css'; // Create this CSS file next

// Placeholder for a section in the structure
interface DeckSection {
  id: string; // Unique ID for the section (e.g., 'problem_statement')
  title: string; // Display title (e.g., "Problem/Opportunity")
  recommended: boolean; // Was this suggested by the system?
  enabled: boolean; // Is this section currently included?
  // Add potential fields like estimated time, key message prompts, etc.
}

// Placeholder function to get suggested structure based on deck type
const getSuggestedStructure = (deckTypeId: string): DeckSection[] => {
  console.log("Getting suggested structure for:", deckTypeId);
  // In a real implementation, fetch this from a config or API
  // Example structure:
  const baseStructure: DeckSection[] = [
    { id: 'executive_summary', title: 'Executive Summary/Overview', recommended: true, enabled: true },
    { id: 'problem_statement', title: 'Problem/Opportunity', recommended: true, enabled: true },
    { id: 'value_proposition', title: 'Value Proposition/Solution', recommended: true, enabled: true },
    { id: 'market_analysis', title: 'Market Analysis', recommended: true, enabled: true },
    { id: 'business_model', title: 'Business Model', recommended: true, enabled: true },
    { id: 'roadmap_timeline', title: 'Roadmap/Timeline', recommended: false, enabled: true },
    { id: 'team', title: 'Team', recommended: true, enabled: true },
    { id: 'financials', title: 'Financial Projections', recommended: true, enabled: true },
    { id: 'competition', title: 'Competitive Landscape', recommended: false, enabled: true },
    { id: 'call_to_action', title: 'Call to Action/Next Steps', recommended: true, enabled: true },
  ];
  // Add/remove/reorder based on deckTypeId logic here...
  if (deckTypeId === 'investment_pitch') {
     // Maybe add 'Ask' section
     const askSection = { id: 'funding_ask', title: 'Funding Ask', recommended: true, enabled: true };
     const financialsIndex = baseStructure.findIndex(s => s.id === 'financials');
     if (financialsIndex !== -1) {
         baseStructure.splice(financialsIndex + 1, 0, askSection);
     } else {
         baseStructure.push(askSection);
     }
  }
  return baseStructure;
};


interface StructurePlannerProps {
  projectId: string;
  deckTypeId: string;
  templateId: string; // May influence structure suggestions
  onStructureConfirmed: (projectId: string, finalStructure: DeckSection[]) => void; // Callback
}

const StructurePlanner: React.FC<StructurePlannerProps> = ({
  projectId,
  deckTypeId,
  templateId,
  onStructureConfirmed,
}) => {
  const [sections, setSections] = useState<DeckSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with suggested structure
    const suggested = getSuggestedStructure(deckTypeId);
    setSections(suggested);
  }, [deckTypeId]);

  // TODO: Implement Drag and Drop reordering using a library
  const handleDragEnd = (result: any /* Replace with type from dnd library */) => {
    // if (!result.destination) return;
    // const items = Array.from(sections);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // items.splice(result.destination.index, 0, reorderedItem);
    // setSections(items);
    console.log("DragEnd result (implement reordering):", result);
  };

  // Toggle section inclusion
  const toggleSectionEnabled = (sectionId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  // TODO: Implement adding/removing sections (with AI recommendations?)
  const handleAddSection = () => {
      console.log("TODO: Implement Add Section functionality");
      // Potentially show a modal with suggested sections or a custom input
  };

  const handleConfirmStructure = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const finalStructure = sections; // Get the current state
      console.log(`Confirming structure for project ${projectId}:`, finalStructure);
      // TODO: Call a service function to save the structure (e.g., update project details or create initial content sections)
      // await projectService.saveProjectStructure(projectId, finalStructure);

      onStructureConfirmed(projectId, finalStructure);

    } catch (err) {
       console.error('Error confirming structure:', err);
       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="structure-planner">
      <h2>Plan Your Document Structure</h2>
      <p>Review the suggested sections for a '{deckTypeId.replace(/_/g, ' ')}'. Drag to reorder, toggle inclusion, or add custom sections.</p>

      {error && <p className="error-message">{error}</p>}

      {/* Placeholder for Drag and Drop Context */}
      {/* <DragDropContext onDragEnd={handleDragEnd}> */}
        {/* <Droppable droppableId="sections"> */}
          {/* {(provided) => ( */}
            {/* <div {...provided.droppableProps} ref={provided.innerRef} className="section-list"> */}
              {sections.map((section, index) => (
                // <Draggable key={section.id} draggableId={section.id} index={index}>
                  // {(provided) => (
                    <div
                      // ref={provided.innerRef}
                      // {...provided.draggableProps}
                      // {...provided.dragHandleProps}
                      className={`section-item ${!section.enabled ? 'disabled' : ''}`}
                      key={section.id} // Added key for React list rendering
                    >
                      <span className="drag-handle">::</span> {/* Placeholder handle */}
                      <span className="section-title">{section.title}</span>
                      {section.recommended && <span className="recommended-badge">Recommended</span>}
                      <button
                        onClick={() => toggleSectionEnabled(section.id)}
                        className={`toggle-button ${section.enabled ? 'enabled' : ''}`}
                        aria-label={section.enabled ? 'Disable section' : 'Enable section'}
                      >
                        {section.enabled ? 'Included' : 'Excluded'}
                      </button>
                    </div>
                  // )}
                // </Draggable>
              ))}
              {/* {provided.placeholder} */}
            {/* </div> */}
          {/* )} */}
        {/* </Droppable> */}
      {/* </DragDropContext> */}

      <div className="structure-actions">
          <button onClick={handleAddSection} disabled={isLoading}>+ Add Section</button>
          <button onClick={handleConfirmStructure} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Confirm Structure & Continue'}
          </button>
      </div>

       {/* TODO: Add complexity slider, time allocation hints, etc. */}

    </div>
  );
};

export default StructurePlanner;