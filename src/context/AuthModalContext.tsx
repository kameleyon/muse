import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthFormType = 'login' | 'register' | 'forgotPassword' | 'resetPassword' | 'magicLink' | null;

interface AuthModalContextType {
  activeForm: AuthFormType;
  openForm: (form: AuthFormType) => void;
  closeForm: () => void;
  isModalOpen: boolean;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeForm, setActiveForm] = useState<AuthFormType>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openForm = (form: AuthFormType) => {
    setActiveForm(form);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    // Keep the form for exit animation, then set to null
    setTimeout(() => setActiveForm(null), 300);
  };

  return (
    <AuthModalContext.Provider value={{ activeForm, openForm, closeForm, isModalOpen }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = (): AuthModalContextType => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

export default AuthModalContext;
