import React from 'react';
import { useAuthModal } from '@/context/AuthModalContext';

interface AuthButtonsProps {
  className?: string;
  buttonClassName?: string;
  showSignUp?: boolean;
  showSignIn?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  className = '',
  buttonClassName = '',
  showSignUp = true,
  showSignIn = true,
  variant = 'primary'
}) => {
  const { openForm } = useAuthModal();

  let baseButtonClass = '';
  
  switch (variant) {
    case 'secondary':
      baseButtonClass = 'bg-secondary hover:bg-secondary-hover text-white';
      break;
    case 'outline':
      baseButtonClass = 'bg-transparent border border-primary text-primary hover:bg-primary/5';
      break;
    case 'primary':
    default:
      baseButtonClass = 'bg-primary hover:bg-primary-hover text-white';
      break;
  }

  const buttonClass = `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${baseButtonClass} ${buttonClassName}`;
  
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {showSignIn && (
        <button
          className={buttonClass}
          onClick={() => openForm('login')}
        >
          Sign In
        </button>
      )}
      
      {showSignUp && (
        <button
          className={buttonClass}
          onClick={() => openForm('register')}
        >
          Sign Up
        </button>
      )}
    </div>
  );
};

export default AuthButtons;