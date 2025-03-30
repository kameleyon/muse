// Simple implementation of class-variance-authority for our components

export type VariantProps<T extends (...args: any) => any> = 
  Parameters<T>[0] extends { variants: infer V } 
    ? { [K in keyof V]?: keyof V[K] } 
    : never;

export interface CvaOptions {
  variants?: Record<string, Record<string, string>>;
  defaultVariants?: Record<string, string>;
}

export const cva = (base: string, options?: CvaOptions) => {
  return (props?: { variant?: string; className?: string }) => {
    const { variants = {}, defaultVariants = {} } = options || {};
    const { variant, className = "" } = props || {};
    
    // Start with the base class
    let result = base;
    
    // Add the variant classes if they exist
    if (variant && variants[variant]) {
      result += " " + variants[variant];
    } else if (defaultVariants.variant && variants[defaultVariants.variant]) {
      // Or use the default variant
      result += " " + variants[defaultVariants.variant];
    }
    
    // Add the extra className if provided
    if (className) {
      result += " " + className;
    }
    
    return result;
  };
};