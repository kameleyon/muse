import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Form = forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form ref={ref} className={cn('space-y-6', className)} {...props} />
));

Form.displayName = 'Form';

const FormGroup = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props} />
));

FormGroup.displayName = 'FormGroup';

const FormLabel = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('block text-sm font-medium text-secondary dark:text-neutral-white', className)}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-error">*</span>}
  </label>
));

FormLabel.displayName = 'FormLabel';

const FormHint = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('mt-1 text-sm text-neutral-medium', className)}
    {...props}
  />
));

FormHint.displayName = 'FormHint';

const FormError = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('mt-1 text-sm text-error', className)}
    {...props}
  />
));

FormError.displayName = 'FormError';

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

export { Form, FormGroup, FormLabel, FormHint, FormError, FormActions };
