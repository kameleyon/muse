import React, { HTMLAttributes, forwardRef, createContext, useContext, useId } from 'react';
import { cn } from '@/utils/cn';
import { Slot, Slottable } from '@radix-ui/react-slot'; // Import Slottable
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';

// --- Form Component ---
const Form = forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  // Note: Removed default space-y-6, apply spacing in specific forms or FormItems if needed
  <form ref={ref} className={cn(className)} {...props} />
));
Form.displayName = 'Form';

// --- FormField Context ---
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
}
const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

// --- FormItem Context ---
type FormItemContextValue = {
  id: string;
}
const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

// --- useFormField Hook ---
// Combined context access and state retrieval
const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext; // Base ID from FormItem

  return {
    id: `${id}-form-item`, // Consistent ID for the input element itself
    name: fieldContext.name,
    formItemId: `${id}-form-item`, // Keep for potential legacy use? Or remove? Let's keep for label htmlFor
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// --- FormItem Component (Used as FormGroup) ---
const FormItem = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = useId(); // Generate unique ID for this form item group

  return (
    <FormItemContext.Provider value={{ id }}>
      {/* Apply spacing here if desired for each group */}
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

// --- FormField Component (Uses Controller) ---
// This component now correctly integrates Controller
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props // Pass all ControllerProps (name, control, render, rules, etc.)
}: ControllerProps<TFieldValues, TName>) => {
  return (
    // Provide field name context for children (Label, Message, etc.)
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

// --- FormLabel Component ---
const FormLabel = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => {
  const { error, formItemId } = useFormField(); // Get the generated input ID

  return (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium text-secondary',
        error ? "text-error" : "", // Style label based on error state
        className
      )}
      htmlFor={formItemId} // Point label to the input
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-error">*</span>}
    </label>
  );
});
FormLabel.displayName = 'FormLabel';

// --- FormControl Component (Uses Slot) ---
// This component acts as a bridge for props to the actual input
const FormControl = forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    // Slot passes its props to its immediate child
    <Slot
      ref={ref}
      id={formItemId} // Assign the ID to the input
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}` // Link input to description and message
      }
      aria-invalid={!!error} // Set aria-invalid based on error state
      {...props}
      // The actual input (e.g., <Input />, <textarea />) is rendered here
      // via the Controller's render prop passed down through FormField
    />
  );
});
FormControl.displayName = "FormControl";

// --- FormDescription Component (Used as FormHint) ---
const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField(); // Get the generated ID

  return (
    <p
      ref={ref}
      id={formDescriptionId} // Assign the ID
      className={cn('text-sm text-neutral-medium', className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

// --- FormMessage Component (Used as FormError) ---
const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField(); // Get error state and ID
  const body = error ? String(error?.message) : children; // Display error message or explicit children

  if (!body) {
    return null; // Don't render if no error and no children
  }

  return (
    <p
      ref={ref}
      id={formMessageId} // Assign the ID
      className={cn('text-sm font-medium text-error', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

// --- Form Actions ---
const FormActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-end gap-4 pt-4', className)}
    {...props}
  />
));
FormActions.displayName = 'FormActions';


// --- Aliases for backward compatibility / semantic preference ---
const FormGroup = FormItem;
const FormHint = FormDescription;
const FormError = FormMessage;

// --- Exports ---
export {
  useFormField,
  Form,
  FormItem,
  FormGroup, // Export alias
  FormLabel,
  FormControl,
  FormDescription,
  FormHint, // Export alias
  FormMessage,
  FormError, // Export alias
  FormField,
  // FormProvider, // Remove re-export, import directly where needed
  FormActions,
};
