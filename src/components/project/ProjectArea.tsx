import React, { useState } from 'react';
import { Card } from '@/components/ui/Card'; // Keep Card
import { Button } from '@/components/ui/Button'; // Import Button
import PitchDeckTypeGrid from './setup/PitchDeckTypeGrid';
import ProjectSetupForm from './setup/ProjectSetupForm';
import ImportOptions from './setup/ImportOptions';
import TargetAudienceForm from './requirements/TargetAudienceForm';
import TemplateGallery from './design/TemplateGallery'; // Import Step 3 component
import BrandCustomization from './design/BrandCustomization'; // Import Step 3 component
import StructurePlanning from './design/StructurePlanning'; // Import Step 3 component
import DesignPreview from './design/DesignPreview';
import GenerationSetup from './generation/GenerationSetup'; // Import Step 4 component
import GenerationProgress from './generation/GenerationProgress'; // Import Step 4 component
import GenerationPreview from './generation/GenerationPreview'; // Import Step 4 component
import ContentEditor from './editing/ContentEditor'; // Import Step 5 component
import EnhancementTools from './editing/EnhancementTools'; // Import Step 5 component
import VisualElementStudio from './editing/VisualElementStudio'; // Import Step 5 component
import CollaborationTools from './editing/CollaborationTools';
import QualityDashboard from './qa/QualityDashboard'; // Import Step 6 component
import ValidationInterface from './qa/ValidationInterface'; // Import Step 6 component
import RefinementPanel from './qa/RefinementPanel'; // Import Step 6 component
import PresenterTools from './delivery/PresenterTools'; // Import Step 7 component
import ExportConfiguration from './delivery/ExportConfiguration'; // Import Step 7 component
import SharingPermissions from './delivery/SharingPermissions'; // Import Step 7 component
import ArchivingAnalytics from './delivery/ArchivingAnalytics'; // Import Step 7 component
import '@/styles/ProjectArea.css';
import '@/styles/ProjectSetup.css';
// Potentially add new CSS files for Steps 6 & 7 later if needed

interface ProjectAreaProps {
  initialName: string | null; // Add prop for initial name
}

const ProjectArea: React.FC<ProjectAreaProps> = ({ initialName }) => {
  const [currentStep, setCurrentStep] = useState<number>(1); // State to track current step

  // --- State for Step 1 ---
  const [selectedPitchDeckTypeId, setSelectedPitchDeckTypeId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>(initialName || '');
  const [description, setDescription] = useState<string>('');
  const [privacy, setPrivacy] = useState<'private' | 'team' | 'public'>('private');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [teamInput, setTeamInput] = useState<string>('');
  // --- End State for Step 1 ---

  // --- State for Step 2 (Add as needed) ---
  // Example:
  // const [audienceName, setAudienceName] = useState<string>('');
  // --- End State for Step 2 ---

  // Handler to select/deselect pitch deck type
  const handleSelectType = (id: string) => {
    setSelectedPitchDeckTypeId(prevId => (prevId === id ? null : id)); // Toggle selection
  };

  // Placeholder handler for final project creation/continuation
  const handleContinueFromStep1 = () => {
    if (!projectName) {
      alert('Project Name is required.');
      return;
    }
    if (!selectedPitchDeckTypeId) {
      alert('Please select a Pitch Deck Type.');
      return;
    }
    console.log('Proceeding from Step 1 with:', {
      projectName,
      pitchDeckTypeId: selectedPitchDeckTypeId,
      description,
      privacy,
      tags: tagsInput.split(',').map(t => t.trim()).filter(t => t),
      team: teamInput.split(',').map(t => t.trim()).filter(t => t),
    });
    // TODO: Backend call for Step 1 data saving

    setCurrentStep(2); // Move to Step 2
  };

  const handleContinueFromStep2 = () => {
    console.log('Proceeding from Step 2 with:', { /* Log Step 2 data */ });
    // TODO: Backend call for Step 2 data saving
    setCurrentStep(3); // Move to Step 3
  };

  const handleContinueFromStep3 = () => {
    console.log('Proceeding from Step 3 with:', { /* Log Step 3 data */ });
    // TODO: Backend call for Step 3 data saving
    setCurrentStep(4); // Move to Step 4
  };

  const handleContinueFromStep4 = () => {
    console.log('Proceeding from Step 4 with:', { /* Log Step 4 data */ });
    // TODO: Backend call for Step 4 data saving
    setCurrentStep(5); // Move to Step 5
  };

  const handleContinueFromStep5 = () => {
    console.log('Proceeding from Step 5 with:', { /* Log Step 5 data */ });
    // TODO: Backend call for Step 5 data saving
    setCurrentStep(6); // Move to Step 6
  };

  const handleContinueFromStep6 = () => {
    console.log('Proceeding from Step 6 with:', { /* Log Step 6 data */ });
    // TODO: Backend call for Step 6 data saving
    setCurrentStep(7); // Move to Step 7
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
       {/* Step 1 Content */}
       {currentStep === 1 && (
         <>
           <div className="p-4 border-b border-neutral-light/40 bg-white/5">
             <h2 className="text-lg font-semibold font-heading text-secondary/80">
               Step 1: Project Setup
             </h2>
             <p className="text-sm text-neutral-medium mt-1">
               Define the basics of your new project and choose a starting point.
             </p>
           </div>
           <div className="p-2 md:p-4 space-y-8">
             <PitchDeckTypeGrid
               selectedTypeId={selectedPitchDeckTypeId}
               onSelectType={handleSelectType}
             />
             <ProjectSetupForm
               projectName={projectName}
               setProjectName={setProjectName}
               description={description}
               setDescription={setDescription}
               privacy={privacy}
               setPrivacy={setPrivacy}
               tagsInput={tagsInput}
               setTagsInput={setTagsInput}
               teamInput={teamInput}
               setTeamInput={setTeamInput}
             />
             <ImportOptions />
             <div className="flex justify-end pt-6 border-t border-neutral-light/40">
               <Button
                 variant="primary"
                 size="lg"
                 onClick={handleContinueFromStep1} // Use updated handler
                 disabled={!projectName || !selectedPitchDeckTypeId}
                 className="text-white"
               >
                 Continue to Requirements
               </Button>
             </div>
           </div>
         </>
       )}
 
       {/* Step 2 Content */}
       {currentStep === 2 && (
         <>
           <div className="p-4 border-b border-neutral-light/40 bg-white/5">
             <h2 className="text-lg font-semibold font-heading text-secondary/80">
               Step 2: Requirements Gathering
             </h2>
             <p className="text-sm text-neutral-medium mt-1">
               Provide details about your audience, product, objectives, and more.
             </p>
           </div>
           <div className="p-4 md:p-6 space-y-6">
             <TargetAudienceForm />
             {/* Add other Step 2 sections here later */}
             
              <div className="flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                 <Button variant="outline" onClick={() => setCurrentStep(1)}>
                   Back to Setup
                 </Button>
                 <Button
                   variant="primary"
                   size="lg"
                   className="text-white"
                   onClick={handleContinueFromStep2} // Use updated handler
                 >
                   Continue to Design & Structure
                 </Button>
              </div>
           </div>
         </>
       )}

       {/* Step 3 Content (Placeholder) */}
       {currentStep === 3 && (
          <>
            <div className="p-4 border-b border-neutral-light/40 bg-white/5">
              <h2 className="text-lg font-semibold font-heading text-secondary/80">
                Step 3: Design & Structure Configuration
              </h2>
              <p className="text-sm text-neutral-medium mt-1">
                Select a template, customize branding, and plan the structure.
              </p>
            </div>
            {/* Step 3 Layout: Two Columns */}
            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
               {/* Left Column: Configuration */}
               <div className="lg:col-span-7 space-y-6">
                  <TemplateGallery />
                  <BrandCustomization />
                  <StructurePlanning />
               </div>
               {/* Right Column: Preview */}
               <div className="lg:col-span-5">
                  {/* Make preview sticky within its column */}
                  <div className="sticky top-[80px]"> {/* Adjust top offset if needed */}
                     <DesignPreview />
                  </div>
               </div>
               {/* Navigation Buttons (Full Width Below Columns) */}
               <div className="lg:col-span-12 flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back to Requirements
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="text-white"
                    onClick={handleContinueFromStep3} // Use new handler
                  >
                    Continue to Content Generation
                  </Button>
               </div>
            </div>
          </>
        )}

        {/* Step 4 Content (Placeholder) */}
        {currentStep === 4 && (
          <>
            <div className="p-4 border-b border-neutral-light/40 bg-white/5">
              <h2 className="text-lg font-semibold font-heading text-secondary/80">
                Step 4: AI-Powered Content Generation
              </h2>
              <p className="text-sm text-neutral-medium mt-1">
                Configure and initiate AI content generation.
              </p>
            </div>
            {/* Step 4 Layout: Similar to Step 3? Or maybe different? Let's try 2 columns again */}
            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
               {/* Left Column: Setup & Progress */}
               <div className="lg:col-span-7 space-y-6">
                  <GenerationSetup />
                  <GenerationProgress />
               </div>
               {/* Right Column: Preview */}
               <div className="lg:col-span-5">
                  <div className="sticky top-[80px]">
                     <GenerationPreview />
                  </div>
               </div>
               {/* Navigation Buttons */}
               <div className="lg:col-span-12 flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                 <Button variant="outline" onClick={() => setCurrentStep(3)}>
                   Back to Design
                 </Button>
                 <Button
                   variant="primary"
                   size="lg"
                   className="text-white"
                   onClick={handleContinueFromStep4}
                 >
                   Continue to Editing
                 </Button>
               </div>
            </div>
          </>
        )}

        {/* Step 5 Content (Placeholder) */}
        {currentStep === 5 && (
          <>
            <div className="p-4 border-b border-neutral-light/40 bg-white/5">
              <h2 className="text-lg font-semibold font-heading text-secondary/80">
                Step 5: Advanced Editing & Enhancement
              </h2>
              <p className="text-sm text-neutral-medium mt-1">
                Refine generated content, enhance visuals, and collaborate.
              </p>
            </div>
             {/* Step 5 Layout: Maybe 3 columns? Editor, Tools, Collaboration? */}
            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Editor Area */}
                <div className="lg:col-span-8 space-y-6">
                   <ContentEditor />
                </div>
                {/* Right Sidebar: Tools & Collaboration */}
                <div className="lg:col-span-4 space-y-6">
                   <div className="sticky top-[80px] space-y-6"> {/* Make sidebar sticky */}
                      <EnhancementTools />
                      <VisualElementStudio />
                      <CollaborationTools />
                   </div>
                </div>
                {/* Navigation Buttons */}
                <div className="lg:col-span-12 flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                  <Button variant="outline" onClick={() => setCurrentStep(4)}>
                    Back to Generation
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="text-white"
                    onClick={handleContinueFromStep5} // Use new handler
                  >
                    Continue to QA & Refinement
                  </Button>
                </div>
              </div>
            </>
          )}
  
          {/* Step 6 Content (Placeholder) */}
          {currentStep === 6 && (
            <>
              <div className="p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-lg font-semibold font-heading text-secondary/80">
                  Step 6: Quality Assurance & Refinement
                </h2>
                <p className="text-sm text-neutral-medium mt-1">
                  Validate content, check compliance, assess impact, and refine.
                </p>
              </div>
              {/* Step 6 Layout: Maybe 2 columns? Validation/Refinement + Dashboard? */}
              <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                 {/* Left Column: Validation & Refinement */}
                 <div className="lg:col-span-7 space-y-6">
                    <ValidationInterface />
                    <RefinementPanel />
                 </div>
                 {/* Right Column: Dashboard */}
                 <div className="lg:col-span-5">
                    <div className="sticky top-[80px]">
                       <QualityDashboard />
                    </div>
                 </div>
                 {/* Navigation Buttons */}
                 <div className="lg:col-span-12 flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                   <Button variant="outline" onClick={() => setCurrentStep(5)}>
                     Back to Editing
                   </Button>
                   <Button
                     variant="primary"
                     size="lg"
                     className="text-white"
                     onClick={handleContinueFromStep6}
                   >
                     Continue to Finalization
                   </Button>
                 </div>
              </div>
            </>
          )}
  
          {/* Step 7 Content (Placeholder) */}
          {currentStep === 7 && (
            <>
              <div className="p-4 border-b border-neutral-light/40 bg-white/5">
                <h2 className="text-lg font-semibold font-heading text-secondary/80">
                  Step 7: Finalization & Delivery
                </h2>
                <p className="text-sm text-neutral-medium mt-1">
                  Prepare for presentation, export, share, and archive.
                </p>
              </div>
               {/* Step 7 Layout: Maybe sections in one column? */}
              <div className="p-4 md:p-6 space-y-6">
                 <PresenterTools />
                 <ExportConfiguration />
                 <SharingPermissions />
                 <ArchivingAnalytics />
                 {/* Navigation Buttons */}
                 <div className="flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                   <Button variant="outline" onClick={() => setCurrentStep(6)}>
                     Back to QA
                   </Button>
                   <Button variant="primary" size="lg" className="text-white">
                     Finish Project {/* Placeholder */}
                  </Button>
                </div>
              </div>
            </>
          )}
         {/* End of steps */}

       {/* Tutorial Overlay Placeholder - Implement later */}
       {/* <div className="absolute inset-0 bg-black/50 text-white p-4">Tutorial Overlay Placeholder</div> */}
    </Card>
  );
};

export default ProjectArea;