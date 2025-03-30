import { StateCreator } from 'zustand';
import { 
  ProjectWorkflowState, 
  ProjectWorkflowActions, 
  QualityMetrics, 
  FactCheckResult, 
  Suggestion 
} from '../projectWorkflowStore';

// Define ValidationStatus type locally if not exported from main store
type ValidationStatus = 'Not Run' | 'Running' | 'Passed' | 'Issues Found';

// Interface for Step 6: QA & Refinement State
export interface QAState {
    qualityMetrics: QualityMetrics | null;
    factCheckResults: FactCheckResult[];
    complianceStatus: ValidationStatus;
    financialValidationStatus: ValidationStatus;
    languageCheckStatus: ValidationStatus;
    refinementSuggestions: Suggestion[];
    isLoadingQA: boolean;
}

// Interface for Step 6 Actions
export interface QAActions {
    setQualityMetrics: (metrics: QualityMetrics | null) => void;
    setFactCheckResults: (results: FactCheckResult[]) => void;
    setComplianceStatus: (status: ValidationStatus) => void;
    setFinancialValidationStatus: (status: ValidationStatus) => void;
    setLanguageCheckStatus: (status: ValidationStatus) => void;
    setRefinementSuggestions: (suggestions: Suggestion[]) => void;
    setIsLoadingQA: (loading: boolean) => void;
    resetQAState: () => void;
}

// Define initial state for QA
export const initialQAState: QAState = {
  qualityMetrics: null,
  factCheckResults: [],
  complianceStatus: 'Not Run',
  financialValidationStatus: 'Not Run',
  languageCheckStatus: 'Not Run',
  refinementSuggestions: [],
  isLoadingQA: false,
};

// Create the slice
export const createQASlice: StateCreator<
  ProjectWorkflowState & ProjectWorkflowActions,
  [],
  [],
  QAState & QAActions
> = (set) => ({
  ...initialQAState, // Spread initial QA state

  // Actions
  setQualityMetrics: (metrics) => set({ qualityMetrics: metrics }),
  setFactCheckResults: (results) => set({ factCheckResults: results }),
  setComplianceStatus: (status) => set({ complianceStatus: status }),
  setFinancialValidationStatus: (status) => set({ financialValidationStatus: status }),
  setLanguageCheckStatus: (status) => set({ languageCheckStatus: status }),
  setRefinementSuggestions: (suggestions) => set({ refinementSuggestions: suggestions }),
  setIsLoadingQA: (loading) => set({ isLoadingQA: loading }),
  resetQAState: () => set(initialQAState), // Reset to initial QA state
});