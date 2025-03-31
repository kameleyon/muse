import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LetterText, AlignLeft, Languages, AlertCircle } from 'lucide-react';
import * as contentGenerationService from '@/services/contentGenerationService';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import { formatToMarkdown } from '@/utils/markdownFormatter';

interface EnhancementToolsProps {
  editorContent: string;
  onContentChange: (newContent: string) => void;
}

const EnhancementTools: React.FC<EnhancementToolsProps> = ({ editorContent, onContentChange }) => {
  const [enhancementType, setEnhancementType] = useState<'clarity' | 'conciseness' | 'persuasiveness' | 'persuasion' | 'tone' | 'flow' | 'transitions' | 'readability' | 'jargon' | 'regenerate' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
     
     // Determine if content is markdown
     const isMarkdown = isMarkdownContent(editorContent);
     
     try {
       // Send content to AI for enhancement
       const result = await contentGenerationService.enhanceContent(
         projectId,
         'current-section', // Using a default section ID
         editorContent,
         type
       );
       
       if (result.content && !result.content.startsWith('Error:')) {
         // If original content was markdown, ensure we preserve markdown formatting
         if (isMarkdown) {
           // Check if the result already contains markdown formatting
           const resultHasMarkdown = isMarkdownContent(result.content);
           
           if (resultHasMarkdown) {
             // If the result already has markdown, use it directly
             onContentChange(result.content);
           } else {
             // If the result lost markdown formatting, convert it back
             const enhancedMarkdown = formatToMarkdown(result.content);
             onContentChange(enhancedMarkdown);
           }
         } else {
           // If not markdown, use the enhanced content as is
           onContentChange(result.content);
         }
         
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
     } finally {
       setIsLoading(false);
       setEnhancementType(null);
     }
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Enhancement Tools</h4>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-neutral-dark">Enhancing {enhancementType}...</p>
          </div>
        </div>
      )}
      
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
             
             // Check if content is already in markdown format
             const isAlreadyMarkdown = isMarkdownContent(editorContent);
             
             if (isAlreadyMarkdown) {
               // If already markdown, just clean it up and ensure proper formatting
               const cleanedMarkdown = editorContent
                 // Fix any broken markdown formatting
                 .replace(/\*\*\s+/g, '**') // Fix spaces after bold markers
                 .replace(/\s+\*\*/g, '**') // Fix spaces before bold markers
                 .replace(/\*\s+/g, '*') // Fix spaces after italic markers
                 .replace(/\s+\*/g, '*') // Fix spaces before italic markers
                 .replace(/\n{3,}/g, '\n\n') // Fix excessive line breaks
                 .replace(/\n\s+\n/g, '\n\n'); // Fix lines with only whitespace
               
               onContentChange(cleanedMarkdown);
             } else {
               // Convert the current content to markdown format
               const markdownContent = formatToMarkdown(editorContent);
               
               // Update the editor content with the markdown-formatted content
               onContentChange(markdownContent);
             }
             
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
    </Card>
  );
};

export default EnhancementTools;