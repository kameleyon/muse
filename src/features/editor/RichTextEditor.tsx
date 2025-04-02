// src/features/editor/RichTextEditor.tsx
import React, { useEffect } from 'react'; // Import useEffect
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { EditorToolbar } from './EditorToolbar'; // Import the toolbar
import Chart from './extensions/ChartExtension'; // Import the Chart extension
import Image from './extensions/ImageExtension'; // Import the Image extension

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  className?: string;
  editable?: boolean;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  brandFonts?: {
    headingFont?: string;
    bodyFont?: string;
  };
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = '',
  onChange,
  className = '',
  editable = true,
  brandColors = { primary: '#ae5630', secondary: '#232321', accent: '#9d4e2c' },
  brandFonts = { headingFont: 'Comfortaa, sans-serif', bodyFont: 'Questrial, sans-serif' }
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit extensions if needed
        // e.g., heading: { levels: [1, 2, 3] }
      }),
      Chart.configure({
        HTMLAttributes: {
          class: 'chart-extension',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'image-extension',
        },
      }),
      // Add more extensions here (e.g., Placeholder, Link)
    ],
    content: initialContent,
    editable: editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML()); // Or use editor.getJSON() for JSON output
      }
    },
  });

  // Add useEffect to update content when initialContent prop changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) { // Check if content differs
      // Parse the incoming HTML (which was converted from Markdown)
      // Use try-catch in case setContent fails
      try {
        editor.commands.setContent(initialContent, true); // true to parse HTML
      } catch (error) {
         console.error("Tiptap failed to set content:", error, initialContent);
      }
    }
  // Only run when initialContent changes, editor instance should be stable
  }, [initialContent, editor]);

  if (!editor) {
    return null; // Or a loading state
  }

  // Create a style object with CSS variables for brand colors and fonts
  const editorStyle = {
    '--primary-color': brandColors.primary,
    '--secondary-color': brandColors.secondary,
    '--accent-color': brandColors.accent,
    '--heading-font': brandFonts.headingFont,
    '--body-font': brandFonts.bodyFont,
  } as React.CSSProperties;

  // Styling for the editor content area
  const editorClasses = `
    prose prose-sm max-w-none focus:outline-none
    border border-t-0 border-neutral-light rounded-b-md p-3 min-h-[200px]
    bg-neutral-white text-neutral-dark
    editor-custom-styles
    ${className}
  `;

  // Add CSS for custom heading and text styles
  const getEditorStyles = () => {
    return `
      /* Remove slide title labels and make headings more compact */
      .ProseMirror h1 {
        color: ${brandColors.primary};
        font-family: ${brandFonts.headingFont};
        font-size: 1.2rem;
        font-weight: 600;
        margin-top: 0.5rem;
        margin-bottom: 0.4rem;
        padding-bottom: 0.3rem;
        //border-bottom: 1px solid ${brandColors.primary}30;
      }
      
      /* Blue title - make smaller and semibold */
      .ProseMirror h2 {
        color: ${brandColors.secondary};
        font-family: ${brandFonts.headingFont};
        font-size: 1.0rem;
        font-weight: 600;
        margin-top: 0.3rem;
        margin-bottom: 0.1rem;
        line-height: 1.4;
      }
      
      /* Pink title - make smaller and semibold */
      .ProseMirror h3 {
        color: ${brandColors.accent};
        font-family: ${brandFonts.headingFont};
        font-size: 0.85rem;
        font-weight: 600;
        margin-top: 0.3rem;
        margin-bottom: 0.25rem;
        line-height: 1.4;
      }
      
      /* Remove slide section labels and slide names */
      .ProseMirror h1:empty,
      .ProseMirror h2:empty,
      .ProseMirror h3:empty,
      .ProseMirror h1:only-child,
      .ProseMirror p:empty {
        display: none;
      }
      
      /* Hide slide section headings - first h1 in content */
      .ProseMirror h1:first-child {
        display: none;
      }
      
      /* Make even tighter spacing */
      .ProseMirror {
        line-height: 1.1;
      }
      
      .ProseMirror > * + * {
        margin-top: 0.2rem;
      }
      .ProseMirror p {
        font-family: ${brandFonts.bodyFont};
        margin-bottom: 0.5rem;
      }
      /* Compact spacing for lists and reduce space between bullets */
      .ProseMirror ul, .ProseMirror ol {
        font-family: ${brandFonts.bodyFont};
        padding-left: 0.75rem;
        margin-top: 0.05rem;
        margin-bottom: 0.1rem;
      }
      .ProseMirror li {
        margin-bottom: 0.05rem;
        line-height: 1.4;
        padding-left: 0.1rem;
      }
      .ProseMirror li p {
        margin-bottom: 0.05rem;
        line-height: 1.4;
      }
      
      /* Custom bullet style for tighter spacing */
      .ProseMirror ul > li::marker {
        font-size: 0.8em;
        color: ${brandColors.primary};
      }
      
      /* Tighten spacing in paragraphs */
      .ProseMirror p {
        font-family: ${brandFonts.bodyFont};
        margin-bottom: 0.15rem;
        line-height: 1.3;
      }
      .ProseMirror blockquote {
        border-left: 3px solid ${brandColors.accent};
        padding-left: 1rem;
        color: ${brandColors.secondary};
      }
      .ProseMirror a {
        color: ${brandColors.accent};
      }
    `;
  };

  return (
    <div className="rich-text-editor-wrapper border border-neutral-light rounded-md" style={editorStyle}> {/* Apply brand styles */}
      <style>{getEditorStyles()}</style>
      <EditorToolbar editor={editor} /> {/* Add the toolbar */}
      <EditorContent editor={editor} className={editorClasses} />
    </div>
  );
};

export default RichTextEditor;
