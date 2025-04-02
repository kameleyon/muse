import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onChange }) => {
  const [viewMode, setViewMode] = useState<'visual' | 'html' | 'markdown'>('visual');
  const [editorContent, setEditorContent] = useState(content);
  
  // Handle content changes in different modes
  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
    onChange(newContent);
  };
  
  // Toolbar button component
  const ToolbarButton = ({ icon, label, onClick, isActive = false }: { 
    icon: React.ReactNode; 
    label: string; 
    onClick: () => void; 
    isActive?: boolean 
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`px-2 h-8 ${isActive ? 'bg-primary/10 text-primary' : ''}`}
      title={label}
    >
      {icon}
    </Button>
  );

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-neutral-light bg-neutral-light/5">
        <h3 className="text-lg font-semibold font-heading text-secondary">Blog Content Editor</h3>
      </div>
      
      <Tabs 
        value={viewMode} 
        onValueChange={(value) => setViewMode(value as 'visual' | 'html' | 'markdown')}
        className="w-full"
      >
        <div className="flex items-center justify-between p-2 border-b border-neutral-light bg-neutral-light/10">
          <TabsList className="bg-transparent">
            <TabsTrigger value="visual" className="text-xs">Visual</TabsTrigger>
            <TabsTrigger value="html" className="text-xs">HTML</TabsTrigger>
            <TabsTrigger value="markdown" className="text-xs">Markdown</TabsTrigger>
          </TabsList>
          
          {viewMode === 'visual' && (
            <div className="editor-toolbar">
              <div className="flex items-center space-x-1">
                <ToolbarButton
                  icon={<span className="font-bold text-xs">H1</span>}
                  label="Heading 1"
                  onClick={() => {
                    const selection = window.getSelection();
                    if (selection && !selection.isCollapsed) {
                      const text = selection.toString();
                      const range = selection.getRangeAt(0);
                      range.deleteContents();
                      const h1 = document.createElement('h1');
                      h1.textContent = text;
                      range.insertNode(h1);
                    }
                  }}
                />
                <ToolbarButton
                  icon={<span className="font-bold text-xs">H2</span>}
                  label="Heading 2"
                  onClick={() => {}}
                />
                <ToolbarButton
                  icon={<span className="font-bold text-xs">H3</span>}
                  label="Heading 3"
                  onClick={() => {}}
                />
                <div className="h-4 w-px bg-neutral-light mx-1"></div>
                <ToolbarButton
                  icon={<span className="font-bold">B</span>}
                  label="Bold"
                  onClick={() => {
                    document.execCommand('bold', false);
                  }}
                />
                <ToolbarButton
                  icon={<span className="italic">I</span>}
                  label="Italic"
                  onClick={() => {
                    document.execCommand('italic', false);
                  }}
                />
                <ToolbarButton
                  icon={<span className="underline">U</span>}
                  label="Underline"
                  onClick={() => {
                    document.execCommand('underline', false);
                  }}
                />
                <div className="h-4 w-px bg-neutral-light mx-1"></div>
                <ToolbarButton
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  }
                  label="Bulleted List"
                  onClick={() => {
                    document.execCommand('insertUnorderedList', false);
                  }}
                />
                <ToolbarButton
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h12" />
                    </svg>
                  }
                  label="Numbered List"
                  onClick={() => {
                    document.execCommand('insertOrderedList', false);
                  }}
                />
                <ToolbarButton
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  }
                  label="Blockquote"
                  onClick={() => {
                    document.execCommand('formatBlock', false, 'blockquote');
                  }}
                />
                <div className="h-4 w-px bg-neutral-light mx-1"></div>
                <ToolbarButton
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  }
                  label="Insert Link"
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) {
                      document.execCommand('createLink', false, url);
                    }
                  }}
                />
                <ToolbarButton
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  label="Insert Image"
                  onClick={() => {
                    const url = prompt('Enter image URL:');
                    if (url) {
                      document.execCommand('insertImage', false, url);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        <TabsContent value="visual" className="p-0">
          <div
            className="blog-editor min-h-[400px] p-6"
            contentEditable
            dangerouslySetInnerHTML={{ __html: editorContent }}
            onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
            suppressContentEditableWarning={true}
          />
        </TabsContent>
        
        <TabsContent value="html" className="p-0">
          <textarea
            className="w-full min-h-[400px] p-6 font-mono text-sm bg-neutral-light/5"
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
          />
        </TabsContent>
        
        <TabsContent value="markdown" className="p-0">
          <textarea
            className="w-full min-h-[400px] p-6 font-mono text-sm bg-neutral-light/5"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="# Your Markdown Content Here"
          />
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t border-neutral-light flex justify-between items-center">
        <div className="text-xs text-neutral-muted">
          {editorContent ? `${countWords(editorContent)} words` : 'No content'}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Save Draft
          </Button>
          <Button size="sm">
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Helper function to count words
function countWords(str: string): number {
  // Remove HTML tags
  const text = str.replace(/<[^>]*>/g, ' ');
  // Split by whitespace and filter out empty strings
  const words = text.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

export default ContentEditor;
