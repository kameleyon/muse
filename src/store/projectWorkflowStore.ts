import { create } from 'zustand';

// --- Interfaces ---

// Interface for Step 1: Project Setup State
interface ProjectSetupState {
  selectedPitchDeckTypeId: string | null;
  projectId: string | null; // Add projectId to store state
  projectName: string;
  description: string;
  privacy: 'private' | 'team' | 'public';
  tags: string[];
  teamMembers: string[];
}

// Interface for Step 1 Actions
interface ProjectSetupActions {
  setSelectedPitchDeckTypeId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setDescription: (desc: string) => void;
  setPrivacy: (privacy: 'private' | 'team' | 'public') => void;
  setProjectId: (id: string | null) => void; // Add action definition here
  setTags: (tags: string[]) => void;
  setTeamMembers: (members: string[]) => void;
  setTagsFromString: (tagsInput: string) => void;
  setTeamMembersFromString: (teamInput: string) => void;
}

// Interface for Step 2: Requirements Gathering State (Audience)
export interface AudienceState {
  name: string;
  orgType: string;
  industry: string;
  size: 'small' | 'medium' | 'enterprise' | '';
  personaRole: string;
  personaConcerns: string[];
  personaCriteria: string[];
  personaCommPrefs: string[];
}

// Interface for Step 2 Actions
interface RequirementsActions {
  setAudienceField: <K extends keyof AudienceState>(field: K, value: AudienceState[K]) => void;
}

// Interface for Step 3: Design & Structure State
export interface Slide {
    id: string;
    title: string;
}
interface DesignState {
    selectedTemplateId: string | null;
    brandLogo: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headingFont: string;
    bodyFont: string;
    slideStructure: Slide[];
    complexityLevel: number;
}

// Interface for Step 3 Actions
interface DesignActions {
    setSelectedTemplateId: (id: string | null) => void;
    setBrandLogo: (logo: string | null) => void;
    setPrimaryColor: (color: string) => void;
    setSecondaryColor: (color: string) => void;
    setAccentColor: (color: string) => void;
    setHeadingFont: (font: string) => void;
    setBodyFont: (font: string) => void;
    setSlideStructure: (slides: Slide[]) => void;
    setComplexityLevel: (level: number) => void;
}

// Interface for Step 4: Content Generation State
interface GenerationState {
    isGenerating: boolean;
    generationProgress: number;
    generationStatusText: string;
    generatedContentPreview: string;
}

// Interface for Step 4 Actions
interface GenerationActions {
    setIsGenerating: (generating: boolean) => void;
    setGenerationProgress: (progress: number) => void;
    setGenerationStatusText: (text: string) => void;
    setGeneratedContentPreview: (content: string) => void;
    resetGenerationState: () => void;
}

// Interface for Step 5: Editing & Enhancement State
interface EditingState {
    editorContent: string; // HTML content for the editor
    isLoadingEnhancement: boolean;
}

// Interface for Step 5 Actions
interface EditingActions {
    setEditorContent: (content: string) => void;
    setIsLoadingEnhancement: (loading: boolean) => void;
}

// Interface for Step 6: QA & Refinement State
export type QualityMetrics = { overallScore: number; categories: { name: string; score: number }[]; issues: { id: string; severity: string; text: string }[]; };
export type FactCheckResult = { claim: string; verified: boolean; source?: string; explanation?: string; };
export type Suggestion = { id: string; text: string; impact: string; effort: string; };
type ValidationStatus = 'Not Run' | 'Running' | 'Passed' | 'Issues Found';

interface QAState {
    qualityMetrics: QualityMetrics | null;
    factCheckResults: FactCheckResult[];
    complianceStatus: ValidationStatus;
    financialValidationStatus: ValidationStatus;
    languageCheckStatus: ValidationStatus;
    refinementSuggestions: Suggestion[];
    isLoadingQA: boolean;
}

// Interface for Step 6 Actions
interface QAActions {
    setQualityMetrics: (metrics: QualityMetrics | null) => void;
    setFactCheckResults: (results: FactCheckResult[]) => void;
    setComplianceStatus: (status: ValidationStatus) => void;
    setFinancialValidationStatus: (status: ValidationStatus) => void;
    setLanguageCheckStatus: (status: ValidationStatus) => void;
    setRefinementSuggestions: (suggestions: Suggestion[]) => void;
    setIsLoadingQA: (loading: boolean) => void;
    resetQAState: () => void;
}

// Interface for Step 7: Delivery State (including client PDF export)
type ClientPdfStatus = 'idle' | 'generating' | 'success' | 'error';
interface DeliveryState {
    isGeneratingClientPdf: boolean;
    clientPdfStatus: ClientPdfStatus;
    // Add state for presenter tools, sharing, archiving later if needed
}

// Interface for Step 7 Actions
interface DeliveryActions {
    setIsGeneratingClientPdf: (generating: boolean) => void;
    setClientPdfStatus: (status: ClientPdfStatus) => void;
    // Add actions for other Step 7 features later
}


// --- Combined Store Interface ---
interface ProjectWorkflowState extends ProjectSetupState, AudienceState, DesignState, GenerationState, EditingState, QAState, DeliveryState {} // Add DeliveryState
interface ProjectWorkflowActions extends ProjectSetupActions, RequirementsActions, DesignActions, GenerationActions, EditingActions, QAActions, DeliveryActions {} // Add DeliveryActions

// --- Store Implementation ---

export const useProjectWorkflowStore = create<ProjectWorkflowState & ProjectWorkflowActions>((set) => ({
  // --- Step 1: Project Setup Initial State ---
  selectedPitchDeckTypeId: null,
  projectId: null, // Ensure projectId is in the initial state
  projectName: '',
  description: '',
  privacy: 'private',
  tags: [],
  teamMembers: [],

  // --- Step 1: Project Setup Actions ---
  setSelectedPitchDeckTypeId: (id) => set({ selectedPitchDeckTypeId: id }),
  setProjectName: (name) => set({ projectName: name }),
  setDescription: (desc) => set({ description: desc }),
  setPrivacy: (privacy) => set({ privacy: privacy }),
  setProjectId: (id: string | null) => set({ projectId: id }), // Add type annotation
  setTags: (tags) => set({ tags: tags }),
  setTeamMembers: (members) => set({ teamMembers: members }),
  setTagsFromString: (tagsInput) => set({ tags: tagsInput.split(',').map(t => t.trim()).filter(t => t) }),
  setTeamMembersFromString: (teamInput) => set({ teamMembers: teamInput.split(',').map(t => t.trim()).filter(t => t) }),

  // --- Step 2: Requirements Initial State ---
  name: '', // Audience name
  orgType: '',
  industry: '',
  size: '',
  personaRole: '',
  personaConcerns: [],
  personaCriteria: [],
  personaCommPrefs: [],

  // --- Step 2: Requirements Actions ---
  setAudienceField: (field, value) => set((state) => ({ ...state, [field]: value })),

  // --- Step 3: Design Initial State ---
  selectedTemplateId: null,
  brandLogo: null,
  primaryColor: '#ae5630',
  secondaryColor: '#232321',
  accentColor: '#9d4e2c',
  headingFont: 'Comfortaa',
  bodyFont: 'Questrial',
  slideStructure: [
      { id: 's1', title: 'Cover/Title' },
      { id: 's2', title: 'Problem/Opportunity' },
      { id: 's3', title: 'Solution Overview' },
      { id: 's4', title: 'Call to Action' },
  ],
  complexityLevel: 50,

  // --- Step 3: Design Actions ---
  setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
  setBrandLogo: (logo) => set({ brandLogo: logo }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSecondaryColor: (color) => set({ secondaryColor: color }),
  setAccentColor: (color) => set({ accentColor: color }),
  setHeadingFont: (font) => set({ headingFont: font }),
  setBodyFont: (font) => set({ bodyFont: font }),
  setSlideStructure: (slides) => set({ slideStructure: slides }),
  setComplexityLevel: (level) => set({ complexityLevel: level }),

  // --- Step 4: Generation Initial State ---
  isGenerating: false,
  generationProgress: 0,
  generationStatusText: '',
  generatedContentPreview: '',

  // --- Step 4: Generation Actions ---
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setGenerationStatusText: (text) => set({ generationStatusText: text }),
  setGeneratedContentPreview: (content) => set({ generatedContentPreview: content }),
  resetGenerationState: () => set({
      isGenerating: false,
      generationProgress: 0,
      generationStatusText: '',
      generatedContentPreview: '',
  }),

  // --- Step 5: Editing Initial State ---
  editorContent: '',
  isLoadingEnhancement: false,

  // --- Step 5: Editing Actions ---
  setEditorContent: (content) => set({ editorContent: content }),
  setIsLoadingEnhancement: (loading) => set({ isLoadingEnhancement: loading }),

  // --- Step 6: QA Initial State ---
  qualityMetrics: null,
  factCheckResults: [],
  complianceStatus: 'Not Run',
  financialValidationStatus: 'Not Run',
  languageCheckStatus: 'Not Run',
  refinementSuggestions: [],
  isLoadingQA: false,

  // --- Step 6: QA Actions ---
  setQualityMetrics: (metrics) => set({ qualityMetrics: metrics }),
  setFactCheckResults: (results) => set({ factCheckResults: results }),
  setComplianceStatus: (status) => set({ complianceStatus: status }),
  setFinancialValidationStatus: (status) => set({ financialValidationStatus: status }),
  setLanguageCheckStatus: (status) => set({ languageCheckStatus: status }),
  setRefinementSuggestions: (suggestions) => set({ refinementSuggestions: suggestions }),
  setIsLoadingQA: (loading) => set({ isLoadingQA: loading }),
  resetQAState: () => set({
      qualityMetrics: null,
      factCheckResults: [],
      complianceStatus: 'Not Run',
      financialValidationStatus: 'Not Run',
      languageCheckStatus: 'Not Run',
      refinementSuggestions: [],
      isLoadingQA: false,
  }),

  // --- Step 7: Delivery Initial State ---
  isGeneratingClientPdf: false,
  clientPdfStatus: 'idle',

  // --- Step 7: Delivery Actions ---
  setIsGeneratingClientPdf: (generating) => set({ isGeneratingClientPdf: generating }),
  setClientPdfStatus: (status) => set({ clientPdfStatus: status }),

}));

// --- Utility function to initialize store with initial props ---
export const initializeWorkflowState = (initialState: Partial<ProjectWorkflowState>) => {
  useProjectWorkflowStore.setState(initialState);
};