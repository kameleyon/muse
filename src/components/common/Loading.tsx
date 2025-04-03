import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = false, 
  message = 'Loading...' 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="flex space-x-2 mb-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full bg-primary animate-pulse`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      {message && <p className="text-neutral-medium">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
