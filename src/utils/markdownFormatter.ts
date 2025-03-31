/**
 * Utility functions for formatting content to markdown with proper styling
 */

/**
 * Formats HTML content to properly styled markdown
 * @param htmlContent The HTML content to format
 * @param brandColors Optional brand colors to apply
 * @returns Formatted markdown content
 */
// Define the brand colors interface
interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  title?: string;
}

/**
 * Cleans up JSON code blocks from content
 * @param content The content to clean
 * @returns Content with JSON code blocks removed or converted to markdown
 */
export const cleanupJsonCodeBlocks = (content: string): string => {
  // Remove or convert JSON code blocks to markdown
  return content
    // Remove JSON chart objects that are in the middle of content
    .replace(/\{\s*"type"\s*:\s*"chart"[\s\S]*?\}\s*\n*/g,
      '[Chart visualization removed for better formatting]\n\n')
    
    // Remove other JSON objects
    .replace(/\{\s*"type"\s*:[\s\S]*?\}\s*\n*/g,
      '[Visual element removed for better formatting]\n\n')
    
    // Clean up any remaining JSON-like structures
    .replace(/\{\s*"[\w]+"[\s\S]*?\}\s*\n*/g,
      '[Data structure removed for better formatting]\n\n')
    
    // Fix broken markdown tables
    .replace(/\|\s*(\w+)\s*\|\s*(\w+)\s*\|/g, '| $1 | $2 |')
    
    // Ensure proper table formatting
    .replace(/\|\s*---\s*\|\s*---\s*\|/g, '| --- | --- |');
};

export const formatToMarkdown = (
  htmlContent: string,
  brandColors?: BrandColors
): string => {
  // Default colors if not provided
  const colors = {
    primary: brandColors?.primary || '#ae5630',
    secondary: brandColors?.secondary || '#232321',
    accent: brandColors?.accent || '#4a90e2'
  };

  // First, clean up any existing markdown or HTML formatting issues
  let cleanedContent = htmlContent
    // Clean up JSON code blocks
    .replace(/\{\s*"type"\s*:[\s\S]*?\}\s*\n*/g,
      '[Visual element removed for better formatting]\n\n')
    
    // Fix spacing issues
    .replace(/\s+/g, ' ')
    // Fix missing spaces after punctuation
    .replace(/([.!?])([A-Z])/g, '$1 $2')
    // Fix HTML tags that might be malformed
    .replace(/<([^>]+)>/g, (match, tag) => {
      // Properly format HTML tags
      const cleanTag = tag.trim();
      return `<${cleanTag}>`;
    });

  // Convert HTML to markdown with proper formatting
  let markdown = cleanedContent
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    
    // Paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    
    // Bold and italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    
    // Lists
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    })
    .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
      let index = 1;
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
        return `${index++}. $1\n`;
      });
    })
    
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    
    // Images
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
    
    // Tables (simplified conversion)
    .replace(/<table[^>]*>(.*?)<\/table>/gis, (match, content) => {
      let markdown = '';
      
      // Extract headers
      const headerMatch = content.match(/<th[^>]*>(.*?)<\/th>/gi);
      if (headerMatch) {
        const headers = headerMatch.map((h: string) => h.replace(/<\/?th[^>]*>/gi, '').trim());
        markdown += `| ${headers.join(' | ')} |\n`;
        markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;
      }
      
      // Extract rows
      const rowMatches = content.match(/<tr[^>]*>(.*?)<\/tr>/gis);
      if (rowMatches) {
        rowMatches.forEach((row: string) => {
          if (!row.includes('<th')) { // Skip header row
            const cells = row.match(/<td[^>]*>(.*?)<\/td>/gi);
            if (cells) {
              const cellValues = cells.map((c: string) => c.replace(/<\/?td[^>]*>/gi, '').trim());
              markdown += `| ${cellValues.join(' | ')} |\n`;
            }
          }
        });
      }
      
      return markdown + '\n';
    })
    
    // Blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
    
    // Code blocks
    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    
    // Horizontal rule
    .replace(/<hr[^>]*>/gi, '---\n\n')
    
    // Clean up any remaining HTML tags
    .replace(/<[^>]+>/g, '')
    
    // Fix extra newlines
    .replace(/\n{3,}/g, '\n\n');

  // Apply color indicators for PDF generation using a more compatible approach
  // Use special markers that can be processed by the PDF generator
  markdown = markdown
    // Mark headings with color indicators
    .replace(/^# (.*?)$/gm, `# [color:primary]$1[/color]`)
    .replace(/^## (.*?)$/gm, `## [color:primary]$1[/color]`)
    .replace(/^### (.*?)$/gm, `### [color:secondary]$1[/color]`)
    .replace(/^#### (.*?)$/gm, `#### [color:secondary]$1[/color]`)
    
    // Mark bold text
    .replace(/\*\*(.*?)\*\*/g, `**[color:primary]$1[/color]**`)
    
    // Mark links
    .replace(/\[(.*?)\]\((.*?)\)/g, `[[color:accent]$1[/color]]($2)`);

  return markdown;
};

/**
 * Formats content for PDF export with proper styling
 * @param content The content to format for PDF
 * @param brandColors Optional brand colors to apply
 * @returns Formatted content for PDF export
 */
export const formatForPdfExport = (
  content: string,
  brandColors?: BrandColors
): string => {
  // First convert to markdown
  const markdown = formatToMarkdown(content, brandColors);
  
  // Process the markdown for PDF generation with jsPDF
  // Preserve markdown formatting for PDF rendering
  const processedMarkdown = markdown
    // Keep color markers for PDF styling
    // Replace with actual PDF-compatible styling if needed
    .replace(/\[color:primary\](.*?)\[\/color\]/g, `$1`)
    .replace(/\[color:secondary\](.*?)\[\/color\]/g, `$1`)
    .replace(/\[color:accent\](.*?)\[\/color\]/g, `$1`)
    
    // Preserve markdown headings with proper formatting
    .replace(/^# (.*?)$/gm, `# $1\n`)
    .replace(/^## (.*?)$/gm, `## $1\n`)
    .replace(/^### (.*?)$/gm, `### $1\n`)
    
    // Preserve markdown lists
    .replace(/^- (.*?)$/gm, `- $1\n`)
    .replace(/^\d+\. (.*?)$/gm, `$1. $1\n`)
    
    // Preserve markdown bold/italic
    // These will be handled by the PDF renderer
    
    // Preserve markdown links with proper formatting
    .replace(/\[(.*?)\]\((.*?)\)/g, `[$1]($2)`)
    
    // Clean up any code blocks that might be causing issues
    .replace(/```([\s\S]*?)```/g, (match, codeContent) => {
      // Remove any JSON or code that might be causing rendering issues
      if (codeContent.includes('"type":') || codeContent.includes('function')) {
        return `[Code block removed for PDF export]`;
      }
      return match;
    })
    
    // Add extra line breaks for better readability
    .replace(/\n\n/g, `\n\n`);
  
  // Return the processed content
  return processedMarkdown;
};