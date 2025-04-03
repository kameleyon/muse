import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'; // Navigate removed
import { RootState } from '@/store/store';
// import { useAuthModal } from '@/context/AuthModalContext'; // Removed
import { logoutUser } from '@/services/auth'; // Added logoutUser import
import Loading from '../common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
  // const location = useLocation(); // No longer needed here if not used in logout message
  // const { openForm } = useAuthModal(); // Removed
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Only mark initial load as complete when auth loading is done
    if (!isLoading && !initialLoadComplete) {
      setInitialLoadComplete(true);
    }
    
    // If loading is complete and user is not authenticated, log them out (clears session) and redirect.
    if (initialLoadComplete && !isLoading && !isAuthenticated && !user) {
      // Call logoutUser which handles Supabase signout and redirect to '/'
      logoutUser(); 
    }
  }, [isLoading, isAuthenticated, user, initialLoadComplete]); // Dependencies updated

  // Show loading during initial auth state check
  if (isLoading || !initialLoadComplete) {
    return <Loading />;
  }

  // If authenticated after auth check is complete, render the protected content
  // The unauthenticated case is handled by the useEffect calling logoutUser, which redirects.
  return <>{children}</>;
};

export default ProtectedRoute;
