import React from 'react';
import { Card } from '@/components/ui/Card';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface GenerationPreviewProps {
  content: string;
}

const GenerationPreview: React.FC<GenerationPreviewProps> = ({ content }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Content Preview</h3>
      
      <div className="blog-preview">
        {content ? (
          <div className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-primary prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-neutral-dark prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary-dark prose-code:bg-neutral-light/20 prose-code:px-1 prose-code:rounded prose-code:font-normal">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-neutral-muted mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h4 className="text-base font-medium text-neutral-dark mb-2">No Content Generated Yet</h4>
            <p className="text-sm text-neutral-muted">
              Generated content will appear here. Configure options and click "Generate Blog Content".
            </p>
          </div>
        )}
      </div>
      
      {content && (
        <div className="mt-6 pt-4 border-t border-neutral-light/40">
          <p className="text-xs text-neutral-muted">
            This is a live preview of your generated content. You'll be able to edit it in the next step.
          </p>
        </div>
      )}
    </Card>
  );
};

export default GenerationPreview;
