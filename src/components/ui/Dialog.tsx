import React, { ComponentPropsWithoutRef, ElementRef, HTMLAttributes } from 'react'; // Import necessary types
import * as DialogPrimitive from '@radix-ui/react-dialog';
import '../../styles/index.css';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

// Explicitly type the props using Radix types and React's ComponentPropsWithoutRef
const DialogOverlay = React.forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
      className={`
        fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        ${className || ''}`}
      {...props}
    />
  )
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Explicitly type the props using Radix types and React's ComponentPropsWithoutRef
const DialogContent = React.forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={`
          fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%]
          translate-y-[-50%] gap-4 border border-neutral-light bg-white p-6 shadow-lg duration-200
          data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
          data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
          data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
          rounded-xl ${className || ''}`} // Removed base font-questrial
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2 disabled:pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Explicitly type props for simple functional components
const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`} // Removed base font-questrial
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

// Explicitly type props for simple functional components
const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ''}`} // Removed base font-questrial
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

// Explicitly type the props using Radix types and React's ComponentPropsWithoutRef
const DialogTitle = React.forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
      className={`
        text-lg font-semibold leading-none tracking-tight
        text-secondary ${className || ''}`} // Removed base font-comfortaa
      {...props}
    />
  )
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Explicitly type the props using Radix types and React's ComponentPropsWithoutRef
const DialogDescription = React.forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
      className={`text-sm text-neutral-medium ${className || ''}`} // Removed base font-questrial
      {...props}
    />
  )
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
