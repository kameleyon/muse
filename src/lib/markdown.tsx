import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { ChartRenderer } from '../components/ChartRenderer'; // Corrected import
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children, ...props }) => {
  const rawContent = String(children).trim();
  const langMatch = /language-(\w+)/.exec(className || '');
  const lang = langMatch?.[1];

  if (!inline && lang === 'chart') {
    // Pass an empty colors object to satisfy the prop requirement.
    // ChartRenderer will use its internal defaults.
    return <ChartRenderer data={rawContent} colors={{}} />;
  }

  return (
    <pre className={className} {...props}>
      <code>{children}</code>
    </pre>
  );
};

const components: Components = {
  code: CodeBlock as unknown as React.ComponentType<any>
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{content}</ReactMarkdown>;
};

export default MarkdownRenderer;
