import React from 'react'
import { cn } from '../lib/utils'

interface TypingContentDisplayProps {
  content: string
  className?: string
}

const TypingContentDisplay: React.FC<TypingContentDisplayProps> = ({ content, className }) => {
  const renderMarkdown = (text: string) => {
    let html = text
    
    // Headers
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-heading font-semibold text-secondary mt-6 mb-4">$1</h2>')
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-heading font-semibold text-secondary mt-4 mb-3">$1</h3>')
    html = html.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-heading font-semibold text-secondary mt-4 mb-2">$1</h4>')

    // Key Points 
    html = html.replace(/\+\$\$\$\+([\s\S]+?)\+\$\$\$\+/gs,`<div class="rounded-xl border border-stone-400/70 bg-stone-300/15 p-4 mt-8 mb-8 font-medium text-stone-600 text-md">$1</div>`)
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary/30 pl-4 my-4 text-neutral-medium italic">$1</blockquote>')
    
    // Code blocks
    html = html.replace(/`([^`]+)`/g, '<code class="bg-neutral-lightest px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // Paragraphs - handle line breaks properly
    const lines = html.split('\n')
    const processedLines = []
    let inParagraph = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : ''
      
      if (line === '') {
        if (inParagraph) {
          processedLines.push('</p>')
          inParagraph = false
        }
      } else {
        if (!inParagraph && !line.startsWith('<')) {
          processedLines.push('<p class="mb-4">')
          inParagraph = true
        }
        processedLines.push(line)
        
        // Add space if next line continues the paragraph
        if (nextLine && !nextLine.startsWith('<') && nextLine !== '') {
          processedLines.push(' ')
        }
      }
    }
    
    if (inParagraph) {
      processedLines.push('</p>')
    }
    
    return processedLines.join('')
  }

  return (
    <div className={cn("prose prose-sm max-w-none min-h-[400px] relative", className)}>
      <div
        className="text-neutral-dark"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
      <div className="h-8 relative">
        <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5 absolute bottom-0" />
      </div>
    </div>
  );
}

export default TypingContentDisplay