/**
 * A simple utility to convert HTML to Markdown
 * Note: This is a basic implementation and doesn't handle all HTML elements
 * For a production app, consider using a library like turndown
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';
  
  let markdown = html;
  
  // Replace heading tags
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');
  
  // Replace paragraph tags
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  
  // Replace bold tags
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  
  // Replace italic tags
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  
  // Replace underline with markdown emphasis (no direct equivalent)
  markdown = markdown.replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_');
  
  // Replace links
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Replace images - handle more image tag variations
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');
  markdown = markdown.replace(/<img[^>]*src='([^']*)'[^>]*alt='([^']*)'[^>]*>/gi, '![$2]($1)');
  markdown = markdown.replace(/<img[^>]*src='([^']*)'[^>]*>/gi, '![]($1)');
  markdown = markdown.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gi, '![$1]($2)');
  markdown = markdown.replace(/<img[^>]*alt='([^']*)'[^>]*src='([^']*)'[^>]*>/gi, '![$1]($2)');
  
  // Replace unordered lists
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
    const listItems = content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    return listItems + '\n';
  });
  
  // Replace ordered lists
  markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match: string, content: string) => {
    let index = 1;
    const listItems = content.replace(/<li[^>]*>(.*?)<\/li>/gi, (liMatch: string, liContent: string) => {
      return `${index++}. ${liContent}\n`;
    });
    return listItems + '\n';
  });
  
  // Replace blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n');
  
  // Handle tables
  markdown = markdown.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match, tableContent) => {
    // Extract table rows
    const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
    if (!rows) return match;
    
    let markdownTable = '';
    let isFirstRow = true;
    
    rows.forEach((row: string) => {
      // Extract cells from the row
      const cells = row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi);
      if (!cells) return;
      
      const markdownRow = cells.map((cell: string) => {
        // Extract cell content
        const content = cell.replace(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/i, '$1').trim();
        return content || ' ';
      }).join(' | ');
      
      markdownTable += '| ' + markdownRow + ' |\n';
      
      // Add header separator after first row
      if (isFirstRow) {
        markdownTable += '| ' + cells.map(() => '---').join(' | ') + ' |\n';
        isFirstRow = false;
      }
    });
    
    return markdownTable + '\n';
  });
  
  // Special handling for chart code blocks
  markdown = markdown.replace(/<pre[^>]*><code[^>]*class="language-chart"[^>]*>([\s\S]*?)<\/code><\/pre>/gis, (match, chartData) => {
    // Preserve chart data exactly as is
    return '```chart\n' + chartData.trim() + '\n```\n\n';
  });
  
  // Replace code blocks with language classes
  markdown = markdown.replace(/<pre[^>]*><code[^>]*class="language-([^"]+)"[^>]*>([\s\S]*?)<\/code><\/pre>/gis, '```$1\n$2\n```\n\n');
  
  // Replace regular code blocks without language classes
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
  
  // Replace inline code
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  
  // Replace horizontal rules
  markdown = markdown.replace(/<hr[^>]*>/gi, '---\n\n');
  
  // Replace line breaks
  markdown = markdown.replace(/<br[^>]*>/gi, '\n');
  
  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  markdown = markdown.replace(/&nbsp;/g, ' ');
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');
  markdown = markdown.replace(/&quot;/g, '"');
  markdown = markdown.replace(/&#39;/g, "'");
  
  // Fix multiple newlines
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return markdown.trim();
}
