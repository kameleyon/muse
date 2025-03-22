import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIState {
  sidebarOpen: boolean;
  toasts: Toast[];
  isGenerating: boolean;
  generationProgress: number;
  modalState: {
    type: string | null;
    isOpen: boolean;
    data: any;
  };
}

const initialState: UIState = {
  sidebarOpen: false,
  toasts: [],
  isGenerating: false,
  generationProgress: 0,
  modalState: {
    type: null,
    isOpen: false,
    data: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state, action: PayloadAction<boolean | undefined>) => {
      state.sidebarOpen = action.payload !== undefined ? action.payload : !state.sidebarOpen;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
      if (!action.payload) {
        state.generationProgress = 0;
      }
    },
    setGenerationProgress: (state, action: PayloadAction<number>) => {
      state.generationProgress = action.payload;
    },
    setModalState: (state, action: PayloadAction<UIState['modalState']>) => {
      state.modalState = action.payload;
    },
    closeModal: (state) => {
      state.modalState = { type: null, isOpen: false, data: null };
    },
  },
});

export const {
  toggleSidebar,
  addToast,
  removeToast,
  setGenerating,
  setGenerationProgress,
  setModalState,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;