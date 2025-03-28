"use client"; // Assuming Next.js or similar environment, adjust if needed

import React from "react"; // Use standard import
import * as AccordionPrimitive from "@radix-ui/react-accordion"; // Use Radix UI primitives
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils"; // Use the existing utility

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-neutral-light/40", className)} // Style the item separator
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", // Basic trigger styles
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" // Basic content styles + animations
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div> 
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

// NOTE: This requires adding accordion animations to tailwind.config.js
// Example for tailwind.config.js:
/*
 extend: {
   keyframes: {
     "accordion-down": {
       from: { height: "0" },
       to: { height: "var(--radix-accordion-content-height)" },
     },
     "accordion-up": {
       from: { height: "var(--radix-accordion-content-height)" },
       to: { height: "0" },
     },
   },
   animation: {
     "accordion-down": "accordion-down 0.2s ease-out",
     "accordion-up": "accordion-up 0.2s ease-out",
   },
 },
*/