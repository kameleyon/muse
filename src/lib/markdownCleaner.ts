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
  // First, handle cases with multiple asterisks (*** or more)
  cleaned = cleaned.replace(/\*{3,}([^*]+)\*{3,}/g, '***$1***');

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

  return cleaned;
}
