/**
 * Configuration for terms that can be linked within markdown content
 */

export interface LinkableTermConfig {
  term: string;
  aliases?: string[];
  description?: string;
}

export interface LinkTermContext {
  isFirstOccurrence: boolean;
  isInExcludedContext: boolean;
  currentParagraphLinkCount: number;
}

// Example terms that can be linked
export const linkableTerms: LinkableTermConfig[] = [
  {
    term: 'Markdown',
    aliases: ['markdown syntax', 'md'],
    description: 'A lightweight markup language with plain text formatting syntax'
  },
  {
    term: 'React',
    aliases: ['React.js', 'ReactJS'],
    description: 'A JavaScript library for building user interfaces'
  }
];

/**
 * Determine if a term should be linked based on context
 */
export function shouldLinkTerm(term: string, context: LinkTermContext): boolean {
  // Default implementation: only link first occurrence and limit links per paragraph
  const maxLinksPerParagraph = 5;
  
  if (context.isInExcludedContext) {
    return false;
  }
  
  if (context.currentParagraphLinkCount >= maxLinksPerParagraph) {
    return false;
  }
  
  return context.isFirstOccurrence;
}

/**
 * Get the canonical form of a term from any of its variations
 */
export function getCanonicalTerm(term: string): string {
  const lowerTerm = term.toLowerCase();
  
  for (const config of linkableTerms) {
    if (config.term.toLowerCase() === lowerTerm) {
      return config.term;
    }
    
    if (config.aliases?.some(alias => alias.toLowerCase() === lowerTerm)) {
      return config.term;
    }
  }
  
  return term;
}
