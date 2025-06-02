import React, { useState } from 'react'
import { cn } from '../lib/utils'
import { Eye, Edit2, Table } from 'lucide-react'

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

  // Enhanced table cleaning utility function
  const cleanMarkdownTable = (tableText: string): string => {
    const lines = tableText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) return tableText;
    
    // Find lines that contain pipe characters (potential table rows)
    const tableLines = lines.filter(line => line.includes('|'));
    
    if (tableLines.length < 2) return tableText;
    
    // Identify separator lines (contain mostly dashes, pipes, and spaces)
    const separatorPattern = /^[\s|:-]+$/;
    const separatorIndices = tableLines.map((line, index) =>
      separatorPattern.test(line) ? index : -1
    ).filter(index => index !== -1);
    
    // Extract header (first non-separator line)
    let headerIndex = 0;
    while (headerIndex < tableLines.length && separatorPattern.test(tableLines[headerIndex])) {
      headerIndex++;
    }
    
    if (headerIndex >= tableLines.length) return tableText;
    
    const headerLine = tableLines[headerIndex];
    
    // Extract headers and normalize
    const headers = headerLine.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);
    
    if (headers.length === 0) return tableText;
    
    // Extract data rows (skip separators and header)
    const dataRows = tableLines
      .filter((line, index) =>
        index !== headerIndex &&
        !separatorPattern.test(line) &&
        line.trim().length > 0
      )
      .map(line => {
        const cells = line.split('|').map(cell => cell.trim());
        // Remove empty cells at start/end (common in malformed tables)
        while (cells.length > 0 && cells[0] === '') cells.shift();
        while (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
        return cells;
      })
      .filter(row => row.length > 0);
    
    // Normalize column count (use header count as reference)
    const normalizedDataRows = dataRows.map(row => {
      const normalizedRow = [...row];
      // Pad with empty strings if row is shorter than headers
      while (normalizedRow.length < headers.length) {
        normalizedRow.push('');
      }
      // Trim if row is longer than headers
      return normalizedRow.slice(0, headers.length);
    });
    
    // Calculate column widths
    const columnWidths = headers.map((header, index) => {
      const headerWidth = header.length;
      const maxDataWidth = Math.max(
        ...normalizedDataRows.map(row => (row[index] || '').length),
        0
      );
      return Math.max(headerWidth, maxDataWidth, 3);
    });
    
    // Format header row
    const formattedHeader = '| ' + headers.map((header, index) =>
      header.padEnd(columnWidths[index])
    ).join(' | ') + ' |';
    
    // Format separator row
    const formattedSeparator = '|' + columnWidths.map(width =>
      '-'.repeat(width + 2)
    ).join('|') + '|';
    
    // Format data rows
    const formattedDataRows = normalizedDataRows.map(row =>
      '| ' + row.map((cell, index) =>
        (cell || '').padEnd(columnWidths[index])
      ).join(' | ') + ' |'
    );
    
    return [formattedHeader, formattedSeparator, ...formattedDataRows].join('\n');
  };

  // Function to clean all tables in the content
  const cleanTables = () => {
    let cleanedContent = value;
    
    // More flexible regex to catch various table formats
    const tablePatterns = [
      // Standard markdown tables
      /\|(.+)\|\n\|[-\s|:]+\|\n((?:\|.+\|\n?)*)/g,
      // Tables without proper separators
      /^(.+\|.+)$\n^(.+\|.+)$/gm,
      // Tables with broken pipe structure
      /(?:^|\n)((?:[^|\n]*\|[^|\n]*)+)(?:\n|$)/g
    ];
    
    // Try to find and clean table-like content
    const lines = cleanedContent.split('\n');
    const processedLines: string[] = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Check if this looks like the start of a table
      if (line.includes('|') && line.trim().length > 0) {
        // Collect consecutive lines that might be part of a table
        const tableCandidate: string[] = [];
        let j = i;
        
        while (j < lines.length) {
          const currentLine = lines[j];
          if (currentLine.includes('|') || (currentLine.trim() === '' && tableCandidate.length > 0)) {
            tableCandidate.push(currentLine);
            j++;
          } else {
            break;
          }
        }
        
        // If we found at least 2 lines with pipes, try to clean as table
        const linesWithPipes = tableCandidate.filter(l => l.includes('|'));
        if (linesWithPipes.length >= 2) {
          const tableText = tableCandidate.join('\n');
          const cleanedTable = cleanMarkdownTable(tableText);
          processedLines.push(cleanedTable);
          i = j;
        } else {
          processedLines.push(line);
          i++;
        }
      } else {
        processedLines.push(line);
        i++;
      }
    }
    
    onChange(processedLines.join('\n'));
  };

  const renderMarkdown = (content: string) => {
    // Basic markdown rendering
    let html = content
    
    // Headers
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-heading font-semibold text-secondary mt-6 mb-4">$1</h2>')
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-heading font-semibold text-secondary mt-4 mb-3">$1</h3>')
    html = html.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-heading font-semibold text-secondary mt-4 mb-2">$1</h4>')

    // Key Points 
    html = html.replace(/\+\$\$\$\+([\s\S]+?)\+\$\$\$\+/gs,`<div class="rounded-xl border border-stone-400/70 bg-stone-300/15 p-4 my-12 font-medium text-stone-600 text-md">$1</div>`)
    
    
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
    
    // Tables - Enhanced styling with rounded corners and custom colors
    html = html.replace(/\|(.+)\|\n\|[-\s|:]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
      // Process header
      const headerCells = header.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell.length > 0)
      const headerHtml = headerCells.map((cell: string) => `<th class="px-3 py-3 text-left text-white test-md bg-stone/85 font-regular">${cell}</th>`).join('')
      
      // Process body rows
      const bodyRows = rows.trim().split('\n').filter((row: string) => row.trim().length > 0)
      const bodyHtml = bodyRows.map((row: string) => {
        const cells = row.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell.length > 0)
        const cellsHtml = cells.map((cell: string) => `<td class="px-3 py-3 text-stone/85 text-sm border-stone/70">${cell}</td>`).join('')
        return `<tr class="border-b border-stone/70">${cellsHtml}</tr>`
      }).join('')
      
      return `<div class="overflow-x-auto my-6">
        <table class="w-full rounded-xl overflow-hidden border border-stone/70">
          <thead>
            <tr>${headerHtml}</tr>
          </thead>
          <tbody>
            ${bodyHtml}
          </tbody>
        </table>
      </div>`
    })
    
    // Key Points sections - Enhanced styling
    html = html.replace(/^(#{1,4})\s*(Key Points.*?)$/gim, (match, hashes, title) => {
      return `<div class="bg-stone/15 rounded-xl border border-stone/70 p-4 my-6">
        <h3 class="text-stone text-[10px] font-semibold mb-2 mt-0">${title}</h3>
        <div class="key-points-content text-stone/85 text-[10px]">`
    })
    
    // Close Key Points sections before next heading or at end
    html = html.replace(/(<div class="bg-stone\/15.*?key-points-content.*?>[\s\S]*?)(?=(^#{1,4}\s|$))/gm, (match, content) => {
      return content + '</div></div>\n'
    })
    
    return html
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {!readOnly && (
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={cleanTables}
            className="px-3 py-1.5 rounded-lg text-sm flex items-center bg-neutral-lightest text-neutral-medium hover:bg-neutral-light"
            title="Clean and format all tables in the content"
          >
            <Table className="w-4 h-4 mr-1" />
            Clean Tables
          </button>
          <div className="flex items-center space-x-2">
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