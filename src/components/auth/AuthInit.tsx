import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSession } from '@/services/supabase';
import { setUser, setSession } from '@/store/slices/authSlice';

// This component initializes authentication state when the app loads
// by checking for existing sessions and loading user data if available
const AuthInit: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if there's an existing session
        const { data, error } = await getSession();
        
        if (error) {
          console.error('Auth initialization error:', error);
          return;
        }
        
        if (data.session) {
          // User is logged in
          // Fix: Access user from data.session, not directly from data
          const user = data.session.user;
          
          if (user) {
            // Set user info in Redux
            dispatch(setUser(user));
            dispatch(setSession(data.session.access_token));
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default AuthInit;