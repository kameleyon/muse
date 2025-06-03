/**
 * Markdown Cleaner Utility
 *
 * This utility cleans and normalizes markdown content to ensure consistent formatting.
 */

/**
 * Clean and normalize markdown content
 * @param content The raw markdown content to clean
 * @returns Cleaned and normalized markdown content
 */
export function cleanMarkdown(content: string): string {
  if (!content) return '';

  let cleaned = content;

  // Fix headings (ensure proper spacing)
  cleaned = cleaned.replace(/####+\s*([^#\n]+)/g, '#### $1');
  cleaned = cleaned.replace(/###\s*([^#\n]+)/g, '### $1');
  cleaned = cleaned.replace(/##\s*([^#\n]+)/g, '## $1');
  cleaned = cleaned.replace(/#\s*([^#\n]+)/g, '# $1');

  // Fix emphasis (convert ** to proper markdown)
  // First, handle cases with multiple dollar signs (+$$$+ or more) for key points
  cleaned = cleaned.replace(/\+\$\$\$\+([^$]+)\+\$\$\$\+/g, '+$$$+$1+$$$+');

  // Then handle standard bold and italic
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '**$1**'); // Bold
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '*$1*'); // Italic

  // Fix lists (ensure proper spacing)
  cleaned = cleaned.replace(/^\s*-\s*/gm, '- ');
  cleaned = cleaned.replace(/^\s*\d+\.\s*/gm, '$&'); // Keep original number spacing

  // Fix blockquotes (ensure proper spacing)
  cleaned = cleaned.replace(/^\s*>\s*/gm, '> ');

  // Fix horizontal rules
  cleaned = cleaned.replace(/^\s*[-*_]{3,}\s*$/gm, '---');

  // Fix links and images (ensure proper formatting, no extra spaces)
  cleaned = cleaned.replace(/\[\s*([^\]]+)\s*\]\(\s*([^)]+)\s*\)/g, '[$1]($2)');
  cleaned = cleaned.replace(/!\[\s*([^\]]*)\s*\]\(\s*([^)]+)\s*\)/g, '![$1]($2)');

  // Fix code blocks (ensure proper syntax)
  // Note: This regex might be simplified depending on expected input variations
  cleaned = cleaned.replace(/```([\s\S]*?)```/g, (match, code) => `\`\`\`\n${code.trim()}\n\`\`\``);
  cleaned = cleaned.replace(/`([^`]+)`/g, '`$1`');

  // Fix multiple consecutive line breaks (more than 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Optional: Remove trailing whitespace from lines
  cleaned = cleaned.replace(/[ \t]+$/gm, '');

  // Optional: Ensure single newline at end of file
  cleaned = cleaned.trim() + '\n';

  // Clean tables as the last step to ensure all other formatting is applied first
  cleaned = cleanTablesInMarkdown(cleaned);

  return cleaned;
}

/**
 * Formats a single markdown table string.
 * @param tableText The raw markdown table string.
 * @returns Formatted markdown table string.
 */
export function formatMarkdownTable(tableText: string): string {
  const lines = tableText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return tableText;

  const tableLines = lines.filter(line => line.includes('|'));
  if (tableLines.length < 2) return tableText;

  const separatorPattern = /^[\s|:-]+$/;
  
  let headerIndex = 0;
  while (headerIndex < tableLines.length && separatorPattern.test(tableLines[headerIndex])) {
    headerIndex++;
  }
  if (headerIndex >= tableLines.length) return tableText;

  const headerLine = tableLines[headerIndex];
  const headers = headerLine.split('|')
    .map(cell => cell.trim())
    .filter(cell => cell.length > 0);

  if (headers.length === 0) return tableText;

  const dataRows = tableLines
    .filter((line, index) =>
      index !== headerIndex &&
      !separatorPattern.test(line) &&
      line.trim().length > 0
    )
    .map(line => {
      const cells = line.split('|').map(cell => cell.trim());
      while (cells.length > 0 && cells[0] === '') cells.shift();
      while (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
      return cells;
    })
    .filter(row => row.length > 0);

  const normalizedDataRows = dataRows.map(row => {
    const normalizedRow = [...row];
    while (normalizedRow.length < headers.length) {
      normalizedRow.push('');
    }
    return normalizedRow.slice(0, headers.length);
  });

  const columnWidths = headers.map((header, index) => {
    const headerWidth = header.length;
    const maxDataWidth = Math.max(
      ...normalizedDataRows.map(row => (row[index] || '').length),
      0
    );
    return Math.max(headerWidth, maxDataWidth, 3);
  });

  const formattedHeader = '| ' + headers.map((header, index) =>
    header.padEnd(columnWidths[index])
  ).join(' | ') + ' |';

  const formattedSeparator = '|' + columnWidths.map(width =>
    '-'.repeat(width + 2) // +2 for padding spaces around hyphens
  ).join('|') + '|';

  const formattedDataRows = normalizedDataRows.map(row =>
    '| ' + row.map((cell, index) =>
      (cell || '').padEnd(columnWidths[index])
    ).join(' | ') + ' |'
  );

  return [formattedHeader, formattedSeparator, ...formattedDataRows].join('\n');
}

/**
 * Finds and cleans all tables within a given markdown string.
 * @param markdownContent The markdown string that may contain tables.
 * @returns Markdown string with all tables formatted.
 */
export function cleanTablesInMarkdown(markdownContent: string): string {
  const lines = markdownContent.split('\n');
  const processedLines: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.includes('|') && line.trim().length > 0) {
      const tableCandidate: string[] = [];
      let j = i;
      while (j < lines.length) {
        const currentLine = lines[j];
        // Collect lines with pipes or empty lines if a table candidate has started
        if (currentLine.includes('|') || (currentLine.trim() === '' && tableCandidate.length > 0 && tableCandidate.some(l => l.includes('|')))) {
          tableCandidate.push(currentLine);
          j++;
        } else {
          break;
        }
      }

      const linesWithPipes = tableCandidate.filter(l => l.includes('|'));
      if (linesWithPipes.length >= 2) {
        const tableText = tableCandidate.join('\n');
        const cleanedTable = formatMarkdownTable(tableText);
        processedLines.push(cleanedTable);
        i = j; // Move past the processed table block
      } else {
        processedLines.push(line); // Not a valid table start, push original line
        i++;
      }
    } else {
      processedLines.push(line);
      i++;
    }
  }
  return processedLines.join('\n');
}
