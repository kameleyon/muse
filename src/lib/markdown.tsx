import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Component for rendering markdown content with custom styling
 */
export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-sm max-w-none prose-headings:font-semibold prose-p:mb-2 prose-ul:list-disc prose-ol:list-decimal ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

/**
 * Utility function to check if content contains markdown
 */
export const containsMarkdown = (content: string): boolean => {
  // Check for common markdown patterns
  const markdownPatterns = [
    /[*_]{1,2}[^*_]+[*_]{1,2}/, // Bold or italic
    /^#+\s+/, // Headers
    /^(-|\*|\+|\d+\.)\s+/, // Lists
    /!\[.*\]\(.*\)/, // Images
    /\[.*\]\(.*\)/, // Links
    /`[^`]+`/, // Inline code
    /```[\s\S]*?```/, // Code blocks
    /^\s*>.*$/ // Blockquotes
  ];

  return markdownPatterns.some(pattern => pattern.test(content));
};
