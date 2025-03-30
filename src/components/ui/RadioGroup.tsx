import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

// Create a context for the radio group
interface RadioGroupContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

const RadioGroupContext = createContext<RadioGroupContextType>({});

// Export a hook to use the RadioGroup context
export const useRadioGroupContext = () => useContext(RadioGroupContext);

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  defaultValue?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  name,
  defaultValue,
  children,
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  // If value is passed, component is controlled, otherwise use internal state
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  
  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <RadioGroupContext.Provider
      value={{ value: currentValue, onValueChange: handleValueChange, name }}
    >
      <div role="radiogroup" className={className} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

// Note: RadioGroupItem component is now in its own file
export { RadioGroup };