import { v4 as uuidv4 } from 'uuid';

/**
 * Interface for a content block
 */
export interface ContentBlock {
  id: string;
  content: string;
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'quote';
}

/**
 * Splits HTML content into blocks for typing effect
 * @param htmlContent The HTML content to split
 * @returns Array of content blocks
 */
export const splitContentIntoBlocks = (htmlContent: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Process each child node
  Array.from(tempDiv.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Handle text nodes (paragraphs without tags)
      const text = node.textContent?.trim();
      if (text && text.length > 0) {
        blocks.push({
          id: uuidv4(),
          content: text,
          type: 'paragraph'
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Handle element nodes
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      
      // Determine block type based on tag
      let type: ContentBlock['type'] = 'paragraph';
      
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        type = 'heading';
      } else if (['ul', 'ol'].includes(tagName)) {
        type = 'list';
      } else if (tagName === 'pre' || tagName === 'code') {
        type = 'code';
      } else if (tagName === 'blockquote') {
        type = 'quote';
      }
      
      // Add the block
      blocks.push({
        id: uuidv4(),
        content: element.innerText.trim(),
        type
      });
    }
  });
  
  return blocks;
};

/**
 * Splits markdown content into blocks for typing effect
 * @param markdownContent The markdown content to split
 * @returns Array of content blocks
 */
export const splitMarkdownIntoBlocks = (markdownContent: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  
  // Split by double newlines to separate paragraphs
  const paragraphs = markdownContent.split(/\n\n+/);
  
  paragraphs.forEach(paragraph => {
    const trimmedParagraph = paragraph.trim();
    if (trimmedParagraph.length === 0) return;
    
    // Determine block type based on markdown syntax
    let type: ContentBlock['type'] = 'paragraph';
    
    if (/^#{1,6}\s/.test(trimmedParagraph)) {
      type = 'heading';
    } else if (/^(\*|\-|\+|\d+\.)\s/.test(trimmedParagraph)) {
      type = 'list';
    } else if (/^```[\s\S]*```$/.test(trimmedParagraph)) {
      type = 'code';
    } else if (/^>\s/.test(trimmedParagraph)) {
      type = 'quote';
    }
    
    blocks.push({
      id: uuidv4(),
      content: trimmedParagraph,
      type
    });
  });
  
  return blocks;
};

/**
 * Splits plain text content into blocks for typing effect
 * @param textContent The plain text content to split
 * @returns Array of content blocks
 */
export const splitTextIntoBlocks = (textContent: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  
  // Split by double newlines to separate paragraphs
  const paragraphs = textContent.split(/\n\n+/);
  
  paragraphs.forEach(paragraph => {
    const trimmedParagraph = paragraph.trim();
    if (trimmedParagraph.length === 0) return;
    
    blocks.push({
      id: uuidv4(),
      content: trimmedParagraph,
      type: 'paragraph'
    });
  });
  
  return blocks;
};