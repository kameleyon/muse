import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

// Custom type for the context value
interface PopoverContextValue {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
}

const PopoverContext = React.createContext<PopoverContextValue>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
  contentRef: { current: null },
});

const Popover = ({ open: controlledOpen, onOpenChange, children }: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  
  // This function handles both direct boolean values and updater functions
  const setOpen = (value: boolean | ((prev: boolean) => boolean)) => {
    // If it's a function, calculate the new value
    const newValue = typeof value === 'function' ? value(open) : value;
    
    if (!isControlled) {
      setUncontrolledOpen(newValue);
    }
    onOpenChange?.(newValue);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        contentRef.current &&
        triggerRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      {children}
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  const { open, setOpen, triggerRef } = React.useContext(PopoverContext);
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOpen(!open);
    props.onClick?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: triggerRef,
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <div ref={triggerRef} onClick={handleClick} {...props}>
      {children}
    </div>
  );
});
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open, contentRef } = React.useContext(PopoverContext);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 w-72 max-w-[16rem] rounded-md border border-gray-200 bg-white shadow-md",
        className
      )}
      style={{ marginTop: '4px', maxHeight: '250px', overflowY: 'auto' }}
      {...props}
    />
  );
});
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };