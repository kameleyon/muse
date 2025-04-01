import React, { useState, useEffect } from 'react';
import TypingEffect from './TypingEffect';
import { MarkdownVisualizer } from '@/components/content/visualization/MarkdownVisualizer';

interface ContentBlock {
  id: string;
  content: string;
  type?: 'heading' | 'paragraph' | 'list' | 'code' | 'quote';
}

interface ContentBlockTypingProps {
  blocks: ContentBlock[];
  onComplete?: () => void;
  typingSpeed?: number;
  delayBetweenBlocks?: number;
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
  options?: {
    enhanceVisuals?: boolean;
    showCharts?: boolean;
    showTables?: boolean;
    showDiagrams?: boolean;
    chartHeight?: number;
    animateCharts?: boolean;
  };
}

/**
 * An enhanced component that displays content blocks with typing animation and rich visualizations
 */
const ContentBlockTyping: React.FC<ContentBlockTypingProps> = ({
  blocks,
  onComplete,
  typingSpeed = 30,
  delayBetweenBlocks = 500,
  className = '',
  brandColors = {
    primary: '#ae5630',
    secondary: '#232321',
    accent: '#9d4e2c',
    highlight: '#ff7300',
    background: '#ffffff'
  },
  fonts = {
    headingFont: 'system-ui, sans-serif',
    bodyFont: 'system-ui, sans-serif'
  },
  options = {
    enhanceVisuals: true,
    showCharts: true,
    showTables: true,
    showDiagrams: true,
    chartHeight: 250,
    animateCharts: true
  }
}) => {
  const [visibleBlocks, setVisibleBlocks] = useState<string[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Start typing the next block
  useEffect(() => {
    if (currentBlockIndex < blocks.length && !isTyping) {
      setIsTyping(true);
      setVisibleBlocks(prev => [...prev, blocks[currentBlockIndex].id]);
    } else if (currentBlockIndex >= blocks.length && !isTyping) {
      // All blocks have been typed
      onComplete?.();
    }
  }, [currentBlockIndex, blocks, isTyping, onComplete]);

  // Handle block typing completion
  const handleBlockTyped = () => {
    setIsTyping(false);
    
    // Add delay before starting the next block
    setTimeout(() => {
      setCurrentBlockIndex(prev => prev + 1);
    }, delayBetweenBlocks);
  };

  // Get the appropriate CSS class based on block type
  const getBlockClass = (type?: string) => {
    switch (type) {
      case 'heading':
        return 'text-xl font-bold mb-4';
      case 'paragraph':
        return 'mb-4';
      case 'list':
        return 'mb-4 pl-4';
      case 'code':
        return 'mb-4 font-mono bg-gray-100 p-2 rounded';
      case 'quote':
        return 'mb-4 pl-4 border-l-4 border-gray-300 italic';
      default:
        return 'mb-4';
    }
  };

  // Check if a block contains chart, table, or diagram, respecting options
  const hasVisualElement = (content: string): boolean => {
    const showCharts = options.showCharts ?? true;
    const showTables = options.showTables ?? true;
    const showDiagrams = options.showDiagrams ?? true;
    return (
      (content.includes('```chart') && showCharts) ||
      (content.includes('|') && content.includes('--') && showTables) || // Basic check for markdown table syntax
      (content.includes('```diagram') && showDiagrams)
    );
  };

  return (
    <div className={`content-blocks ${className}`}>
      {blocks.map((block, index) => (
        <div 
          key={block.id} 
          className={`content-block ${getBlockClass(block.type)}`}
          style={{ display: visibleBlocks.includes(block.id) ? 'block' : 'none' }}
        >
          {visibleBlocks.includes(block.id) && currentBlockIndex === index && (
            hasVisualElement(block.content) ? (
              // For blocks with charts/tables, use typing effect then render with visualization
              <>
                <TypingEffect 
                  text={block.content} 
                  speed={typingSpeed}
                  onComplete={handleBlockTyped}
                  className="typing-container"
                />
                <div className="visual-container" style={{ opacity: 0 }}>
                  <MarkdownVisualizer 
                    content={block.content}
                    enhanceVisuals={options.enhanceVisuals}
                    brandColors={brandColors}
                    fonts={fonts}
                    options={{
                      showCharts: options.showCharts,
                      showTables: options.showTables,
                      showDiagrams: options.showDiagrams,
                      chartHeight: options.chartHeight,
                      animateCharts: options.animateCharts
                    }}
                  />
                </div>
              </>
            ) : (
              // For regular text blocks, use standard typing effect
              <TypingEffect 
                text={block.content} 
                speed={typingSpeed}
                onComplete={handleBlockTyped}
              />
            )
          )}
          
          {visibleBlocks.includes(block.id) && currentBlockIndex !== index && (
            hasVisualElement(block.content) ? (
              // For completed blocks with charts/tables, render with visualization
              <MarkdownVisualizer 
                content={block.content}
                enhanceVisuals={options.enhanceVisuals}
                brandColors={brandColors}
                fonts={fonts}
                options={{
                  showCharts: options.showCharts,
                  showTables: options.showTables,
                  showDiagrams: options.showDiagrams,
                  chartHeight: options.chartHeight,
                  animateCharts: options.animateCharts
                }}
              />
            ) : (
              // For completed regular text blocks, render as is
              <div>{block.content}</div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default ContentBlockTyping;
