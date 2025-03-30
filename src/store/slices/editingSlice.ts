import { StateCreator } from 'zustand';
import { ProjectWorkflowState, ProjectWorkflowActions } from '../projectWorkflowStore';

// Interface for Step 5: Editing & Enhancement State
export interface EditingState {
    editorContent: string; // HTML content for the editor
    isLoadingEnhancement: boolean;
}

// Interface for Step 5 Actions
export interface EditingActions {
    setEditorContent: (content: string) => void;
    setIsLoadingEnhancement: (loading: boolean) => void;
}

// Define the initial state for this slice
export const initialEditingState: EditingState = {
  editorContent: '',
  isLoadingEnhancement: false,
};

// Create the slice
export const createEditingSlice: StateCreator<
  ProjectWorkflowState & ProjectWorkflowActions,
  [],
  [],
  EditingState & EditingActions
> = (set) => ({
  ...initialEditingState,

  // Actions
  setEditorContent: (content) => set({ editorContent: content }),
  setIsLoadingEnhancement: (loading) => set({ isLoadingEnhancement: loading }),
});