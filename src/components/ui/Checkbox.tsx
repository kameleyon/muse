import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, id, ...props }, ref) => {
    // Handle input change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(event.target.checked);
    };

    return (
      <div className={cn("relative flex items-center", className)}>
        <input
          type="checkbox"
          ref={ref}
          id={id}
          checked={checked}
          onChange={handleChange}
          className="absolute opacity-0 w-0 h-0" // Hide native input visually but keep accessible
          {...props}
        />
        {/* Custom checkbox indicator */}
        <span
          aria-hidden="true"
          className={cn(
            "h-4 w-4 rounded border border-neutral-medium flex items-center justify-center transition-colors",
            checked ? "bg-primary border-primary" : "bg-transparent",
          )}
        >
          {checked && <Check className="h-3 w-3 text-white" />}
        </span>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
