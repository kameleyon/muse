import { QualityMetrics, analyzeContent, detectRepetitions, detectAIPatterns } from './qualityMetrics';
import {
  evaluateAudienceAlignment,
  evaluateAccuracy,
  evaluateCorrectness,
  evaluateStyleGuide,
  evaluateDelivery,
  evaluatePurposeAlignment,
  evaluateFactualAccuracy
} from './qualityEvaluators';

interface BookContext {
  topic: string;
  targetAudience: any;
  marketResearch: any;
  tone: string;
  style: string;
  readingLevel: string;
  gradeLevel: string;
}

interface ChapterContext {
  title: string;
  number: number;
  description: string;
  keyTopics?: string[];
}

// ============================================================================
// OPTIMIZED QUALITY THRESHOLDS
// ============================================================================

const ENHANCED_QUALITY_THRESHOLDS = {
  VOCABULARY: {
    EXCELLENT: 0.65,
    GOOD: 0.55,
    ACCEPTABLE: 0.35,     // More realistic threshold
    POOR: 0.25
  },
  GRADE_LEVEL_TOLERANCE: 3,   // Increased from 2
  AI_CONFIDENCE: {
    EXCELLENT: 15,
    GOOD: 25,
    ACCEPTABLE: 40,       // More lenient
    POOR: 60
  },
  READABILITY: {
    FLESCH_TOLERANCE: 15,      // Increased from 10
    SENTENCE_LENGTH: { min: 8, max: 30 }, // Wider range
    PARAGRAPH_LENGTH: { min: 2, max: 8 }  // More flexible
  }
};

// ============================================================================
// ENHANCED QUALITY CALCULATION
// ============================================================================

export async function calculateQualityScore(
  content: string,
  bookContext: BookContext,
  chapterContext: ChapterContext
): Promise<QualityMetrics> {
  const contentAnalysis = analyzeContent(content);
  const repetitions = detectRepetitions(content);
  const aiPatterns = detectAIPatterns(content);
  
  const createErrorScore = (error: any) => ({
    score: 0,
    maxScore: 100,
    percentage: 0,
    issues: ['Evaluation failed', error.message],
    highlights: [],
  });

  // Async evaluations with error handling
  const evaluationPromises = {
    audienceAlignment: evaluateAudienceAlignment(content, bookContext, contentAnalysis).catch(createErrorScore),
    correctness: evaluateCorrectness(content).catch(createErrorScore),
    factualAccuracy: evaluateFactualAccuracy(content, bookContext).catch(createErrorScore),
    accuracy: evaluateAccuracy(content, bookContext, chapterContext).catch(createErrorScore),
    purposeAlignment: evaluatePurposeAlignment(content, bookContext, chapterContext).catch(createErrorScore),
  };

  const evaluatedScores = await Promise.all(Object.values(evaluationPromises));
  
  // Build quality breakdown with enhanced evaluations
  const breakdown: QualityMetrics['breakdown'] = {
    audienceAlignment: evaluatedScores[0],
    readability: evaluateEnhancedReadability(contentAnalysis, bookContext),
    engagement: evaluateEnhancedEngagement(content, contentAnalysis),
    correctness: evaluatedScores[1],
    styleGuide: evaluateStyleGuide(content, bookContext),
    delivery: evaluateDelivery(content, contentAnalysis),
    vocabulary: evaluateEnhancedVocabulary(contentAnalysis, bookContext),
    aiPatterns: evaluateEnhancedAIPatterns(aiPatterns),
    purposeAlignment: evaluatedScores[4],
    factualAccuracy: evaluatedScores[2],
  };
  
  // Enhanced weighted scoring system
  const weights = {
    audienceAlignment: 0.12,
    readability: 0.10,
    engagement: 0.12,
    correctness: 0.08,
    styleGuide: 0.10,
    delivery: 0.10,
    vocabulary: 0.12,        // Increased weight
    aiPatterns: 0.10,        // Increased weight
    purposeAlignment: 0.08,
    factualAccuracy: 0.08
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.entries(breakdown).forEach(([key, detail]) => {
    const weight = weights[key as keyof typeof weights] || 0;
    totalScore += (detail as any).percentage * weight;
    totalWeight += weight;
  });
  
  const overallScore = Math.round(totalScore / totalWeight);
  
  // Generate intelligent suggestions
  const suggestions = generateEnhancedSuggestions(breakdown);
  
  return {
    overallScore,
    breakdown,
    suggestions,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// ENHANCED READABILITY EVALUATION
// ============================================================================

function evaluateEnhancedReadability(analysis: ReturnType<typeof analyzeContent>, context: BookContext) {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];
  
  // More lenient Flesch Reading Ease evaluation
  const targetFleschScore = getTargetFleschScore(context.readingLevel);
  const fleschDiff = Math.abs(analysis.fleschReadingEase - targetFleschScore);
  
  if (fleschDiff > ENHANCED_QUALITY_THRESHOLDS.READABILITY.FLESCH_TOLERANCE) {
    const penalty = Math.min(25, (fleschDiff - ENHANCED_QUALITY_THRESHOLDS.READABILITY.FLESCH_TOLERANCE) * 1.5);
    score -= penalty;
    issues.push(`Reading ease (${analysis.fleschReadingEase.toFixed(1)}) differs from target (${targetFleschScore})`);
  } else if (fleschDiff <= 5) {
    highlights.push(`Excellent reading ease alignment with target audience`);
  } else {
    highlights.push(`Good reading ease for target audience`);
  }
  
  // Enhanced sentence length evaluation
  const { min: minSentence, max: maxSentence } = ENHANCED_QUALITY_THRESHOLDS.READABILITY.SENTENCE_LENGTH;
  
  if (analysis.avgWordsPerSentence > maxSentence) {
    score -= Math.min(15, (analysis.avgWordsPerSentence - maxSentence) * 0.5);
    issues.push(`Sentences may be too long (avg ${analysis.avgWordsPerSentence.toFixed(1)} words)`);
  } else if (analysis.avgWordsPerSentence < minSentence) {
    score -= Math.min(10, (minSentence - analysis.avgWordsPerSentence) * 0.5);
    issues.push(`Sentences may be too short (avg ${analysis.avgWordsPerSentence.toFixed(1)} words)`);
  } else {
    highlights.push(`Excellent sentence length for readability`);
  }
  
  // Enhanced paragraph structure evaluation
  const { min: minParagraph, max: maxParagraph } = ENHANCED_QUALITY_THRESHOLDS.READABILITY.PARAGRAPH_LENGTH;
  
  if (analysis.avgSentencesPerParagraph > maxParagraph) {
    score -= Math.min(8, (analysis.avgSentencesPerParagraph - maxParagraph) * 1);
    issues.push(`Paragraphs may be too long (avg ${analysis.avgSentencesPerParagraph.toFixed(1)} sentences)`);
  } else if (analysis.avgSentencesPerParagraph < minParagraph) {
    score -= 3;
    issues.push(`Paragraphs may be too short for depth`);
  } else {
    highlights.push(`Good paragraph structure and flow`);
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

// ============================================================================
// ENHANCED VOCABULARY EVALUATION
// ============================================================================

function evaluateEnhancedVocabulary(analysis: ReturnType<typeof analyzeContent>, context: BookContext) {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];
  
  const diversity = analysis.vocabularyDiversity;
  const thresholds = ENHANCED_QUALITY_THRESHOLDS.VOCABULARY;
  
  // Enhanced vocabulary diversity scoring
  if (diversity < thresholds.POOR) {
    score -= 30;
    issues.push(`Very limited vocabulary variety (${(diversity * 100).toFixed(1)}% unique words)`);
  } else if (diversity < thresholds.ACCEPTABLE) {
    score -= 15;  // Reduced penalty
    issues.push(`Limited vocabulary variety (${(diversity * 100).toFixed(1)}% unique words)`);
  } else if (diversity >= thresholds.EXCELLENT) {
    if (diversity > 0.75) {
      score -= 5;  // Minor penalty for potentially too complex vocabulary
      issues.push(`Vocabulary may be complex for some readers (${(diversity * 100).toFixed(1)}% unique)`);
    } else {
      highlights.push(`Excellent vocabulary diversity (${(diversity * 100).toFixed(1)}% unique words)`);
    }
  } else if (diversity >= thresholds.GOOD) {
    highlights.push(`Good vocabulary variety for target audience (${(diversity * 100).toFixed(1)}%)`);
  } else {
    highlights.push(`Acceptable vocabulary diversity for the content type`);
  }
  
  // Enhanced grade level alignment with increased tolerance
  const targetGrade = parseInt(context.gradeLevel) || 9;
  const gradeDiff = Math.abs(analysis.gradeLevel - targetGrade);
  
  if (gradeDiff > ENHANCED_QUALITY_THRESHOLDS.GRADE_LEVEL_TOLERANCE) {
    score -= Math.min(20, gradeDiff * 3);
    issues.push(`Grade level (${analysis.gradeLevel.toFixed(1)}) significantly differs from target (${targetGrade})`);
  } else if (gradeDiff > 1.5) {
    score -= Math.min(8, gradeDiff * 2);
    issues.push(`Grade level slightly above target range`);
  } else {
    highlights.push(`Grade level well-aligned with target audience`);
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

// ============================================================================
// ENHANCED ENGAGEMENT EVALUATION
// ============================================================================

function evaluateEnhancedEngagement(content: string, analysis: ReturnType<typeof analyzeContent>) {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];
  
  // Enhanced question analysis
  const questions = (content.match(/\?/g) || []).length;
  const questionRatio = questions / analysis.sentenceCount;
  
  if (questionRatio < 0.01) {
    score -= 8;  // Reduced penalty
    issues.push(`Consider adding more questions to engage readers`);
  } else if (questionRatio > 0.15) {
    score -= 8;
    issues.push(`Too many questions may overwhelm readers`);
  } else if (questionRatio >= 0.03) {
    highlights.push(`Excellent use of questions to engage readers`);
  } else {
    highlights.push(`Good reader engagement through questions`);
  }
  
  // Enhanced example detection
  const exampleIndicators = [
    /\b(for example|for instance|such as|like|consider|take)\b/gi,
    /\b(imagine|suppose|let's say|picture)\b/gi,
    /\b(case study|real.world|in practice)\b/gi
  ];
  
  let exampleCount = 0;
  exampleIndicators.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) exampleCount += matches.length;
  });
  
  if (exampleCount < 2) {
    score -= 12;
    issues.push(`Needs more concrete examples and illustrations`);
  } else if (exampleCount >= 5) {
    highlights.push(`Rich in examples and practical illustrations`);
  } else {
    highlights.push(`Good use of examples to clarify concepts`);
  }
  
  // Enhanced active voice analysis
  const passiveIndicators = content.match(/\b(was|were|been|being)\s+\w+ed\b/gi) || [];
  const passiveRatio = passiveIndicators.length / analysis.sentenceCount;
  
  if (passiveRatio > 0.4) {
    score -= 15;
    issues.push(`Excessive passive voice reduces engagement`);
  } else if (passiveRatio > 0.25) {
    score -= 8;
    issues.push(`Consider using more active voice`);
  } else if (passiveRatio < 0.1) {
    highlights.push(`Excellent use of active voice for engagement`);
  }
  
  // Content variety analysis
  const listItems = (content.match(/^\s*[-*•]\s/gm) || []).length;
  const headings = (content.match(/^#{1,6}\s/gm) || []).length;
  
  if (headings >= 3 && listItems >= 2) {
    highlights.push(`Good content structure with headings and lists`);
  } else if (headings < 2) {
    score -= 5;
    issues.push(`Consider adding more section headings for better structure`);
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

// ============================================================================
// ENHANCED AI PATTERNS EVALUATION
// ============================================================================

function evaluateEnhancedAIPatterns(aiPatterns: ReturnType<typeof detectAIPatterns>) {
  const confidence = aiPatterns.confidence;
  const thresholds = ENHANCED_QUALITY_THRESHOLDS.AI_CONFIDENCE;
  
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];
  
  // Enhanced AI confidence scoring
  if (confidence > thresholds.POOR) {
    score = 30;  // Cap at 30 for very high confidence
    issues.push(`High AI pattern confidence detected (${confidence}%)`);
    if (aiPatterns.patterns.length > 0) {
      issues.push(`Detected patterns: ${aiPatterns.patterns.slice(0, 2).join(', ')}`);
    }
  } else if (confidence > thresholds.ACCEPTABLE) {
    score = Math.max(60, 100 - confidence);
    issues.push(`Moderate AI pattern confidence (${confidence}%)`);
  } else if (confidence > thresholds.GOOD) {
    score = Math.max(75, 100 - confidence * 0.8);
    highlights.push(`Low AI pattern detection`);
  } else if (confidence <= thresholds.EXCELLENT) {
    score = Math.max(85, 100 - confidence * 0.5);
    highlights.push(`Very natural, human-like writing style`);
  } else {
    score = Math.max(80, 100 - confidence * 0.6);
    highlights.push(`Mostly natural writing with minimal AI patterns`);
  }
  
  return {
    score: Math.round(score),
    maxScore: 100,
    percentage: Math.round(score),
    issues,
    highlights
  };
}

// ============================================================================
// ENHANCED SUGGESTIONS GENERATOR
// ============================================================================

function generateEnhancedSuggestions(breakdown: QualityMetrics['breakdown']): string[] {
  const suggestions: string[] = [];
  
  // Find areas needing improvement (below 80%)
  const improvementAreas = Object.entries(breakdown)
    .map(([key, detail]) => ({ 
      key, 
      score: (detail as any).percentage,
      issues: (detail as any).issues 
    }))
    .filter(area => area.score < 80)
    .sort((a, b) => a.score - b.score);
  
  // Prioritize suggestions based on impact
  const priorityOrder = ['vocabulary', 'aiPatterns', 'readability', 'engagement'];
  
  priorityOrder.forEach(priorityKey => {
    const area = improvementAreas.find(a => a.key === priorityKey);
    if (area && area.issues.length > 0) {
      suggestions.push(`${getDisplayName(area.key)}: ${area.issues[0]}`);
    }
  });
  
  // Add remaining suggestions
  improvementAreas
    .filter(area => !priorityOrder.includes(area.key))
    .slice(0, 2)
    .forEach(area => {
      if (area.issues.length > 0) {
        suggestions.push(`${getDisplayName(area.key)}: ${area.issues[0]}`);
      }
    });
  
  return suggestions.slice(0, 5); // Limit to top 5 suggestions
}

function getDisplayName(key: string): string {
  const displayNames: { [key: string]: string } = {
    vocabulary: 'Vocabulary',
    aiPatterns: 'Writing Style',
    readability: 'Readability',
    engagement: 'Engagement',
    audienceAlignment: 'Audience Alignment',
    correctness: 'Correctness',
    styleGuide: 'Style Guide',
    delivery: 'Delivery',
    purposeAlignment: 'Purpose Alignment',
    factualAccuracy: 'Factual Accuracy'
  };
  
  return displayNames[key] || key;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getTargetFleschScore(readingLevel: string): number {
  const levels: { [key: string]: number } = {
    'Very Easy (90-100)': 95,
    'Easy (80-89)': 85,
    'Fairly Easy (70-79)': 75,
    'Standard (60-69)': 65,
    'Fairly Difficult (50-59)': 55,
    'Difficult (30-49)': 40,
    'Very Difficult (0-29)': 20
  };
  
  return levels[readingLevel] || 65;
}