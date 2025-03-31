import * as React from "react";
import { cva, type VariantProps } from "@/lib/cva";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  // Removed base text-[#00000]
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-neutral-white hover:bg-primary/80", // Explicit light text
        secondary:
          "border-transparent bg-secondary text-neutral-light hover:bg-secondary/80", // Explicit light text
        destructive:
          "border-transparent bg-destructive text-neutral-white hover:bg-destructive/80", // Explicit light text
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
