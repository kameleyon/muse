import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import ContentBlockTyping from '@/components/ui/ContentBlockTyping';
import { ContentBlock, splitMarkdownIntoBlocks } from '@/utils/contentBlockUtils';

interface ContentGenerationPreviewProps {
  content: string;
  onExport?: () => void;
  className?: string;
}

/**
 * A component that displays content generation with a typing effect
 */
const ContentGenerationPreview: React.FC<ContentGenerationPreviewProps> = ({
  content,
  onExport,
  className = ''
}) => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(30);
  const [isComplete, setIsComplete] = useState(false);

  // Split content into blocks when it changes
  useEffect(() => {
    if (content) {
      const blocks = splitMarkdownIntoBlocks(content);
      setContentBlocks(blocks);
      setIsComplete(false);
    }
  }, [content]);

  // Handle typing completion
  const handleTypingComplete = () => {
    setIsComplete(true);
    setIsPlaying(false);
  };

  // Reset the typing animation
  const handleReset = () => {
    setContentBlocks([]);
    setTimeout(() => {
      setContentBlocks(splitMarkdownIntoBlocks(content));
      setIsPlaying(true);
      setIsComplete(false);
    }, 100);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Adjust typing speed
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseInt(e.target.value);
    setTypingSpeed(newSpeed);
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Content Generation Preview</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePlayPause}
            disabled={isComplete}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
          >
            <RotateCcw size={16} className="mr-1" />
            Reset
          </Button>
          {onExport && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExport}
            >
              <Download size={16} className="mr-1" />
              Export
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="typingSpeed" className="block text-sm mb-1">
          Typing Speed: {typingSpeed}ms
        </label>
        <input
          id="typingSpeed"
          type="range"
          min="10"
          max="100"
          value={typingSpeed}
          onChange={handleSpeedChange}
          className="w-full"
        />
      </div>

      <div className="bg-white p-4 rounded-md border min-h-[300px] max-h-[500px] overflow-y-auto">
        {contentBlocks.length > 0 ? (
          <ContentBlockTyping
            blocks={contentBlocks}
            typingSpeed={typingSpeed}
            delayBetweenBlocks={500}
            onComplete={handleTypingComplete}
          />
        ) : (
          <div className="text-gray-400 italic">No content to display</div>
        )}
      </div>
    </Card>
  );
};

export default ContentGenerationPreview;