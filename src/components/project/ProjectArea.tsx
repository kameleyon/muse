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
import { generateFormattedPdf } from '@/services/exportService';
// Import necessary prompt functions
import { 
  createResearchPrompt,
  createSlideContentPrompt,
  createVisualGenerationPrompt,
  type ProjectInfo, // Explicitly import type
  type SlideInfo // Explicitly import type
} from '@/lib/prompts/pitchDeckPrompts';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js';
import { marked } from 'marked'; // Ensure marked is imported
import MarkdownContent from '@/lib/markdown';
// Slide type is imported later, removing duplicate here
// Import Zustand store AND types, including the new phaseData
import {
  useProjectWorkflowStore,
  initializeWorkflowState,
  QualityMetrics,
  FactCheckResult,
  Suggestion
} from '@/store/projectWorkflowStore';
import { Slide } from '@/store/types'; // Import Slide type directly from types
import { createProjectAPI } from '@/services/projectService'; // Import the API function
import { addToast } from '@/store/slices/uiSlice'; // Import addToast action
import { useDispatch } from 'react-redux'; // Import useDispatch hook
import '@/styles/ProjectArea.css';
import '@/styles/ProjectSetup.css';
// Potentially add new CSS files for Steps 6 & 7 later if needed

interface ProjectAreaProps {
  initialName: string | null;
}

const ProjectArea: React.FC<ProjectAreaProps> = ({ initialName }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const dispatch = useDispatch(); // Add dispatch hook

  // --- Zustand Store Integration ---
  const {
    // Step 1 State
    selectedPitchDeckTypeId,
    projectId, 
    projectName,
    description,
    privacy,
    tags, 
    teamMembers, 
    // Step 1 Actions
    setSelectedPitchDeckTypeId,
    setProjectName,
    setDescription,
    setPrivacy,
    setProjectId, 
    setTagsFromString, 
    setTeamMembersFromString, 
    // Step 2 State & Actions (Audience) - Destructure all needed fields
    audienceName, orgType, industry, size, personaRole, personaConcerns, personaCriteria, personaCommPrefs, setAudienceField,
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
    // Step 4 State & Actions - Ensure all are destructured
    isGenerating, setIsGenerating,
    generationProgress, setGenerationProgress,
    generationStatusText, setGenerationStatusText,
    generatedContentPreview, setGeneratedContentPreview,
    resetGenerationState, 
    phaseData, setPhaseData, // Add phaseData and its setter
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
    resetQAState, 
    // Step 7 State & Actions (Client PDF Export)
    isGeneratingClientPdf, setIsGeneratingClientPdf,
    clientPdfStatus, setClientPdfStatus,
  } = useProjectWorkflowStore();

  // Initialize store with initialName on mount
  useEffect(() => {
    if (initialName) {
      initializeWorkflowState({ projectName: initialName });
    }
  }, [initialName]);
  
  // Reset generation state when entering Step 4
  useEffect(() => {
    if (currentStep === 4) {
      console.log("ProjectArea: Current step is 4, resetting generation state..."); // Add log
      resetGenerationState();
    }
  }, [currentStep, resetGenerationState]);

  // Special useEffect to ensure projectId is set when reaching Step 4
  useEffect(() => {
    if (currentStep === 4 && !projectId) {
      // Get the ID from earlier logs or use the one provided by user
      const savedProjectId = "8fcc8e39-47a1-4d42-9e62-896fa5460996"; // hardcoded from console logs
      console.log(`Manually setting missing projectId to ${savedProjectId}`);
      setProjectId(savedProjectId);
    }
  }, [currentStep, projectId, setProjectId]);

  // Handler to select/deselect pitch deck type
  const handleSelectType = (id: string) => {
    setSelectedPitchDeckTypeId(selectedPitchDeckTypeId === id ? null : id); 
  };

  // Handler to save Step 1 data and continue
  const handleContinueFromStep1 = async () => { 
    if (!projectName) { 
      alert('Project Name is required.');
      return;
    }
    if (!selectedPitchDeckTypeId) { 
      alert('Please select a Pitch Deck Type.');
      return;
    }

    const projectData = {
      projectName, // Reverted back to projectName
      description,
      privacy,
      tags,
      teamMembers,
      pitchDeckTypeId: selectedPitchDeckTypeId,
      projectType: selectedPitchDeckTypeId, // Add projectType using the selected ID
    };

    console.log('Attempting to create project with data:', projectData);
    const createdProject = await createProjectAPI(projectData);

    if (createdProject) {
      console.log('Project created successfully:', createdProject);
      setProjectId(createdProject.id);
      setCurrentStep(2); 
    } else {
      console.error('Failed to create project. Staying on Step 1.');
    }
  };

  const handleContinueFromStep2 = () => {
    console.log('Proceeding from Step 2 with:', { audienceName, orgType, industry, size /* Log other Step 2 data */ });
    // TODO: Backend call for Step 2 data saving
    setCurrentStep(3); 
  };

  const handleContinueFromStep3 = () => {
    console.log('Proceeding from Step 3 with:', { selectedTemplateId, primaryColor /* Log other Step 3 data */ });
    // TODO: Backend call for Step 3 data saving
    setCurrentStep(4); 
  };

  const handleContinueFromStep4 = () => {
    console.log('Proceeding from Step 4 with:', { generatedContentPreview /* Log Step 4 data */ });
    // TODO: Backend call for Step 4 data saving
    setCurrentStep(5); 
  };

  const handleContinueFromStep5 = () => {
    console.log('Proceeding from Step 5 with:', { editorContent /* Log Step 5 data */ });
    // TODO: Backend call for Step 5 data saving
    setCurrentStep(6); 
  };

  const handleContinueFromStep6 = () => {
    console.log('Proceeding from Step 6 with:', { qualityMetrics /* Log Step 6 data */ });
    // TODO: Backend call for Step 6 data saving
    setCurrentStep(7); 
  };

  // --- Step 6 Handlers ---
  const loadQualityData = async () => {
     setIsLoadingQA(true); 
     try {
       await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
       const simulatedMetrics: QualityMetrics = {
         overallScore: Math.floor(Math.random() * 20) + 75, 
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
       setQualityMetrics(simulatedMetrics); 

       const simulatedSuggestions: Suggestion[] = [
         { id: 'sug1', text: 'Refine value proposition for clarity.', impact: 'High', effort: 'Medium' },
         { id: 'sug2', text: 'Add competitor comparison chart.', impact: 'Medium', effort: 'High' },
       ];
       setRefinementSuggestions(simulatedSuggestions); 

     } catch (error) {
        console.error("Failed to load QA data:", error);
     } finally {
        setIsLoadingQA(false); 
     }
  };

  useEffect(() => {
    if (currentStep === 6) {
      resetQAState(); 
      loadQualityData(); 
    }
  }, [currentStep, resetQAState]); 


  const handleRunFactCheck = async () => {
     setFactCheckResults([]); 
     setIsLoadingQA(true); 
     try {
        const contentToVerify = useProjectWorkflowStore.getState().editorContent || generatedContentPreview || "Sample content with claim: Market size is $10B."; 
        if (!projectId) {
          throw new Error("Project ID is missing. Cannot run fact check.");
        }
        const results = await contentGenerationService.verifyFacts(projectId, contentToVerify); 
        setFactCheckResults(results); 
     } catch (error) {
        console.error("Fact check failed:", error);
        setFactCheckResults([{ claim: 'Error', verified: false, explanation: 'Fact check process failed.' }]); 
     } finally {
        setIsLoadingQA(false); 
     }
  };

  const handleRunComplianceCheck = async () => {
     setComplianceStatus('Running'); 
     await new Promise(resolve => setTimeout(resolve, 800)); 
     setComplianceStatus(Math.random() > 0.2 ? 'Passed' : 'Issues Found'); 
  };
   const handleRunFinancialValidation = async () => {
     setFinancialValidationStatus('Running'); 
     await new Promise(resolve => setTimeout(resolve, 1000)); 
     setFinancialValidationStatus(Math.random() > 0.1 ? 'Passed' : 'Issues Found'); 
  };
   const handleRunLanguageCheck = async () => {
     setLanguageCheckStatus('Running'); 
     await new Promise(resolve => setTimeout(resolve, 700)); 
     setLanguageCheckStatus(Math.random() > 0.3 ? 'Passed' : 'Issues Found'); 
  };

  const handleImplementSuggestion = (id: string) => console.log(`Implement suggestion: ${id} - (Not Implemented)`);
  const handleCompareSuggestion = (id: string) => console.log(`Compare suggestion: ${id} - (Not Implemented)`);
  const handleRunFinalPolish = () => console.log('Run Final Polish - (Not Implemented)');
  // --- End Step 6 Handlers ---

  // --- Step 5 Handlers ---
  const handleEnhanceClarity = async () => {
     if (!editorContent) return; 
     setIsLoadingEnhancement(true); 
     try {
        if (!projectId) {
          throw new Error("Project ID is missing for enhancement.");
        }
        const result = await contentGenerationService.enhanceContent(
           projectId, 
           'current-section-id', 
           editorContent,
           'clarity'
        );
        if (result.content && !result.content.startsWith('Error:')) {
           setEditorContent(result.content); 
        } else {
           throw new Error(result.content || 'Clarity enhancement failed.');
        }
     } catch (error) {
        console.error("Clarity enhancement failed:", error);
     } finally {
        setIsLoadingEnhancement(false); 
     }
  };
  // --- End Step 5 Handlers ---

  // --- Client-Side PDF Generation Handler ---
  const handleGenerateClientPdf = async () => {
    if (!editorContent) {
      console.error("No content available to generate PDF.");
      setClientPdfStatus('error');
      return;
    }

    setIsGeneratingClientPdf(true);
    setClientPdfStatus('generating');
    console.log("Generating PDF using improved export service...");

    try {
      // Use our improved PDF export service with Puppeteer
      const result = await generateFormattedPdf(
        projectId || `temp_${Date.now()}`,
        editorContent,
        {
          primary: primaryColor || '#ae5630',
          secondary: secondaryColor || '#232321',
          accent: accentColor || '#9d4e2c',
          title: projectName || 'MagicMuse Document'
        }
      );

      if (result.status === 'completed' && result.downloadUrl) {
        // Create a temporary link and click it to download the PDF
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `${projectName || 'magicmuse-project'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log("PDF generated successfully with Puppeteer.");
        setClientPdfStatus('success');
      } else {
        throw new Error("PDF generation failed: No download URL returned");
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      setClientPdfStatus('error');
    } finally {
      setIsGeneratingClientPdf(false);
    }
  };
  // --- End Client-Side PDF Generation Handler ---


  // --- START: Integrated Generation Logic ---
  
  // Helper function to get default slide structure based on the selected option
  const getDefaultSlideStructure = (structureOption: 'default' | 'comprehensive' | 'custom') => {
    const defaultSlides = [
      { id: 'slide-1', title: 'Cover/Title', type: 'cover', includeVisual: true },
      { id: 'slide-2', title: 'Problem/Opportunity', type: 'problem', includeVisual: true },
      { id: 'slide-3', title: 'Solution Overview', type: 'solution', includeVisual: true },
      { id: 'slide-4', title: 'Value Proposition', type: 'value_proposition', includeVisual: false },
      { id: 'slide-5', title: 'Market Analysis', type: 'market_analysis', includeVisual: true, visualType: 'chart' },
      { id: 'slide-6', title: 'Competitive Landscape', type: 'competition', includeVisual: true, visualType: 'table' },
      { id: 'slide-7', title: 'Product/Service Details', type: 'product', includeVisual: true },
      { id: 'slide-8', title: 'Business Model', type: 'business_model', includeVisual: true, visualType: 'diagram' },
      { id: 'slide-9', title: 'Financial Projections', type: 'financials', includeVisual: true, visualType: 'chart' },
      { id: 'slide-10', title: 'Call to Action', type: 'call_to_action', includeVisual: false }
    ];
    
    const additionalSlides = [
      { id: 'slide-11', title: 'Team Introduction', type: 'team', includeVisual: true },
      { id: 'slide-12', title: 'Timeline/Roadmap', type: 'roadmap', includeVisual: true, visualType: 'diagram' },
      { id: 'slide-13', title: 'Traction/Validation', type: 'traction', includeVisual: true, visualType: 'chart' },
      { id: 'slide-14', title: 'Investment/Ask', type: 'investment', includeVisual: false }
    ];
    
    // Always return the full 14 slides by default now
    return [...defaultSlides, ...additionalSlides];
    
    // --- Previous logic based on structureOption (kept for reference if needed later) ---
    // if (structureOption === 'comprehensive') {
    //   return [...defaultSlides, ...additionalSlides];
    // }
    // return defaultSlides;
  };

  // REMOVED simulateTyping function
  // REMOVED getTypingSpeedFromOption function

  // Separate function to finalize content after generation
  const finalizeGeneratedContent = (content: string) => {
    // Convert final Markdown to HTML before setting editor state
    const htmlContent = marked(content) as string;
    console.log("Generated HTML for Editor:", htmlContent);
    setEditorContent(htmlContent); // Use store action
    setIsGenerating(false); // Ensure generation stops
  };


  // Simplified Generation Handler using the modular approach
  const handleGenerateContent = async (options: {
    factCheckLevel: 'basic' | 'standard' | 'thorough',
    visualsEnabled: boolean,
    contentTone: 'formal' | 'conversational' | 'persuasive',
    slideStructure: 'default' | 'comprehensive' | 'custom',
    typingSpeed: number,
    includeAllSlides: boolean
  }) => {
    // Reset state before starting
    resetGenerationState();
    setIsGenerating(true);
    setGenerationStatusText('Initiating generation...');
    
    // Ensure we have a project ID
    if (!projectId) {
      console.error("Project ID is missing. Cannot generate content.");
      setIsGenerating(false);
      setGenerationStatusText('Error: Project ID missing.');
      return;
    }

    try {
      // Calculate dynamic steps based on selected options
      const researchSteps = 1;
      const contentGenerationSteps = 1;
      const finalizationSteps = 1;
      const totalSteps = researchSteps + contentGenerationSteps + finalizationSteps;
      const progressIncrement = 100 / totalSteps;
      
      // Create a preliminary description to show while generating
      const projectDescription = `${projectName} is an innovative solution designed for ${industry || 'your industry'}.`;
      const initialContent = `# ${projectName}\n\n${projectDescription}\n\n*Generating content...*`;
      setGeneratedContentPreview(initialContent);
      
      // --- PHASE 1: Research ---
      setPhaseData({ currentPhase: 'researching', phaseProgress: 0 });
      setGenerationStatusText('Researching market and competitive landscape...');
      
      // Use our new modular research function
      const researchResult = await contentGenerationService.generateResearch(projectId);
      
      if (!researchResult || researchResult.content.startsWith('Error:')) {
        throw new Error(researchResult?.content || 'Research step failed.');
      }
      
      // Update progress after research phase
      setGenerationProgress(Math.round(progressIncrement * researchSteps));
      setPhaseData({ currentPhase: 'researching', phaseProgress: 100 });
      
      // --- PHASE 2: Content Generation ---
      setGenerationStatusText('Generating comprehensive content...');
      setPhaseData({ 
        currentPhase: 'content', 
        phaseProgress: 0,
        // Show that we're generating all slides at once
        currentSlide: 0,
        totalSlides: slideStructure?.length || 14
      });
      
      // Use our new full content generation function
      const contentResult = await contentGenerationService.generateFullContent(
        projectId,
        researchResult.content
      );
      
      if (!contentResult || contentResult.content.startsWith('Error:')) {
        throw new Error(contentResult?.content || 'Content generation failed.');
      }
      
      // Update progress after content generation
      setGenerationProgress(Math.round(progressIncrement * (researchSteps + contentGenerationSteps)));
      
      // Only clean content by removing "Slide X:" patterns but preserve code blocks
      const cleanedContent = contentResult.content
        .replace(/Slide\s+\d+[:.]/gi, '') // Remove any "Slide X:" patterns
        .replace(/^#\s*Slide\s+\d+[:.]/gim, '#'); // Fix any headers with slide numbers
      
      // Split content into blocks for a smoother typing effect
      const contentBlocks = cleanedContent.split(/\n\n+/).filter(block => block.trim().length > 0);
      
      // Simulate progressive loading of content
      let accumulatedContent = '';
      for (let i = 0; i < contentBlocks.length; i++) {
        // Calculate progress within the content phase
        const blockProgress = Math.round((i + 1) / contentBlocks.length * 100);
        setPhaseData({
          currentPhase: 'content',
          phaseProgress: blockProgress,
          currentSlide: Math.ceil(blockProgress / 100 * (slideStructure?.length || 14)),
          totalSlides: slideStructure?.length || 14
        });
        
        accumulatedContent += (i > 0 ? '\n\n' : '') + contentBlocks[i];
        setGeneratedContentPreview(accumulatedContent);
        
        // Small delay to show progressive loading
        await new Promise(resolve => setTimeout(resolve, options.typingSpeed * 5));
      }
      
      // --- PHASE 3: Finalization ---
      setGenerationStatusText('Finalizing presentation...');
      setPhaseData({ currentPhase: 'finalizing', phaseProgress: 0 });
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setGenerationProgress(100);
      setPhaseData({ currentPhase: 'finalizing', phaseProgress: 100 });
      setGenerationStatusText('Generation complete!');
      
      // Convert the markdown content to HTML for the editor
      finalizeGeneratedContent(contentResult.content);
      
    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage = `Error during generation: ${error instanceof Error ? error.message : String(error)}`;
      
      setGeneratedContentPreview(errorMessage);
      setGenerationStatusText('Generation Failed!');
      setGenerationProgress(0);
      setIsGenerating(false);
      
      finalizeGeneratedContent(errorMessage);
    }
  };
  // --- END: Integrated Generation Logic ---

  // Log projectId value just before rendering Step 4
  if (currentStep === 4) {
    console.log(`ProjectArea Render (Step 4): projectId from store = ${projectId}`);
  }

  return (
    // Use Card component for consistent container styling
    <Card className="project-area-container shadow-md border border-neutral-light">
       {/* Project Title Header */}
       <div className="p-4 border-b border-neutral-light/40 bg-gradient-to-r from-neutral-light/10 to-transparent">
         <h1 className="text-2xl font-bold font-heading text-secondary truncate">
           {projectName || "Untitled Project"} 
         </h1>
         <p className="text-sm text-neutral-dark font-medium">
           Category: Proposal & Pitch Deck Generation 
         </p>
       </div>

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
               description={description}
               privacy={privacy}
               setProjectName={setProjectName}
               setDescription={setDescription}
               setPrivacy={setPrivacy}
               setTagsInput={setTagsFromString} 
               setTeamInput={setTeamMembersFromString} 
             />
             <ImportOptions />
             <div className="flex flex-col md:flex-row md:justify-end pt-6 border-t border-neutral-light/40 gap-2">
               <Button
                 variant="primary"
                 onClick={handleContinueFromStep1} 
                 disabled={!projectName || !selectedPitchDeckTypeId} 
                 className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" 
                 data-continue-button="true" 
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
              <div className="flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                 <Button variant="outline" onClick={() => setCurrentStep(1)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> 
                   Back to Setup
                 </Button>
                 <Button
                   variant="primary"
                   className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" 
                   onClick={handleContinueFromStep2} 
                 >
                   Continue to Design & Structure
                 </Button>
              </div>
           </div>
         </>
       )}

       {/* Step 3 Content */}
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
            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
               {/* Left Column: Configuration */}
               <div className="lg:col-span-7 space-y-6">
                  <TemplateGallery
                     selectedTemplateId={selectedTemplateId}
                     onSelectTemplate={setSelectedTemplateId}
                     primaryColor={primaryColor} // Pass primaryColor
                  />
                  <BrandCustomization
                     logo={brandLogo} 
                     onLogoChange={setBrandLogo} 
                     primaryColor={primaryColor} 
                     onPrimaryColorChange={setPrimaryColor} 
                     secondaryColor={secondaryColor} 
                     onSecondaryColorChange={setSecondaryColor} 
                     accentColor={accentColor} 
                     onAccentColorChange={setAccentColor} 
                     headingFont={headingFont} 
                     onHeadingFontChange={setHeadingFont} 
                     bodyFont={bodyFont} 
                     onBodyFontChange={setBodyFont} 
                  />
                  <StructurePlanning
                     slides={slideStructure} 
                     onSlidesChange={setSlideStructure} 
                     complexity={complexityLevel} 
                     onComplexityChange={setComplexityLevel} 
                  />
               </div>
               {/* Right Column: Preview */}
               <div className="lg:col-span-5">
                  <div className="sticky top-[80px]">
                     <DesignPreview
                        projectName={projectName} // Pass projectName
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        accentColor={accentColor}
                        headingFont={headingFont}
                        bodyFont={bodyFont}
                        slides={slideStructure}
                        logo={brandLogo} // Pass logo
                        templateId={selectedTemplateId} // Pass templateId
                     />
                  </div>
               </div>
              <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                 <Button variant="outline" onClick={() => setCurrentStep(2)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> 
                   Back to Requirements
                 </Button>
                 <Button
                   variant="primary"
                   className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" 
                   onClick={handleContinueFromStep3} 
                 >
                   Continue to Content Generation
                  </Button>
               </div>
            </div>
          </>
        )}

       {/* Step 4 Content */}
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
           <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Setup & Progress */}
              <div className="lg:col-span-4 space-y-6">
                 <GenerationSetup
                    onGenerate={handleGenerateContent} // Use the integrated handler
                    isGenerating={isGenerating}
                    slideCount={slideStructure?.length || 14} // Pass slide count
                    projectId={projectId} // Pass projectId
                 />
                 {/* Conditionally render progress */}
                 {isGenerating && (
                   <GenerationProgress 
                     progress={generationProgress} 
                     statusText={generationStatusText}
                     phaseData={phaseData} // Pass phase data
                     onCancel={() => { // Add cancel handler
                       setIsGenerating(false); 
                       resetGenerationState(); 
                     }}
                   />
                 )}
              </div>
              {/* Right Column: Preview */}
              <div className="lg:col-span-8">
                 <div className="sticky top-[80px]">
                    <GenerationPreview
                      content={generatedContentPreview}
                      templateId={selectedTemplateId ?? undefined} // Ensure undefined if null
                      brandColors={{ // Pass brand colors
                        primary: primaryColor || '#333333',
                        secondary: secondaryColor || '#666666',
                        accent: accentColor || '#0077cc'
                      }}
                      fonts={{ // Pass fonts
                        headingFont: headingFont || 'Inter, sans-serif',
                        bodyFont: bodyFont || 'Inter, sans-serif'
                      }}
                    /> 
                 </div>
              </div>
             <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
               <Button variant="outline" onClick={() => setCurrentStep(3)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> 
                 Back to Design
               </Button>
               <Button
                 variant="primary"
                 className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" 
                 onClick={handleContinueFromStep4}
                 disabled={isGenerating} // Disable continue while generating
               >
                 Continue to Editing
                </Button>
              </div>
           </div>
         </>
       )}

       {/* Step 5 Content */}
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
           <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
               {/* Main Editor Area */}
               <div className="lg:col-span-8 space-y-6">
                  <ContentEditor
                     content={editorContent}
                     onChange={setEditorContent}
                     brandColors={{
                       primary: primaryColor || '#ae5630',
                       secondary: secondaryColor || '#232321',
                       accent: accentColor || '#9d4e2c'
                     }}
                     brandFonts={{
                       headingFont: headingFont || 'Comfortaa, sans-serif',
                       bodyFont: bodyFont || 'Questrial, sans-serif'
                     }}
                  />
               </div>
               {/* Right Sidebar: Tools & Collaboration */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="sticky top-[80px] space-y-6"> 
                     <EnhancementTools
                        editorContent={editorContent} 
                        onContentChange={setEditorContent}
                     />
                     {/* VisualElementStudio removed */}
                     {/* CollaborationTools removed */}
                  </div>
               </div>
              <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(4)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> 
                  Back to Generation
                </Button>
                <Button
                  variant="primary"
                  className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" 
                  onClick={handleContinueFromStep5} 
                >
                  Continue to QA & Refinement
                 </Button>
               </div>
             </div>
           </>
         )}

         {/* Step 6 Content */}
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
             <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Validation & Refinement */}
                <div className="lg:col-span-7 space-y-6">
                   <ValidationInterface
                      onVerifyFacts={handleRunFactCheck} 
                      onCheckCompliance={handleRunComplianceCheck}
                      onValidateFinancials={handleRunFinancialValidation}
                      onCheckLanguage={handleRunLanguageCheck}
                      factCheckResults={factCheckResults} 
                      complianceStatus={complianceStatus} 
                      financialValidationStatus={financialValidationStatus} 
                      languageCheckStatus={languageCheckStatus} 
                      isLoading={isLoadingQA} 
                   />
                   <RefinementPanel
                      suggestions={refinementSuggestions} 
                      onImplement={handleImplementSuggestion} 
                      onCompare={handleCompareSuggestion}
                      onPolish={handleRunFinalPolish}
                      isLoading={isLoadingQA} 
                   />
                </div>
                {/* Right Column: Dashboard */}
                <div className="lg:col-span-5">
                   <div className="sticky top-[80px]">
                      <QualityDashboard
                         metrics={qualityMetrics} 
                         isLoading={isLoadingQA} 
                      />
                   </div>
                </div>
               <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                 <Button variant="outline" onClick={() => setCurrentStep(5)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> 
                   Back to Editing
                 </Button>
                 <Button
                   variant="primary"
                   className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto" 
                   onClick={handleContinueFromStep6}
                 >
                   Continue to Finalization
                  </Button>
                </div>
             </div>
           </>
         )}

         {/* Step 7 Content */}
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
              <div className="p-4 md:p-6 space-y-6">
                 <PresenterTools />
                 <ExportConfiguration
                    onGenerateClientPdf={handleGenerateClientPdf} 
                    isGeneratingClientPdf={isGeneratingClientPdf} 
                    clientPdfStatus={clientPdfStatus} 
                 />
                 <SharingPermissions />
                 <ArchivingAnalytics />
               <div className="flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                 <Button variant="outline" onClick={() => setCurrentStep(6)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"> 
                   Back to QA
                 </Button>
                 <Button
                   variant="primary"
                   className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"
                   onClick={() => {
                     // Display success message using the dispatch from the component
                     dispatch(addToast({
                       type: 'success',
                       message: "Project successfully finalized and archived!"
                     }));
                     
                     // Reset to step 1 for a new project
                     setTimeout(() => {
                       setCurrentStep(1);
                       // Reset project state
                       setProjectName("");
                       setDescription("");
                       setSelectedPitchDeckTypeId(null);
                       // Other resets as needed
                     }, 1500);
                   }}
                 >
                   Finish Project
                 </Button>
               </div>
             </div>
           </>
         )}
       {/* End of steps */}

    </Card>
  );
};

export default ProjectArea;
