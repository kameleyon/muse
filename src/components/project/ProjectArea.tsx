import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import PitchDeckTypeGrid from './setup/PitchDeckTypeGrid';
import ProjectSetupForm from './setup/ProjectSetupForm';
import ImportOptions from './setup/ImportOptions';
import TargetAudienceForm from './requirements/TargetAudienceForm';
import TemplateGallery from './design/TemplateGallery';
import BrandCustomization from './design/BrandCustomization';
import StructurePlanning from './design/StructurePlanning';
import DesignPreview from './design/DesignPreview';
import GenerationSetup from './generation/GenerationSetup';
import GenerationProgress from './generation/GenerationProgress';
import GenerationPreview from './generation/GenerationPreview';
import ContentEditor from './editing/ContentEditor';
import EnhancementTools from './editing/EnhancementTools';
import VisualElementStudio from './editing/VisualElementStudio';
import CollaborationTools from './editing/CollaborationTools';
import QualityDashboard from './qa/QualityDashboard';
import ValidationInterface from './qa/ValidationInterface';
import RefinementPanel from './qa/RefinementPanel';
import PresenterTools from './delivery/PresenterTools';
import ExportConfiguration from './delivery/ExportConfiguration';
import SharingPermissions from './delivery/SharingPermissions';
import ArchivingAnalytics from './delivery/ArchivingAnalytics';
import * as contentGenerationService from '@/services/contentGenerationService';
import { createResearchPrompt, createPitchDeckContentPrompt } from '@/lib/prompts/pitchDeckPrompts';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js';
import { marked } from 'marked';
import { MarkdownContent } from '@/lib/markdown';
import { useProjectWorkflowStore, initializeWorkflowState, QualityMetrics, FactCheckResult, Suggestion } from '@/store/projectWorkflowStore'; // Import Zustand store AND types
import '@/styles/ProjectArea.css';
import '@/styles/ProjectSetup.css';
// Potentially add new CSS files for Steps 6 & 7 later if needed

interface ProjectAreaProps {
  initialName: string | null;
}

const ProjectArea: React.FC<ProjectAreaProps> = ({ initialName }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // --- Zustand Store Integration ---
  const {
    // Step 1 State
    selectedPitchDeckTypeId,
    projectName,
    description,
    privacy,
    tags, // Get processed tags array
    teamMembers, // Get processed team members array
    // Step 1 Actions
    setSelectedPitchDeckTypeId,
    setProjectName,
    setDescription,
    setPrivacy,
    setTagsFromString, // Use action that takes string input
    setTeamMembersFromString, // Use action that takes string input
    // Step 2 State & Actions (Audience) - Already added in store, just need to destructure if used directly here
    // name: audienceName, orgType, industry, size, personaRole, personaConcerns, personaCriteria, personaCommPrefs, setAudienceField,
    // Step 3 State & Actions
    selectedTemplateId, setSelectedTemplateId,
    brandLogo, setBrandLogo,
    primaryColor, setPrimaryColor,
    secondaryColor, setSecondaryColor,
    accentColor, setAccentColor,
    headingFont, setHeadingFont,
    bodyFont, setBodyFont,
    slideStructure, setSlideStructure,
    complexityLevel, setComplexityLevel,
    // Step 4 State & Actions
    isGenerating, setIsGenerating,
    generationProgress, setGenerationProgress,
    generationStatusText, setGenerationStatusText,
    generatedContentPreview, setGeneratedContentPreview,
    resetGenerationState, // Add reset action
    // Step 5 State & Actions
    editorContent, setEditorContent,
    isLoadingEnhancement, setIsLoadingEnhancement,
    // Step 6 State & Actions
    qualityMetrics, setQualityMetrics,
    factCheckResults, setFactCheckResults,
    complianceStatus, setComplianceStatus,
    financialValidationStatus, setFinancialValidationStatus,
    languageCheckStatus, setLanguageCheckStatus,
    refinementSuggestions, setRefinementSuggestions,
    isLoadingQA, setIsLoadingQA,
    resetQAState, // Add reset action
    // Step 7 State & Actions (Client PDF Export)
    isGeneratingClientPdf, setIsGeneratingClientPdf,
    clientPdfStatus, setClientPdfStatus,
  } = useProjectWorkflowStore();

  // Initialize store with initialName on mount
  useEffect(() => {
    if (initialName) {
      initializeWorkflowState({ projectName: initialName });
    }
    // Set initial state for other fields if needed, or rely on store defaults
  }, [initialName]); // Run only when initialName changes (typically once)

  // --- State for Step 1 (REMOVED - Now in Zustand) ---
  // const [selectedPitchDeckTypeId, setSelectedPitchDeckTypeId] = useState<string | null>(null);
  // const [projectName, setProjectName] = useState<string>(initialName || '');
  // const [description, setDescription] = useState<string>('');
  // const [privacy, setPrivacy] = useState<'private' | 'team' | 'public'>('private');
  // const [tagsInput, setTagsInput] = useState<string>(''); // Input state might move to ProjectSetupForm
  // const [teamInput, setTeamInput] = useState<string>(''); // Input state might move to ProjectSetupForm
  // --- End State for Step 1 ---

  // --- State for Step 2 (Add as needed) ---
  // Example:
  // const [audienceName, setAudienceName] = useState<string>('');
  // --- End State for Step 2 ---

  // --- State for Step 3 (REMOVED - Now in Zustand) ---
  // const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  // const [brandLogo, setBrandLogo] = useState<string | null>(null);
  // const [primaryColor, setPrimaryColor] = useState<string>('#ae5630');
  // const [secondaryColor, setSecondaryColor] = useState<string>('#232321');
  // const [accentColor, setAccentColor] = useState<string>('#9d4e2c');
  // const [headingFont, setHeadingFont] = useState<string>('Comfortaa');
  // const [bodyFont, setBodyFont] = useState<string>('Questrial');
  // const [slideStructure, setSlideStructure] = useState([ ... ]);
  // const [complexityLevel, setComplexityLevel] = useState<number>(50);
  // --- End State for Step 3 ---

  // --- State for Step 4 (REMOVED - Now in Zustand) ---
  // const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // const [generationProgress, setGenerationProgress] = useState<number>(0);
  // const [generationStatusText, setGenerationStatusText] = useState<string>('');
  // const [generatedContentPreview, setGeneratedContentPreview] = useState<string>('');
  // --- End State for Step 4 ---

  // --- State for Step 6 (REMOVED - Now in Zustand) ---
  // Define types based on service placeholders (or import if defined elsewhere)
  // type QualityMetrics = { overallScore: number; categories: { name: string; score: number }[]; issues: { id: string; severity: string; text: string }[]; };
  // type FactCheckResult = { claim: string; verified: boolean; source?: string; explanation?: string; };
  // type Suggestion = { id: string; text: string; impact: string; effort: string; };

  // const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  // const [factCheckResults, setFactCheckResults] = useState<FactCheckResult[]>([]);
  // const [complianceStatus, setComplianceStatus] = useState<'Not Run' | 'Running' | 'Passed' | 'Issues Found'>('Not Run');
  // const [financialValidationStatus, setFinancialValidationStatus] = useState<'Not Run' | 'Running' | 'Passed' | 'Issues Found'>('Not Run');
  // const [languageCheckStatus, setLanguageCheckStatus] = useState<'Not Run' | 'Running' | 'Passed' | 'Issues Found'>('Not Run');
  // const [refinementSuggestions, setRefinementSuggestions] = useState<Suggestion[]>([]);
  // const [isLoadingQA, setIsLoadingQA] = useState<boolean>(false);
  // --- End State for Step 6 ---

  // --- State for Step 5 (REMOVED - Now in Zustand) ---
  // const [editorContent, setEditorContent] = useState<string>('');
  // const [isLoadingEnhancement, setIsLoadingEnhancement] = useState<boolean>(false);
  // --- End State for Step 5 ---

  // --- State for Client-Side PDF Export (REMOVED - Now in Zustand) ---
  // const [isGeneratingClientPdf, setIsGeneratingClientPdf] = useState<boolean>(false);
  // const [clientPdfStatus, setClientPdfStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  // --- End State for Client-Side PDF Export ---

  // Handler to select/deselect pitch deck type - Use Zustand action
  const handleSelectType = (id: string) => {
    setSelectedPitchDeckTypeId(selectedPitchDeckTypeId === id ? null : id); // Toggle selection using store action
  };

  // Placeholder handler for final project creation/continuation - Use Zustand state
  const handleContinueFromStep1 = () => {
    if (!projectName) { // Check store state
      alert('Project Name is required.');
      return;
    }
    if (!selectedPitchDeckTypeId) { // Check store state
      alert('Please select a Pitch Deck Type.');
      return;
    }
    console.log('Proceeding from Step 1 with (from store):', {
      projectName, // From store
      pitchDeckTypeId: selectedPitchDeckTypeId, // From store
      description, // From store
      privacy, // From store
      tags, // From store (already processed array)
      teamMembers, // From store (already processed array)
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

  // --- Step 6 Handlers ---
  const loadQualityData = async () => {
     setIsLoadingQA(true); // Use store action
     try {
       // Simulate fetching quality metrics (replace with actual service call later)
       // const metrics = await analyticsService.getQualityAssessment('temp-project-id');
       await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
       const simulatedMetrics: QualityMetrics = {
         overallScore: Math.floor(Math.random() * 20) + 75, // Score between 75-94
         categories: [
           { name: 'Content Quality', score: Math.floor(Math.random() * 20) + 78 },
           { name: 'Design Effectiveness', score: Math.floor(Math.random() * 25) + 70 },
           { name: 'Narrative Structure', score: Math.floor(Math.random() * 20) + 75 },
           { name: 'Data Integrity', score: Math.floor(Math.random() * 15) + 85 },
           { name: 'Persuasiveness', score: Math.floor(Math.random() * 25) + 70 },
         ],
         issues: [
           { id: 'iss1', severity: ['warning', 'info'][Math.floor(Math.random()*2)], text: 'Consider clarifying the market size source.' },
           { id: 'iss2', severity: 'info', text: 'Add transition between Solution and Market sections.' },
         ]
       };
       setQualityMetrics(simulatedMetrics); // Use store action

       // Simulate fetching suggestions (replace with actual service call later)
       // const suggestions = await contentGenerationService.getRefinementSuggestions('temp-project-id');
       const simulatedSuggestions: Suggestion[] = [
         { id: 'sug1', text: 'Refine value proposition for clarity.', impact: 'High', effort: 'Medium' },
         { id: 'sug2', text: 'Add competitor comparison chart.', impact: 'Medium', effort: 'High' },
       ];
       setRefinementSuggestions(simulatedSuggestions); // Use store action

     } catch (error) {
        console.error("Failed to load QA data:", error);
        // Handle error state if needed
     } finally {
        setIsLoadingQA(false); // Use store action
     }
  };

  // Add useEffect to load QA data and reset state when entering Step 6
  useEffect(() => {
    if (currentStep === 6) {
      resetQAState(); // Use store action to reset all QA state
      loadQualityData(); // Then load new data
    }
  }, [currentStep, resetQAState]); // Add resetQAState to dependency array


  const handleRunFactCheck = async () => {
     setFactCheckResults([]); // Use store action
     setIsLoadingQA(true); // Use store action
     try {
        // TODO: Get actual content from Step 5 editor state (use store state)
        const contentToVerify = useProjectWorkflowStore.getState().editorContent || generatedContentPreview || "Sample content with claim: Market size is $10B."; // Prioritize editor content
        const results = await contentGenerationService.verifyFacts('temp-project-id', contentToVerify);
        setFactCheckResults(results); // Use store action
     } catch (error) {
        console.error("Fact check failed:", error);
        setFactCheckResults([{ claim: 'Error', verified: false, explanation: 'Fact check process failed.' }]); // Use store action
     } finally {
        setIsLoadingQA(false); // Use store action
     }
  };

  // Add similar handlers for handleCheckCompliance, handleValidateFinancials, handleCheckLanguage
  // These would likely call different backend services or AI prompts
  const handleRunComplianceCheck = async () => {
     setComplianceStatus('Running'); // Use store action
     await new Promise(resolve => setTimeout(resolve, 800)); // Simulate check
     setComplianceStatus(Math.random() > 0.2 ? 'Passed' : 'Issues Found'); // Use store action
  };
   const handleRunFinancialValidation = async () => {
     setFinancialValidationStatus('Running'); // Use store action
     await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate check
     setFinancialValidationStatus(Math.random() > 0.1 ? 'Passed' : 'Issues Found'); // Use store action
  };
   const handleRunLanguageCheck = async () => {
     setLanguageCheckStatus('Running'); // Use store action
     await new Promise(resolve => setTimeout(resolve, 700)); // Simulate check
     setLanguageCheckStatus(Math.random() > 0.3 ? 'Passed' : 'Issues Found'); // Use store action
  };

  // Placeholder handlers for refinement actions
  const handleImplementSuggestion = (id: string) => console.log(`Implement suggestion: ${id} - (Not Implemented)`);
  const handleCompareSuggestion = (id: string) => console.log(`Compare suggestion: ${id} - (Not Implemented)`);
  const handleRunFinalPolish = () => console.log('Run Final Polish - (Not Implemented)');
  // --- End Step 6 Handlers ---

  // --- Step 5 Handlers ---
  const handleEnhanceClarity = async () => {
     if (!editorContent) return; // Use store state
     setIsLoadingEnhancement(true); // Use store action
     try {
        const result = await contentGenerationService.enhanceContent(
           'temp-project-id', // Replace later
           'current-section-id', // Need a way to track current section later
           editorContent,
           'clarity'
        );
        if (result.content && !result.content.startsWith('Error:')) {
           setEditorContent(result.content); // Use store action
           // Optionally, provide feedback to the user
        } else {
           throw new Error(result.content || 'Clarity enhancement failed.');
        }
     } catch (error) {
        console.error("Clarity enhancement failed:", error);
        // Show error to user
     } finally {
        setIsLoadingEnhancement(false); // Use store action
     }
  };
  // Add handlers for other enhancement buttons later
  // --- End Step 5 Handlers ---

  // --- Client-Side PDF Generation Handler ---
  const handleGenerateClientPdf = async () => {
    if (!editorContent) { // Use store state
      console.error("No content available to generate PDF.");
      setClientPdfStatus('error'); // Use store action
      return;
    }

    setIsGeneratingClientPdf(true); // Use store action
    setClientPdfStatus('generating'); // Use store action
    console.log("Generating PDF client-side...");

    try {
      // 1. Render Markdown to HTML string
      // We need to wrap MarkdownContent in basic HTML structure for pdf generation
      const htmlString = ReactDOMServer.renderToString(
        <html>
          <head>
            {/* Basic styling - consider linking a CSS file or adding more inline styles */}
            <style>{`
              body { font-family: sans-serif; padding: 20px; }
              h1, h2, h3 { margin-bottom: 0.5em; }
              p { margin-bottom: 1em; line-height: 1.4; }
              ul, ol { margin-left: 20px; margin-bottom: 1em; }
              /* Add more styles based on MarkdownContent's output if needed */
            `}</style>
          </head>
          <body>
            <MarkdownContent content={editorContent} />
          </body>
        </html>
      );

      // 2. Configure html2pdf
      const pdfOptions = {
        margin:       [1, 1, 1, 1], // Use array for margins [top, left, bottom, right] in inches
        filename:     `${projectName || 'magicmuse-project'}.pdf`, // Use project name from store
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, // Increase scale for better quality
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // 3. Generate PDF
      await html2pdf().set(pdfOptions).from(htmlString).save();

      console.log("Client-side PDF generated successfully.");
      setClientPdfStatus('success'); // Use store action

    } catch (error) {
      console.error("Client-side PDF generation failed:", error);
      setClientPdfStatus('error'); // Use store action
    } finally {
      setIsGeneratingClientPdf(false); // Use store action
    }
  };
  // --- End Client-Side PDF Generation Handler ---

  // --- Step 4 Handler ---
  const handleGenerateContent = async (options: { factCheckLevel: 'basic' | 'standard' | 'thorough' }) => {
    resetGenerationState(); // Reset store state first
    setIsGenerating(true); // Use store action
    setGenerationStatusText('Initiating generation...'); // Use store action
    // setGeneratedContentPreview(''); // Covered by resetGenerationState

    // Get latest state from store for the prompt
    const currentStoreState = useProjectWorkflowStore.getState();
    const projectInfo = {
       projectName: currentStoreState.projectName,
       pitchDeckType: currentStoreState.selectedPitchDeckTypeId || 'generic',
       description: currentStoreState.description,
       // TODO: Add data from Step 2 state here (once added to store)
    };

    try {
      // Calculate dynamic steps
      const researchSteps = 1;
      const contentSteps = slideStructure.length > 0 ? slideStructure.length : 1; // Ensure at least 1 content step
      const finalizationSteps = 1;
      const totalSteps = researchSteps + contentSteps + finalizationSteps;
      const progressIncrement = 100 / totalSteps;
      let currentProgress = 0;

      // --- Step 1: Research ---
      // setGenerationStatusText('Researching background information...'); // Already set
      // setGenerationProgress(Math.round(currentProgress)); // Progress starts at 0 from reset
      const researchPrompt = createResearchPrompt(projectInfo);
      const researchResult = await contentGenerationService.generateContent({
         projectId: 'temp-project-id', // TODO: Use actual project ID
         prompt: researchPrompt,
         useResearchModel: true,
         factCheckLevel: options.factCheckLevel
      });

      if (!researchResult || researchResult.content.startsWith('Error:')) {
         throw new Error(researchResult?.content || 'Research step failed.');
      }

      // --- Update after Research ---
      currentProgress += progressIncrement * researchSteps;
      setGenerationProgress(Math.round(currentProgress)); // Use store action
      setGenerationStatusText(`Generating content for ${contentSteps} sections...`); // Use store action
      setGeneratedContentPreview(`Research Summary:\n${researchResult.content.substring(0, 300)}...\n\n---`); // Use store action

      // --- Step 2: Content Generation ---
      // Add instruction for Markdown formatting to the prompt
      const contentPrompt = createPitchDeckContentPrompt(projectInfo, researchResult.content) +
                            "\n\nPlease format the entire output strictly as Markdown, using appropriate headings (## for sections, ### for subsections), bullet points (*), and bold text (**bold**).";
      const contentResult = await contentGenerationService.generateContent({
         projectId: 'temp-project-id', // TODO: Use actual project ID
         prompt: contentPrompt,
         useResearchModel: false,
      });

       if (!contentResult || contentResult.content.startsWith('Error:')) {
         throw new Error(contentResult?.content || 'Content generation step failed.');
      }

      // --- Update after Content Generation ---
      currentProgress += progressIncrement * contentSteps; // Add progress for all content steps
      setGenerationProgress(Math.round(currentProgress)); // Use store action
      setGenerationStatusText('Finalizing and formatting...'); // Use store action

      // --- Finalize ---
      // Add a small delay for "Finalizing" step before setting to 100%
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate finalization
      currentProgress += progressIncrement * finalizationSteps;
      setGenerationProgress(100); // Use store action
      setGenerationStatusText('Generation complete. Displaying content...'); // Use store action

      // Prepend H1 title and ensure Markdown format
      const finalMarkdownContent = `# ${useProjectWorkflowStore.getState().projectName}\n\n${contentResult.content}`; // Get latest name

      simulateTyping(finalMarkdownContent, setGeneratedContentPreview); // Start typing effect with formatted content

    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage = `Error during generation: ${error instanceof Error ? error.message : String(error)}`;
      setGeneratedContentPreview(errorMessage); // Use store action
      setGenerationStatusText('Generation Failed!'); // Use store action
      setGenerationProgress(0); // Use store action
      setIsGenerating(false); // Use store action
    }
    // setIsGenerating(false) is now handled by simulateTyping or catch block
  };

// Helper for typing effect
const simulateTyping = (text: string, setText: (text: string) => void, speed = 0) => { // Accept Zustand action signature
  let i = 0;
  let currentText = ''; // Use a local variable to build the string
  setText(''); // Clear initial state via action
  const intervalId = setInterval(() => {
    if (i < text.length) {
      currentText += text.charAt(i); // Append to local variable
      setText(currentText); // Update store with the accumulated string
      i++;
    } else {
      clearInterval(intervalId);
      // Convert final Markdown to HTML before setting editor state
      const htmlContent = marked(text) as string; // Use marked to parse
      console.log("Generated HTML for Editor:", htmlContent); // Log the generated HTML
      setEditorContent(htmlContent); // Use store action
      setIsGenerating(false); // Ensure generation stops (using store action)
    }
  }, speed);
};


  return (
    // Use Card component for consistent container styling
    <Card className="project-area-container shadow-md border border-neutral-light">
       {/* Project Title Header - Reads from Zustand store */}
       <div className="p-4 border-b border-neutral-light/40 bg-gradient-to-r from-neutral-light/10 to-transparent">
         <h1 className="text-2xl font-bold font-heading text-secondary truncate">
           {projectName || "Untitled Project"} {/* Display state from store */}
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
               selectedTypeId={selectedPitchDeckTypeId} // From store
               onSelectType={handleSelectType} // Uses store action
             />
             <ProjectSetupForm
               // Pass state values from store
               projectName={projectName}
               description={description}
               privacy={privacy}
               // Pass actions from store
               setProjectName={setProjectName}
               setDescription={setDescription}
               setPrivacy={setPrivacy}
               setTagsInput={setTagsFromString} // Pass store action for string input
               setTeamInput={setTeamMembersFromString} // Pass store action for string input
               // tagsInput and teamInput props removed - form will manage its own input state
             />
             <ImportOptions />
             {/* Make button container stack on mobile */}
             <div className="flex flex-col md:flex-row md:justify-end pt-6 border-t border-neutral-light/40 gap-2">
               <Button
                 variant="primary"
                 // size prop removed
                 onClick={handleContinueFromStep1} // Uses store state for validation
                 disabled={!projectName || !selectedPitchDeckTypeId} // Use store state
                 className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" // Responsive width and sizing
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

              {/* Make button container stack on mobile */}
              <div className="flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                 <Button variant="outline" onClick={() => setCurrentStep(1)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> {/* Responsive width */}
                   Back to Setup
                 </Button>
                 <Button
                   variant="primary"
                   className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" // Responsive width
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
                  <TemplateGallery
                     selectedTemplateId={selectedTemplateId} // From store
                     onSelectTemplate={setSelectedTemplateId} // Store action
                  />
                  <BrandCustomization
                     logo={brandLogo} // From store
                     onLogoChange={setBrandLogo} // Store action (handler needed for upload)
                     primaryColor={primaryColor} // From store
                     onPrimaryColorChange={setPrimaryColor} // Store action
                     secondaryColor={secondaryColor} // From store
                     onSecondaryColorChange={setSecondaryColor} // Store action
                     accentColor={accentColor} // From store
                     onAccentColorChange={setAccentColor} // Store action
                     headingFont={headingFont} // From store
                     onHeadingFontChange={setHeadingFont} // Store action
                     bodyFont={bodyFont} // From store
                     onBodyFontChange={setBodyFont} // Store action
                  />
                  <StructurePlanning
                     slides={slideStructure} // From store
                     onSlidesChange={setSlideStructure} // Store action
                     complexity={complexityLevel} // From store
                     onComplexityChange={setComplexityLevel} // Store action
                  />
               </div>
               {/* Right Column: Preview */}
               <div className="lg:col-span-5">
                  <div className="sticky top-[80px]">
                     <DesignPreview
                        // Pass relevant state from store to preview
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        accentColor={accentColor}
                        headingFont={headingFont}
                        bodyFont={bodyFont}
                        slides={slideStructure}
                     />
                  </div>
               </div>
               {/* Navigation Buttons (Full Width Below Columns) */}
              {/* Make button container stack on mobile */}
              <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                 <Button variant="outline" onClick={() => setCurrentStep(2)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> {/* Responsive width */}
                   Back to Requirements
                 </Button>
                 <Button
                   variant="primary"
                   className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" // Responsive width
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
               {/* Left Column: Setup & Progress (1/3 width) */}
               <div className="lg:col-span-4 space-y-6">
                  <GenerationSetup
                     onGenerate={handleGenerateContent} // Handler remains the same
                     isGenerating={isGenerating} // Use store state
                  />
                  {isGenerating && <GenerationProgress progress={generationProgress} statusText={generationStatusText} />} {/* Use store state */}
               </div>
               {/* Right Column: Preview (2/3 width) */}
               <div className="lg:col-span-8">
                  <div className="sticky top-[80px]">
                     {/* Pass content from store to GenerationPreview */}
                     <GenerationPreview content={generatedContentPreview} /> {/* Use store state */}
                  </div>
               </div>
               {/* Navigation Buttons */}
              {/* Make button container stack on mobile */}
              <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(3)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> {/* Responsive width */}
                  Back to Design
                </Button>
                <Button
                  variant="primary"
                  className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" // Responsive width
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
                   <ContentEditor
                      content={editorContent} // Use store state
                      onChange={setEditorContent} // Use store action
                   />
                </div>
                {/* Right Sidebar: Tools & Collaboration */}
                <div className="lg:col-span-4 space-y-6">
                   <div className="sticky top-[80px] space-y-6"> {/* Make sidebar sticky */}
                      <EnhancementTools
                         editorContent={editorContent} // Use store state
                         onContentChange={setEditorContent} // Use store action
                      />
                      <VisualElementStudio />
                      <CollaborationTools />
                   </div>
                </div>
                {/* Navigation Buttons */}
               {/* Make button container stack on mobile */}
               <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                 <Button variant="outline" onClick={() => setCurrentStep(4)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> {/* Responsive width */}
                   Back to Generation
                 </Button>
                 <Button
                   variant="primary"
                   className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" // Responsive width
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
                    <ValidationInterface
                       onVerifyFacts={handleRunFactCheck} // Handlers remain the same
                       onCheckCompliance={handleRunComplianceCheck}
                       onValidateFinancials={handleRunFinancialValidation}
                       onCheckLanguage={handleRunLanguageCheck}
                       factCheckResults={factCheckResults} // Use store state
                       complianceStatus={complianceStatus} // Use store state
                       financialValidationStatus={financialValidationStatus} // Use store state
                       languageCheckStatus={languageCheckStatus} // Use store state
                       isLoading={isLoadingQA} // Use store state
                    />
                    <RefinementPanel
                       suggestions={refinementSuggestions} // Use store state
                       onImplement={handleImplementSuggestion} // Handlers remain the same
                       onCompare={handleCompareSuggestion}
                       onPolish={handleRunFinalPolish}
                       isLoading={isLoadingQA} // Use store state
                    />
                 </div>
                 {/* Right Column: Dashboard */}
                 <div className="lg:col-span-5">
                    <div className="sticky top-[80px]">
                       <QualityDashboard
                          metrics={qualityMetrics} // Use store state
                          isLoading={isLoadingQA} // Use store state
                       />
                    </div>
                 </div>
                 {/* Navigation Buttons */}
                {/* Make button container stack on mobile */}
                <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep(5)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> {/* Responsive width */}
                    Back to Editing
                  </Button>
                  <Button
                    variant="primary"
                    className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" // Responsive width
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
                  <ExportConfiguration
                     onGenerateClientPdf={handleGenerateClientPdf} // Handler remains the same
                     isGeneratingClientPdf={isGeneratingClientPdf} // Use store state
                     clientPdfStatus={clientPdfStatus} // Use store state
                  />
                  <SharingPermissions />
                  <ArchivingAnalytics />
                 {/* Navigation Buttons */}
                {/* Make button container stack on mobile */}
                <div className="flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep(6)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> {/* Responsive width */}
                    Back to QA
                  </Button>
                  <Button variant="primary" className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> {/* Responsive width */}
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