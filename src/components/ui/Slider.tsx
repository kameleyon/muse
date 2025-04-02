import React from 'react';
import { cn } from '@/lib/utils';

// Omit the standard 'onChange' to avoid type conflict and define our custom one
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ 
    className, 
    min = 0, 
    max = 100, 
    step = 1, 
    value, 
    defaultValue, 
    onChange,
    trackClassName,
    thumbClassName,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || min);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    
    // Calculate the percentage for styling
    const percent = ((currentValue - min) / (max - min)) * 100;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };
    
    return (
      <div className={cn("relative w-full pt-1", className)}>
        <div 
          className={cn(
            "absolute h-2 rounded-full bg-neutral-light/50",
            trackClassName
          )}
          style={{ 
            width: '100%',
            top: '14px',
          }}
        />
        <div
          className={cn(
            "absolute h-2 rounded-full bg-accent-teal",
            trackClassName
          )}
          style={{ 
            width: `${percent}%`,
            top: '14px',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          className={cn(
            "appearance-none w-full h-2 bg-transparent cursor-pointer focus:outline-none",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-teal [&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-teal [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer",
            "[&:focus::-webkit-slider-thumb]:ring-2 [&:focus::-webkit-slider-thumb]:ring-accent-teal/50",
            "[&:focus::-moz-range-thumb]:ring-2 [&:focus::-moz-range-thumb]:ring-accent-teal/50",
            thumbClassName
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
