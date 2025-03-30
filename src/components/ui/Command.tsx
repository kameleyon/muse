import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CommandProps {
  className?: string;
  children: React.ReactNode;
}

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

interface CommandItemProps {
  className?: string;
  onSelect?: (value: string) => void;
  value: string;
  children: React.ReactNode;
}

const Command = forwardRef<HTMLDivElement, CommandProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col rounded-md", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Command.displayName = "Command";

const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, value, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <div className="flex items-center border-b border-gray-200 px-3">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
CommandInput.displayName = "CommandInput";

const CommandEmpty = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { showOnlyIfEmpty?: boolean }>(
  ({ className, showOnlyIfEmpty = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("py-3 text-center text-sm text-gray-500", className)}
      {...props}
    />
  )
);
CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("overflow-hidden p-1 max-h-64 overflow-y-auto", className)}
      {...props}
    />
  )
);
CommandGroup.displayName = "CommandGroup";

const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, onSelect, value, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100",
          className
        )}
        onClick={() => onSelect?.(value)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CommandItem.displayName = "CommandItem";

export { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem };