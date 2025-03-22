import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'blog' | 'marketing' | 'creative' | 'academic' | 'social';
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
  isPrivate: boolean;
  version: number;
}

interface ContentState {
  items: ContentItem[];
  selectedItem: ContentItem | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    type: string | null;
    search: string;
    tags: string[];
    dateRange: {
      from: string | null;
      to: string | null;
    };
  };
}

const initialState: ContentState = {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  filters: {
    type: null,
    search: '',
    tags: [],
    dateRange: {
      from: null,
      to: null,
    },
  },
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContentLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setContentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setContentItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addContentItem: (state, action: PayloadAction<ContentItem>) => {
      state.items.unshift(action.payload);
    },
    updateContentItem: (state, action: PayloadAction<ContentItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedItem && state.selectedItem.id === action.payload.id) {
        state.selectedItem = action.payload;
      }
    },
    deleteContentItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.selectedItem && state.selectedItem.id === action.payload) {
        state.selectedItem = null;
      }
    },
    setSelectedItem: (state, action: PayloadAction<ContentItem | null>) => {
      state.selectedItem = action.payload;
    },
    setContentFilters: (state, action: PayloadAction<Partial<ContentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setContentLoading,
  setContentError,
  setContentItems,
  addContentItem,
  updateContentItem,
  deleteContentItem,
  setSelectedItem,
  setContentFilters,
} = contentSlice.actions;

export default contentSlice.reducer;