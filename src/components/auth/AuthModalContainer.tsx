import React, { lazy, Suspense } from 'react';
import { useAuthModal } from '@/context/AuthModalContext';
import { AnimatePresence, motion } from 'framer-motion';

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
  const { activeForm, isModalOpen, message } = useAuthModal();
  
  // Render nothing if no form is active or modal is not open
  if (!activeForm || !isModalOpen) return null;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="auth-overlay">
        <div className="auth-modal">
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-[#f8d7da] text-[#ae5630] rounded-md border border-[#ae5630]"
            >
              {message}
            </motion.div>
          )}
          {activeForm === 'login' && <Login />}
          {activeForm === 'register' && <Register />}
          {activeForm === 'forgotPassword' && <ForgotPassword />}
          {activeForm === 'resetPassword' && <ResetPassword />}
          {activeForm === 'magicLink' && <MagicLink />}
        </div>
      </div>
    </Suspense>
  );
};

export default AuthModalContainer;
