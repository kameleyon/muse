import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '@/store/store';
import { useAuthModal } from '@/context/AuthModalContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { openForm } = useAuthModal();

  useEffect(() => {
    if (!isAuthenticated && !user) {
      // Show authentication modal if user is not authenticated
      openForm('login', `You need to login to access ${location.pathname}`);
    }
  }, [isAuthenticated, user, location.pathname, openForm]);

  if (!isAuthenticated && !user) {
    // Redirect to landing page with the return url
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
