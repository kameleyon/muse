import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-1',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-1',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-1',
  };
  
  return (
    <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs bg-neutral-dark text-white rounded shadow max-w-xs w-max',
            positionClasses[position],
            className
          )}
        >
          {content}
          {/* Triangle pointer */}
          <div
            className={cn(
              'absolute w-0 h-0 border-solid',
              position === 'top' && 'border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-dark -bottom-1 left-1/2 transform -translate-x-1/2',
              position === 'bottom' && 'border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-neutral-dark -top-1 left-1/2 transform -translate-x-1/2',
              position === 'left' && 'border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-neutral-dark -right-1 top-1/2 transform -translate-y-1/2',
              position === 'right' && 'border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-neutral-dark -left-1 top-1/2 transform -translate-y-1/2'
            )}
          />
        </div>
      )}
      {children}
    </div>
  );
};