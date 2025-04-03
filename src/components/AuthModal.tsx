import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthModal } from '@/context/AuthModalContext';

// Import all auth form components
import Login from '@/features/auth/components/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import MagicLink from '@/pages/auth/MagicLink';

const AuthModal: React.FC = () => {
  const { activeForm, isModalOpen, closeForm } = useAuthModal();

  // If modal is not open, don't render anything
  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="auth-overlay">
            {activeForm === 'login' && <Login />}
            {activeForm === 'register' && <Register />}
            {activeForm === 'forgotPassword' && <ForgotPassword />}
            {activeForm === 'resetPassword' && <ResetPassword />}
            {activeForm === 'magicLink' && <MagicLink />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
