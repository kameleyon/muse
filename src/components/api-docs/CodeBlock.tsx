import React from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children }) => {
  return (
    // Removed overflow-x-auto, adjusted padding
    <pre className="bg-neutral-lightest p-3 sm:p-4 rounded-md my-3 sm:my-4 border border-neutral-light/50 shadow-sm text-primary whitespace-pre-wrap break-words">
      {/* Increased text contrast, enabled wrapping */}
      <code className="text-xs sm:text-sm font-mono text-neutral-darkest">
        {children}
      </code>
    </pre>
  );
};

export default CodeBlock;
