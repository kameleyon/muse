import React from 'react';
import { Card } from '@/components/ui/Card';
import ReactMarkdown from 'react-markdown'; 
import remarkGfm from 'remark-gfm'; 

interface GenerationPreviewProps {
  content?: string; 
}

const GenerationPreview: React.FC<GenerationPreviewProps> = ({ content }) => {
  return (
    // Removed min-h-[400px], added fixed height and flex-col
    <Card className="p-4 border border-neutral-light bg-white shadow-md h-[700px] flex flex-col"> {/* Example fixed height, adjust as needed */}
      <h4 className="font-semibold text-neutral-dark mb-2 text-center text-sm border-b pb-2 flex-shrink-0">Real-Time Preview</h4>
      {/* Added custom scrollbar classes (needs definition in global CSS) */}
      <div 
        className="flex-grow overflow-y-auto text-sm text-neutral-dark bg-white/50 p-2 rounded border border-neutral-light custom-scrollbar" // Added custom-scrollbar class
        style={{ overflowWrap: 'break-word' }}
      > 
        {content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
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