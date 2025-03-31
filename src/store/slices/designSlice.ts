import { StateCreator } from 'zustand';
import { ProjectWorkflowState, ProjectWorkflowActions } from '../projectWorkflowStore';
// Import shared types from the central types file
import { Slide, ComplexityLevel } from '../types'; 

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
    complexityLevel: ComplexityLevel; 
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
    setComplexityLevel: (level: ComplexityLevel) => void; 
}

// Define the full 14-slide default structure
const fullDefaultStructure: Slide[] = [
  { id: 'slide-1', title: 'Cover Slide', type: 'cover', description: 'Company Logo, Project Name, Tagline or Short Mission Statement', isRequired: true },
  { id: 'slide-2', title: 'Problem', type: 'problem', description: 'Define the problem your product/service aims to solve', isRequired: true },
  { id: 'slide-3', title: 'Solution', type: 'solution', description: 'Explain how your product/service solves the problem', isRequired: true },
  { id: 'slide-4', title: 'How It Works', type: 'how_it_works', description: 'Explain the mechanics of your solution', isRequired: true },
  { id: 'slide-5', title: 'Core Features', type: 'features', description: 'Highlight the main features and benefits', isRequired: true },
  { id: 'slide-6', title: 'Market Opportunity', type: 'market_analysis', description: 'Market size, trends, and growth potential', isRequired: true },
  { id: 'slide-7', title: 'Business Model', type: 'business_model', description: 'Revenue streams and monetization strategy', isRequired: true },
  { id: 'slide-8', title: 'Competitive Advantage', type: 'competition', description: 'What sets you apart from competitors', isRequired: true },
  { id: 'slide-9', title: 'Go-to-Market Strategy', type: 'go_to_market', description: 'Plan for acquiring customers and scaling', isRequired: true },
  { id: 'slide-10', title: 'Financial Projections', type: 'financials', description: 'Key financial metrics and forecasts', isRequired: true },
  { id: 'slide-11', title: 'Team & Expertise', type: 'team', description: 'Key team members and their qualifications', isRequired: true },
  { id: 'slide-12', title: 'Roadmap & Milestones', type: 'roadmap', description: 'Timeline of key achievements and future goals', isRequired: true },
  { id: 'slide-13', title: 'Call to Action', type: 'call_to_action', description: 'Specific ask and next steps', isRequired: true },
  { id: 'slide-14', title: 'Appendix', type: 'appendix', description: 'Additional supporting information (optional)', isRequired: false }
];


// Define the initial state for this slice using the full structure
export const initialDesignState: DesignState = {
  selectedTemplateId: null,
  brandLogo: null,
  primaryColor: '#ae5630', // Default theme color
  secondaryColor: '#232321', // Default theme color
  accentColor: '#9d4e2c', // Default theme color
  headingFont: 'Comfortaa', // Default font
  bodyFont: 'Questrial', // Default font
  slideStructure: fullDefaultStructure, // Use the full 14-slide structure
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