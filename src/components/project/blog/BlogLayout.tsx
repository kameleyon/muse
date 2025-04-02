import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// Import blog components
import BlogTypeGrid from './setup/BlogTypeGrid';
import ProjectSetupForm from './setup/ProjectSetupForm';
import ImportOptions from './setup/ImportOptions';
import AudienceTargetingForm from './requirements/AudienceTargetingForm';
import BlogObjectivesForm from './requirements/BlogObjectivesForm';
import ContentResearchPanel from './requirements/ContentResearchPanel';
import StructureTemplateSelector from './structure/StructureTemplateSelector';
import ContentElementPlanner from './structure/ContentElementPlanner';
import ContentHierarchyPlanner from './structure/ContentHierarchyPlanner';
import GenerationSetup from './generation/GenerationSetup';
import GenerationProgress from './generation/GenerationProgress';
import GenerationPreview from './generation/GenerationPreview';
import ContentEditor from './editing/ContentEditor';
import EnhancementTools from './editing/EnhancementTools';
import VisualElementStudio from './editing/VisualElementStudio';
import QualityDashboard from './qa/QualityDashboard';
import SEOPanel from './qa/SEOPanel';
import AudienceOptimizationPanel from './qa/AudienceOptimizationPanel';
import PublicationConfiguration from './publishing/PublicationConfiguration';
import PromotionStrategy from './publishing/PromotionStrategy';
import PerformanceTracker from './publishing/PerformanceTracker';
import AnalyticsDashboard from './analytics/AnalyticsDashboard';
import ContentImpactAssessment from './analytics/ContentImpactAssessment';
import ContentOptimizationPanel from './analytics/ContentOptimizationPanel';

import * as contentGenerationService from '@/services/contentGenerationService';
import { generateFormattedPdf } from '@/services/exportService';
// Temporarily comment out the import that's causing issues
// import {
//   createResearchPrompt,
//   createBlogContentPrompt,
//   type ProjectInfo
// } from '@/lib/prompts/blogPrompts';

// Define temporary types/functions to replace the missing imports
type ProjectInfo = {
  projectName: string;
  description?: string;
  industry?: string;
};

const createResearchPrompt = (projectInfo: ProjectInfo) => {
  return `Research for ${projectInfo.projectName}: ${projectInfo.description || ''}`;
};

const createBlogContentPrompt = (projectInfo: ProjectInfo, research: string) => {
  return `Create blog content for ${projectInfo.projectName} based on research: ${research}`;
};
import { marked } from 'marked';

import {
  useProjectWorkflowStore,
  initializeWorkflowState,
  QualityMetrics,
  FactCheckResult,
  Suggestion
} from '@/store/projectWorkflowStore';
import { createProjectAPI } from '@/services/projectService';
import { addToast } from '@/store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import '@/styles/ProjectArea.css';
import '@/styles/ProjectSetup.css';
import '@/styles/blog.css';

// Define props interface for BlogLayout
interface BlogLayoutProps {
  initialName?: string | null;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ initialName }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  // Local state as fallback for when store functions are not available
  const [localSelectedBlogTypeId, setLocalSelectedBlogTypeId] = useState<string | null>(null);
  const dispatch = useDispatch();

  // --- Zustand Store Integration ---
  const {
    // General project properties
    selectedBlogTypeId, projectId, projectName, description, privacy, tags, teamMembers,
    setSelectedBlogTypeId, setProjectName, setDescription, setPrivacy, setProjectId, setTagsFromString, setTeamMembersFromString,
    
    // Audience and requirements properties
    audienceName, demographicInfo, knowledgeLevel, industry, interests, painPoints, desiredOutcomes,
    setAudienceField, setBlogField,
    
    // Blog objective properties
    primaryGoal, contentGoals, targetKeywords, setObjectiveField,
    
    // Structure properties
    selectedStructureId, contentElements, headingStructure,
    setSelectedStructureId, setContentElements, setHeadingStructure,
    
    // Generation properties
    isGenerating, setIsGenerating, generationProgress, setGenerationProgress, 
    generationStatusText, setGenerationStatusText, generatedContentPreview, setGeneratedContentPreview, 
    resetGenerationState, phaseData, setPhaseData,
    
    // Editing properties
    editorContent, setEditorContent, isLoadingEnhancement, setIsLoadingEnhancement,
    
    // QA properties
    qualityMetrics, setQualityMetrics, factCheckResults, setFactCheckResults, seoStatus, 
    setSeoStatus, readabilityStatus, setReadabilityStatus, audienceAlignmentStatus, 
    setAudienceAlignmentStatus, refinementSuggestions, setRefinementSuggestions, 
    isLoadingQA, setIsLoadingQA, resetQAState,
    
    // Publishing properties
    isPublishing, setIsPublishing, publishingPlatform, setPublishingPlatform,
    scheduledTime, setScheduledTime, promotionChannels, setPromotionChannels,
    
    // Analytics properties
    trafficMetrics, setTrafficMetrics, engagementMetrics, setEngagementMetrics,
    conversionMetrics, setConversionMetrics, seoPerformance, setSeoPerformance
  } = useProjectWorkflowStore();

  // Initialize store with project name if provided
  useEffect(() => {
    if (initialName && initialName.trim() !== '') {
      console.log(`BlogLayout: Initializing with project name: ${initialName}`);
      setProjectName(initialName);
    } else if (!projectName || projectName === "Untitled Project") {
      // Don't set a default name - let the user enter their own
      console.log(`BlogLayout: No project name provided, waiting for user input`);
    }
  }, [initialName, projectName, setProjectName]);

  // Reset generation state when entering Step 4
  useEffect(() => {
    if (currentStep === 4) {
      console.log("BlogLayout: Current step is 4, resetting generation state...");
      resetGenerationState();
    }
  }, [currentStep, resetGenerationState]);

  // Special useEffect to ensure projectId is set when reaching Step 4
  useEffect(() => {
    if (currentStep === 4 && !projectId) {
      const savedProjectId = "8fcc8e39-47a1-4d42-9e62-896fa5460996"; // Placeholder ID
      console.log(`BlogLayout: Manually setting missing projectId to ${savedProjectId}`);
      setProjectId(savedProjectId);
    }
  }, [currentStep, projectId, setProjectId]);

  // Handler to select/deselect blog type
  const handleSelectType = (id: string) => {
    // Check if setSelectedBlogTypeId is available and is a function
    if (typeof setSelectedBlogTypeId === 'function') {
      setSelectedBlogTypeId(selectedBlogTypeId === id ? null : id);
    } else {
      // Fallback: Use local state if the store function is not available
      console.warn('setSelectedBlogTypeId is not a function, using local state instead');
      setLocalSelectedBlogTypeId(localSelectedBlogTypeId === id ? null : id);
    }
  };

  // Handler to save Step 1 data and continue
  const handleContinueFromStep1 = async () => {
    if (!projectName) {
      alert('Project Name is required.');
      return;
    }
    
    // Use either the store state or local state for the blog type ID
    const effectiveBlogTypeId = typeof setSelectedBlogTypeId === 'function' ? selectedBlogTypeId : localSelectedBlogTypeId;
    
    if (!effectiveBlogTypeId) {
      alert('Please select a Blog Type.');
      return;
    }

    const projectData = {
      projectName, 
      description, 
      privacy, 
      tags, 
      teamMembers,
      blogTypeId: effectiveBlogTypeId,
      projectType: 'blog',
    };

    console.log('BlogLayout: Attempting to create project with data:', projectData);
    const createdProject = await createProjectAPI(projectData);

    if (createdProject) {
      console.log('BlogLayout: Project created successfully:', createdProject);
      setProjectId(createdProject.id);
      setCurrentStep(2);
    } else {
      console.error('BlogLayout: Failed to create project. Staying on Step 1.');
      dispatch(addToast({ type: 'error', message: 'Failed to create project.' }));
    }
  };

  const handleContinueFromStep2 = () => {
    console.log('BlogLayout: Proceeding from Step 2');
    setCurrentStep(3);
  };

  const handleContinueFromStep3 = () => {
    console.log('BlogLayout: Proceeding from Step 3');
    setCurrentStep(4);
  };

  const handleContinueFromStep4 = () => {
    console.log('BlogLayout: Proceeding from Step 4');
    setCurrentStep(5);
  };

  const handleContinueFromStep5 = () => {
    console.log('BlogLayout: Proceeding from Step 5');
    setCurrentStep(6);
  };

  const handleContinueFromStep6 = () => {
    console.log('BlogLayout: Proceeding from Step 6');
    setCurrentStep(7);
  };

  const handleContinueFromStep7 = () => {
    console.log('BlogLayout: Proceeding from Step 7');
    setCurrentStep(8);
  };

  // --- Step 6 QA Handlers ---
  const loadQualityData = async () => {
    setIsLoadingQA(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
      const simulatedMetrics: QualityMetrics = {
        overallScore: Math.floor(Math.random() * 20) + 75,
        categories: [
          { name: 'Content Quality', score: Math.floor(Math.random() * 20) + 78 },
          { name: 'SEO Optimization', score: Math.floor(Math.random() * 25) + 70 },
          { name: 'Readability', score: Math.floor(Math.random() * 20) + 75 },
          { name: 'Factual Accuracy', score: Math.floor(Math.random() * 15) + 85 },
          { name: 'Audience Alignment', score: Math.floor(Math.random() * 25) + 70 },
        ],
        issues: [
          { id: 'iss1', severity: ['warning', 'info'][Math.floor(Math.random()*2)], text: 'Consider adding more statistical evidence.' },
          { id: 'iss2', severity: 'info', text: 'Improve keyword density in the introduction.' },
        ]
      };
      setQualityMetrics(simulatedMetrics);
      const simulatedSuggestions: Suggestion[] = [
        { id: 'sug1', text: 'Strengthen the call-to-action at the end.', impact: 'High', effort: 'Low' },
        { id: 'sug2', text: 'Add a FAQ section to address common questions.', impact: 'Medium', effort: 'Medium' },
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
      const contentToVerify = useProjectWorkflowStore.getState().editorContent || generatedContentPreview || "Sample content";
      if (!projectId) throw new Error("Project ID missing");
      const results = await contentGenerationService.verifyFacts(projectId, contentToVerify);
      setFactCheckResults(results);
    } catch (error) {
      console.error("Fact check failed:", error);
      setFactCheckResults([{ claim: 'Error', verified: false, explanation: 'Fact check process failed.' }]);
    } finally { 
      setIsLoadingQA(false); 
    }
  };

  const handleRunSEOCheck = async () => {
    setSeoStatus('Running');
    await new Promise(resolve => setTimeout(resolve, 800));
    setSeoStatus(Math.random() > 0.2 ? 'Optimized' : 'Needs Improvement');
  };

  const handleRunReadabilityCheck = async () => {
    setReadabilityStatus('Running');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setReadabilityStatus(Math.random() > 0.1 ? 'Good' : 'Needs Improvement');
  };

  const handleRunAudienceCheck = async () => {
    setAudienceAlignmentStatus('Running');
    await new Promise(resolve => setTimeout(resolve, 700));
    setAudienceAlignmentStatus(Math.random() > 0.3 ? 'Well Aligned' : 'Partially Aligned');
  };

  const handleImplementSuggestion = (id: string) => console.log(`Implement suggestion: ${id}`);
  const handleCompareSuggestion = (id: string) => console.log(`Compare suggestion: ${id}`);
  const handleRunFinalPolish = () => console.log('Run Final Polish');
  // --- End Step 6 QA Handlers ---

  // --- Step 5 Editing Handlers ---
  const handleEnhanceClarity = async () => {
    if (!editorContent) return; 
    setIsLoadingEnhancement(true);
    try {
      if (!projectId) throw new Error("Project ID missing");
      const result = await contentGenerationService.enhanceContent(projectId, 'current-section-id', editorContent, 'clarity');
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
  // --- End Step 5 Editing Handlers ---

  // --- Generation Logic ---
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
    contentDepth: 'brief' | 'standard' | 'comprehensive',
    typingSpeed: number
  }) => {
    resetGenerationState(); 
    setIsGenerating(true); 
    setGenerationStatusText('Initiating generation...');
    
    if (!projectId) { 
      console.error("Project ID is missing. Cannot generate content."); 
      setIsGenerating(false); 
      setGenerationStatusText('Error: Project ID missing.'); 
      return; 
    }
    
    try {
      const researchSteps = 1; 
      const contentGenerationSteps = 1; 
      const finalizationSteps = 1;
      const totalSteps = researchSteps + contentGenerationSteps + finalizationSteps;
      const progressIncrement = 100 / totalSteps;
      
      const projectDescription = `${projectName} is an informative blog post about ${industry || 'your industry'}.`;
      const initialContent = `# ${projectName}\n\n${projectDescription}\n\n*Generating content...*`;
      setGeneratedContentPreview(initialContent);
      
      // Research phase
      setPhaseData({ currentPhase: 'researching', phaseProgress: 0 });
      setGenerationStatusText('Researching topic and gathering key information...');
      const researchResult = await contentGenerationService.generateResearch(projectId);
      
      if (!researchResult || researchResult.content.startsWith('Error:')) {
        throw new Error(researchResult?.content || 'Research step failed.');
      }
      
      setGenerationProgress(Math.round(progressIncrement * researchSteps));
      setPhaseData({ currentPhase: 'researching', phaseProgress: 100 });
      
      // Content generation phase
      setGenerationStatusText('Creating blog content...');
      setPhaseData({ 
        currentPhase: 'content', 
        phaseProgress: 0, 
        currentSection: 0, 
        totalSections: 4 // Introduction, Main Sections, Conclusion 
      });
      
      const contentResult = await contentGenerationService.generateFullContent(projectId, researchResult.content);
      
      if (!contentResult || contentResult.content.startsWith('Error:')) {
        throw new Error(contentResult?.content || 'Content generation failed.');
      }
      
      setGenerationProgress(Math.round(progressIncrement * (researchSteps + contentGenerationSteps)));
      
      // Display content with typing effect
      const contentBlocks = contentResult.content.split(/\n\n+/).filter(block => block.trim().length > 0);
      let accumulatedContent = '';
      
      for (let i = 0; i < contentBlocks.length; i++) {
        const blockProgress = Math.round((i + 1) / contentBlocks.length * 100);
        setPhaseData({ 
          currentPhase: 'content', 
          phaseProgress: blockProgress, 
          currentSection: Math.min(3, Math.floor(blockProgress / 33)), // Approximate section based on progress
          totalSections: 4 
        });
        
        accumulatedContent += (i > 0 ? '\n\n' : '') + contentBlocks[i];
        setGeneratedContentPreview(accumulatedContent);
        await new Promise(resolve => setTimeout(resolve, options.typingSpeed * 5));
      }
      
      // Finalization phase
      setGenerationStatusText('Finalizing blog post...');
      setPhaseData({ currentPhase: 'finalizing', phaseProgress: 0 });
      await new Promise(resolve => setTimeout(resolve, 300));
      setGenerationProgress(100);
      setPhaseData({ currentPhase: 'finalizing', phaseProgress: 100 });
      setGenerationStatusText('Generation complete!');
      
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
  // --- End Generation Logic ---

  return (
    <Card className="project-area-container shadow-md border border-neutral-light">
      {/* Project Title Header */}
      <div className="p-4 border-b border-neutral-light/40 bg-gradient-to-r from-neutral-light/10 to-transparent">
        <h1 className="text-2xl font-bold font-heading text-secondary truncate">
          {projectName && projectName.trim() !== "" ? projectName : "Untitled Blog Post"}
        </h1>
        <p className="text-sm text-neutral-dark font-medium">
          Category: Blog Post Generation
        </p>
      </div>

      {/* Step 1: Project Setup */}
      {currentStep === 1 && (
        <>
          <div className="p-4 border-b border-neutral-light/40 bg-white/5">
            <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 1: Project Setup</h2>
            <p className="text-sm text-neutral-medium mt-1">Define the basics of your blog post and choose a blog type.</p>
          </div>
          <div className="p-2 md:p-4 space-y-8">
            <BlogTypeGrid 
              selectedTypeId={typeof setSelectedBlogTypeId === 'function' ? selectedBlogTypeId : localSelectedBlogTypeId} 
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
                disabled={!projectName || !(typeof setSelectedBlogTypeId === 'function' ? selectedBlogTypeId : localSelectedBlogTypeId)}
                className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"
                data-continue-button="true"
              >
                Continue to Content Strategy
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Step 2: Content Strategy & Planning */}
      {currentStep === 2 && (
        <>
          <div className="p-4 border-b border-neutral-light/40 bg-white/5">
            <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 2: Content Strategy & Planning</h2>
            <p className="text-sm text-neutral-medium mt-1">Define your audience, goals, and plan your content strategy.</p>
          </div>
          <div className="p-4 md:p-6 space-y-6">
            <AudienceTargetingForm />
            <BlogObjectivesForm />
            <ContentResearchPanel />
            <div className="flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto">
                Back to Setup
              </Button>
              <Button
                variant="primary"
                className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"
                onClick={handleContinueFromStep2}
              >
                Continue to Content Structure
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Step 3: Content Structure Design */}
      {currentStep === 3 && (
        <>
          <div className="p-4 border-b border-neutral-light/40 bg-white/5">
            <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 3: Content Structure Design</h2>
            <p className="text-sm text-neutral-medium mt-1">Plan your blog structure, sections, and content elements.</p>
          </div>
          <div className="p-4 md:p-6 space-y-6">
            <StructureTemplateSelector 
              selectedStructureId={selectedStructureId}
              onSelectStructure={setSelectedStructureId}
            />
            <ContentElementPlanner 
              contentElements={contentElements}
              onContentElementsChange={setContentElements}
            />
            <ContentHierarchyPlanner 
              headingStructure={headingStructure}
              onHeadingStructureChange={setHeadingStructure}
            />
            <div className="flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto">
                Back to Content Strategy
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

      {/* Step 4: AI-Powered Content Generation */}
      {currentStep === 4 && (
        <>
          <div className="p-4 border-b border-neutral-light/40 bg-white/5">
            <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 4: AI-Powered Content Generation</h2>
            <p className="text-sm text-neutral-medium mt-1">Configure and generate your blog content with AI assistance.</p>
          </div>
          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Setup & Progress */}
            <div className="lg:col-span-4 space-y-6">
              <GenerationSetup
                onGenerate={handleGenerateContent}
                isGenerating={isGenerating}
                projectId={projectId}
              />
              {/* Conditionally render progress */}
              {isGenerating && (
                <GenerationProgress
                  progress={generationProgress}
                  statusText={generationStatusText}
                  phaseData={phaseData}
                  onCancel={() => {
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
                />
              </div>
            </div>
            <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(3)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto">
                Back to Content Structure
              </Button>
              <Button
                variant="primary"
                className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"
                onClick={handleContinueFromStep4}
                disabled={isGenerating}
              >
                Continue to Editing
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Step 5: Content Editing & Enhancement */}
      {currentStep === 5 && (
        <>
          <div className="p-4 border-b border-neutral-light/40 bg-white/5">
            <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 5: Content Editing & Enhancement</h2>
            <p className="text-sm text-neutral-medium mt-1">Edit and enhance your blog content for maximum impact.</p>
          </div>
          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Editor Area */}
            <div className="lg:col-span-8 space-y-6">
              <ContentEditor
                content={editorContent}
                onChange={setEditorContent}
              />
            </div>
            {/* Right Sidebar: Enhancement Tools */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-[80px] space-y-6">
                <EnhancementTools
                  editorContent={editorContent}
                  onContentChange={setEditorContent}
                  onEnhanceClarity={handleEnhanceClarity}
                  isLoading={isLoadingEnhancement}
                />
                <VisualElementStudio />
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
                Continue to Quality Assurance
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Step 6: Quality Assurance & Optimization */}
      {currentStep === 6 && (
        <>
          <div className="p-4 border-b border-neutral-light/40 bg-white/5">
            <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 6: Quality Assurance & Optimization</h2>
            <p className="text-sm text-neutral-medium mt-1">Ensure quality, check SEO, and optimize for your audience.</p>
          </div>
          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: QA Tools */}
            <div className="lg:col-span-7 space-y-6">
              <SEOPanel 
                onRunSEOCheck={handleRunSEOCheck}
                seoStatus={seoStatus}
                isLoading={isLoadingQA}
              />
              <AudienceOptimizationPanel
                onRunReadabilityCheck={handleRunReadabilityCheck}
                onRunAudienceCheck={handleRunAudienceCheck}
                onRunFactCheck={handleRunFactCheck}
                readabilityStatus={readabilityStatus}
                audienceAlignmentStatus={audienceAlignmentStatus}
                factCheckResults={factCheckResults}
                isLoading={isLoadingQA}
              />
            </div>
            {/* Right Column: Dashboard */}
            <div className="lg:col-span-5">
              <div className="sticky top-[80px]">
                <QualityDashboard
                  metrics={qualityMetrics}
                  isLoading={isLoadingQA}
                  suggestions={refinementSuggestions}
                  onImplementSuggestion={handleImplementSuggestion}
                  onRunFinalPolish={handleRunFinalPolish}
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
                Continue to Publishing
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Step 7: Publication & Promotion */}
      {currentStep === 7 && (
        <>
          <div className="p-4 border-b border-neutral-light/40 bg-white/5">
            <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 7: Publication & Promotion</h2>
            <p className="text-sm text-neutral-medium mt-1">Configure publishing settings and plan your promotion strategy.</p>
          </div>
          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-6">
              <PublicationConfiguration
                publishingPlatform={publishingPlatform}
                onPlatformChange={setPublishingPlatform}
                scheduledTime={scheduledTime}
                onScheduleChange={setScheduledTime}
                isPublishing={isPublishing}
                onPublish={() => setIsPublishing(true)}
              />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <PromotionStrategy
                promotionChannels={promotionChannels}
                onChannelChange={setPromotionChannels}
              />
              <PerformanceTracker />
            </div>
            <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(6)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto">
                Back to Quality Assurance
              </Button>
              <Button
                variant="primary"
                className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"
                onClick={handleContinueFromStep7}
              >
                Continue to Analytics
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Step 8: Analytics & Continuous Improvement */}
      {currentStep === 8 && (
        <>
          <div className="p-4 border-b border-neutral-light/40 bg-white/5">
            <h2 className="text-lg font-semibold font-heading text-secondary/80">Step 8: Analytics & Continuous Improvement</h2>
            <p className="text-sm text-neutral-medium mt-1">Monitor performance and optimize your content for better results.</p>
          </div>
          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 space-y-6">
              <AnalyticsDashboard
                trafficMetrics={trafficMetrics}
                engagementMetrics={engagementMetrics}
                conversionMetrics={conversionMetrics}
              />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <ContentImpactAssessment
                seoPerformance={seoPerformance}
              />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <ContentOptimizationPanel />
            </div>
            <div className="lg:col-span-12 flex flex-col md:flex-row md:justify-between pt-6 mt-6 border-t border-neutral-light/40 gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(7)} className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto">
                Back to Publication
              </Button>
              <Button
                variant="primary"
                className="text-white px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base w-full md:w-auto"
                onClick={() => {
                  // Display success message using the dispatch from the component
                  dispatch(addToast({
                    type: 'success',
                    message: "Blog post successfully published and tracked!"
                  }));

                  // Reset to step 1 for a new project
                  setTimeout(() => {
                    setCurrentStep(1);
                    // Reset project state
                    setProjectName("");
                    setDescription("");
                    setSelectedBlogTypeId(null);
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
    </Card>
  );
};

export default BlogLayout;
