import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase'; // Import supabase client
import PitchDeckSetupForm from '@/features/pitch_deck_setup/components/PitchDeckSetupForm';
import DeckTypeSelector from '@/features/pitch_deck_setup/components/DeckTypeSelector';
import RequirementsForm from '@/features/pitch_deck_setup/components/RequirementsForm';
import TemplateGallery from '@/features/pitch_deck_setup/components/TemplateGallery';
import StructurePlanner from '@/features/pitch_deck_setup/components/StructurePlanner'; // Import StructurePlanner
import GenerationSetup from '@/features/pitch_deck_setup/components/GenerationSetup'; // Import GenerationSetup
import GenerationProgress from '@/features/pitch_deck_setup/components/GenerationProgress'; // Import GenerationProgress
import { useNavigate } from 'react-router-dom';
import { addToast } from '@/store/slices/uiSlice'; // Import addToast for error messages
import { useDispatch } from 'react-redux'; // Import useDispatch

// Define the steps in the setup process
enum SetupStep {
  InitialInfo,
  SelectDeckType,
  GatherRequirements,
  ConfigureDesign, // Includes Template Selection & Structure Planning
  SetupGeneration, // Review and configure AI generation
  GeneratingContent, // Show progress while AI works
  // Editing step would likely be the ProjectEditor page itself
}

// Define types used across steps (consider moving to a types file)
interface RequirementsData { /* ... */ } // Placeholder
interface DeckSection { id: string; title: string; enabled: boolean; /* ... */ } // Placeholder
interface GenerationConfig { /* ... */ } // Placeholder

const PitchDeckSetupPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.InitialInfo);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [deckTypeId, setDeckTypeId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null); // Store selected template ID
  const [requirementsData, setRequirementsData] = useState<Partial<RequirementsData> | null>(null); // Store requirements
  const [structureData, setStructureData] = useState<DeckSection[] | null>(null); // Store final structure
  const [generationConfig, setGenerationConfig] = useState<GenerationConfig | null>(null); // Store generation config

  // Fetch user ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        dispatch(addToast({ type: 'error', message: 'Could not verify user session.' }));
      } else if (session?.user) {
        setUserId(session.user.id);
      } else {
        // Handle case where user is not logged in (e.g., redirect or show message)
        console.log("No active user session found.");
        // navigate('/login'); // Example redirect
      }
    };
    fetchUser();
  }, [dispatch]); // Add dispatch to dependency array

  // Callback from PitchDeckSetupForm when project is created
  const handleProjectCreated = (newProjectId: string) => {
    console.log('PitchDeckSetupPage: Project created with ID:', newProjectId);
    setProjectId(newProjectId);
    setCurrentStep(SetupStep.SelectDeckType); // Move to the next step
  };

  // Callback from DeckTypeSelector when a type is selected
  const handleDeckTypeSelected = (selectedProjectId: string, selectedDeckTypeId: string) => {
    console.log(`PitchDeckSetupPage: Deck type selected: ${selectedDeckTypeId} for project: ${selectedProjectId}`);
    if (selectedProjectId !== projectId) {
        console.warn("Project ID mismatch!"); // Should ideally not happen
        dispatch(addToast({ type: 'error', message: 'Project ID mismatch. Please try again.' }));
        setCurrentStep(SetupStep.InitialInfo); // Reset
        return;
    }
    setDeckTypeId(selectedDeckTypeId);
    setCurrentStep(SetupStep.GatherRequirements);
    console.log("Proceeding to next step: GatherRequirements");
  };

  // Callback from RequirementsForm when requirements are submitted
  const handleRequirementsComplete = (completedProjectId: string, data: any) => { // Use 'data' from callback
    console.log(`PitchDeckSetupPage: Requirements submitted for project ${completedProjectId}:`, data);
    if (completedProjectId !== projectId) {
        console.warn("Project ID mismatch!");
        dispatch(addToast({ type: 'error', message: 'Project ID mismatch. Please try again.' }));
        setCurrentStep(SetupStep.InitialInfo); // Reset
        return;
    }
    setRequirementsData(data); // Store the requirements data
    setCurrentStep(SetupStep.ConfigureDesign);
    console.log("Proceeding to next step: ConfigureDesign");
  };

  // Callback from TemplateGallery when a template is selected
  const handleTemplateSelected = (selectedProjectId: string, selectedTemplateId: string) => {
    console.log(`PitchDeckSetupPage: Template selected: ${selectedTemplateId} for project ${selectedProjectId}`);
     if (selectedProjectId !== projectId) {
        console.warn("Project ID mismatch!");
        dispatch(addToast({ type: 'error', message: 'Project ID mismatch. Please try again.' }));
        setCurrentStep(SetupStep.InitialInfo); // Reset
        return;
    }
    setTemplateId(selectedTemplateId);
    console.log("Template selected, proceeding to structure planning within ConfigureDesign step.");
  };

  // Callback from StructurePlanner when structure is confirmed
  const handleStructureConfirmed = (confirmedProjectId: string, finalStructure: DeckSection[]) => {
    console.log(`PitchDeckSetupPage: Structure confirmed for project ${confirmedProjectId}:`, finalStructure);
    if (confirmedProjectId !== projectId) {
        console.warn("Project ID mismatch!");
        dispatch(addToast({ type: 'error', message: 'Project ID mismatch. Please try again.' }));
        setCurrentStep(SetupStep.InitialInfo); // Reset
        return;
    }
    setStructureData(finalStructure);
    setCurrentStep(SetupStep.SetupGeneration); // Move to the next major step
    console.log("Proceeding to next step: SetupGeneration");
  };

  // Callback from GenerationSetup to start the AI process
  const handleStartGeneration = (startProjectId: string, config: any) => {
     console.log(`PitchDeckSetupPage: Starting generation for project ${startProjectId} with config:`, config);
     if (startProjectId !== projectId) {
        console.warn("Project ID mismatch!");
        dispatch(addToast({ type: 'error', message: 'Project ID mismatch. Please try again.' }));
        setCurrentStep(SetupStep.InitialInfo); // Reset
        return;
    }
    // Store the config that might be needed by GenerationProgress (or pass directly)
    // Ensure config structure is correct, adjust if needed
    setGenerationConfig(config); // Store the whole config object passed
    setCurrentStep(SetupStep.GeneratingContent);
    console.log("Proceeding to next step: GeneratingContent");
  };

   // Callback from GenerationProgress when AI finishes successfully
  const handleGenerationComplete = (completedProjectId: string) => {
    console.log(`PitchDeckSetupPage: Generation completed for project ${completedProjectId}`);
    if (completedProjectId !== projectId) {
        console.warn("Project ID mismatch!");
        // Don't reset, just maybe show a warning? Or ignore?
        return;
    }
    // Navigate to the correct editor page for the newly generated project
    navigate(`/projects/${projectId}/pitch-deck`); // Corrected path
  };

  // Callback from GenerationProgress if AI encounters an error
  const handleGenerationError = (errorProjectId: string, error: Error) => {
     console.error(`PitchDeckSetupPage: Generation error for project ${errorProjectId}:`, error);
     if (errorProjectId !== projectId) {
        console.warn("Project ID mismatch!");
        return;
    }
    // Handle the error, e.g., show message, maybe go back to setup?
    dispatch(addToast({ type: 'error', message: `Generation failed: ${error.message}` }));
    setCurrentStep(SetupStep.SetupGeneration); // Go back to setup step on error
  };


  // Render component based on the current step
  const renderStep = () => {
    // Show loading or placeholder while userId is being fetched
    if (userId === null) {
      return <p>Loading user information...</p>; // Or a spinner component
    }
    // If userId fetch completed but is still null/undefined (user not logged in)
    if (!userId) {
       // Redirect or show login prompt
       navigate('/auth/login?redirect=/setup/pitch-deck'); // Example redirect
       return <p>Please log in to create a project.</p>;
    }

    switch (currentStep) {
      case SetupStep.InitialInfo:
        return (
          <PitchDeckSetupForm
            userId={userId} // Use the userId state variable
            onCreateProject={handleProjectCreated}
          />
        );
      case SetupStep.SelectDeckType:
        if (!projectId) {
            console.error("Error: Reached SelectDeckType step without a projectId.");
            dispatch(addToast({ type: 'error', message: 'An error occurred. Please try creating the project again.' }));
            setCurrentStep(SetupStep.InitialInfo); // Go back
            return null; // Avoid rendering anything problematic
        }
        return (
          <DeckTypeSelector
            projectId={projectId}
            onDeckTypeSelected={handleDeckTypeSelected}
          />
        );
      case SetupStep.GatherRequirements:
        if (!projectId || !deckTypeId) {
           console.error("Error: Reached GatherRequirements step without projectId or deckTypeId.");
           dispatch(addToast({ type: 'error', message: 'An error occurred. Please start the setup again.' }));
           setCurrentStep(SetupStep.InitialInfo); // Go back to start
           return null;
        }
        return (
          <RequirementsForm
            projectId={projectId}
            deckTypeId={deckTypeId}
            onRequirementsComplete={handleRequirementsComplete}
          />
        );
      case SetupStep.ConfigureDesign:
         if (!projectId || !deckTypeId) {
            console.error("Error: Reached ConfigureDesign step without projectId or deckTypeId.");
            dispatch(addToast({ type: 'error', message: 'An error occurred. Please start the setup again.' }));
            setCurrentStep(SetupStep.InitialInfo); // Go back to start
            return null;
         }
         // Show Template Gallery first, then Structure Planner within this step
         if (!templateId) {
             return (
               <TemplateGallery
                 projectId={projectId}
                 deckTypeId={deckTypeId}
                 onTemplateSelected={handleTemplateSelected}
               />
             );
         } else {
             // Ensure templateId is not null before rendering StructurePlanner
             return (
                <StructurePlanner
                    projectId={projectId}
                    deckTypeId={deckTypeId}
                    templateId={templateId} // Pass selected templateId
                    onStructureConfirmed={handleStructureConfirmed}
                />
             );
         }
      case SetupStep.SetupGeneration:
          // Check if requirementsData is needed here - it wasn't stored before
          if (!projectId || !deckTypeId || !templateId || !structureData) { // Removed requirementsData check for now
            console.error("Error: Reached SetupGeneration step without complete data (Project, DeckType, Template, Structure).");
            dispatch(addToast({ type: 'error', message: 'An error occurred. Please complete previous steps.' }));
            setCurrentStep(SetupStep.ConfigureDesign); // Go back to design step
            return null;
          }
          return (
            <GenerationSetup
                projectId={projectId}
                deckTypeId={deckTypeId}
                templateId={templateId}
                requirementsData={requirementsData || {}} // Pass stored or empty object
                structureData={structureData}
                onStartGeneration={handleStartGeneration}
            />
          );
       case SetupStep.GeneratingContent:
          if (!projectId || !generationConfig) {
             console.error("Error: Reached GeneratingContent step without projectId or config.");
             dispatch(addToast({ type: 'error', message: 'An error occurred before generation could start.' }));
             setCurrentStep(SetupStep.SetupGeneration); // Go back
             return null;
          }
          return (
            <GenerationProgress
                projectId={projectId}
                generationConfig={generationConfig} // Pass the stored config
                onGenerationComplete={handleGenerationComplete}
                onGenerationError={handleGenerationError}
            />
          );
      default:
        return <p>Unknown setup step.</p>;
    }
  };

  return (
    <div className="pitch-deck-setup-page">
      {/* Optional: Add a stepper/progress indicator here */}
      {renderStep()}
    </div>
  );
};

export default PitchDeckSetupPage;
