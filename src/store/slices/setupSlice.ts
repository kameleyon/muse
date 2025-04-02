import { StateCreator } from 'zustand';
// Correctly import both exported types from the main store file
import { ProjectWorkflowState, ProjectWorkflowActions } from '../projectWorkflowStore';

// Interface for Step 1: Project Setup State
export interface ProjectSetupState {
  selectedPitchDeckTypeId: string | null;
  selectedBlogTypeId: string | null;
  projectId: string | null; 
  projectName: string;
  description: string;
  privacy: 'private' | 'team' | 'public';
  tags: string[];
  teamMembers: string[];
}

// Interface for Step 1 Actions
export interface ProjectSetupActions {
  setSelectedPitchDeckTypeId: (id: string | null) => void;
  setSelectedBlogTypeId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setDescription: (desc: string) => void;
  setPrivacy: (privacy: 'private' | 'team' | 'public') => void;
  setProjectId: (id: string | null) => void; 
  setTags: (tags: string[]) => void;
  setTeamMembers: (members: string[]) => void;
  setTagsFromString: (tagsInput: string) => void;
  setTeamMembersFromString: (teamInput: string) => void;
}

// Define the initial state for this slice
export const initialSetupState: ProjectSetupState = {
  selectedPitchDeckTypeId: null,
  selectedBlogTypeId: null,
  projectId: null, 
  projectName: '',
  description: '',
  privacy: 'private',
  tags: [],
  teamMembers: [],
};

// Create the slice using StateCreator
export const createSetupSlice: StateCreator<
  ProjectWorkflowState & ProjectWorkflowActions, // Full store type
  [], // Middleware types (empty for now)
  [], // Middleware types (empty for now)
  ProjectSetupState & ProjectSetupActions // Slice type
> = (set) => ({
  ...initialSetupState, // Spread initial state

  // Actions
  setSelectedPitchDeckTypeId: (id) => set({ selectedPitchDeckTypeId: id }),
  setSelectedBlogTypeId: (id) => set({ selectedBlogTypeId: id }),
  setProjectName: (name) => set({ projectName: name }),
  setDescription: (desc) => set({ description: desc }),
  setPrivacy: (privacy) => set({ privacy: privacy }),
  setProjectId: (id: string | null) => set({ projectId: id }), 
  setTags: (tags) => set({ tags: tags }),
  setTeamMembers: (members) => set({ teamMembers: members }),
  setTagsFromString: (tagsInput) => set({ tags: tagsInput.split(',').map(t => t.trim()).filter(t => t) }),
  setTeamMembersFromString: (teamInput) => set({ teamMembers: teamInput.split(',').map(t => t.trim()).filter(t => t) }),
});
