import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import { RootState } from '@/store/store';
import { removeToast } from '@/store/slices/uiSlice';
import { Toast } from '../ui/Toast';

const ToastContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state: RootState) => state.ui);

  // Handle toast dismissal
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration !== 0) {
        const timer = setTimeout(() => {
          dispatch(removeToast(toast.id));
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;