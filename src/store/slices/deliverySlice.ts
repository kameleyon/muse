import { StateCreator } from 'zustand';
import { ProjectWorkflowState, ProjectWorkflowActions } from '../projectWorkflowStore';

// Define ClientPdfStatus type locally if not exported
type ClientPdfStatus = 'idle' | 'generating' | 'success' | 'error';

// Interface for Step 7: Delivery State
export interface DeliveryState {
    isGeneratingClientPdf: boolean;
    clientPdfStatus: ClientPdfStatus;
    // Add state for presenter tools, sharing, archiving later if needed
}

// Interface for Step 7 Actions
export interface DeliveryActions {
    setIsGeneratingClientPdf: (generating: boolean) => void;
    setClientPdfStatus: (status: ClientPdfStatus) => void;
    // Add actions for other Step 7 features later
}

// Define the initial state for this slice
export const initialDeliveryState: DeliveryState = {
  isGeneratingClientPdf: false,
  clientPdfStatus: 'idle',
};

// Create the slice
export const createDeliverySlice: StateCreator<
  ProjectWorkflowState & ProjectWorkflowActions,
  [],
  [],
  DeliveryState & DeliveryActions
> = (set) => ({
  ...initialDeliveryState,

  // Actions
  setIsGeneratingClientPdf: (generating) => set({ isGeneratingClientPdf: generating }),
  setClientPdfStatus: (status) => set({ clientPdfStatus: status }),
});