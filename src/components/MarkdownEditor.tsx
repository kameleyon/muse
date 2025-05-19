import React, { useState } from 'react'
import { cn } from '../lib/utils'
import { Eye, Edit2 } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  readOnly?: boolean
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  readOnly = false
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')

  const renderMarkdown = (content: string) => {
    // Basic markdown rendering
    let html = content
    
    // Headers
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-heading font-semibold text-secondary mt-6 mb-4">$1</h2>')
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-heading font-semibold text-secondary mt-4 mb-3">$1</h3>')
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary/30 pl-4 my-4 text-neutral-medium italic">$1</blockquote>')
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4">')
    html = '<p class="mb-4">' + html + '</p>'
    
    // Code blocks
    html = html.replace(/`([^`]+)`/g, '<code class="bg-neutral-lightest px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    
    return html
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {!readOnly && (
        <div className="flex items-center justify-end mb-2 space-x-2">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm flex items-center",
              viewMode === 'edit' 
                ? "bg-primary text-white" 
                : "bg-neutral-lightest text-neutral-medium hover:bg-neutral-light"
            )}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm flex items-center",
              viewMode === 'preview' 
                ? "bg-primary text-white" 
                : "bg-neutral-lightest text-neutral-medium hover:bg-neutral-light"
            )}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </button>
        </div>
      )}

      {viewMode === 'edit' && !readOnly ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex-1 w-full p-4 border border-neutral-light rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "resize-none font-mono text-sm text-neutral-dark",
            disabled && "opacity-50"
          )}
        />
      ) : (
        <div 
          className={cn(
            "flex-1 w-full p-4 border border-neutral-light rounded-lg",
            "overflow-y-auto prose prose-sm max-w-none",
            "bg-white"
          )}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      )}
    </div>
  )
}

export default MarkdownEditor