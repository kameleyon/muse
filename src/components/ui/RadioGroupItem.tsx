import React from 'react';
import { cn } from '@/lib/utils';
import { useRadioGroupContext } from './RadioGroup'; // Import the hook
import { Check } from 'lucide-react'; // Icon for the indicator

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string; // The value associated with this radio item
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, children, id, ...props }, ref) => {
    const context = useRadioGroupContext(); // Get context from parent RadioGroup
    const isChecked = context.value === value;

    return (
      // We use a button-like structure for styling flexibility, containing a hidden native input
      // The Label component in the form will associate with the input via `htmlFor={id}`
      <div className={cn("relative flex items-center", className)}>
         <input
           type="radio"
           ref={ref}
           id={id} // Ensure ID is passed for label association
           value={value}
           checked={isChecked}
           onChange={() => context.onValueChange?.(value)} // Use context handler with optional chaining
           name={context.name} // Use name from context
           className="absolute opacity-0 w-0 h-0" // Hide native input visually but keep accessible
           {...props}
         />
         {/* Custom indicator */}
         <span
           aria-hidden="true"
           className={cn(
             "h-4 w-4 rounded-full border border-primary flex items-center justify-center transition-colors",
             isChecked ? "bg-primary text-primary-foreground" : "bg-transparent",
             className // Allow overriding styles
           )}
         >
           {isChecked && <Check className="h-3 w-3" />}
         </span>
         {/* Render children (often the Label) next to the indicator */}
         {children}
      </div>

    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroupItem };