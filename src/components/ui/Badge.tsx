import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary/20 text-primary-hover',
        secondary: 'bg-secondary/20 text-secondary',
        teal: 'bg-accent-teal/20 text-accent-teal',
        purple: 'bg-accent-purple/20 text-accent-purple',
        success: 'bg-success/20 text-success',
        error: 'bg-error/20 text-error',
        outline: 'bg-transparent border border-current'
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <div className={badgeVariants({ variant, className })} {...props} />
  );
};

export { Badge, badgeVariants };
