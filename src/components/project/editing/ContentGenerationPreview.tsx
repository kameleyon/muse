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
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    highlight?: string;
    background?: string;
  };
  fonts?: {
    headingFont?: string;
    bodyFont?: string;
  };
  visualOptions?: {
    enhanceVisuals?: boolean;
    showCharts?: boolean;
    showTables?: boolean;
    showDiagrams?: boolean;
    chartHeight?: number;
    animateCharts?: boolean;
  };
}

/**
 * An enhanced component that displays content generation with a typing effect and visualization capabilities
 */
const ContentGenerationPreview: React.FC<ContentGenerationPreviewProps> = ({
  content,
  onExport,
  className = '',
  brandColors = {
    primary: '#ae5630',
    secondary: '#232321',
    accent: '#9d4e2c',
    highlight: '#ff7300',
    background: '#ffffff'
  },
  fonts = {
    headingFont: 'Comfortaa, sans-serif',
    bodyFont: 'Questrial, sans-serif'
  },
  visualOptions = {
    enhanceVisuals: true,
    showCharts: true,
    showTables: true,
    showDiagrams: true,
    chartHeight: 250,
    animateCharts: true
  }
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

  // Toggle visual enhancements
  const [visualEnhancements, setVisualEnhancements] = useState(visualOptions.enhanceVisuals);
  const toggleVisualEnhancements = () => {
    setVisualEnhancements(!visualEnhancements);
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

      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2 mr-2">
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
        <div className="w-1/2 ml-2">
          <label className="flex items-center text-sm mb-1">
            <input
              type="checkbox"
              checked={visualEnhancements}
              onChange={toggleVisualEnhancements}
              className="mr-2"
            />
            Enhanced Visualizations
          </label>
          <div className="text-xs text-gray-500">
            {visualEnhancements ? "Rich charts, tables and diagrams" : "Simple text mode"}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border min-h-[300px] max-h-[500px] overflow-y-auto">
        {contentBlocks.length > 0 ? (
          <ContentBlockTyping
            blocks={contentBlocks}
            typingSpeed={typingSpeed}
            delayBetweenBlocks={500}
            onComplete={handleTypingComplete}
            brandColors={brandColors}
            fonts={fonts}
            options={{
              enhanceVisuals: visualEnhancements,
              showCharts: visualOptions.showCharts,
              showTables: visualOptions.showTables,
              showDiagrams: visualOptions.showDiagrams,
              chartHeight: visualOptions.chartHeight,
              animateCharts: visualOptions.animateCharts
            }}
          />
        ) : (
          <div className="text-gray-400 italic">No content to display</div>
        )}
      </div>
    </Card>
  );
};

export default ContentGenerationPreview;