import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/Button';

interface ContentGeneratorPreviewProps {
  content: string;
  isGenerating: boolean;
  onExport: () => void;
}

const ContentGeneratorPreview: React.FC<ContentGeneratorPreviewProps> = ({
  content,
  isGenerating,
  onExport
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
    dispatch(
      addToast({
        type: 'success',
        message: 'Content copied to clipboard',
      })
    );
  };

  const handleSaveToLibrary = () => {
    // In a real app, this would save the content to the library
    dispatch(
      addToast({
        type: 'success',
        message: 'Content saved to library',
      })
    );
    navigate('/app/library');
  };

  return (
    <div>
      <div
        className={`bg-white    border border-neutral-light    rounded-md p-4 min-h-[400px] max-h-[600px] overflow-y-auto ${
          isGenerating ? 'animate-pulse' : ''
        }`}
      >
        {isGenerating ? (
          <div className="flex flex-col space-y-4">
            <div className="h-4 bg-neutral-light    rounded w-3/4"></div>
            <div className="h-4 bg-neutral-light    rounded w-1/2"></div>
            <div className="h-4 bg-neutral-light    rounded w-5/6"></div>
            <div className="h-4 bg-neutral-light    rounded w-2/3"></div>
            <div className="h-4 bg-neutral-light    rounded w-3/4"></div>
            <div className="h-4 bg-neutral-light    rounded w-1/2"></div>
            <div className="h-4 bg-neutral-light    rounded w-5/6"></div>
          </div>
        ) : content ? (
          <div className="prose    max-w-none">
            {/* In a real app, we'd use a markdown renderer here */}
            <pre className="whitespace-pre-wrap font-sans">{content}</pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <p className="text-center">
              Fill out the form and click "Generate Content" to create
              your content
            </p>
          </div>
        )}
      </div>
      
      {content && (
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handleCopyToClipboard}
          >
            Copy
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onExport}
            >
              Export
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveToLibrary}
            >
              Save
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/app/library')}
            >
              Edit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGeneratorPreview;