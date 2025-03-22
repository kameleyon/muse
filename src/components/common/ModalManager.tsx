import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ContentDetailModal from '@/components/content/ContentDetailModal';
import Loading from '@/components/common/Loading';

/**
 * Modal Manager Component
 * 
 * Central component that handles displaying different modals throughout the application
 * based on the current modalState in the Redux store.
 */
const ModalManager: React.FC = () => {
  const { modalState } = useSelector((state: RootState) => state.ui);
  const { type, isOpen, data } = modalState;

  // Only render if modal is open
  if (!isOpen) return null;

  // Render different modals based on the type
  switch (type) {
    case 'contentDetail':
      return <ContentDetailModal content={data} />;
      
    // Additional modal types can be added here
    case 'loading':
      return <Loading />;
      
    default:
      return null;
  }
};

export default ModalManager;
