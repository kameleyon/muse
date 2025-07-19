import { executeOpenRouterRequest } from './openrouter';

export interface QualityMetrics {
  overallScore: number;
  breakdown: {
    audienceAlignment: ScoreDetail;
    readability: ScoreDetail;
    accuracy: ScoreDetail;
    engagement: ScoreDetail;
    correctness: ScoreDetail;
    styleGuide: ScoreDetail;
    delivery: ScoreDetail;
    originality: ScoreDetail;
    repetition: ScoreDetail;
    vocabulary: ScoreDetail;
    aiPatterns: ScoreDetail;
    purposeAlignment: ScoreDetail;
    factualAccuracy: ScoreDetail;
  };
  suggestions: string[];
  timestamp: string;
}

interface ScoreDetail {
  score: number;
  maxScore: number;
  percentage: number;
  issues: string[];
  highlights: string[];
}

interface ContentAnalysis {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  avgSentencesPerParagraph: number;
  vocabularyDiversity: number;
  fleschReadingEase: number;
  gradeLevel: number;
}

// Analyze basic content metrics
export function analyzeContent(content: string): ContentAnalysis {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const uniqueWords = new Set(words);
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSentencesPerParagraph = sentences.length / paragraphs.length;
  const vocabularyDiversity = uniqueWords.size / words.length;
  
  // Calculate Flesch Reading Ease
  const syllableCount = words.reduce((count, word) => count + countSyllables(word), 0);
  const avgSyllablesPerWord = syllableCount / words.length;
  const fleschReadingEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  
  // Calculate grade level (Flesch-Kincaid)
  const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    avgWordsPerSentence,
    avgSentencesPerParagraph,
    vocabularyDiversity,
    fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)),
    gradeLevel: Math.max(1, Math.min(18, gradeLevel))
  };
}

// Count syllables in a word (approximation)
function countSyllables(word: string): number {
  word = word.toLowerCase();
  let count = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = /[aeiou]/.test(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  // Adjust for silent e
  if (word.endsWith('e')) {
    count--;
  }
  
  // Ensure at least one syllable
  return Math.max(1, count);
}

// Detect word/phrase repetitions
export function detectRepetitions(content: string): { word: string; count: number; density: number }[] {
  const words = content.toLowerCase().split(/\s+/)
    .filter(w => w.length > 3) // Ignore short words
    .map(w => w.replace(/[^a-z]/g, '')); // Remove punctuation
  
  const wordCounts = new Map<string, number>();
  words.forEach(word => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });
  
  // Find 2-word phrases
  const phrases = new Map<string, number>();
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i]} ${words[i + 1]}`;
    phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
  }
  
  const repetitions: { word: string; count: number; density: number }[] = [];
  
  // Add overused words
  wordCounts.forEach((count, word) => {
    if (count > 3) {
      repetitions.push({
        word,
        count,
        density: count / words.length
      });
    }
  });
  
  // Add overused phrases
  phrases.forEach((count, phrase) => {
    if (count > 2) {
      repetitions.push({
        word: phrase,
        count,
        density: count / (words.length - 1)
      });
    }
  });
  
  return repetitions.sort((a, b) => b.density - a.density);
}

// Detect AI writing patterns
export function detectAIPatterns(content: string): { 
  score: number; 
  patterns: string[]; 
  confidence: number;
} {
  const aiPatterns = [
    /picture this/gi,
  /imagine/gi,
  /let's dive/gi,
  /buckle up/gi,
  /welcome to/gi,
  /cosmic/gi,
  /have you ever wondered/gi,
  /in this article/gi,
  /are you looking to/gi,
  /curious about/gi,
  /however,/gi,
  /moreover,/gi,
  /furthermore,/gi,
  /additionally,/gi,
  /on the other hand,/gi,
  /with that said,/gi,
  /in contrast,/gi,
  /similarly,/gi,
  /consequently,/gi,
  /nevertheless,/gi,
  /meanwhile,/gi,
  /specifically,/gi,
  /to illustrate,/gi,
  /for instance,/gi,
  /in particular,/gi,
  /in conclusion,/gi,
  /to sum up,/gi,
  /in summary,/gi,
  /ultimately,/gi,
  /to wrap things up,/gi,
  /the bottom line is,/gi,
  /all things considered,/gi,
  /as we've seen,/gi,
  /moving forward,/gi,
  /looking ahead,/gi,
  /it's worth noting/gi,
  /it's important to note/gi,
  /it should be mentioned/gi,
  /keep in mind that/gi,
  /it's crucial to remember/gi,
  /generally speaking,/gi,
  /in most cases,/gi,
  /typically,/gi,
  /often,/gi,
  /usually,/gi,
  /leverage/gi,
  /utilize/gi,
  /implement/gi,
  /facilitate/gi,
  /optimize/gi,
  /streamline/gi,
  /robust/gi,
  /game-changer/gi,
  /revolutionary/gi,
  /cutting-edge/gi,
  /innovative/gi,
  /strategic/gi,
  /synergy/gi,
  /best practices/gi,
  /pain points/gi,
  /journey/gi,
  /path/gi,
  /landscape/gi,
  /navigate/gi,
  /roadmap/gi,
  /blueprint/gi,
  /tapestry/gi,
  /realm/gi,
  /ecosystem/gi,
  /horizon/gi,
  /unlock/gi,
  /transform your life/gi,
  /gateway to/gi,
  /bridge the gap/gi,
  /pave the way/gi,
  /top \d+/gi,
  /\d+ essential tips/gi,
  /\d+ strategies/gi,
  /\d+ benefits/gi,
  /\d+ common mistakes/gi,
  /but what does this mean/gi,
  /how can you apply this/gi,
  /why does this matter/gi,
  /amazing/gi,
  /incredible/gi,
  /stunning/gi,
  /powerful/gi,
  /effective/gi,
  /essential/gi,
  /critical/gi,
  /crucial/gi,
  /vital/gi,
  /comprehensive/gi,
  /extensive/gi,
  /thorough/gi,
  /in technical terms/gi,
  /in simpler terms/gi,
  /step by step/gi,
  /pros and cons/gi,
  /faq/gi,
  /beginner/gi,
  /intermediate/gi,
  /advanced/gi,
  /problem-solution/gi,
  /definition/gi,
  /example/gi,
  /application/gi,
  /comparison/gi,
  /technical term/gi,
  /layperson/gi,
  /celestial/gi,
  /mystical/gi,
  /delve into/gi
  ];
  
  const detectedPatterns: string[] = [];
  let patternCount = 0;
  
  aiPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      patternCount += matches.length;
      detectedPatterns.push(matches[0]);
    }
  });
  
  // Check for overly formal transitions
  const transitionCount = (content.match(/\b(However|Moreover|Furthermore|Additionally|Consequently|Therefore|Nevertheless)\b/g) || []).length;
  
  // Check for repetitive sentence starters
  const sentences = content.split(/[.!?]+/);
  const starterWords = sentences.map(s => s.trim().split(' ')[0]).filter(w => w);
  const starterCounts = new Map<string, number>();
  starterWords.forEach(word => {
    starterCounts.set(word, (starterCounts.get(word) || 0) + 1);
  });
  
  const repetitiveStarters = Array.from(starterCounts.entries())
    .filter(([_, count]) => count > 3)
    .map(([word, _]) => word);
  
  if (repetitiveStarters.length > 0) {
    detectedPatterns.push(`Repetitive sentence starters: ${repetitiveStarters.join(', ')}`);
  }
  
  const wordCount = content.split(/\s+/).length;
  const patternDensity = patternCount / wordCount;
  const transitionDensity = transitionCount / sentences.length;
  
  // Calculate AI pattern score (0-100, where 100 is most human-like)
  let aiScore = 100;
  aiScore -= patternDensity * 500; // Heavy penalty for AI patterns
  aiScore -= transitionDensity * 100; // Penalty for overuse of formal transitions
  aiScore -= repetitiveStarters.length * 5; // Penalty for repetitive starters
  
  const confidence = Math.min(99, Math.max(1, 100 - Math.max(0, aiScore)));
  
  return {
    score: Math.max(0, aiScore),
    patterns: detectedPatterns,
    confidence
  };
}