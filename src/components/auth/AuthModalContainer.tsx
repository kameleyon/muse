import React, { lazy, Suspense } from 'react';
import { useAuthModal } from '@/context/AuthModalContext';

// Import auth components directly
import Login from '@/features/auth/components/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import MagicLink from '@/pages/auth/MagicLink';
import ResetPassword from '@/pages/auth/ResetPassword';

const LoadingFallback = () => (
  <div className="auth-overlay">
    <div className="auth-modal">
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    </div>
  </div>
);

const AuthModalContainer: React.FC = () => {
  const { activeForm, isModalOpen } = useAuthModal();
  
  // Render nothing if no form is active or modal is not open
  if (!activeForm || !isModalOpen) return null;

  return (
    <Suspense fallback={<LoadingFallback />}>
      {activeForm === 'login' && <Login />}
      {activeForm === 'register' && <Register />}
      {activeForm === 'forgotPassword' && <ForgotPassword />}
      {activeForm === 'resetPassword' && <ResetPassword />}
      {activeForm === 'magicLink' && <MagicLink />}
    </Suspense>
  );
};

export default AuthModalContainer;