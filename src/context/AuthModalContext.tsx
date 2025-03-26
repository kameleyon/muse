import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthFormType = 'login' | 'register' | 'forgotPassword' | 'resetPassword' | 'magicLink' | null;

interface AuthModalContextType {
  activeForm: AuthFormType;
  openForm: (form: AuthFormType, message?: string) => void;
  closeForm: () => void;
  isModalOpen: boolean;
  message: string | null;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeForm, setActiveForm] = useState<AuthFormType>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const openForm = (form: AuthFormType, message?: string) => {
    setActiveForm(form);
    setIsModalOpen(true);
    setMessage(message || null);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    // Keep the form for exit animation, then set to null
    setTimeout(() => setActiveForm(null), 300);
  };

  return (
    <AuthModalContext.Provider value={{ activeForm, openForm, closeForm, isModalOpen, message }}>
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
