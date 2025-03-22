import React, { ComponentType } from 'react';
import AuthModal from './AuthModal';

interface WithAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// Higher order component to wrap any auth form with the modal
const withAuthModal = <P extends object>(
  Component: ComponentType<P>,
  defaultTitle: string = 'Authentication'
) => {
  return function WithAuthModalComponent(props: P & WithAuthModalProps) {
    const { isOpen, onClose, title = defaultTitle, ...componentProps } = props;

    return (
      <AuthModal isOpen={isOpen} onClose={onClose} title={title}>
        <Component {...componentProps as P} />
      </AuthModal>
    );
  };
};

export default withAuthModal;
