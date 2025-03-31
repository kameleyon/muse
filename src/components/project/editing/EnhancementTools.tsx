import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LetterText, AlignLeft, Languages, AlertCircle } from 'lucide-react';
import * as contentGenerationService from '@/services/contentGenerationService';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import { formatToMarkdown, cleanupJsonCodeBlocks } from '@/utils/markdownFormatter';
import { marked } from 'marked'; // Import marked library
import ContentBlockTyping from '@/components/ui/ContentBlockTyping'; // Import typing effect component
import { ContentBlock, splitMarkdownIntoBlocks } from '@/utils/contentBlockUtils'; // Import block utilities

interface EnhancementToolsProps {
  editorContent: string; // This might represent the *current* state, not necessarily what's being typed
  onContentChange: (newContent: string) => void;
}

const EnhancementTools: React.FC<EnhancementToolsProps> = ({ editorContent, onContentChange }) => {
  const [enhancementType, setEnhancementType] = useState<'clarity' | 'conciseness' | 'persuasiveness' | 'persuasion' | 'tone' | 'flow' | 'transitions' | 'readability' | 'jargon' | 'regenerate' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typingBlocks, setTypingBlocks] = useState<ContentBlock[] | null>(null); // State for typing effect blocks
  const [finalEnhancedContent, setFinalEnhancedContent] = useState<string | null>(null); // Store final content after typing

  // Get project ID from store
  const { projectId } = useProjectWorkflowStore();
  const dispatch = useDispatch();

  // Helper function to detect if content is markdown
  const isMarkdownContent = (content: string): boolean => {
    // Check for common markdown patterns
    const markdownPatterns = [
      /^#+ /m,                  // Headers
      /\*\*(.*?)\*\*/,          // Bold
      /\*(.*?)\*/,              // Italic
      /\[(.*?)\]\((.*?)\)/,     // Links
      /^- /m,                   // Unordered lists
      /^[0-9]+\. /m,            // Ordered lists
      /^>/m,                    // Blockquotes
      /`(.*?)`/,                // Inline code
      /^```[\s\S]*?```$/m       // Code blocks
    ];

    return markdownPatterns.some(pattern => pattern.test(content));
  };

  const handleEnhance = async (type: 'clarity' | 'conciseness' | 'persuasiveness' | 'persuasion' | 'tone' | 'flow' | 'transitions' | 'readability' | 'jargon' | 'regenerate') => {
     if (!editorContent) {
       dispatch(addToast({
         type: 'warning',
         message: "Please add some content before using enhancement tools."
       }));
       return;
     }

     if (!projectId) {
       dispatch(addToast({
         type: 'error',
         message: "Cannot enhance content without a valid project ID."
       }));
       return;
     }

     setEnhancementType(type);
     setIsLoading(true);
     setTypingBlocks(null); // Clear previous typing effect if any
     setFinalEnhancedContent(null);

     // Determine if content is markdown (using the *original* content before enhancement)
     // const isMarkdown = isMarkdownContent(editorContent); // We might not need this check anymore

     try {
       // Send content to AI for enhancement
       const result = await contentGenerationService.enhanceContent(
         projectId,
         'current-section', // Using a default section ID
         editorContent, // Send the current editor content for enhancement
         type
       );

       if (result.content && !result.content.startsWith('Error:')) {
         // First, clean up any JSON code blocks in the result content
         const cleanedResultContent = cleanupJsonCodeBlocks(result.content);

         // Convert the potentially markdown result to HTML using marked
         // This ensures consistent input format for the Tiptap editor later
         const enhancedHtml = marked(cleanedResultContent) as string;

         // --- Start Typing Effect ---
         // 1. Clear existing content visually (or editor state if possible)
         //    For now, we'll rely on the parent component re-rendering with empty typingBlocks
         setTypingBlocks(null); // Clear previous blocks if any
         setFinalEnhancedContent(enhancedHtml); // Store the final HTML

         // 2. Split the *original markdown* (cleaned) into blocks for typing
         //    We type out the markdown structure, which marked converts to HTML visually
         const blocksForTyping = splitMarkdownIntoBlocks(cleanedResultContent);

         // 3. Set blocks to start typing effect
         //    Need a slight delay to ensure UI clears before starting
         setTimeout(() => {
           setTypingBlocks(blocksForTyping);
         }, 50);
         // Note: onContentChange with final HTML is now called in handleTypingComplete

         dispatch(addToast({
           type: 'success',
           message: `Successfully enhanced content for ${type}.`
         }));
       } else {
         throw new Error(result.content || `Enhancement failed for ${type}`);
       }
     } catch (error) {
       console.error(`Error during enhancement ${type}:`, error);
       dispatch(addToast({
         type: 'error',
         message: error instanceof Error ? error.message : `Failed to enhance content for ${type}.`
       }));
       setFinalEnhancedContent(null); // Clear final content on error
     } finally {
       setIsLoading(false);
       setEnhancementType(null);
       // Don't clear typingBlocks here, let the effect run or complete
     }
  };

  // Function to call when typing effect completes
  const handleTypingComplete = () => {
    if (finalEnhancedContent !== null) {
      onContentChange(finalEnhancedContent); // Update the actual editor state
    }
    setTypingBlocks(null); // Clear typing blocks after completion
    setFinalEnhancedContent(null); // Clear stored final content
  };


  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Enhancement Tools</h4>

      {isLoading && !typingBlocks && ( // Show loading overlay only when fetching, not during typing
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-neutral-dark">Enhancing {enhancementType}...</p>
          </div>
        </div>
      )}

      {/* Conditionally render Typing Effect or Buttons */}
      {typingBlocks ? (
        <div className="typing-effect-container p-2 border rounded-md bg-white min-h-[150px]">
          <ContentBlockTyping
            blocks={typingBlocks}
            typingSpeed={30} // Adjust speed as needed
            delayBetweenBlocks={200}
            onComplete={handleTypingComplete}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Text Enhancement */}
          <div>
             <label className="settings-label mb-1">
               <span className="flex items-center gap-1">
                 <LetterText size={14}/> Text
               </span>
             </label>
             <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleEnhance('clarity')}
                  disabled={isLoading}
                >
                  Improve Clarity
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleEnhance('conciseness')}
                  disabled={isLoading}
                >
                  Make Concise
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleEnhance('persuasion')}
                  disabled={isLoading}
                >
                  Boost Persuasion
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleEnhance('tone')}
                  disabled={isLoading}
                >
                  Adjust Tone
                </Button>
             </div>
          </div>
           {/* Narrative Tools */}
           <div>
             <label className="settings-label mb-1 mt-5">
               <span className="flex items-center gap-1">
                 <AlignLeft size={14}/> Narrative
               </span>
             </label>
             <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleEnhance('flow')}
                  disabled={isLoading}
                >
                  Analyze Flow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleEnhance('transitions')}
                  disabled={isLoading}
                >
                  Suggest Transitions
                </Button>
             </div>
          </div>
           {/* Language Optimization */}
           <div>
             <label className="settings-label mb-1 mt-5">
               <span className="flex items-center gap-1">
                 <Languages size={14}/> Language
               </span>
             </label>
             <div className="flex flex-wrap gap-1 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleEnhance('readability')}
                  disabled={isLoading}
                >
                  Check Readability
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleEnhance('jargon')}
                  disabled={isLoading}
                >
                  Detect Jargon
                </Button>
             </div>
          </div>
           {/* Apply Markdown Button */}
           <Button
             variant="secondary"
             size="sm"
             className="w-full mt-8"
             onClick={() => {
               if (!editorContent) {
                 dispatch(addToast({
                   type: 'warning',
                   message: "Please add some content before applying markdown formatting."
                 }));
                 return;
               }

               // First, clean up any JSON code blocks in the content
               const contentWithoutJson = cleanupJsonCodeBlocks(editorContent);

               // Always convert the cleaned content to markdown format to ensure consistency
               const markdownContent = formatToMarkdown(contentWithoutJson);

               // Update the editor content with the markdown-formatted content
               onContentChange(markdownContent);

               dispatch(addToast({
                 type: 'success',
                 message: "Markdown formatting applied successfully."
               }));
             }}
             disabled={isLoading}
           >
              Apply Markdown Formatting
           </Button>
        </div>
      )}
    </Card>
  );
};

export default EnhancementTools;