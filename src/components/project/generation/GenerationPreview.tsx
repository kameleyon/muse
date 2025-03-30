import React from 'react';
import { Card } from '@/components/ui/Card';
import ReactMarkdown from 'react-markdown'; 
import remarkGfm from 'remark-gfm';

interface GenerationPreviewProps {
  content?: string;
  templateId?: string;
  brandColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts?: {
    headingFont: string;
    bodyFont: string;
  };
}

const GenerationPreview: React.FC<GenerationPreviewProps> = ({ 
  content,
  templateId = 'default',
  brandColors = { 
    primary: '#333333', 
    secondary: '#666666', 
    accent: '#0077cc' 
  },
  fonts = {
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif'
  }
}) => {
  // Apply template-specific styling
  const getTemplateStyles = () => {
    // Base styles for all templates
    const baseStyles = {
      '--primary-color': brandColors.primary,
      '--secondary-color': brandColors.secondary,
      '--accent-color': brandColors.accent,
      '--heading-font': fonts.headingFont,
      '--body-font': fonts.bodyFont,
    } as React.CSSProperties;
    
    // Template-specific style variations
    switch(templateId) {
      case 'modern':
        return {
          ...baseStyles,
          backgroundColor: '#fafafa',
          color: '#333',
          padding: '1.5rem',
          borderRadius: '8px',
        };
      case 'classic':
        return {
          ...baseStyles,
          backgroundColor: '#fff',
          color: '#444',
          padding: '1rem',
          border: `1px solid ${brandColors.secondary}40`,
        };
      case 'minimal':
        return {
          ...baseStyles,
          backgroundColor: '#fff',
          color: '#222',
          padding: '1rem',
        };
      case 'bold':
        return {
          ...baseStyles,
          backgroundColor: brandColors.primary + '10',
          color: '#333',
          padding: '1.25rem',
          borderLeft: `4px solid ${brandColors.accent}`,
        };
      default:
        return baseStyles;
    }
  };

  // Custom components for markdown rendering with template styles
  const markdownComponents = {
    h1: ({ node, ...props }: any) => (
      <h1 
        style={{ 
          color: brandColors.primary,
          fontFamily: fonts.headingFont,
          fontSize: '1.8rem',
          borderBottom: `1px solid ${brandColors.primary}30`,
          paddingBottom: '0.5rem',
          marginBottom: '1rem'
        }} 
        {...props} 
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 
        style={{ 
          color: brandColors.secondary,
          fontFamily: fonts.headingFont,
          fontSize: '1.5rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem'
        }} 
        {...props} 
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 
        style={{ 
          color: brandColors.secondary,
          fontFamily: fonts.headingFont,
          fontSize: '1.25rem',
          marginTop: '1.25rem',
          marginBottom: '0.5rem'
        }} 
        {...props} 
      />
    ),
    p: ({ node, ...props }: any) => (
      <p 
        style={{ 
          fontFamily: fonts.bodyFont,
          marginBottom: '0.75rem',
          lineHeight: '1.6',
          fontSize: '0.95rem'
        }} 
        {...props} 
      />
    ),
    ul: ({ node, ...props }: any) => (
      <ul 
        style={{ 
          paddingLeft: '1.5rem',
          marginBottom: '1rem'
        }} 
        {...props} 
      />
    ),
    li: ({ node, ...props }: any) => (
      <li 
        style={{ 
          fontFamily: fonts.bodyFont,
          marginBottom: '0.25rem',
          fontSize: '0.95rem'
        }} 
        {...props} 
      />
    ),
    a: ({ node, ...props }: any) => (
      <a 
        style={{ 
          color: brandColors.accent,
          textDecoration: 'none'
        }} 
        {...props} 
      />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote 
        style={{ 
          borderLeft: `3px solid ${brandColors.accent}`,
          paddingLeft: '1rem',
          fontStyle: 'italic',
          color: brandColors.secondary,
          margin: '1rem 0'
        }} 
        {...props} 
      />
    ),
    pre: ({ node, ...props }: any) => (
      <pre 
        style={{ 
          backgroundColor: '#f7f7f7',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          marginBottom: '1rem'
        }} 
        {...props} 
      />
    ),
    img: ({ node, ...props }: any) => (
      <img 
        style={{ 
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '4px',
          margin: '1rem 0'
        }} 
        {...props} 
      />
    ),
    // Process visual data blocks specially
    code: ({ node, className, ...props }: any) => {
      if (className === 'language-visual-data' || className === 'language-visual-specification') {
        return (
          <div
            style={{
              backgroundColor: `${brandColors.primary}10`,
              border: `1px solid ${brandColors.primary}30`,
              borderRadius: '6px',
              padding: '0.75rem',
              marginBottom: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              position: 'relative',
              overflow: 'auto'
            }}
          >
            <div style={{ 
              color: brandColors.primary,
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              fontFamily: fonts.headingFont
            }}>
              Visual Element Data
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {props.children}
            </pre>
          </div>
        );
      }
      return <code {...props} />;
    }
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white shadow-md h-[700px] flex flex-col">
      <h4 className="font-semibold text-neutral-dark mb-2 text-center text-sm border-b pb-2 flex-shrink-0">
        Real-Time Preview
      </h4>
      <div 
        className={`flex-grow overflow-y-auto text-sm text-neutral-dark bg-white/50 p-2 rounded border border-neutral-light custom-scrollbar template-${templateId}`}
        style={{ overflowWrap: 'break-word', ...getTemplateStyles() }}
      > 
        {content ? (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <p className="text-neutral-medium italic text-center mt-10">
            Click "Start Content Generation" to begin...
          </p>
        )}
      </div>
    </Card>
  );
};

export default GenerationPreview;