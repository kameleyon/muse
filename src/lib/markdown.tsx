import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import ChartRenderer from '../components/ChartRenderer';

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

const CodeBlock: React.FC<CodeBlockProps> = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  if (!inline && match && match[1] === 'chart') {
    const childArray = React.Children.toArray(children);
    // Filter out only text nodes (strings or numbers) and convert them to strings.
    const textNodes = childArray.filter(
      (child): child is React.ReactText =>
        typeof child === 'string' || typeof child === 'number'
    );
    const data = textNodes.map(child => String(child)).join('');
    return <ChartRenderer data={data} />;
  }
  return (
    <pre className={className} {...props}>
      <code>{children}</code>
    </pre>
  );
};

// Cast CodeBlock to any to satisfy the expected type from ReactMarkdown.
const components: Components = {
  code: CodeBlock as unknown as React.ComponentType<any>
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
};

export default MarkdownRenderer;
