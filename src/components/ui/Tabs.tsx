import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={`
      inline-flex h-10 items-center justify-center rounded-md bg-neutral-light/20 p-1 
      text-secondary dark:bg-neutral-dark dark:text-neutral-white ${className || ''}
    `}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={`
      inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium 
      transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal 
      disabled:pointer-events-none disabled:opacity-50 
      data-[state=active]:bg-white dark:data-[state=active]:bg-secondary 
      data-[state=active]:text-secondary dark:data-[state=active]:text-neutral-white
      data-[state=active]:shadow-sm ${className || ''}
    `}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={`
      mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal
      focus-visible:ring-offset-2 ${className || ''}
    `}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
