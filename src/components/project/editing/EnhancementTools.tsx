import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LetterText, TextCursorInput, AlignLeft, Languages } from 'lucide-react'; // Icons
import * as contentGenerationService from '@/services/contentGenerationService'; // Import service
import { useState } from 'react'; // Import useState for loading

interface EnhancementToolsProps {
  editorContent: string;
  onContentChange: (newContent: string) => void;
}

const EnhancementTools: React.FC<EnhancementToolsProps> = ({ editorContent, onContentChange }) => {
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Placeholder handlers - will be updated
  const handleEnhance = async (type: string) => {
     console.log(`Enhance: ${type}`);
     // TODO: Implement actual enhancement logic
     if (!editorContent) return;
     setIsLoading(true);
     try {
       // Example for clarity - replace with actual service call and type mapping
       const result = await contentGenerationService.enhanceContent(
         'temp-project-id',
         'current-section-id', // Need section context later
         editorContent,
         type // Pass the type (clarity, conciseness, etc.)
       );
       if (result.content && !result.content.startsWith('Error:')) {
         onContentChange(result.content); // Update parent state
       } else {
         console.error(`Enhancement failed for ${type}:`, result.content);
         // TODO: Show error to user
       }
     } catch (error) {
       console.error(`Error during enhancement ${type}:`, error);
       // TODO: Show error to user
     } finally {
       setIsLoading(false);
     }
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Enhancement Tools</h4>
      <div className="space-y-3">
        {/* Text Enhancement */}
        <div>
           <label className="settings-label mb-1"> {/* Removed flex from label */}
             <span className="flex items-center gap-1"> {/* Added span wrapper with flex */}
               <LetterText size={14}/> Text
             </span>
           </label>
           <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('clarity')}>Improve Clarity</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('conciseness')}>Make Concise</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('persuasion')}>Boost Persuasion</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('tone')}>Adjust Tone</Button>
           </div>
        </div>
         {/* Narrative Tools */}
         <div>
           <label className="settings-label mb-1 mt-5"> {/* Removed flex from label */}
             <span className="flex items-center gap-1"> {/* Added span wrapper with flex */}
               <AlignLeft size={14}/> Narrative
             </span>
           </label>
           <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('flow')}>Analyze Flow</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('transitions')}>Suggest Transitions</Button>
           </div>
        </div>
         {/* Language Optimization */}
         <div>
           <label className="settings-label mb-1 mt-5"> {/* Removed flex from label */}
             <span className="flex items-center gap-1"> {/* Added span wrapper with flex */}
               <Languages size={14}/> Language
             </span>
           </label>
           <div className="flex flex-wrap gap-1 mb-4">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('readability')}>Check Readability</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('jargon')}>Detect Jargon</Button>
           </div>
        </div>
         {/* Section Regeneration */}
         <Button variant="secondary" size="sm" className="w-full mt-8" onClick={() => handleEnhance('regenerate')}>
            Regenerate Section
         </Button>
      </div>
    </Card>
  );
};

export default EnhancementTools;