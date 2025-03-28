import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Bot, GitCompare, LayoutTemplate, Image as ImageIcon } from 'lucide-react'; 
import RichTextEditor from '@/features/editor/RichTextEditor'; // Import the existing editor

// Define props
interface ContentEditorProps {
  content: string; // Content from parent state
  onChange: (newContent: string) => void; // Function to update parent state
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onChange }) => {

  // Note: We are passing the content and onChange handler directly to RichTextEditor.
  // RichTextEditor needs to be implemented as a controlled component 
  // or use useEffect to update its internal state when the 'content' prop changes.

  return (
    <Card className="p-0 border border-neutral-light bg-white/30 shadow-sm flex flex-col h-full min-h-[500px]"> 
      <h4 className="font-semibold text-neutral-dark text-lg p-4 border-b border-neutral-light/40 flex-shrink-0">Content Editor</h4>
      
      {/* Placeholder Toolbar for other features */}
      <div className="p-2 border-b border-neutral-light/40 flex flex-wrap gap-2 items-center text-xs text-neutral-medium flex-shrink-0">
         <span>Tools:</span>
         <Button variant="outline" size="sm" className="text-xs"><LayoutTemplate size={14} className="mr-1"/> Section Templates</Button>
         <Button variant="outline" size="sm" className="text-xs"><ImageIcon size={14} className="mr-1"/> Media</Button>
         <Button variant="outline" size="sm" className="text-xs"><GitCompare size={14} className="mr-1"/> Versions</Button>
         <Button variant="outline" size="sm" className="text-xs"><Bot size={14} className="mr-1"/> AI Suggestions</Button>
         <Button variant="outline" size="sm" className="text-xs"><MessageSquare size={14} className="mr-1"/> Comments</Button>
      </div>

      {/* Render the existing RichTextEditor, passing content and onChange */}
      <div className="flex-grow p-2 overflow-hidden"> 
         <RichTextEditor 
            // Use key to force re-mount if content changes externally? Or handle inside RTE
            // key={content} // This might be inefficient, better to handle inside RTE
            initialContent={content} // Pass content from Step 4 generation
            onChange={onChange} // Pass handler to update ProjectArea state
         />
      </div>
    </Card>
  );
};

export default ContentEditor;