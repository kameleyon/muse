import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '@/services/supabase'; // Import supabase client directly
import { setUser, setSession, setAuthLoading } from '@/store/slices/authSlice'; // Corrected: Import setAuthLoading action

// This component initializes authentication state when the app loads
// by setting up the onAuthStateChange listener
const AuthInit: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Set loading state initially
    dispatch(setAuthLoading(true));
    
    let authStateResolved = false;

    // Immediately check the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(setUser(session.user));
        dispatch(setSession(session.access_token));
      }
      
      // Important: Set loading to false after initial session check
      // This ensures we don't leave the app in a loading state if the listener takes time
      if (!authStateResolved) {
        authStateResolved = true;
        dispatch(setAuthLoading(false));
      }
    }).catch(error => {
      console.error('Session retrieval error:', error);
      // Still need to complete loading even on error
      dispatch(setAuthLoading(false));
      authStateResolved = true;
    });

    // Set up the listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth State Change Event:', event, 'Session:', session ? 'exists' : 'null'); // More secure logging
        
        if (session) {
          // User is signed in or session restored
          dispatch(setUser(session.user));
          dispatch(setSession(session.access_token));
          dispatch(setAuthLoading(false));
        } else if (event === 'SIGNED_OUT') {
          // Only clear user data on explicit sign out
          dispatch(setUser(null));
          dispatch(setSession(null));
          dispatch(setAuthLoading(false));
        } else if (!authStateResolved) {
          // Only set loading false if we haven't already done it from getSession
          authStateResolved = true;
          dispatch(setAuthLoading(false));
        }
      }
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default AuthInit;
