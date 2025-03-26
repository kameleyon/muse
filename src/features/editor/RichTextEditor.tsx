// src/features/editor/RichTextEditor.tsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { EditorToolbar } from './EditorToolbar'; // Import the toolbar

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  className?: string;
  editable?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = '',
  onChange,
  className = '',
  editable = true,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit extensions if needed
        // e.g., heading: { levels: [1, 2, 3] }
      }),
      // Add more extensions here (e.g., Placeholder, Link, Image)
    ],
    content: initialContent,
    editable: editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML()); // Or use editor.getJSON() for JSON output
      }
    },
  });

  if (!editor) {
    return null; // Or a loading state
  }

  // Styling for the editor content area
  const editorClasses = `
    prose prose-sm max-w-none focus:outline-none
    border border-t-0 border-neutral-light rounded-b-md p-4 min-h-[200px] {/* Adjusted borders/radius */}
    bg-neutral-white text-neutral-dark
    ${className}
  `;

  // Apply themed prose styles from tailwind.config.js
  // The 'prose prose-sm' classes will pick up the custom theme

  return (
    <div className="rich-text-editor-wrapper border border-neutral-light rounded-md"> {/* Add wrapper border */}
      <EditorToolbar editor={editor} /> {/* Add the toolbar */}
      <EditorContent editor={editor} className={editorClasses} />
    </div>
  );
};

export default RichTextEditor;