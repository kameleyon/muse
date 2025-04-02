import { StateCreator } from 'zustand';
import { ProjectWorkflowState, ProjectWorkflowActions } from '../projectWorkflowStore';

// Interface for Step 2: Requirements Gathering State (Audience)
export interface AudienceState {
  audienceName: string; 
  orgType: string;
  industry: string;
  size: 'Small' | 'Medium' | 'Enterprise' | ''; 
  personaRole: string;
  personaConcerns: string[];
  personaCriteria: string[];
  personaCommPrefs: string[];
  
  // Additional properties for blog audience targeting
  demographicInfo: string;
  knowledgeLevel: string;
  interests: string;
  painPoints: string;
  desiredOutcomes: string;
}

// Interface for Step 2 Actions
export interface RequirementsActions {
  setAudienceField: <K extends keyof AudienceState>(field: K, value: AudienceState[K]) => void;
}

// Define the initial state for this slice
export const initialRequirementsState: AudienceState = {
  audienceName: '', 
  orgType: '',
  industry: '',
  size: '', 
  personaRole: '',
  personaConcerns: [],
  personaCriteria: [],
  personaCommPrefs: [],
  
  // Initialize additional properties
  demographicInfo: '',
  knowledgeLevel: '',
  interests: '',
  painPoints: '',
  desiredOutcomes: ''
};

// Create the slice
export const createRequirementsSlice: StateCreator<
  ProjectWorkflowState & ProjectWorkflowActions,
  [],
  [],
  AudienceState & RequirementsActions
> = (set) => ({
  ...initialRequirementsState,

  // Actions
  setAudienceField: (field, value) => set((state) => ({ ...state, [field]: value })),
});
