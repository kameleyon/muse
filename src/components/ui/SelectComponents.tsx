import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// Create context for the Select
interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

const SelectContext = createContext<SelectContextType>({});

// Export a hook to use the Select context
export const useSelectContext = () => useContext(SelectContext);

// Root component
interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, defaultValue, open, onOpenChange, disabled = false, children, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '');
    const [internalOpen, setInternalOpen] = React.useState(false);
    
    // If value is passed, component is controlled, otherwise use internal state
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    
    const isOpenControlled = open !== undefined;
    const isOpen = isOpenControlled ? open : internalOpen;
    
    const handleValueChange = React.useCallback((newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
      
      // Close the menu when a value is selected
      if (!isOpenControlled) {
        setInternalOpen(false);
      } else {
        onOpenChange?.(false);
      }
    }, [isControlled, onValueChange, isOpenControlled, onOpenChange]);
    
    const handleOpenChange = React.useCallback((newOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    }, [isOpenControlled, onOpenChange]);
    
    return (
      <SelectContext.Provider
        value={{ 
          value: currentValue, 
          onValueChange: handleValueChange, 
          open: isOpen, 
          onOpenChange: handleOpenChange,
          disabled
        }}
      >
        <div 
          ref={ref} 
          className={cn("relative inline-block w-full", className)}
          {...props}
        >
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);

Select.displayName = 'Select';

// Trigger component
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { value, open, onOpenChange, disabled } = useSelectContext();
    
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-neutral-light bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-accent-teal",
          className
        )}
        onClick={() => onOpenChange?.(!open)}
        disabled={disabled}
        aria-expanded={open}
        {...props}
      >
        <span className="truncate">{children}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={cn("h-4 w-4 transition-transform", open && "transform rotate-180")}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

// Value component (to display the selected value)
interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder = "Select an option", ...props }, ref) => {
    const { value } = useSelectContext();
    
    return (
      <span
        ref={ref}
        className={cn("truncate", !value && "text-neutral-muted", className)}
        {...props}
      >
        {value || placeholder}
      </span>
    );
  }
);

SelectValue.displayName = 'SelectValue';

// Content component (dropdown menu)
interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = useSelectContext();
    
    if (!open) return null;
    
    return (
      <div 
        ref={ref}
        className={cn(
          "absolute z-50 mt-1 w-full rounded-md border border-neutral-light bg-white shadow-md",
          className
        )}
        {...props}
      >
        <div className="p-1">{children}</div>
      </div>
    );
  }
);

SelectContent.displayName = 'SelectContent';

// Item component
interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange, disabled: groupDisabled } = useSelectContext();
    const isSelected = selectedValue === value;
    
    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center rounded-sm px-2 py-1.5 text-sm focus:bg-neutral-light/50 focus:outline-none",
          isSelected && "bg-accent-teal/10 font-medium text-accent-teal",
          className
        )}
        onClick={() => onValueChange?.(value)}
        disabled={groupDisabled || props.disabled}
        {...props}
      >
        <span>{children}</span>
        {isSelected && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="ml-auto h-4 w-4"
          >
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        )}
      </button>
    );
  }
);

SelectItem.displayName = 'SelectItem';

// Export all components
export { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
};
