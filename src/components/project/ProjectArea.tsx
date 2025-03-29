import React, { useState, useEffect } from 'react'; // Import useEffect
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
import ArchivingAnalytics from './delivery/ArchivingAnalytics';
import * as contentGenerationService from '@/services/contentGenerationService';
import { createResearchPrompt, createPitchDeckContentPrompt } from '@/lib/prompts/pitchDeckPrompts'; // Import prompt functions
import ReactDOMServer from 'react-dom/server'; // Import for rendering component to string
import html2pdf from 'html2pdf.js'; // Import html2pdf
import { marked } from 'marked'; // Import marked for Markdown -> HTML conversion
import { MarkdownContent } from '@/lib/markdown'; // Re-add import for PDF generation
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

  // --- State for Step 3 ---
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [brandLogo, setBrandLogo] = useState<string | null>(null); // URL or data URI
  const [primaryColor, setPrimaryColor] = useState<string>('#ae5630'); // Default primary
  const [secondaryColor, setSecondaryColor] = useState<string>('#232321'); // Default secondary
  const [accentColor, setAccentColor] = useState<string>('#9d4e2c'); // Default accent
  const [headingFont, setHeadingFont] = useState<string>('Comfortaa'); // Default heading
  const [bodyFont, setBodyFont] = useState<string>('Questrial'); // Default body
  const [slideStructure, setSlideStructure] = useState([ // Default structure
      { id: 's1', title: 'Cover/Title' },
      { id: 's2', title: 'Problem/Opportunity' },
      { id: 's3', title: 'Solution Overview' },
      { id: 's4', title: 'Call to Action' },
  ]);
  const [complexityLevel, setComplexityLevel] = useState<number>(50); // Default complexity
  // --- End State for Step 3 ---

  // --- State for Step 4 ---
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0); // Add progress state
  const [generationStatusText, setGenerationStatusText] = useState<string>(''); // Add status text state
  const [generatedContentPreview, setGeneratedContentPreview] = useState<string>('');
  // --- End State for Step 4 ---

  // --- State for Step 6 ---
  // Define types based on service placeholders (or import if defined elsewhere)
  type QualityMetrics = { overallScore: number; categories: { name: string; score: number }[]; issues: { id: string; severity: string; text: string }[]; };
  type FactCheckResult = { claim: string; verified: boolean; source?: string; explanation?: string; };
  type Suggestion = { id: string; text: string; impact: string; effort: string; };

  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  const [factCheckResults, setFactCheckResults] = useState<FactCheckResult[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<'Not Run' | 'Running' | 'Passed' | 'Issues Found'>('Not Run');
  const [financialValidationStatus, setFinancialValidationStatus] = useState<'Not Run' | 'Running' | 'Passed' | 'Issues Found'>('Not Run');
  const [languageCheckStatus, setLanguageCheckStatus] = useState<'Not Run' | 'Running' | 'Passed' | 'Issues Found'>('Not Run');
  const [refinementSuggestions, setRefinementSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingQA, setIsLoadingQA] = useState<boolean>(false);
  // --- End State for Step 6 ---

  // --- State for Step 5 ---
  const [editorContent, setEditorContent] = useState<string>(''); // Content for the rich text editor
  const [isLoadingEnhancement, setIsLoadingEnhancement] = useState<boolean>(false); // Loading state for enhancements
  // --- End State for Step 5 ---
  
  // --- State for Client-Side PDF Export ---
  const [isGeneratingClientPdf, setIsGeneratingClientPdf] = useState<boolean>(false);
  const [clientPdfStatus, setClientPdfStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  // --- End State for Client-Side PDF Export ---

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

  // --- Step 6 Handlers ---
  const loadQualityData = async () => {
     setIsLoadingQA(true);
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
       setQualityMetrics(simulatedMetrics);

       // Simulate fetching suggestions (replace with actual service call later)
       // const suggestions = await contentGenerationService.getRefinementSuggestions('temp-project-id');
       const simulatedSuggestions: Suggestion[] = [
         { id: 'sug1', text: 'Refine value proposition for clarity.', impact: 'High', effort: 'Medium' },
         { id: 'sug2', text: 'Add competitor comparison chart.', impact: 'Medium', effort: 'High' },
       ];
       setRefinementSuggestions(simulatedSuggestions);

     } catch (error) {
        console.error("Failed to load QA data:", error);
        // Handle error state if needed
     } finally {
        setIsLoadingQA(false);
     }
  };

  // Add useEffect to load QA data when entering Step 6
  useEffect(() => {
    if (currentStep === 6) {
      loadQualityData();
      // Reset statuses on re-entering step
      setFactCheckResults([]);
      setComplianceStatus('Not Run');
      setFinancialValidationStatus('Not Run');
      setLanguageCheckStatus('Not Run');
    }
  }, [currentStep]);


  const handleRunFactCheck = async () => {
     setFactCheckResults([]); // Clear previous
     setIsLoadingQA(true); // Use general QA loading state
     try {
        // TODO: Get actual content from Step 5 editor state
        const contentToVerify = generatedContentPreview || "Sample content with claim: Market size is $10B.";
        const results = await contentGenerationService.verifyFacts('temp-project-id', contentToVerify);
        setFactCheckResults(results);
     } catch (error) {
        console.error("Fact check failed:", error);
        setFactCheckResults([{ claim: 'Error', verified: false, explanation: 'Fact check process failed.' }]);
     } finally {
        setIsLoadingQA(false);
     }
  };
  
  // Add similar handlers for handleCheckCompliance, handleValidateFinancials, handleCheckLanguage
  // These would likely call different backend services or AI prompts
  const handleRunComplianceCheck = async () => {
     setComplianceStatus('Running');
     await new Promise(resolve => setTimeout(resolve, 800)); // Simulate check
     setComplianceStatus(Math.random() > 0.2 ? 'Passed' : 'Issues Found'); // Simulate result
  };
   const handleRunFinancialValidation = async () => {
     setFinancialValidationStatus('Running');
     await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate check
     setFinancialValidationStatus(Math.random() > 0.1 ? 'Passed' : 'Issues Found'); // Simulate result
  };
   const handleRunLanguageCheck = async () => {
     setLanguageCheckStatus('Running');
     await new Promise(resolve => setTimeout(resolve, 700)); // Simulate check
     setLanguageCheckStatus(Math.random() > 0.3 ? 'Passed' : 'Issues Found'); // Simulate result
  };

  // Placeholder handlers for refinement actions
  const handleImplementSuggestion = (id: string) => console.log(`Implement suggestion: ${id} - (Not Implemented)`);
  const handleCompareSuggestion = (id: string) => console.log(`Compare suggestion: ${id} - (Not Implemented)`);
  const handleRunFinalPolish = () => console.log('Run Final Polish - (Not Implemented)');
  // --- End Step 6 Handlers ---

  // --- Step 5 Handlers ---
  const handleEnhanceClarity = async () => {
     if (!editorContent) return; // Don't run if no content
     setIsLoadingEnhancement(true);
     try {
        const result = await contentGenerationService.enhanceContent(
           'temp-project-id', // Replace later
           'current-section-id', // Need a way to track current section later
           editorContent,
           'clarity'
        );
        if (result.content && !result.content.startsWith('Error:')) {
           setEditorContent(result.content); // Update editor state
           // Optionally, provide feedback to the user
        } else {
           throw new Error(result.content || 'Clarity enhancement failed.');
        }
     } catch (error) {
        console.error("Clarity enhancement failed:", error);
        // Show error to user
     } finally {
        setIsLoadingEnhancement(false);
     }
  };
  // Add handlers for other enhancement buttons later
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
        filename:     `${projectName || 'magicmuse-project'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, // Increase scale for better quality
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // 3. Generate PDF
      await html2pdf().set(pdfOptions).from(htmlString).save();

      console.log("Client-side PDF generated successfully.");
      setClientPdfStatus('success');

    } catch (error) {
      console.error("Client-side PDF generation failed:", error);
      setClientPdfStatus('error');
    } finally {
      setIsGeneratingClientPdf(false);
    }
  };
  // --- End Client-Side PDF Generation Handler ---

  // --- Step 4 Handler ---
  const handleGenerateContent = async (options: { factCheckLevel: 'basic' | 'standard' | 'thorough' }) => {
    setIsGenerating(true);
    setGenerationProgress(0); // Reset progress
    setGenerationStatusText('Initiating generation...');
    setGeneratedContentPreview(''); // Clear previous preview
    
    const projectInfo = {
       projectName: projectName,
       pitchDeckType: selectedPitchDeckTypeId || 'generic',
       description: description,
       // TODO: Add data from Step 2 state here
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
      setGenerationStatusText('Researching background information...');
      setGenerationProgress(Math.round(currentProgress)); // Start progress at 0
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
      setGenerationProgress(Math.round(currentProgress));
      setGenerationStatusText(`Generating content for ${contentSteps} sections...`);
      setGeneratedContentPreview(`Research Summary:\n${researchResult.content.substring(0, 300)}...\n\n---`); // Show summary briefly

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
      setGenerationProgress(Math.round(currentProgress));
      setGenerationStatusText('Finalizing and formatting...');

      // --- Finalize ---
      // Add a small delay for "Finalizing" step before setting to 100%
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate finalization
      currentProgress += progressIncrement * finalizationSteps;
      setGenerationProgress(100); // Ensure it reaches 100
      setGenerationStatusText('Generation complete. Displaying content...');
      
      // Prepend H1 title and ensure Markdown format
      const finalMarkdownContent = `# ${projectName}\n\n${contentResult.content}`;
      
      simulateTyping(finalMarkdownContent, setGeneratedContentPreview); // Start typing effect with formatted content

    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage = `Error during generation: ${error instanceof Error ? error.message : String(error)}`;
      setGeneratedContentPreview(errorMessage);
      setGenerationStatusText('Generation Failed!');
      setGenerationProgress(0); // Reset progress on error
      setIsGenerating(false);
    }
    // setIsGenerating(false) is now handled by simulateTyping or catch block
  };

// Helper for typing effect
const simulateTyping = (text: string, setText: React.Dispatch<React.SetStateAction<string>>, speed = 0) => { // Changed default speed to 0ms
  let i = 0;
  setText('');
  const intervalId = setInterval(() => {
    if (i < text.length) {
      setText(prev => prev + text.charAt(i));
      i++;
    } else {
      clearInterval(intervalId);
      // Convert final Markdown to HTML before setting editor state
      const htmlContent = marked(text) as string; // Use marked to parse
      console.log("Generated HTML for Editor:", htmlContent); // Log the generated HTML
      setEditorContent(htmlContent);
      setIsGenerating(false);
    }
  }, speed);
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
                 size="lg" // Revert to original size prop
                 onClick={handleContinueFromStep1} // Use updated handler
                 disabled={!projectName || !selectedPitchDeckTypeId}
                 className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base" // Added responsive padding/text size
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
                 <Button variant="outline" onClick={() => setCurrentStep(1)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base"> {/* Removed size props, kept className */}
                   Back to Setup
                 </Button>
                 <Button
                   variant="primary"
                   // Removed size props
                   className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base" // Kept responsive classes
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
                     selectedTemplateId={selectedTemplateId}
                     onSelectTemplate={setSelectedTemplateId}
                  />
                  <BrandCustomization
                     logo={brandLogo}
                     onLogoChange={setBrandLogo} // Need to implement handler for file upload -> URL/DataURI
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
                        // Pass relevant state to preview
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        accentColor={accentColor}
                        headingFont={headingFont}
                        bodyFont={bodyFont}
                        slides={slideStructure} // Pass slide structure
                     />
                  </div>
               </div>
               {/* Navigation Buttons (Full Width Below Columns) */}
              <div className="lg:col-span-12 flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                 <Button variant="outline" onClick={() => setCurrentStep(2)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base"> {/* Added responsive classes */}
                   Back to Requirements
                 </Button>
                 <Button
                   variant="primary"
                   // size prop removed
                   className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base" // Added responsive classes
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
                     onGenerate={handleGenerateContent}
                     isGenerating={isGenerating}
                  />
                  {isGenerating && <GenerationProgress progress={generationProgress} statusText={generationStatusText} />}
               </div>
               {/* Right Column: Preview (2/3 width) */}
               <div className="lg:col-span-8">
                  <div className="sticky top-[80px]">
                     {/* Pass content to GenerationPreview or display directly */}
                     <GenerationPreview content={generatedContentPreview} />
                  </div>
               </div>
               {/* Navigation Buttons */}
              <div className="lg:col-span-12 flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                <Button variant="outline" onClick={() => setCurrentStep(3)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base"> {/* Added responsive classes */}
                  Back to Design
                </Button>
                <Button
                  variant="primary"
                  // size prop removed
                  className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base" // Added responsive classes
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
                      content={editorContent}
                      onChange={setEditorContent} // Re-add onChange prop
                   />
                </div>
                {/* Right Sidebar: Tools & Collaboration */}
                <div className="lg:col-span-4 space-y-6">
                   <div className="sticky top-[80px] space-y-6"> {/* Make sidebar sticky */}
                      <EnhancementTools
                         editorContent={editorContent}
                         onContentChange={setEditorContent}
                      />
                      <VisualElementStudio />
                      <CollaborationTools />
                   </div>
                </div>
                {/* Navigation Buttons */}
               <div className="lg:col-span-12 flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                 <Button variant="outline" onClick={() => setCurrentStep(4)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base"> {/* Added responsive classes */}
                   Back to Generation
                 </Button>
                 <Button
                   variant="primary"
                   // size prop removed
                   className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base" // Added responsive classes
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
                       onVerifyFacts={handleRunFactCheck}
                       onCheckCompliance={handleRunComplianceCheck}
                       onValidateFinancials={handleRunFinancialValidation}
                       onCheckLanguage={handleRunLanguageCheck}
                       factCheckResults={factCheckResults}
                       complianceStatus={complianceStatus}
                       financialValidationStatus={financialValidationStatus} // Corrected name
                       languageCheckStatus={languageCheckStatus} // Corrected name
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
                 {/* Navigation Buttons */}
                <div className="lg:col-span-12 flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                  <Button variant="outline" onClick={() => setCurrentStep(5)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base"> {/* Added responsive classes */}
                    Back to Editing
                  </Button>
                  <Button
                    variant="primary"
                    // size prop removed
                    className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base" // Added responsive classes
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
                    onGenerateClientPdf={handleGenerateClientPdf} // Pass the function
                    isGeneratingClientPdf={isGeneratingClientPdf} // Pass loading state
                    clientPdfStatus={clientPdfStatus} // Pass status state
                 />
                 <SharingPermissions />
                 <ArchivingAnalytics />
                 {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 mt-6 border-t border-neutral-light/40">
                  <Button variant="outline" onClick={() => setCurrentStep(6)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base"> {/* Added responsive classes */}
                    Back to QA
                  </Button>
                  <Button variant="primary" className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base"> {/* Added responsive classes, removed size */}
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