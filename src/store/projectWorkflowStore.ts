import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Import slice creators and their state/action types
import { createSetupSlice, ProjectSetupState, ProjectSetupActions } from './slices/setupSlice';
import { createRequirementsSlice, AudienceState, RequirementsActions } from './slices/requirementsSlice';
import { createDesignSlice, DesignState, DesignActions } from './slices/designSlice'; 
import { createGenerationSlice, GenerationState, GenerationActions } from './slices/generationSlice';
import { createEditingSlice, EditingState, EditingActions } from './slices/editingSlice';
import { createQASlice, QAState, QAActions } from './slices/qaSlice';
import { createDeliverySlice, DeliveryState, DeliveryActions } from './slices/deliverySlice';
import { createBlogSlice, BlogState, BlogActions } from './slices/blogSlice';

// Import shared types from the central types file
import { 
  Slide, 
  FactCheckLevel, 
  GenerationPhase, 
  SlideContent, 
  VisualElement, 
  Citation,
  QualityMetrics,
  FactCheckResult,
  Suggestion,
  ValidationStatus, // Ensure all needed types are imported
  ClientPdfStatus,
  AudienceSize,
  ComplexityLevel,
  PrivacyLevel
} from './types';

// --- Re-export types needed by components ---
// Re-export types from the central types file
export type { 
  Slide, 
  FactCheckLevel, 
  GenerationPhase, 
  SlideContent, 
  VisualElement, 
  Citation,
  QualityMetrics,
  FactCheckResult,
  Suggestion,
  ValidationStatus,
  ClientPdfStatus,
  AudienceSize,
  ComplexityLevel,
  PrivacyLevel
};

// --- Combined Store Interface ---
// Define the combined state and action types by intersecting slice types
export type ProjectWorkflowState = 
  ProjectSetupState & 
  AudienceState & 
  DesignState & 
  GenerationState & 
  EditingState & 
  QAState & 
  DeliveryState &
  BlogState;

export type ProjectWorkflowActions = 
  ProjectSetupActions & 
  RequirementsActions & 
  DesignActions & 
  GenerationActions & 
  EditingActions & 
  QAActions & 
  DeliveryActions &
  BlogActions;

// --- Store Implementation using Slice Pattern ---
// Define the type for the combined store creator function
type StoreCreator = StateCreator<ProjectWorkflowState & ProjectWorkflowActions, [], [["zustand/persist", unknown]]>;

export const useProjectWorkflowStore = create<ProjectWorkflowState & ProjectWorkflowActions>()(
  persist(
    (...args) => ({
      // Combine slices by calling their creator functions
      ...createSetupSlice(...args),
      ...createRequirementsSlice(...args),
      ...createDesignSlice(...args),
      ...createGenerationSlice(...args),
      ...createEditingSlice(...args),
      ...createQASlice(...args),
      ...createDeliverySlice(...args),
      ...createBlogSlice(...args),
    }),
    {
      name: 'project-workflow-storage', // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      partialize: (state) => ({
        // Selectively persist only necessary state
        projectId: state.projectId,
        projectName: state.projectName,
        selectedPitchDeckTypeId: state.selectedPitchDeckTypeId,
        selectedBlogTypeId: state.selectedBlogTypeId,
        description: state.description,
        privacy: state.privacy,
        tags: state.tags,
        teamMembers: state.teamMembers,
        // Persist other relevant setup/requirements/design state as needed
        // Example:
        audienceName: state.audienceName,
        industry: state.industry,
        selectedTemplateId: state.selectedTemplateId,
        primaryColor: state.primaryColor,
        secondaryColor: state.secondaryColor,
        accentColor: state.accentColor,
        headingFont: state.headingFont,
        bodyFont: state.bodyFont,
        slideStructure: state.slideStructure,
        // DO NOT persist temporary/transient state like:
        // isGenerating, generationProgress, generatedContentPreview, editorContent, etc.
      }),
    }
  )
);


// --- Utility function to initialize store with initial props ---
// This remains the same
export const initializeWorkflowState = (initialState: Partial<ProjectWorkflowState>) => {
  useProjectWorkflowStore.setState(initialState);
};
