import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// Corrected relative paths for the new location, adding .tsx extension
import PitchDeckTypeGrid from './setup/PitchDeckTypeGrid';
import ProjectSetupForm from './setup/ProjectSetupForm';
import TargetAudienceForm from './requirements/TargetAudienceForm';
import ProjectDetailsForm from './requirements/ProjectDetailsForm';
import TemplateGallery from './design/TemplateGallery';
import BrandCustomization from './design/BrandCustomization';
import StructurePlanning from './design/StructurePlanning';
import DesignPreview from './design/DesignPreview';
import GenerationSetup from './generation/GenerationSetup';
import GenerationProgress from './generation/GenerationProgress';
import GenerationPreview from './generation/GenerationPreview';
import ContentEditor from './editing/ContentEditor';
import EnhancementTools from './editing/EnhancementTools';
// VisualElementStudio and CollaborationTools seem removed based on comments in original code
// import VisualElementStudio from './editing/VisualElementStudio';
// import CollaborationTools from './editing/CollaborationTools';
// import QualityDashboard from './qa/QualityDashboard'; // Commented out for replacement
// import ValidationInterface from './qa/ValidationInterface'; // Commented out for replacement
import RefinementPanel from './qa/RefinementPanel';
import { ComprehensiveQAPanel } from './qa/ComprehensiveQAPanel'; // Import the new component
import PresenterTools from './delivery/PresenterTools';
import ExportConfiguration from './delivery/ExportConfiguration';
import SharingPermissions from './delivery/SharingPermissions';
import ArchivingAnalytics from './delivery/ArchivingAnalytics';
import * as contentGenerationService from '@/services/contentGenerationService';
import { generateFormattedPdf } from '@/services/exportService';
import {
  createResearchPrompt,
  createSlideContentPrompt,
  createVisualGenerationPrompt,
  type ProjectInfo,
  type SlideInfo
} from '@/lib/prompts/pitchDeckPrompts';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js';
import { marked } from 'marked';
import MarkdownContent from '@/lib/markdown';
import {
  useProjectWorkflowStore,
  initializeWorkflowState, // Keep initializeWorkflowState if needed for initial setup within this layout
  QualityMetrics,
  FactCheckResult,
  Suggestion
} from '@/store/projectWorkflowStore';
import { Slide } from '@/store/types';
import { createProjectAPI } from '@/services/projectService';
import { addToast } from '@/store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import '@/styles/ProjectArea.css'; // Keep styles if they apply broadly
import '@/styles/ProjectSetup.css'; // Keep styles if they apply broadly
import '@/styles/blog.css';

// Define props interface for PitchDeckLayout
interface PitchDeckLayoutProps {
  initialName?: string | null;
}

// Renamed component from ProjectArea to PitchDeckLayout
const PitchDeckLayout: React.FC<PitchDeckLayoutProps> = ({ initialName }) => {
  const [currentStep, setCurrentStep] = useState<number>(1); // Step management remains internal to this layout
  const dispatch = useDispatch();

  // --- Zustand Store Integration ---
  // Keep using the store as before
  const {
    selectedPitchDeckTypeId, projectId, projectName, description, privacy, tags, teamMembers,
    setSelectedPitchDeckTypeId, setProjectName, setDescription, setPrivacy, setProjectId, setTagsFromString, setTeamMembersFromString,
    audienceName, orgType, industry, size, personaRole, personaConcerns, personaCriteria, personaCommPrefs, setAudienceField,
    selectedTemplateId, setSelectedTemplateId, brandLogo, setBrandLogo, primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor, accentColor, setAccentColor, headingFont, setHeadingFont, bodyFont, setBodyFont, slideStructure, setSlideStructure, complexityLevel, setComplexityLevel,
    isGenerating, setIsGenerating, generationProgress, setGenerationProgress, generationStatusText, setGenerationStatusText, generatedContentPreview, setGeneratedContentPreview, resetGenerationState, phaseData, setPhaseData,
    editorContent, setEditorContent, isLoadingEnhancement, setIsLoadingEnhancement,
    qualityMetrics, setQualityMetrics, factCheckResults, setFactCheckResults, complianceStatus, setComplianceStatus, financialValidationStatus, setFinancialValidationStatus, languageCheckStatus, setLanguageCheckStatus, refinementSuggestions, setRefinementSuggestions, isLoadingQA, setIsLoadingQA, resetQAState,
    isGeneratingClientPdf, setIsGeneratingClientPdf, clientPdfStatus, setClientPdfStatus,
  } = useProjectWorkflowStore();

  // Initialize store with project name if provided
  useEffect(() => {
    if (initialName && initialName.trim() !== '') {
      console.log(`PitchDeckLayout: Initializing with project name: ${initialName}`);
      setProjectName(initialName);
    } else if (!projectName || projectName === "Untitled Project") {
      // Don't set a default name - let the user enter their own
      console.log(`PitchDeckLayout: No project name provided, waiting for user input`);
    }
  }, [initialName, projectName, setProjectName]);

  // Reset generation state when entering Step 4
  useEffect(() => {
    if (currentStep === 4) {
      console.log("PitchDeckLayout: Current step is 4, resetting generation state...");
      resetGenerationState();
    }
  }, [currentStep, resetGenerationState]);

  // Special useEffect to ensure projectId is set when reaching Step 4
  // This might still be relevant if the ID isn't guaranteed earlier
  useEffect(() => {
    if (currentStep === 4 && !projectId) {
      const savedProjectId = "8fcc8e39-47a1-4d42-9e62-896fa5460996"; // Keep hardcoded for now, but ideally passed as prop or retrieved differently
      console.log(`PitchDeckLayout: Manually setting missing projectId to ${savedProjectId}`);
      setProjectId(savedProjectId);
    }
  }, [currentStep, projectId, setProjectId]);

  // Handler to select/deselect pitch deck type
  const handleSelectType = (id: string) => {
    setSelectedPitchDeckTypeId(selectedPitchDeckTypeId === id ? null : id);
  };

  // Handler to save Step 1 data and continue
  // This logic might belong in the parent component (ProjectSetup) that renders ProjectArea,
  // as it involves creating the project *before* showing this layout.
  // Let's keep it for now but mark it for potential refactoring.
  // TODO: Consider moving project creation logic upstream.
  const handleContinueFromStep1 = async () => {
    // Get the current value directly from the input field as a backup
    const formProjectName = document.getElementById('projectName') as HTMLInputElement;
    const currentProjectName = projectName || (formProjectName ? formProjectName.value : '');
    
    if (!currentProjectName || currentProjectName.trim() === '') {
      alert('Project Name is required.');
      return;
    }
    
    if (!selectedPitchDeckTypeId) {
      alert('Please select a Pitch Deck Type.');
      return;
    }

    // Make sure we use the current name value, not the potentially stale state
    // Also ensure it's set in state for future reference
    if (currentProjectName !== projectName) {
      setProjectName(currentProjectName);
    }

    const projectData = {
      projectName: currentProjectName, // Use current name directly
      description, 
      privacy, 
      tags, 
      teamMembers,
      pitchDeckTypeId: selectedPitchDeckTypeId,
      projectType: selectedPitchDeckTypeId, // Assuming pitch deck type ID is the project type key
    };

    console.log('PitchDeckLayout: Attempting to create project with data:', projectData);
    const createdProject = await createProjectAPI(projectData);

    if (createdProject) {
      console.log('PitchDeckLayout: Project created successfully:', createdProject);
      setProjectId(createdProject.id); // Set ID in store
      
      // If we need to access the project name from the response, use name field (not project_name)
      // This ensures compatibility with the database schema
      console.log('Project name from response:', createdProject.name);
      setCurrentStep(2);
    } else {
      console.error('PitchDeckLayout: Failed to create project. Staying on Step 1.');
      // Optionally dispatch a toast error
      dispatch(addToast({ type: 'error', message: 'Failed to create project.' }));
    }
  };

  const handleContinueFromStep2 = () => {
    console.log('PitchDeckLayout: Proceeding from Step 2');
    // TODO: Backend call for Step 2 data saving (if not done upstream)
    setCurrentStep(3);
  };

  const handleContinueFromStep3 = () => {
    console.log('PitchDeckLayout: Proceeding from Step 3');
    // TODO: Backend call for Step 3 data saving
    setCurrentStep(4);
  };

  const handleContinueFromStep4 = () => {
    console.log('PitchDeckLayout: Proceeding from Step 4');
    // TODO: Backend call for Step 4 data saving
    setCurrentStep(5);
  };

  const handleContinueFromStep5 = () => {
    console.log('PitchDeckLayout: Proceeding from Step 5');
    // TODO: Backend call for Step 5 data saving
    setCurrentStep(6);
  };

  const handleContinueFromStep6 = () => {
    console.log('PitchDeckLayout: Proceeding from Step 6');
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
     } catch (error) { console.error("Failed to load QA data:", error); }
     finally { setIsLoadingQA(false); }
  };

  useEffect(() => {
    if (currentStep === 6) {
      resetQAState();
      loadQualityData();
    }
  }, [currentStep, resetQAState]);

  const handleRunFactCheck = async () => {
     setFactCheckResults([]); setIsLoadingQA(true);
     try {
        const contentToVerify = useProjectWorkflowStore.getState().editorContent || generatedContentPreview || "Sample content";
        if (!projectId) throw new Error("Project ID missing");
        const results = await contentGenerationService.verifyFacts(projectId, contentToVerify);
        setFactCheckResults(results);
     } catch (error) {
        console.error("Fact check failed:", error);
        setFactCheckResults([{ claim: 'Error', verified: false, explanation: 'Fact check process failed.' }]);
     } finally { setIsLoadingQA(false); }
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

  const handleImplementSuggestion = (id: string) => console.log(`Implement suggestion: ${id}`);
  const handleCompareSuggestion = (id: string) => console.log(`Compare suggestion: ${id}`);
  const handleRunFinalPolish = () => console.log('Run Final Polish');
  // --- End Step 6 Handlers ---

  // --- Step 5 Handlers ---
  const handleEnhanceClarity = async () => {
     if (!editorContent) return; setIsLoadingEnhancement(true);
     try {
        if (!projectId) throw new Error("Project ID missing");
        const result = await contentGenerationService.enhanceContent(projectId, 'current-section-id', editorContent, 'clarity');
        if (result.content && !result.content.startsWith('Error:')) { setEditorContent(result.content); }
        else { throw new Error(result.content || 'Clarity enhancement failed.'); }
     } catch (error) { console.error("Clarity enhancement failed:", error); }
     finally { setIsLoadingEnhancement(false); }
  };
  // --- End Step 5 Handlers ---

  // This function is no longer needed as we're using the inline PDF export
  // in the ExportConfiguration component
  // --- End Client-Side PDF Generation Handler ---

  // --- START: Integrated Generation Logic ---
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
    return [...defaultSlides, ...additionalSlides];
  };
  const finalizeGeneratedContent = (content: string) => {
    const htmlContent = marked(content) as string;
    console.log("Generated HTML for Editor:", htmlContent);
    setEditorContent(htmlContent);
    setIsGenerating(false);
  };
  const handleGenerateContent = async (options: {
    factCheckLevel: 'basic' | 'standard' | 'thorough',
    visualsEnabled: boolean,
    contentTone: 'formal' | 'conversational' | 'persuasive',
    slideStructure: 'default' | 'comprehensive' | 'custom',
    typingSpeed: number,
    includeAllSlides: boolean
  }) => {
    resetGenerationState(); setIsGenerating(true); setGenerationStatusText('Initiating generation...');
    if (!projectId) { console.error("Project ID is missing. Cannot generate content."); setIsGenerating(false); setGenerationStatusText('Error: Project ID missing.'); return; }
    try {
      const researchSteps = 1; const contentGenerationSteps = 1; const finalizationSteps = 1;
      const totalSteps = researchSteps + contentGenerationSteps + finalizationSteps;
      const progressIncrement = 100 / totalSteps;
      const projectDescription = `${projectName} is an innovative solution designed for ${industry || 'your industry'}.`;
      const initialContent = `# ${projectName}\n\n${projectDescription}\n\n*Generating content...*`;
      setGeneratedContentPreview(initialContent);
      setPhaseData({ currentPhase: 'researching', phaseProgress: 0 });
      setGenerationStatusText('Researching market and competitive landscape...');
      const researchResult = await contentGenerationService.generateResearch(projectId);
      if (!researchResult || researchResult.content.startsWith('Error:')) throw new Error(researchResult?.content || 'Research step failed.');
      setGenerationProgress(Math.round(progressIncrement * researchSteps));
      setPhaseData({ currentPhase: 'researching', phaseProgress: 100 });
      setGenerationStatusText('Generating comprehensive content...');
      setPhaseData({ currentPhase: 'content', phaseProgress: 0, currentSlide: 0, totalSlides: slideStructure?.length || 14 });
      const contentResult = await contentGenerationService.generateFullContent(projectId, researchResult.content);
      if (!contentResult || contentResult.content.startsWith('Error:')) throw new Error(contentResult?.content || 'Content generation failed.');
      setGenerationProgress(Math.round(progressIncrement * (researchSteps + contentGenerationSteps)));
      const cleanedContent = contentResult.content.replace(/Slide\s+\d+[:.]/gi, '').replace(/^#\s*Slide\s+\d+[:.]/gim, '#');
      const contentBlocks = cleanedContent.split(/\n\n+/).filter(block => block.trim().length > 0);
      let accumulatedContent = '';
      for (let i = 0; i < contentBlocks.length; i++) {
        const blockProgress = Math.round((i + 1) / contentBlocks.length * 100);
        setPhaseData({ currentPhase: 'content', phaseProgress: blockProgress, currentSlide: Math.ceil(blockProgress / 100 * (slideStructure?.length || 14)), totalSlides: slideStructure?.length || 14 });
        accumulatedContent += (i > 0 ? '\n\n' : '') + contentBlocks[i];
        setGeneratedContentPreview(accumulatedContent);
        await new Promise(resolve => setTimeout(resolve, options.typingSpeed * 5));
      }
      setGenerationStatusText('Finalizing presentation...');
      setPhaseData({ currentPhase: 'finalizing', phaseProgress: 0 });
      await new Promise(resolve => setTimeout(resolve, 300));
      setGenerationProgress(100);
      setPhaseData({ currentPhase: 'finalizing', phaseProgress: 100 });
      setGenerationStatusText('Generation complete!');
      finalizeGeneratedContent(contentResult.content);
    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage = `Error during generation: ${error instanceof Error ? error.message : String(error)}`;
      setGeneratedContentPreview(errorMessage); setGenerationStatusText('Generation Failed!'); setGenerationProgress(0); setIsGenerating(false);
      finalizeGeneratedContent(errorMessage);
    }
  };
  // --- END: Integrated Generation Logic ---

  // Log projectId value just before rendering Step 4
  if (currentStep === 4) {
    console.log(`PitchDeckLayout Render (Step 4): projectId from store = ${projectId}`);
  }

  // The JSX structure remains largely the same, just wrapped in PitchDeckLayout
  return (
    <Card className="project-area-container shadow-md border border-neutral-light">
       {/* Project Title Header - This might also move upstream depending on design */}
       <div className="p-4 border-b border-neutral-light/40 bg-gradient-to-r from-neutral-light/10 to-transparent">
         <h1 className="text-2xl font-bold font-heading text-secondary truncate">
           {projectName && projectName.trim() !== "" ? projectName : "Untitled Project"}
         </h1>
         <p className="text-sm text-neutral-dark font-medium">
           Category: Proposal & Pitch Deck Generation
         </p>
       </div>

       {/* Step 1 Content - Consider if Step 1 belongs here or upstream */}
       {currentStep === 1 && (
         <>
           <div className="p-4 border-b border-neutral-light/40 bg-white/5">
             <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 1: Project Setup</h2>
             <p className="text-sm text-neutral-medium mt-1">Define the basics of your new project and choose a starting point.</p>
           </div>
           <div className="p-2 md:p-4 space-y-8">
             <PitchDeckTypeGrid selectedTypeId={selectedPitchDeckTypeId} onSelectType={handleSelectType} />
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
             <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 2: Requirements Gathering</h2>
             <p className="text-sm text-neutral-medium mt-1">Provide details about your audience, product, objectives, and more.</p>
           </div>

           <div className="p-4 md:p-6 space-y-6">
             <ProjectDetailsForm />
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
              <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 3: Design & Structure Configuration</h2>
              <p className="text-sm text-neutral-medium mt-1">Select a template, customize branding, and plan the structure.</p>
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
             <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 4: AI-Powered Content Generation</h2>
             <p className="text-sm text-neutral-medium mt-1">Configure and initiate AI content generation.</p>
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
               <Button 
                 variant="outline" 
                 onClick={() => setCurrentStep(3)} 
                 className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"
                 disabled={isGenerating} // Disable back button while generating
               >
                 Back to Design
               </Button>
               <Button
                 variant="primary"
                 className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"
                 onClick={handleContinueFromStep4}
                 disabled={isGenerating || !generatedContentPreview} // Enable only when generation is complete
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
             <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 5: Advanced Editing & Enhancement</h2>
             <p className="text-sm text-neutral-medium mt-1">Refine generated content, enhance visuals, and collaborate.</p>
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
               {/* Right Sidebar: Quality Dashboard */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="sticky top-[80px] space-y-6">
                     {/* Enhancement tools commented out
                     <EnhancementTools
                        editorContent={editorContent}
                        onContentChange={setEditorContent}
                     />
                     */}
                     {/*<Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative">
                        <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Quality Dashboard</h4>
                        <div className="space-y-4">
                           <div>
                              <span className="text-sm font-medium text-neutral-dark">Refinement Recommendations</span>
                              <p className="text-xs text-neutral-medium mt-1">AI-powered suggestions to improve your content.</p>
                           </div>
                           <div>
                              <span className="text-sm font-medium text-neutral-dark">Content Validation</span>
                              <p className="text-xs text-neutral-medium mt-1">Verify facts and ensure quality standards.</p>
                           </div>
                        </div>
                     </Card>*/}
                     {/* <QualityDashboard
                       metrics={qualityMetrics}
                       isLoading={isLoadingQA}
                     /> */}
                     <div className="space-y-6">
                       <ComprehensiveQAPanel /> {/* Render the new component here */}
                     {/*<RefinementPanel
                      suggestions={refinementSuggestions}
                      onImplement={handleImplementSuggestion}
                      onCompare={handleCompareSuggestion}
                      onPolish={handleRunFinalPolish}
                      isLoading={isLoadingQA}
                   />*/}
                   {/* <ValidationInterface
                      onVerifyFacts={handleRunFactCheck}
                      onCheckCompliance={handleRunComplianceCheck}
                      onValidateFinancials={handleRunFinancialValidation}
                      onCheckLanguage={handleRunLanguageCheck}
                      factCheckResults={factCheckResults}
                      complianceStatus={complianceStatus}
                      financialValidationStatus={financialValidationStatus}
                      languageCheckStatus={languageCheckStatus}
                      isLoading={isLoadingQA}
                   /> */}
                   
                </div>
                     {/* VisualElementStudio removed */}
                     {/* CollaborationTools removed */}
                  </div>
               </div>
              <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(4)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto">
                  Back to Generation
                </Button>
                {/*<Button
                  variant="primary"
                  className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"
                  onClick={handleContinueFromStep5}
                >
                  Continue to QA & Refinement
                 </Button>*/}
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

         {/* Step 6 Content 
         {currentStep === 6 && (
           <>
             <div className="p-4 border-b border-neutral-light/40 bg-white/5">
               <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 6: Quality Assurance & Refinement</h2>
               <p className="text-sm text-neutral-medium mt-1">Validate content, check compliance, assess impact, and refine.</p>
             </div>
             <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Validation & Refinement 
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
                </div>*/}
                {/* Right Column: Dashboard
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
         )}*/}

         {/* Step 7 Content */}
         {currentStep === 7 && (
           <>
             <div className="p-4 border-b border-neutral-light/40 bg-white/5">
               <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 6: Finalization & Delivery</h2>
               <p className="text-sm text-neutral-medium mt-1">Prepare for presentation, export, share, and archive.</p>
             </div>
              <div className="p-4 md:p-6 space-y-6">
                 {/* Presenter Tools - Not production ready yet
                 <PresenterTools />
                 */}
                 <ExportConfiguration
                    isGeneratingClientPdf={isGeneratingClientPdf}
                    clientPdfStatus={clientPdfStatus}
                 />
                 {/* Sharing Permissions - Not production ready yet
                 <SharingPermissions />
                 */}
                 {/* Archiving Analytics - Not production ready yet
                 <ArchivingAnalytics />
                 */}
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

// Update export
export default PitchDeckLayout;
