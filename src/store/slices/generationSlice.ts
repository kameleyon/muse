import { StateCreator } from 'zustand';
import { 
  ProjectWorkflowState, 
  ProjectWorkflowActions, 
  SlideContent, 
  FactCheckLevel, 
  GenerationPhase 
} from '../projectWorkflowStore';

// Interface for Step 4: Content Generation State
export interface GenerationState {
    isGenerating: boolean;
    generationProgress: number; // Overall progress
    generationStatusText: string;
    generatedContentPreview: string; // Live preview content
    phaseData: {
      currentPhase: 'researching' | 'content' | 'finalizing';
      phaseProgress: number; // Progress within the current phase (0-100)
      currentSection?: number;
      totalSections?: number;
      currentSlide?: number;
      totalSlides?: number;
    };
    factCheckLevel: FactCheckLevel; 
    slideContents: SlideContent[]; // Detailed content per slide (if needed later)
    lastError: string | null; // Store last generation error
}

// Interface for Step 4 Actions
export interface GenerationActions {
    setIsGenerating: (generating: boolean) => void;
    setGenerationProgress: (progress: number) => void;
    setGenerationStatusText: (text: string) => void;
    setGeneratedContentPreview: (content: string) => void;
    setPhaseData: (data: GenerationState['phaseData']) => void; 
    setFactCheckLevel: (level: FactCheckLevel) => void; 
    setSlideContents: (contents: SlideContent[]) => void; // If needed later
    updateSlideContent: (slideId: string, content: Partial<SlideContent>) => void; // If needed later
    setLastError: (error: string | null) => void;
    resetGenerationState: () => void;
}

// Define initial state for generation phase data
export const initialPhaseData: GenerationState['phaseData'] = {
  currentPhase: 'researching',
  phaseProgress: 0,
};

// Define initial state for generation
export const initialGenerationState: GenerationState = {
  isGenerating: false,
  generationProgress: 0,
  generationStatusText: '',
  generatedContentPreview: '',
  phaseData: initialPhaseData,
  factCheckLevel: 'standard',
  slideContents: [],
  lastError: null,
};

// Create the slice
export const createGenerationSlice: StateCreator<
  ProjectWorkflowState & ProjectWorkflowActions,
  [],
  [],
  GenerationState & GenerationActions
> = (set) => ({
  ...initialGenerationState, // Spread initial state

  // Actions
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setGenerationStatusText: (text) => set({ generationStatusText: text }),
  setGeneratedContentPreview: (content) => set({ generatedContentPreview: content }),
  setPhaseData: (data) => set({ phaseData: data }), 
  setFactCheckLevel: (level) => set({ factCheckLevel: level }),
  setSlideContents: (contents) => set({ slideContents: contents }),
  updateSlideContent: (slideId, contentUpdate) => set((state) => ({
    slideContents: state.slideContents.map(sc => 
      sc.id === slideId ? { ...sc, ...contentUpdate } : sc
    )
  })),
  setLastError: (error) => set({ lastError: error }),
  resetGenerationState: () => set(initialGenerationState), // Reset to initial generation state
});
