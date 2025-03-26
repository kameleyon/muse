import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '@/store/store';
import { useAuthModal } from '@/context/AuthModalContext';
import Loading from '../common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { openForm } = useAuthModal();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Only mark initial load as complete when auth loading is done
    if (!isLoading && !initialLoadComplete) {
      setInitialLoadComplete(true);
    }
    
    // Handle showing the auth modal only after we've confirmed authentication status
    if (initialLoadComplete && !isLoading && !isAuthenticated && !user) {
      openForm('login', `You need to login to access ${location.pathname}`);
    }
  }, [isLoading, isAuthenticated, user, location.pathname, openForm, initialLoadComplete]);

  // Show loading during initial auth state check
  if (isLoading || !initialLoadComplete) {
    return <Loading />;
  }

  // If not authenticated after auth check is complete, redirect
  if (!isAuthenticated && !user) {
    // Redirect to landing page, preserving the intended destination
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
