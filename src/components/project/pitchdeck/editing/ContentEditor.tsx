import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Bot, GitCompare, LayoutTemplate, Image as ImageIcon, Edit, Eye, Save } from 'lucide-react';
import RichTextEditor from '@/features/editor/RichTextEditor';
import MarkdownVisualizer from '@/components/content/visualization/MarkdownVisualizer';
import MediaModal from './MediaModal';
import VersionHistoryModal from './VersionHistoryModal';
import AISuggestionsSidebar, { AISuggestion } from './AISuggestionsSidebar';
import CommentsSidebar from './CommentsSidebar';
import * as contentGenerationService from '@/services/contentGenerationService';
import { htmlToMarkdown } from '@/lib/htmlToMarkdown';

// Define props
interface ContentEditorProps {
  content: string; // Content from parent state (Should be HTML or Tiptap JSON now)
  onChange: (newContent: string) => void; // Re-add onChange handler prop
  brandColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  brandFonts?: {
    headingFont: string;
    bodyFont: string;
  };
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onChange,
  brandColors = { primary: '#ae5630', secondary: '#232321', accent: '#9d4e2c' },
  brandFonts = { headingFont: 'Comfortaa, sans-serif', bodyFont: 'Questrial, sans-serif' }
}) => {
  // Add state for edit/view mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editorContent, setEditorContent] = useState(content);
  const [markdownContent, setMarkdownContent] = useState('');
  
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false);

  const openMediaModal = () => setIsMediaModalOpen(true);
  const closeMediaModal = () => setIsMediaModalOpen(false);

  const openVersionsModal = () => setIsVersionsModalOpen(true);
  const closeVersionsModal = () => setIsVersionsModalOpen(false);

  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isCommentsSidebarOpen, setIsCommentsSidebarOpen] = useState(false);

  const closeAISidebar = () => setIsAISidebarOpen(false);
  
  const openCommentsSidebar = () => setIsCommentsSidebarOpen(true);
  const closeCommentsSidebar = () => setIsCommentsSidebarOpen(false);
  
  // Convert HTML to Markdown when content changes or when switching to view mode
  useEffect(() => {
    if (!isEditMode) {
      // Process JSON code blocks before converting to markdown
      let processedContent = editorContent;
      
      // Look for potential JSON blocks in the HTML content
      const jsonRegex = /\[\s*\{\s*"name":/g;
      if (jsonRegex.test(processedContent)) {
        console.log("Found potential JSON block in HTML content");
        
        // Try to extract JSON blocks and wrap them in code blocks
        processedContent = processedContent.replace(/(\[{.*?}\])/gs, (match) => {
          // Skip if it's already inside a code block
          if (match.includes('<pre') || match.includes('<code')) {
            return match;
          }
          
          // Check if it looks like chart data
          if (match.includes('"name"') && (match.includes('"value"') || match.includes('"Line '))) {
            // Fix generic "Line 1", "Line 2" labels
            try {
              const chartData = JSON.parse(match);
              if (Array.isArray(chartData)) {
                // Check if we have generic "Line 1", "Line 2" labels
                const hasGenericLabels = chartData.some(item => 
                  item && typeof item === 'object' && 
                  Object.keys(item).some(key => /^Line \d+$/.test(key))
                );
                
                if (hasGenericLabels) {
                  // Replace generic labels with more descriptive ones
                  const fixedData = chartData.map(item => {
                    if (item && typeof item === 'object') {
                      const newItem: Record<string, any> = {};
                      Object.entries(item).forEach(([key, value]) => {
                        if (/^Line \d+$/.test(key)) {
                          // Replace with more descriptive name based on position
                          newItem[`Data Series ${key.replace('Line ', '')}`] = value;
                        } else {
                          newItem[key] = value;
                        }
                      });
                      return newItem;
                    }
                    return item;
                  });
                  
                  return '<pre><code class="language-chart">' + JSON.stringify(fixedData) + '</code></pre>';
                }
              }
            } catch (e) {
              console.error("Error parsing chart data:", e);
            }
            
            return '<pre><code class="language-chart">' + match + '</code></pre>';
          }
          
          return match;
        });
        
        // Also look for JSON objects with a data property
        processedContent = processedContent.replace(/({.*?"data":\s*\[.*?\].*?})/gs, (match) => {
          // Skip if it's already inside a code block
          if (match.includes('<pre') || match.includes('<code')) {
            return match;
          }
          
          // Check if it looks like chart data
          if (match.includes('"data"') && (match.includes('"name"') || match.includes('"type"'))) {
            return '<pre><code class="language-chart">' + match + '</code></pre>';
          }
          
          return match;
        });
      }
      
      // Handle tables - look for table tags and ensure they're properly formatted
      if (processedContent.includes('<table')) {
        console.log("Found table in HTML content");
      }
      
      const markdown = htmlToMarkdown(processedContent);
      console.log("Converted HTML to Markdown:", markdown.substring(0, 100) + "...");
      setMarkdownContent(markdown);
    }
  }, [editorContent, isEditMode]);

  // Initialize content
  useEffect(() => {
    setEditorContent(content);
    const markdown = htmlToMarkdown(content);
    setMarkdownContent(markdown);
  }, [content]);
  
  // Toggle between edit and view modes
  const toggleEditMode = () => {
    if (isEditMode) {
      // Switching to view mode, update markdown content
      const markdown = htmlToMarkdown(editorContent);
      setMarkdownContent(markdown);
    }
    setIsEditMode(prev => !prev);
  };

  // Handle content changes from the editor
  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    onChange(newContent); // Propagate changes to parent
  };

  const fetchAndOpenAISuggestions = async () => {
    setIsAISidebarOpen(true); // Open sidebar immediately
    setIsLoadingSuggestions(true);
    setAiSuggestions([]); // Clear previous suggestions
    console.log("Fetching AI suggestions for clarity...");
    try {
      // Use the current editor content
      const currentContent = editorContent;
      
      // Simulate suggestions if service doesn't exist yet
      const suggestions: AISuggestion[] = [
         { id: 'sug1', suggestedText: 'Clarified text example 1.', explanation: 'Improves flow.' },
         { id: 'sug2', originalText: 'complex phrase', suggestedText: 'simpler phrase', explanation: 'Easier to understand.' },
      ];
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

      setAiSuggestions(suggestions || []); // Handle potential null/undefined response
    } catch (error: any) {
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
     
     // Remove the applied suggestion from the list
     setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  return (
    <Card className="p-0 border border-neutral-light bg-white/30 shadow-sm flex flex-col h-full min-h-[500px]"> 
      <div className="flex justify-between items-center p-4 border-b border-neutral-light/40 flex-shrink-0">
        <h4 className="font-semibold text-neutral-dark text-lg">Content Editor</h4>
        {/* Edit button commented out temporarily
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleEditMode}
          className="flex items-center gap-1.5"
        >
          {isEditMode ? (
            <>
              <Eye size={16} /> View
            </>
          ) : (
            <>
              <Edit size={16} /> Edit
            </>
          )}
        </Button>
        */}
      </div>
      
      {/* Toolbar - only visible in edit mode */}
      {isEditMode && (
        <div className="p-2 border-b border-neutral-light/40 flex flex-wrap gap-2 items-center text-xs text-neutral-medium flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs py-1.5 px-2.5 shadow-sm hover:bg-neutral-light/20" 
            onClick={fetchAndOpenAISuggestions}
          >
            <Bot size={14} className="mr-1.5"/> AI Enhance
          </Button>
        </div>
      )}

      {/* Content area - conditionally render editor or visualizer */}
      <div className="flex-grow p-2 overflow-hidden">
        {isEditMode ? (
          <RichTextEditor
            initialContent={editorContent}
            onChange={handleEditorChange}
            brandColors={brandColors}
            brandFonts={brandFonts}
          />
        ) : (
          <MarkdownVisualizer
            content={markdownContent}
            enhanceVisuals={true}
            brandColors={{
              primary: brandColors.primary,
              secondary: brandColors.secondary,
              accent: brandColors.accent,
              highlight: brandColors.accent,
              background: '#ffffff'
            }}
            fonts={{
              headingFont: brandFonts.headingFont,
              bodyFont: brandFonts.bodyFont
            }}
            options={{
              showCharts: true,
              showTables: true,
              showDiagrams: true,
              chartHeight: 250,
              animateCharts: false
            }}
          />
        )}
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
