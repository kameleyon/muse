import { StateCreator } from 'zustand';
import { ProjectWorkflowState, ProjectWorkflowActions, Slide } from '../projectWorkflowStore'; // Import Slide type

// Interface for Step 3: Design & Structure State
export interface DesignState {
    selectedTemplateId: string | null;
    brandLogo: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headingFont: string;
    bodyFont: string;
    slideStructure: Slide[]; 
    complexityLevel: 'basic' | 'intermediate' | 'advanced'; 
}

// Interface for Step 3 Actions
export interface DesignActions {
    setSelectedTemplateId: (id: string | null) => void;
    setBrandLogo: (logo: string | null) => void;
    setPrimaryColor: (color: string) => void;
    setSecondaryColor: (color: string) => void;
    setAccentColor: (color: string) => void;
    setHeadingFont: (font: string) => void;
    setBodyFont: (font: string) => void;
    setSlideStructure: (slides: Slide[]) => void;
    setComplexityLevel: (level: 'basic' | 'intermediate' | 'advanced') => void; 
}

// Define the initial state for this slice
export const initialDesignState: DesignState = {
  selectedTemplateId: null,
  brandLogo: null,
  primaryColor: '#ae5630', // Default theme color
  secondaryColor: '#232321', // Default theme color
  accentColor: '#9d4e2c', // Default theme color
  headingFont: 'Comfortaa', // Default font
  bodyFont: 'Questrial', // Default font
  // Default slide structure with types
  slideStructure: [
      { id: 's1', title: 'Cover/Title', type: 'cover' },
      { id: 's2', title: 'Problem/Opportunity', type: 'problem' },
      { id: 's3', title: 'Solution Overview', type: 'solution' },
      { id: 's4', title: 'Value Proposition', type: 'value_proposition' },
      { id: 's5', title: 'Market Analysis', type: 'market_analysis' },
      { id: 's6', title: 'Competitive Landscape', type: 'competition' },
      { id: 's7', title: 'Product/Service Details', type: 'product' },
      { id: 's8', title: 'Business Model', type: 'business_model' },
      { id: 's9', title: 'Team Introduction', type: 'team' },
      { id: 's10', title: 'Financial Projections', type: 'financials' },
      { id: 's11', title: 'Timeline/Roadmap', type: 'roadmap' },
      { id: 's12', title: 'Call to Action', type: 'call_to_action' },
  ],
  complexityLevel: 'intermediate', 
};

// Create the slice
export const createDesignSlice: StateCreator<
  ProjectWorkflowState & ProjectWorkflowActions,
  [],
  [],
  DesignState & DesignActions
> = (set) => ({
  ...initialDesignState,

  // Actions
  setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
  setBrandLogo: (logo) => set({ brandLogo: logo }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSecondaryColor: (color) => set({ secondaryColor: color }),
  setAccentColor: (color) => set({ accentColor: color }),
  setHeadingFont: (font) => set({ headingFont: font }),
  setBodyFont: (font) => set({ bodyFont: font }),
  setSlideStructure: (slides) => set({ slideStructure: slides }),
  setComplexityLevel: (level) => set({ complexityLevel: level }),
});