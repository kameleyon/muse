import { executeOpenRouterRequest } from './openrouter';

export interface QualityMetrics {
  overallScore: number;
  breakdown: {
    audienceAlignment: ScoreDetail;
    readability: ScoreDetail;
    engagement: ScoreDetail;
    correctness: ScoreDetail;
    styleGuide: ScoreDetail;
    delivery: ScoreDetail;
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
  sentenceVariety: number;
  wordFrequency: Map<string, number>;
}

// ============================================================================
// ENHANCED CONTENT ANALYSIS
// ============================================================================

export function analyzeContent(content: string): ContentAnalysis {
  // Clean and prepare text
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links, keep text
  
  // Analyze sentences with improved splitting
  const sentences = cleanContent
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 3); // Filter out very short fragments
  
  // Analyze paragraphs
  const paragraphs = content
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 10); // Filter out very short paragraphs
  
  // Enhanced word analysis
  const words = cleanContent
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/[^\w]/g, '')) // Remove punctuation
    .filter(w => w.length > 2); // Filter out very short words
  
  // Calculate word frequency for diversity analysis
  const wordFrequency = new Map<string, number>();
  words.forEach(word => {
    wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
  });
  
  const uniqueWords = new Set(words);
  
  // Enhanced metrics calculation
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSentencesPerParagraph = sentences.length / Math.max(paragraphs.length, 1);
  const vocabularyDiversity = uniqueWords.size / words.length;
  
  // Calculate sentence variety (length variation)
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const sentenceLengthVariance = sentenceLengths.reduce((acc, len) => 
    acc + Math.pow(len - avgSentenceLength, 2), 0) / sentenceLengths.length;
  const sentenceVariety = Math.min(1, Math.sqrt(sentenceLengthVariance) / avgSentenceLength);
  
  // Enhanced Flesch Reading Ease calculation
  const syllableCount = words.reduce((count, word) => count + countEnhancedSyllables(word), 0);
  const avgSyllablesPerWord = syllableCount / Math.max(words.length, 1);
  const fleschReadingEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  
  // Enhanced Flesch-Kincaid Grade Level
  const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    avgWordsPerSentence,
    avgSentencesPerParagraph,
    vocabularyDiversity: Math.max(0, Math.min(1, vocabularyDiversity)),
    fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)),
    gradeLevel: Math.max(1, Math.min(18, gradeLevel)),
    sentenceVariety,
    wordFrequency
  };
}

// ============================================================================
// ENHANCED SYLLABLE COUNTING
// ============================================================================

function countEnhancedSyllables(word: string): number {
  if (!word || word.length === 0) return 0;
  
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length === 0) return 1;
  
  // Handle common patterns
  const specialCases: { [key: string]: number } = {
    'the': 1, 'a': 1, 'an': 1, 'and': 1, 'or': 1, 'but': 1, 'in': 1, 'on': 1, 'at': 1, 'to': 1,
    'fire': 1, 'hour': 1, 'our': 1, 'your': 1, 'here': 1, 'there': 1, 'where': 1,
    'people': 2, 'simple': 2, 'table': 2, 'little': 2, 'middle': 2, 'purple': 2
  };
  
  if (specialCases[word]) {
    return specialCases[word];
  }
  
  let count = 0;
  let previousWasVowel = false;
  const vowels = /[aeiouy]/;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.test(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  // Handle silent e
  if (word.endsWith('e') && count > 1) {
    count--;
  }
  
  // Handle 'le' endings
  if (word.endsWith('le') && word.length > 2 && !/[aeiou]/.test(word[word.length - 3])) {
    count++;
  }
  
  // Handle 'ed' endings
  if (word.endsWith('ed') && word.length > 2) {
    const beforeEd = word[word.length - 3];
    if (!/[aeiou]/.test(beforeEd) || beforeEd === 'd' || beforeEd === 't') {
      // Silent ed
    } else {
      count++;
    }
  }
  
  return Math.max(1, count);
}

// ============================================================================
// ENHANCED REPETITION DETECTION
// ============================================================================

export function detectRepetitions(content: string): { word: string; count: number; density: number }[] {
  const cleanContent = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = cleanContent
    .split(/\s+/)
    .filter(w => w.length > 3) // Only analyze meaningful words
    .filter(w => !isCommonWord(w)); // Filter out common words
  
  const wordCounts = new Map<string, number>();
  const phraseCounts = new Map<string, number>();
  
  // Count individual words
  words.forEach(word => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });
  
  // Count 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i]} ${words[i + 1]}`;
    phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
  }
  
  // Count 3-word phrases for important concepts
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    if (phrase.length > 10) { // Only longer phrases
      phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
    }
  }
  
  const repetitions: { word: string; count: number; density: number }[] = [];
  
  // Analyze word repetitions with adjusted thresholds
  wordCounts.forEach((count, word) => {
    if (count > 4) { // Slightly more lenient threshold
      repetitions.push({
        word,
        count,
        density: count / words.length
      });
    }
  });
  
  // Analyze phrase repetitions
  phraseCounts.forEach((count, phrase) => {
    if (count > 2) {
      repetitions.push({
        word: phrase,
        count,
        density: count / (words.length - phrase.split(' ').length + 1)
      });
    }
  });
  
  return repetitions
    .sort((a, b) => b.density - a.density)
    .slice(0, 20); // Limit to top 20 repetitions
}

// ============================================================================
// ENHANCED AI PATTERN DETECTION
// ============================================================================

export function detectAIPatterns(content: string): { 
  score: number; 
  patterns: string[]; 
  confidence: number;
} {
  // Critical AI patterns that are strong indicators
  const criticalAIPatterns = [
    /\bpicture this\b/gi,
    /\bimagine if we\b/gi,
    /\blet's dive deep into\b/gi,
    /\bbuckle up\b/gi,
    /\bwelcome to the world of\b/gi,
    /\bin this comprehensive guide\b/gi,
    /\bare you ready to transform\b/gi,
    /\bunlock the secrets of\b/gi,
    /\bthe ultimate guide to\b/gi,
    /\bmind-blowing\b/gi,
    /\blife-changing\b/gi,
    /\bgame-changing revolution\b/gi,
    /\bcutting-edge innovation\b/gi,
    /\brevolutionary breakthrough\b/gi
  ];
  
  // Moderate AI patterns (only flag if overused)
  const moderateAIPatterns = [
    /\bhowever,\b/gi,
    /\bmoreover,\b/gi,
    /\bfurthermore,\b/gi,
    /\badditionally,\b/gi,
    /\bconsequently,\b/gi,
    /\bnevertheless,\b/gi,
    /\bin conclusion,\b/gi,
    /\bit's important to note\b/gi,
    /\bit should be mentioned\b/gi,
    /\bmoving forward,\b/gi
  ];
  
  // Marketing jargon patterns
  const marketingPatterns = [
    /\bgame-changer\b/gi,
    /\brevolutionary\b/gi,
    /\bcutting-edge\b/gi,
    /\bgroundbreaking\b/gi,
    /\btransform your life\b/gi,
    /\bunlock your potential\b/gi,
    /\bseamless experience\b/gi,
    /\bmaximi[sz]e your\b/gi,
    /\boptimi[sz]e your\b/gi
  ];
  
  const detectedPatterns: string[] = [];
  let criticalScore = 0;
  let moderateScore = 0;
  let marketingScore = 0;
  
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Check critical patterns (heavy weight)
  criticalAIPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      criticalScore += matches.length * 15; // High penalty
      detectedPatterns.push(`${matches[0]} (${matches.length}x)`);
    }
  });
  
  // Check moderate patterns (only penalize if overused)
  moderateAIPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches && matches.length > 2) { // Only flag if used more than twice
      moderateScore += (matches.length - 2) * 5; // Graduated penalty
      detectedPatterns.push(`${matches[0]} (overused: ${matches.length}x)`);
    }
  });
  
  // Check marketing jargon
  marketingPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      marketingScore += matches.length * 8;
      detectedPatterns.push(`${matches[0]} (marketing jargon)`);
    }
  });
  
  // Analyze sentence starter repetition with increased tolerance
  const starterWords = sentences.map(s => {
    const firstWords = s.trim().split(/\s+/).slice(0, 2).join(' ').toLowerCase();
    return firstWords.replace(/[^\w\s]/g, '');
  }).filter(w => w.length > 2);
  
  const starterCounts = new Map<string, number>();
  starterWords.forEach(starter => {
    starterCounts.set(starter, (starterCounts.get(starter) || 0) + 1);
  });
  
  const repetitiveStarters = Array.from(starterCounts.entries())
    .filter(([_, count]) => count > 4) // Increased threshold from 3 to 4
    .map(([starter, count]) => ({ starter, count }));
  
  let repetitionScore = 0;
  if (repetitiveStarters.length > 2) { // Only penalize if multiple starters are overused
    repetitionScore = repetitiveStarters.reduce((acc, { count }) => acc + (count - 4) * 3, 0);
    const topStarters = repetitiveStarters
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(({ starter, count }) => `"${starter}" (${count}x)`)
      .join(', ');
    detectedPatterns.push(`Repetitive starters: ${topStarters}`);
  }
  
  // Calculate final scores with more lenient weights
  const totalPenalty = criticalScore + moderateScore + marketingScore + repetitionScore;
  const normalizedPenalty = Math.min(80, totalPenalty / Math.max(1, wordCount / 100)); // Normalize by content length
  
  // More realistic confidence calculation
  let confidence = Math.min(75, normalizedPenalty); // Cap at 75% instead of 99%
  
  // Adjust confidence based on content characteristics
  if (wordCount < 500) {
    confidence *= 0.8; // Reduce confidence for shorter content
  }
  
  if (detectedPatterns.length === 0) {
    confidence = Math.min(confidence, 15); // Low confidence if no patterns detected
  }
  
  const score = Math.max(20, 100 - normalizedPenalty); // Ensure minimum score of 20
  
  return {
    score: Math.round(score),
    patterns: detectedPatterns.slice(0, 8), // Limit to top 8 patterns
    confidence: Math.round(confidence)
  };
}

// ============================================================================
// ENHANCED VOCABULARY ANALYSIS
// ============================================================================

export function analyzeVocabularyDepth(content: string): {
  complexity: number;
  diversity: number;
  academicWords: number;
  commonWords: number;
  technicalTerms: string[];
} {
  const words = content
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/[^\w]/g, ''))
    .filter(w => w.length > 2);
  
  const uniqueWords = new Set(words);
  const diversity = uniqueWords.size / words.length;
  
  // Academic word list (simplified)
  const academicWords = new Set([
    'analyze', 'assessment', 'concept', 'consist', 'constitute', 'context', 'contract',
    'create', 'data', 'define', 'derive', 'distribute', 'economy', 'environment',
    'establish', 'estimate', 'evident', 'export', 'factor', 'formula', 'function',
    'identify', 'income', 'indicate', 'individual', 'interpret', 'involve', 'issue',
    'labor', 'legal', 'legislate', 'major', 'method', 'occur', 'percent', 'period',
    'policy', 'principle', 'proceed', 'process', 'require', 'research', 'respond',
    'role', 'section', 'significant', 'similar', 'source', 'specific', 'structure',
    'theory', 'vary', 'approach', 'area', 'available', 'benefit', 'concept',
    'consistent', 'constitutional', 'create', 'economic', 'environment', 'established',
    'estimate', 'factors', 'financial', 'formula', 'function', 'identified',
    'income', 'indicate', 'individual', 'interpretation', 'involved', 'issues'
  ]);
  
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'between', 'among', 'under', 'over', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'which', 'who', 'when',
    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
    'very', 'can', 'said', 'just', 'like', 'get', 'make', 'go', 'know', 'take', 'see',
    'come', 'think', 'look', 'want', 'give', 'use', 'find', 'tell', 'ask', 'work',
    'seem', 'feel', 'try', 'leave', 'call', 'good', 'new', 'first', 'last', 'long',
    'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different',
    'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad',
    'same', 'able'
  ]);
  
  let academicWordCount = 0;
  let commonWordCount = 0;
  const technicalTerms: string[] = [];
  
  words.forEach(word => {
    if (academicWords.has(word)) {
      academicWordCount++;
    } else if (commonWords.has(word)) {
      commonWordCount++;
    } else if (word.length > 6 && !isCommonWord(word)) {
      technicalTerms.push(word);
    }
  });
  
  const complexity = (academicWordCount + technicalTerms.length) / words.length;
  
  return {
    complexity,
    diversity,
    academicWords: academicWordCount,
    commonWords: commonWordCount,
    technicalTerms: [...new Set(technicalTerms)].slice(0, 20)
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isCommonWord(word: string): boolean {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'about', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'between', 'under', 'over', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'not', 'only', 'own',
    'same', 'than', 'too', 'very', 'said', 'just', 'like', 'get', 'make', 'know',
    'take', 'see', 'come', 'think', 'look', 'want', 'give', 'use', 'find', 'tell',
    'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'good', 'new', 'first',
    'last', 'long', 'great', 'little', 'old', 'right', 'big', 'high', 'different',
    'small', 'large', 'next', 'early', 'young', 'important', 'public', 'bad', 'able'
  ]);
  
  return commonWords.has(word.toLowerCase());
}

export function getContentStatistics(content: string): {
  readabilityGrade: string;
  vocabularyLevel: string;
  engagementScore: number;
  structureScore: number;
} {
  const analysis = analyzeContent(content);
  const vocabAnalysis = analyzeVocabularyDepth(content);
  
  // Determine readability grade
  let readabilityGrade = 'Advanced';
  if (analysis.fleschReadingEase >= 90) readabilityGrade = 'Very Easy';
  else if (analysis.fleschReadingEase >= 80) readabilityGrade = 'Easy';
  else if (analysis.fleschReadingEase >= 70) readabilityGrade = 'Fairly Easy';
  else if (analysis.fleschReadingEase >= 60) readabilityGrade = 'Standard';
  else if (analysis.fleschReadingEase >= 50) readabilityGrade = 'Fairly Difficult';
  else if (analysis.fleschReadingEase >= 30) readabilityGrade = 'Difficult';
  
  // Determine vocabulary level
  let vocabularyLevel = 'Advanced';
  if (vocabAnalysis.complexity < 0.1) vocabularyLevel = 'Basic';
  else if (vocabAnalysis.complexity < 0.2) vocabularyLevel = 'Intermediate';
  else if (vocabAnalysis.complexity < 0.3) vocabularyLevel = 'Upper Intermediate';
  
  // Calculate engagement score
  const questions = (content.match(/\?/g) || []).length;
  const examples = (content.match(/\b(example|instance|case|such as)\b/gi) || []).length;
  const lists = (content.match(/^\s*[-*•]\s/gm) || []).length;
  const engagementScore = Math.min(100, 
    (questions * 5) + (examples * 3) + (lists * 2) + (analysis.sentenceVariety * 30)
  );
  
  // Calculate structure score
  const headings = (content.match(/^#{1,6}\s/gm) || []).length;
  const paragraphBalance = Math.min(1, 1 / Math.abs(analysis.avgSentencesPerParagraph - 4));
  const structureScore = Math.min(100, 
    (headings * 10) + (paragraphBalance * 40) + (analysis.paragraphCount > 3 ? 30 : 0)
  );
  
  return {
    readabilityGrade,
    vocabularyLevel,
    engagementScore: Math.round(engagementScore),
    structureScore: Math.round(structureScore)
  };
}