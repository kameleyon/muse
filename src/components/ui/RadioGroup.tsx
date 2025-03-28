import React from 'react';
import { cn } from '@/lib/utils'; // Assuming utils exists for class merging

// Context to share state between RadioGroup and RadioGroupItem
interface RadioGroupContextProps {
  value: string;
  onValueChange: (value: string) => void;
  name?: string; // Optional name for native radio grouping
}

const RadioGroupContext = React.createContext<RadioGroupContextProps | null>(null);

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string; // The controlled value of the selected radio item
  onValueChange: (value: string) => void; // Callback when the value changes
  name?: string; // Optional name attribute for the radio inputs
  defaultValue?: string; // Optional default value (if uncontrolled) - Not used in this controlled example
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, name, children, ...props }, ref) => {
    // Provide context to children
    const contextValue = React.useMemo(() => ({ value, onValueChange, name }), [value, onValueChange, name]);
    return (
      <RadioGroupContext.Provider value={contextValue}>
        {/* The role="radiogroup" is important for accessibility */}
        <div ref={ref} role="radiogroup" className={cn("grid gap-2", className)} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

// Hook for RadioGroupItem to access context
export const useRadioGroupContext = () => {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error("useRadioGroupContext must be used within a <RadioGroup>");
  }
  return context;
};

export { RadioGroup };