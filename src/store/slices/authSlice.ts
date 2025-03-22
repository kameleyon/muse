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
  isLoading: false,
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
      } else {
        state.user = null;
      }
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
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
  },
});

export const { setAuthLoading, setAuthError, setUser, setSession, logout } = authSlice.actions;

export default authSlice.reducer;