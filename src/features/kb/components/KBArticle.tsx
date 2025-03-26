// src/features/kb/components/KBArticle.tsx
import React from 'react';
import { MarkdownContent } from '../../../lib/markdown'; // Adjust path if needed

interface KBArticleProps {
  content: string; // Markdown content
  className?: string;
}

/**
 * Renders markdown content for a knowledge base article
 * using the themed MarkdownContent component.
 */
export const KBArticle: React.FC<KBArticleProps> = ({ content, className = '' }) => {
  // The MarkdownContent component already applies themed prose styles
  return (
    <article className={`kb-article ${className}`}>
      <MarkdownContent content={content} />
    </article>
  );
};

export default KBArticle;