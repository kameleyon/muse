import React, { lazy, Suspense } from 'react';
import { useAuthModal } from '../../context/AuthModalContext';
import withAuthModal from './withAuthModal';
import AuthModal from './AuthModal';

// Lazy load the auth components for better performance
const Login = lazy(() => import('../../pages/auth/Login'));
const Register = lazy(() => import('../../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../../pages/auth/ResetPassword'));
const MagicLink = lazy(() => import('../../pages/auth/MagicLink'));

// Create modal versions of each form component
const LoginModal = withAuthModal(Login, 'Sign In');
const RegisterModal = withAuthModal(Register, 'Create Your Account');
const ForgotPasswordModal = withAuthModal(ForgotPassword, 'Reset Your Password');
const ResetPasswordModal = withAuthModal(ResetPassword, 'Set Your New Password');
const MagicLinkModal = withAuthModal(MagicLink, 'Magic Link Sign In');

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const AuthModalContainer: React.FC = () => {
  const { activeForm, closeForm, isModalOpen } = useAuthModal();

  // Render nothing if no form is active
  if (!activeForm) return null;

  return (
    <Suspense fallback={
      <AuthModal isOpen={isModalOpen} onClose={closeForm} title="Loading...">
        <LoadingFallback />
      </AuthModal>
    }>
      {activeForm === 'login' && (
        <LoginModal isOpen={isModalOpen} onClose={closeForm} />
      )}
      {activeForm === 'register' && (
        <RegisterModal isOpen={isModalOpen} onClose={closeForm} />
      )}
      {activeForm === 'forgotPassword' && (
        <ForgotPasswordModal isOpen={isModalOpen} onClose={closeForm} />
      )}
      {activeForm === 'resetPassword' && (
        <ResetPasswordModal isOpen={isModalOpen} onClose={closeForm} />
      )}
      {activeForm === 'magicLink' && (
        <MagicLinkModal isOpen={isModalOpen} onClose={closeForm} />
      )}
    </Suspense>
  );
};

export default AuthModalContainer;
