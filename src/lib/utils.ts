import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes without conflicts.
 * @param inputs - Class values to merge.
 * @returns Merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if a string contains common Markdown syntax characters.
 * This is a basic check and might not cover all edge cases.
 * @param text - The string to check.
 * @returns True if the string likely contains Markdown, false otherwise.
 */
export function containsMarkdown(text: string): boolean {
  if (!text) {
    return false;
  }
  // Look for common markdown patterns: **, __, *, _, #, ```, ``, [], (), ![]()
  // Added checks for list items (* , - , + ) and blockquotes (>)
  const markdownPattern = /(\*\*|__|\*|_|#|```|`|\[.*\]\(.*\)|!\[.*\]\(.*\)|^\s*[-*+]\s+|\n>\s*)/;
  return markdownPattern.test(text);
}
