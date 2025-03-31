import React, { useState, useEffect } from 'react';
import TypingEffect from './TypingEffect';

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
}

/**
 * A component that displays content blocks with a typing animation effect
 */
const ContentBlockTyping: React.FC<ContentBlockTypingProps> = ({
  blocks,
  onComplete,
  typingSpeed = 30,
  delayBetweenBlocks = 500,
  className = ''
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

  return (
    <div className={`content-blocks ${className}`}>
      {blocks.map((block, index) => (
        <div 
          key={block.id} 
          className={`content-block ${getBlockClass(block.type)}`}
          style={{ display: visibleBlocks.includes(block.id) ? 'block' : 'none' }}
        >
          {visibleBlocks.includes(block.id) && currentBlockIndex === index && (
            <TypingEffect 
              text={block.content} 
              speed={typingSpeed}
              onComplete={handleBlockTyped}
            />
          )}
          
          {visibleBlocks.includes(block.id) && currentBlockIndex !== index && (
            <div>{block.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContentBlockTyping;