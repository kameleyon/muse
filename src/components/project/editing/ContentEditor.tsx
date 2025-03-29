import React, { useState } from 'react'; // Import useState
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Bot, GitCompare, LayoutTemplate, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '@/features/editor/RichTextEditor'; // Import RichTextEditor again
// import { MarkdownContent } from '@/lib/markdown'; // No longer using MarkdownContent here
import MediaModal from './MediaModal'; // Import the Media modal
import VersionHistoryModal from './VersionHistoryModal'; // Import the Versions modal
import AISuggestionsSidebar, { AISuggestion } from './AISuggestionsSidebar'; // Import AI Sidebar and type
import CommentsSidebar from './CommentsSidebar'; // Import Comments Sidebar
import * as contentGenerationService from '@/services/contentGenerationService'; // Assuming service exists

// Define props
interface ContentEditorProps {
  content: string; // Content from parent state (Should be HTML or Tiptap JSON now)
  onChange: (newContent: string) => void; // Re-add onChange handler prop
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onChange }) => { // Re-add onChange
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false); // State for Versions modal

  const openMediaModal = () => setIsMediaModalOpen(true);
  const closeMediaModal = () => setIsMediaModalOpen(false);

  const openVersionsModal = () => setIsVersionsModalOpen(true); // Handler for Versions modal
  const closeVersionsModal = () => setIsVersionsModalOpen(false); // Handler for Versions modal

  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isCommentsSidebarOpen, setIsCommentsSidebarOpen] = useState(false); // State for Comments sidebar

  const closeAISidebar = () => setIsAISidebarOpen(false);
  
  const openCommentsSidebar = () => setIsCommentsSidebarOpen(true); // Handler for Comments sidebar
  const closeCommentsSidebar = () => setIsCommentsSidebarOpen(false); // Handler for Comments sidebar

  const fetchAndOpenAISuggestions = async () => {
    setIsAISidebarOpen(true); // Open sidebar immediately
    setIsLoadingSuggestions(true);
    setAiSuggestions([]); // Clear previous suggestions
    console.log("Fetching AI suggestions for clarity...");
    try {
      // TODO: Get content from editor state - assuming 'content' prop holds it for now
      // Need a way to get current editor content if it's changed
      const currentContent = content; // Use prop for now
      
      // Assuming a service function exists to get suggestions
      // This service would likely call the backend/AI
      // const suggestions = await contentGenerationService.getClaritySuggestions('temp-project-id', currentContent); // Commented out for now
      
      
      // Simulate suggestions if service doesn't exist yet
      const suggestions: AISuggestion[] = [ // Using simulated data - UNCOMMENTED
         { id: 'sug1', suggestedText: 'Clarified text example 1.', explanation: 'Improves flow.' },
         { id: 'sug2', originalText: 'complex phrase', suggestedText: 'simpler phrase', explanation: 'Easier to understand.' },
      ];
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay - UNCOMMENTED

      setAiSuggestions(suggestions || []); // Handle potential null/undefined response
    } catch (error: any) { // Added catch block
      console.error("Failed to fetch AI suggestions:", error);
      // Optionally show an error message to the user
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
     console.log("Applying suggestion:", suggestion);
     // TODO: Implement logic to apply suggestion to the Tiptap editor content
     // This will likely involve using the editor instance passed from RichTextEditor
     // or calling a command on the editor. For now, just log.
     // Example (needs editor instance):
     // if (suggestion.originalText) { editor.chain().find(suggestion.originalText).replace(suggestion.suggestedText).run(); }
     // else { editor.chain().insertContent(suggestion.suggestedText).run(); }
     
     // Remove the applied suggestion from the list
     setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };


  // Note: Displaying rendered Markdown content. Editing might need a different approach.
  
  // or use useEffect to update its internal state when the 'content' prop changes.

  return (
    <Card className="p-0 border border-neutral-light bg-white/30 shadow-sm flex flex-col h-full min-h-[500px]"> 
      <h4 className="font-semibold text-neutral-dark text-lg p-4 border-b border-neutral-light/40 flex-shrink-0">Content Editor</h4>
      
      {/* Placeholder Toolbar for other features */}
      {/* Placeholder Toolbar for other features */}
      <div className="p-0 border-b border-neutral-light/40 flex flex-wrap gap-2 items-center text-xs text-neutral-medium flex-shrink-0">
         <Button variant="outline" size="sm" className="text-xs border-0" onClick={openMediaModal}><ImageIcon size={14} className="mr-1"/> Media</Button>
         <Button variant="outline" size="sm" className="text-xs border-0" onClick={openVersionsModal}><GitCompare size={14} className="mr-1"/> Versions</Button>
         <Button variant="outline" size="sm" className="text-xs border-0" onClick={fetchAndOpenAISuggestions}><Bot size={14} className="mr-1"/> AI Suggestions</Button>
         <Button variant="outline" size="sm" className="text-xs border-0" onClick={openCommentsSidebar}><MessageSquare size={14} className="mr-1"/> Comments</Button>
      </div>

      {/* Render the RichTextEditor */}
      <div className="flex-grow p-2 overflow-hidden"> {/* Reverted padding */}
         <RichTextEditor
            initialContent={content} // Pass content (expecting HTML or Tiptap JSON)
            onChange={onChange} // Pass handler to update ProjectArea state
         />
      </div>
       
       {/* Render the Media Modal */}
      <MediaModal isOpen={isMediaModalOpen} onClose={closeMediaModal} />
      
      {/* Render the Versions Modal */}
      <VersionHistoryModal isOpen={isVersionsModalOpen} onClose={closeVersionsModal} />

      {/* Render the AI Suggestions Sidebar */}
      <AISuggestionsSidebar
        isOpen={isAISidebarOpen}
        onClose={closeAISidebar}
        suggestions={aiSuggestions}
        onApplySuggestion={handleApplySuggestion}
        isLoading={isLoadingSuggestions}
      />

      {/* Render the Comments Sidebar */}
      <CommentsSidebar isOpen={isCommentsSidebarOpen} onClose={closeCommentsSidebar} />
    </Card>
  );
};

export default ContentEditor;