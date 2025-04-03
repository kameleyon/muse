import React, { forwardRef } from 'react';

interface ApiSectionProps {
  title: string;
  level?: number; // Optional level for heading (h2, h3, h4)
  children: React.ReactNode;
  className?: string; // Allow passing additional classes
}

// Wrap component definition with forwardRef
const ApiSection = forwardRef<HTMLElement, ApiSectionProps>(
  ({ title, level = 2, children, className = '' }, ref) => {
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    const getHeadingClasses = (lvl: number) => {
    // Added responsive text sizes (e.g., text-2xl sm:text-3xl)
    switch (lvl) {
      case 2:
        return "text-2xl sm:text-3xl font-heading text-primary mt-8 sm:mt-10 mb-4 sm:mb-6 border-b border-neutral-light pb-2 sm:pb-3";
      case 3:
        return "text-xl sm:text-2xl font-heading text-secondary mt-6 sm:mt-8 mb-3 sm:mb-4";
      case 4:
        return "text-lg sm:text-xl font-semibold text-neutral-dark mt-5 sm:mt-6 mb-2 sm:mb-3";
      default:
        return "text-2xl sm:text-3xl font-heading text-primary mt-8 sm:mt-10 mb-4 sm:mb-6 border-b border-neutral-light pb-2 sm:pb-3"; // Default to h2 style
    }
    };

    return (
      // Pass the ref to the underlying section element
      <section ref={ref} className={`api-section mb-8 ${className}`}>
        <HeadingTag className={getHeadingClasses(level)}>{title}</HeadingTag>
        <div className="prose prose-neutral max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none">
          {/* Prose styles for paragraphs, lists, etc. Reset pre/code styles as CodeBlock handles them */}
          {children}
        </div>
      </section>
    );
  }
);

// Add display name for better debugging
ApiSection.displayName = 'ApiSection';

export default ApiSection;
