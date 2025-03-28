import React, { useState } from 'react';
import { Card } from '@/components/ui/Card'; // Keep Card
import { Button } from '@/components/ui/Button'; // Import Button
import PitchDeckTypeGrid from './setup/PitchDeckTypeGrid';
import ProjectSetupForm from './setup/ProjectSetupForm';
import ImportOptions from './setup/ImportOptions';
import '@/styles/ProjectArea.css'; // Keep existing CSS
import '@/styles/ProjectSetup.css'; // Import new CSS

interface ProjectAreaProps {
  initialName: string | null; // Add prop for initial name
}

const ProjectArea: React.FC<ProjectAreaProps> = ({ initialName }) => {
  // State for the setup form
  const [selectedPitchDeckTypeId, setSelectedPitchDeckTypeId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>(initialName || '');
  const [description, setDescription] = useState<string>('');
  const [privacy, setPrivacy] = useState<'private' | 'team' | 'public'>('private');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [teamInput, setTeamInput] = useState<string>('');

  // Handler to select/deselect pitch deck type
  const handleSelectType = (id: string) => {
    setSelectedPitchDeckTypeId(prevId => (prevId === id ? null : id)); // Toggle selection
  };

  // Placeholder handler for final project creation/continuation
  const handleCreateProject = () => {
    if (!projectName) {
      alert('Project Name is required.'); // Simple validation
      return;
    }
    if (!selectedPitchDeckTypeId) {
      alert('Please select a Pitch Deck Type.'); // Simple validation
      return;
    }
    console.log('Creating project with:', {
      projectName,
      pitchDeckTypeId: selectedPitchDeckTypeId,
      description,
      privacy,
      // Add tags, team members, import details later
    });
    // TODO: Implement actual backend call here
    // TODO: Navigate to the next step or project view on success
  };


  return (
    // Use Card component for consistent container styling
    <Card className="project-area-container shadow-md border border-neutral-light">
       {/* Project Title Header */}
       <div className="p-4 border-b border-neutral-light/40 bg-gradient-to-r from-neutral-light/10 to-transparent">
         <h1 className="text-2xl font-bold font-heading text-secondary truncate">
           {projectName || "Untitled Project"} {/* Display state or default */}
         </h1>
         <p className="text-sm text-neutral-dark font-medium">
           Category: Proposal & Pitch Deck Generation {/* Fixed Category */}
         </p>
       </div>

       {/* Step Header */}
       <div className="p-4 border-b border-neutral-light/40 bg-white/5">
         <h2 className="text-lg font-semibold font-heading text-secondary/80">
           Step 1: Project Setup
         </h2>
         <p className="text-sm text-neutral-medium mt-1">
           Define the basics of your new project and choose a starting point.
         </p>
       </div>

       {/* Main Content Area */}
       <div className="p-2 md:p-4 space-y-8">
         {/* Pitch Deck Type Selection */}
         <PitchDeckTypeGrid
           selectedTypeId={selectedPitchDeckTypeId}
           onSelectType={handleSelectType} // Pass the new toggle handler
         />

         {/* Project Details Form */}
         <ProjectSetupForm
           projectName={projectName}
           setProjectName={setProjectName}
           description={description}
           setDescription={setDescription}
           privacy={privacy}
           setPrivacy={setPrivacy}
           tagsInput={tagsInput} // Pass state down
           setTagsInput={setTagsInput} // Pass setter down
           teamInput={teamInput} // Pass state down
           setTeamInput={setTeamInput} // Pass setter down
         />

         {/* Import Options */}
         <ImportOptions
           // Pass handlers for import actions later
         />

         {/* Action Button */}
         <div className="flex justify-end pt-6 border-t border-neutral-light/40">
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateProject}
              disabled={!projectName || !selectedPitchDeckTypeId} // Basic validation
              className="text-white"
            >
              Create Project & Continue
            </Button>
         </div>

         {/* Tutorial Overlay Placeholder - Implement later */}
         {/* <div className="absolute inset-0 bg-black/50 text-white p-4">Tutorial Overlay Placeholder</div> */}

       </div>
    </Card>
  );
};

export default ProjectArea;