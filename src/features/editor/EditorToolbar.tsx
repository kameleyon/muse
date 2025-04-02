// src/features/editor/EditorToolbar.tsx
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/Button'; // Import the Button component
import {
  FaBold, FaItalic, FaStrikethrough, FaHeading,
  FaListUl, FaListOl, FaQuoteLeft, FaCode, FaUndo, FaRedo,
  FaChartBar, FaChartPie, FaChartLine, FaImage
} from 'react-icons/fa';
import ImageModal from './ImageModal';

interface EditorToolbarProps {
  editor: Editor | null;
}

// Simple reusable button component for the toolbar
const ToolbarButton: React.FC<{
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}> = ({ onClick, isActive = false, disabled = false, children, title }) => (
  <Button // Use the actual Button component
    variant="ghost"
    size="icon" // Use icon size
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      p-1.5 w-9 h-9  // Increased size for better visibility
      ${isActive ? 'bg-primary/20 text-primary font-bold' : 'text-neutral-dark hover:bg-neutral-light hover:text-primary'} {/* Improved contrast */}
    `}
    // Pass children directly to Button component
  >
    {children}
  </Button>
);

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<string>('bar');

  if (!editor) {
    return null;
  }

  const insertChart = (chartType: string) => {
    // Sample chart data based on chart type
    let sampleData;
    
    switch (chartType) {
      case 'pie':
        sampleData = JSON.stringify([
          { name: "Category A", value: 30 },
          { name: "Category B", value: 45 },
          { name: "Category C", value: 25 }
        ]);
        break;
      case 'line':
        sampleData = JSON.stringify([
          { name: "Jan", value: 100 },
          { name: "Feb", value: 150 },
          { name: "Mar", value: 120 },
          { name: "Apr", value: 200 },
          { name: "May", value: 180 }
        ]);
        break;
      case 'bar':
      default:
        sampleData = JSON.stringify([
          { name: "Product A", value: 400 },
          { name: "Product B", value: 300 },
          { name: "Product C", value: 200 },
          { name: "Product D", value: 278 },
          { name: "Product E", value: 189 }
        ]);
    }

    // Insert the chart with the sample data
    editor.chain().focus().insertChart(sampleData, chartType).run();
  };

  return (
    <div className="editor-toolbar flex flex-wrap gap-1 border border-b-0 border-neutral-light rounded-t-md p-2 bg-neutral-white"> {/* Removed bottom border */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <FaBold />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <FaItalic />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <FaStrikethrough />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <FaHeading className="w-4 h-4" /> <span className="text-xs">2</span>
      </ToolbarButton>
       <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <FaHeading className="w-4 h-4" /> <span className="text-xs">3</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <FaListUl />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <FaListOl />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <FaQuoteLeft />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <FaCode />
      </ToolbarButton>
      
      {/* Chart buttons */}
      <div className="border-l border-neutral-light mx-1"></div>
      <ToolbarButton
        onClick={() => insertChart('bar')}
        title="Insert Bar Chart"
      >
        <FaChartBar />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => insertChart('pie')}
        title="Insert Pie Chart"
      >
        <FaChartPie />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => insertChart('line')}
        title="Insert Line Chart"
      >
        <FaChartLine />
      </ToolbarButton>
      
      <div className="border-l border-neutral-light mx-1"></div>
      <ToolbarButton
        onClick={() => setIsImageModalOpen(true)}
        title="Insert Image"
      >
        <FaImage />
      </ToolbarButton>
      
      <div className="border-l border-neutral-light mx-1"></div>
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Undo (Ctrl+Z)"
      >
        <FaUndo />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Redo (Ctrl+Y)"
      >
        <FaRedo />
      </ToolbarButton>
      
      {/* Image Modal */}
      <ImageModal 
        isOpen={isImageModalOpen} 
        onClose={() => setIsImageModalOpen(false)} 
        editor={editor} 
      />
    </div>
  );
};

export default EditorToolbar;
