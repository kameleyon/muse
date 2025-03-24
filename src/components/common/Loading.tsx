import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = false, 
  message = 'Loading...' 
}) => {
  const loadingContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const loadingCircle = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        repeat: Infinity,
        repeatType: 'reverse' as const,
        duration: 0.6,
      },
    },
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-6">
      <motion.div
        className="flex space-x-2 mb-3"
        variants={loadingContainer}
        initial="hidden"
        animate="show"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-primary"
            variants={loadingCircle}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </motion.div>
      {message && <p className="text-neutral-medium">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white    bg-opacity-80   ">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
