// src/features/editor/EditorToolbar.tsx
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/Button'; // Import the Button component
import {
  FaBold, FaItalic, FaStrikethrough, FaHeading,
  FaListUl, FaListOl, FaQuoteLeft, FaCode, FaUndo, FaRedo
} from 'react-icons/fa';

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
      p-1 w-8 h-8  // Override padding and size for tighter toolbar look
      ${isActive ? 'bg-neutral-light text-primary' : 'text-neutral-dark hover:text-primary'} {/* Changed inactive text color */}
    `}
    // Pass children directly to Button component
  >
    {children}
  </Button>
);


export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

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
      {/* Add more buttons as needed */}
    </div>
  );
};

export default EditorToolbar;