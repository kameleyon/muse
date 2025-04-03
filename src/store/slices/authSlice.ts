import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  session: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent premature auth decisions
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setUser: (state, action: PayloadAction<any>) => {
      // Create a normalized user object from the Supabase user
      const supabaseUser = action.payload;
      if (supabaseUser) {
        state.user = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          fullName: supabaseUser.user_metadata?.full_name,
          avatar_url: supabaseUser.user_metadata?.avatar_url,
        };
        state.isAuthenticated = true;
      } else {
        // Only clear user if explicitly passed null
        state.user = null;
        state.isAuthenticated = false;
      }
      
      // Note: Don't set isLoading to false here, let AuthInit component control that
      state.error = null;
    },
    setSession: (state, action: PayloadAction<string | null>) => {
      state.session = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setAuthLoading,
  setAuthError,
  setUser,
  setSession,
  logout,
  updateUserProfile, // Export the new action
} = authSlice.actions;

export default authSlice.reducer;
