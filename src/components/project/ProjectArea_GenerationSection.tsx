// This file contains the content generation section for ProjectArea.tsx
// To be integrated into the ProjectArea.tsx component

const handleGenerateContent = async (options: { 
  factCheckLevel: 'basic' | 'standard' | 'thorough',
  visualsEnabled: boolean,
  contentTone: 'formal' | 'conversational' | 'persuasive',
  slideStructure: 'default' | 'comprehensive' | 'custom',
  typingSpeed: number,
  includeAllSlides: boolean
}) => {
  resetGenerationState(); // Reset store state first
  setIsGenerating(true); // Use store action
  setGenerationStatusText('Initiating generation...'); // Use store action
  
  // Get latest state from store for the prompt
  const currentStoreState = useProjectWorkflowStore.getState();
  
  // Prepare comprehensive project info object for prompts
  const projectInfo = {
    projectId: currentStoreState.projectId || 'temp-id',
    projectName: currentStoreState.projectName,
    pitchDeckType: currentStoreState.selectedPitchDeckTypeId || 'generic',
    description: currentStoreState.description,
    tags: currentStoreState.tags,
    teamMembers: currentStoreState.teamMembers,
    privacy: currentStoreState.privacy,
    
    // Step 2: Audience & Requirements Data
    audience: {
      name: currentStoreState.audienceName, 
      orgType: currentStoreState.orgType,
      industry: currentStoreState.industry,
      size: currentStoreState.size,
      personaRole: currentStoreState.personaRole,
      personaConcerns: currentStoreState.personaConcerns,
      personaCriteria: currentStoreState.personaCriteria,
      personaCommPrefs: currentStoreState.personaCommPrefs
    },
    
    // Step 3: Design & Structure Data
    design: {
      templateId: currentStoreState.selectedTemplateId,
      brandLogo: currentStoreState.brandLogo,
      primaryColor: currentStoreState.primaryColor,
      secondaryColor: currentStoreState.secondaryColor, 
      accentColor: currentStoreState.accentColor,
      headingFont: currentStoreState.headingFont,
      bodyFont: currentStoreState.bodyFont,
      complexityLevel: currentStoreState.complexityLevel
    },
    
    // Slide structure (from Step 3)
    slideStructure: currentStoreState.slideStructure || getDefaultSlideStructure(options.slideStructure),
    
    // Generation options (from Step 4)
    generationOptions: {
      factCheckLevel: options.factCheckLevel,
      visualsEnabled: options.visualsEnabled,
      contentTone: options.contentTone
    }
  };

  try {
    // Calculate dynamic steps based on selected options
    const researchSteps = 1;
    const slideCount = options.includeAllSlides && projectInfo.slideStructure ? 
      projectInfo.slideStructure.length : 
      (options.slideStructure === 'comprehensive' ? 14 : 10);
    const visualSteps = options.visualsEnabled ? Math.ceil(slideCount * 0.4) : 0; // Visuals for ~40% of slides
    const finalizationSteps = 1;
    const totalSteps = researchSteps + slideCount + visualSteps + finalizationSteps;
    const progressIncrement = 100 / totalSteps;
    let currentProgress = 0;
    
    // --- PHASE 1: Research ---
    setGenerationStatusText('Researching information...');
    setPhaseData({
      currentPhase: 'research',
      phaseProgress: 0
    });
    
    // Check for projectId before making API call
    if (!projectId) {
      throw new Error("Project ID is missing. Cannot generate content.");
    }
    
    // Create comprehensive research prompt with all available data
    const researchPrompt = createResearchPrompt(projectInfo);
    
    // Use research model with fact checking level
    const researchResult = await contentGenerationService.generateContent({
      projectId: projectId,
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
    setPhaseData({
      currentPhase: 'research',
      phaseProgress: 100
    });
    
    // Display research preview
    const researchPreview = `# Research Results\n\n${researchResult.content.substring(0, 300)}...\n\n---\n\n`;
    setGeneratedContentPreview(researchPreview);
    
    // --- PHASE 2: Content Generation (SLIDE BY SLIDE) ---
    setGenerationStatusText(`Generating content for ${slideCount} slides...`);
    setPhaseData({
      currentPhase: 'content',
      phaseProgress: 0,
      currentSlide: 1,
      totalSlides: slideCount
    });
    
    // Get slides to generate based on structure option
    const slidesToGenerate = options.includeAllSlides ? 
      projectInfo.slideStructure : 
      projectInfo.slideStructure?.slice(0, options.slideStructure === 'comprehensive' ? 14 : 10);
    
    if (!slidesToGenerate || slidesToGenerate.length === 0) {
      throw new Error("No slide structure defined for generation.");
    }
    
    // Initialize content collection
    let allGeneratedContent = '';
    const generatedSlides: string[] = [];
    
    // Generate each slide individually
    for (let i = 0; i < slidesToGenerate.length; i++) {
      const slide = slidesToGenerate[i];
      const slideIndex = i + 1;
      
      // Update progress UI for this slide
      setGenerationStatusText(`Generating slide ${slideIndex}: ${slide.title}...`);
      setPhaseData({
        currentPhase: 'content',
        phaseProgress: (i / slidesToGenerate.length) * 100,
        currentSlide: slideIndex,
        totalSlides: slidesToGenerate.length
      });
      
      // Create slide-specific prompt
      const slidePrompt = createSlideContentPrompt(
        slide,
        slideIndex,
        slidesToGenerate.length,
        projectInfo,
        researchResult.content,
        generatedSlides
      );
      
      // Generate content for this specific slide
      const slideResult = await contentGenerationService.generateContent({
        projectId: projectId,
        prompt: slidePrompt,
        useResearchModel: false,
      });
      
      if (!slideResult || slideResult.content.startsWith('Error:')) {
        throw new Error(`Failed to generate content for slide ${slideIndex}.`);
      }
      
      // Format the slide with proper heading
      let formattedSlideContent = `# ${slideIndex}. ${slide.title}\n${slideResult.content}\n\n`;
      
      // Add to collected results
      generatedSlides.push(formattedSlideContent);
      
      // Update the full content
      allGeneratedContent = `# ${projectInfo.projectName}\n${projectInfo.description ? `\n${projectInfo.description}\n` : ''}\n\n${generatedSlides.join('\n---\n\n')}`;
      
      // Update preview content with typing effect if not the last slide
      if (i < slidesToGenerate.length - 1) {
        setGeneratedContentPreview(allGeneratedContent);
      }
      
      // Update overall progress
      currentProgress = Math.floor((researchSteps + (i + 1)) / totalSteps * 100);
      setGenerationProgress(Math.min(currentProgress, 85)); // Cap at 85% until visuals/finalization
    }
    
    // --- PHASE 3: Visual Generation (if enabled) ---
    if (options.visualsEnabled && visualSteps > 0) {
      setGenerationStatusText('Creating visual elements...');
      setPhaseData({
        currentPhase: 'visuals',
        phaseProgress: 0
      });
      
      // Identify slides needing visuals (based on slide type)
      const visualSlides = slidesToGenerate.filter(slide => 
        slide.includeVisual || 
        ['market_analysis', 'competition', 'financials', 'roadmap', 'product'].some(type => 
          slide.type.includes(type)
        )
      );
      
      // Limit to the calculated number of visual steps
      const slidesForVisuals = visualSlides.slice(0, visualSteps);
      
      for (let i = 0; i < slidesForVisuals.length; i++) {
        const slide = slidesForVisuals[i];
        const slideIndex = slidesToGenerate.findIndex(s => s.id === slide.id) + 1;
        
        // Update progress
        setGenerationStatusText(`Creating visuals for slide ${slideIndex}: ${slide.title}...`);
        setPhaseData({
          currentPhase: 'visuals',
          phaseProgress: (i / slidesForVisuals.length) * 100,
          currentSlide: slideIndex,
          totalSlides: slidesToGenerate.length
        });
        
        // Generate visual content spec
        // In a real implementation, this would call a visual generation service
        const visualPrompt = createVisualGenerationPrompt(
          slide,
          generatedSlides[slideIndex - 1],
          projectInfo
        );
        
        // Add a small delay to simulate visual generation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update progress
        currentProgress = Math.floor((researchSteps + slidesToGenerate.length + (i + 1)) / totalSteps * 100);
        setGenerationProgress(Math.min(currentProgress, 95)); // Cap at 95% until finalization
      }
    }
    
    // --- PHASE 4: Finalization ---
    setGenerationStatusText('Finalizing presentation...');
    setPhaseData({
      currentPhase: 'finalizing',
      phaseProgress: 0
    });
    
    // Add a small delay for "Finalizing" step
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Complete progress
    setGenerationProgress(100);
    setPhaseData({
      currentPhase: 'finalizing',
      phaseProgress: 100
    });
    setGenerationStatusText('Generation complete!');
    
    // Prepare the final content
    const finalContent = allGeneratedContent;
    
    // Apply typing effect for the final content display
    // The typingSpeed parameter controls how fast content appears (inverse relationship)
    const typingSpeedInMs = getTypingSpeedFromOption(options.typingSpeed);
    simulateTyping(finalContent, setGeneratedContentPreview, typingSpeedInMs);
    
  } catch (error) {
    console.error("Generation failed:", error);
    const errorMessage = `Error during generation: ${error instanceof Error ? error.message : String(error)}`;
    setGeneratedContentPreview(errorMessage);
    setGenerationStatusText('Generation Failed!');
    setGenerationProgress(0);
    setIsGenerating(false);
  }
};

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
  
  // Additional slides for comprehensive option
  const additionalSlides = [
    { id: 'slide-11', title: 'Team Introduction', type: 'team', includeVisual: true },
    { id: 'slide-12', title: 'Timeline/Roadmap', type: 'roadmap', includeVisual: true, visualType: 'diagram' },
    { id: 'slide-13', title: 'Traction/Validation', type: 'traction', includeVisual: true, visualType: 'chart' },
    { id: 'slide-14', title: 'Investment/Ask', type: 'investment', includeVisual: false }
  ];
  
  if (structureOption === 'comprehensive') {
    return [...defaultSlides, ...additionalSlides];
  }
  
  return defaultSlides;
};

// Helper for typing effect with configurable speed
const simulateTyping = (text: string, setText: (text: string) => void, speed = 5) => {
  let i = 0;
  let currentText = '';
  setText('');
  
  const intervalId = setInterval(() => {
    if (i < text.length) {
      currentText += text.charAt(i);
      setText(currentText);
      i++;
    } else {
      clearInterval(intervalId);
      // Convert final Markdown to HTML before setting editor state
      const htmlContent = marked(text) as string;
      console.log("Generated HTML for Editor:", htmlContent);
      setEditorContent(htmlContent); // Use store action
      setIsGenerating(false); // Ensure generation stops (using store action)
    }
  }, speed); // Speed in milliseconds - lower is faster
};

// Helper to convert typingSpeed option to actual milliseconds
const getTypingSpeedFromOption = (speedOption: number) => {
  // Map speedOption (0-4) to actual ms values (0=fastest, 4=slowest)
  const speedMap = [0, 2, 5, 10, 20];
  return speedMap[speedOption] || 5; // Default to 5ms if invalid option
};