import { create, StateCreator } from 'zustand';

// Import slice creators and their state/action types
import { createSetupSlice, ProjectSetupState, ProjectSetupActions } from './slices/setupSlice';
import { createRequirementsSlice, AudienceState, RequirementsActions } from './slices/requirementsSlice';
import { createDesignSlice, DesignState, DesignActions } from './slices/designSlice'; 
import { createGenerationSlice, GenerationState, GenerationActions } from './slices/generationSlice';
import { createEditingSlice, EditingState, EditingActions } from './slices/editingSlice';
import { createQASlice, QAState, QAActions } from './slices/qaSlice';
import { createDeliverySlice, DeliveryState, DeliveryActions } from './slices/deliverySlice';

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
  DeliveryState;

export type ProjectWorkflowActions = 
  ProjectSetupActions & 
  RequirementsActions & 
  DesignActions & 
  GenerationActions & 
  EditingActions & 
  QAActions & 
  DeliveryActions;

// --- Store Implementation using Slice Pattern ---
// Define the type for the combined store creator function
type StoreCreator = StateCreator<ProjectWorkflowState & ProjectWorkflowActions>;

export const useProjectWorkflowStore = create<ProjectWorkflowState & ProjectWorkflowActions>(
  (...args) => ({
    // Combine slices by calling their creator functions
    ...createSetupSlice(...args),
    ...createRequirementsSlice(...args),
    ...createDesignSlice(...args),
    ...createGenerationSlice(...args),
    ...createEditingSlice(...args),
    ...createQASlice(...args),
    ...createDeliverySlice(...args),
  })
);

// --- Utility function to initialize store with initial props ---
// This remains the same
export const initializeWorkflowState = (initialState: Partial<ProjectWorkflowState>) => {
  useProjectWorkflowStore.setState(initialState);
};