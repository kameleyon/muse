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

export async function calculateQualityScore(
  content: string,
  bookContext: BookContext,
  chapterContext: ChapterContext
): Promise<QualityMetrics> {
  const contentAnalysis = analyzeContent(content);
  const repetitions = detectRepetitions(content);
  const aiPatterns = detectAIPatterns(content);
  
  // Initialize breakdown with all criteria
  const breakdown: QualityMetrics['breakdown'] = {
    audienceAlignment: await evaluateAudienceAlignment(content, bookContext, contentAnalysis),
    readability: evaluateReadability(contentAnalysis, bookContext),
    accuracy: await evaluateAccuracy(content, bookContext, chapterContext),
    engagement: evaluateEngagement(content, contentAnalysis),
    correctness: await evaluateCorrectness(content),
    styleGuide: evaluateStyleGuide(content, bookContext),
    delivery: evaluateDelivery(content, contentAnalysis),
    originality: evaluateOriginality(aiPatterns),
    repetition: evaluateRepetition(repetitions, contentAnalysis),
    vocabulary: evaluateVocabulary(contentAnalysis, bookContext),
    aiPatterns: evaluateAIPatterns(aiPatterns),
    purposeAlignment: await evaluatePurposeAlignment(content, bookContext, chapterContext),
    factualAccuracy: await evaluateFactualAccuracy(content, bookContext)
  };
  
  // Calculate overall score (weighted average)
  const weights = {
    audienceAlignment: 0.12,
    readability: 0.10,
    accuracy: 0.08,
    engagement: 0.10,
    correctness: 0.08,
    styleGuide: 0.08,
    delivery: 0.08,
    originality: 0.10,
    repetition: 0.06,
    vocabulary: 0.06,
    aiPatterns: 0.08,
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
  
  // Generate suggestions based on low-scoring areas
  const suggestions = generateSuggestions(breakdown);
  
  return {
    overallScore,
    breakdown,
    suggestions,
    timestamp: new Date().toISOString()
  };
}

function evaluateReadability(analysis: ReturnType<typeof analyzeContent>, context: BookContext) {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];
  
  // Check against target reading level
  const targetFleschScore = getTargetFleschScore(context.readingLevel);
  const fleschDiff = Math.abs(analysis.fleschReadingEase - targetFleschScore);
  
  if (fleschDiff > 10) {
    score -= Math.min(30, fleschDiff - 10);
    issues.push(`Reading ease score (${analysis.fleschReadingEase.toFixed(1)}) differs from target (${targetFleschScore})`);
  } else {
    highlights.push(`Reading ease matches target audience well`);
  }
  
  // Check sentence length
  if (analysis.avgWordsPerSentence > 25) {
    score -= 10;
    issues.push(`Sentences too long (avg ${analysis.avgWordsPerSentence.toFixed(1)} words)`);
  } else if (analysis.avgWordsPerSentence < 10) {
    score -= 5;
    issues.push(`Sentences too short (avg ${analysis.avgWordsPerSentence.toFixed(1)} words)`);
  } else {
    highlights.push(`Good sentence length variation`);
  }
  
  // Check paragraph structure
  if (analysis.avgSentencesPerParagraph > 6) {
    score -= 5;
    issues.push(`Paragraphs too long (avg ${analysis.avgSentencesPerParagraph.toFixed(1)} sentences)`);
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

function evaluateEngagement(content: string, analysis: ReturnType<typeof analyzeContent>) {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];
  
  // Check for questions (engaging the reader)
  const questions = (content.match(/\?/g) || []).length;
  const questionRatio = questions / analysis.sentenceCount;
  
  if (questionRatio < 0.02) {
    score -= 10;
    issues.push(`Too few questions to engage readers`);
  } else if (questionRatio > 0.1) {
    score -= 5;
    issues.push(`Too many questions may feel overwhelming`);
  } else {
    highlights.push(`Good use of questions to engage readers`);
  }
  
  // Check for examples and stories
  const examples = (content.match(/\b(for example|for instance|such as|like|consider)\b/gi) || []).length;
  if (examples < 2) {
    score -= 15;
    issues.push(`Needs more concrete examples`);
  } else {
    highlights.push(`Good use of examples`);
  }
  
  // Check for active voice (more engaging)
  const passiveIndicators = (content.match(/\b(was|were|been|being)\s+\w+ed\b/gi) || []).length;
  const passiveRatio = passiveIndicators / analysis.sentenceCount;
  
  if (passiveRatio > 0.3) {
    score -= 10;
    issues.push(`Too much passive voice reduces engagement`);
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

function evaluateRepetition(repetitions: ReturnType<typeof detectRepetitions>, analysis: ReturnType<typeof analyzeContent>) {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];
  
  // Check for overused words
  const severeRepetitions = repetitions.filter((r: any) => r.density > 0.02 && r.count > 5);
  const moderateRepetitions = repetitions.filter((r: any) => r.density > 0.01 && r.count > 3);
  
  severeRepetitions.forEach((rep: any) => {
    score -= 5;
    issues.push(`"${rep.word}" used ${rep.count} times`);
  });
  
  if (moderateRepetitions.length > 5) {
    score -= 10;
    issues.push(`Too many repeated words/phrases`);
  }
  
  if (severeRepetitions.length === 0 && moderateRepetitions.length < 3) {
    highlights.push(`Good vocabulary variety`);
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

function evaluateVocabulary(analysis: ReturnType<typeof analyzeContent>, context: BookContext) {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];
  
  // Check vocabulary diversity
  if (analysis.vocabularyDiversity < 0.4) {
    score -= 20;
    issues.push(`Limited vocabulary variety (${(analysis.vocabularyDiversity * 100).toFixed(1)}% unique words)`);
  } else if (analysis.vocabularyDiversity > 0.7) {
    score -= 10;
    issues.push(`Vocabulary may be too complex for target audience`);
  } else {
    highlights.push(`Good vocabulary diversity for target audience`);
  }
  
  // Check grade level alignment
  const targetGrade = parseInt(context.gradeLevel) || 9;
  const gradeDiff = Math.abs(analysis.gradeLevel - targetGrade);
  
  if (gradeDiff > 2) {
    score -= 15;
    issues.push(`Grade level (${analysis.gradeLevel.toFixed(1)}) misaligned with target (${targetGrade})`);
  }
  
  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

function evaluateOriginality(aiPatterns: ReturnType<typeof detectAIPatterns>) {
  const score = aiPatterns.score;
  const issues: string[] = [];
  const highlights: string[] = [];
  
  if (aiPatterns.patterns.length > 0) {
    issues.push(`Detected AI patterns: ${aiPatterns.patterns.slice(0, 3).join(', ')}`);
    if (aiPatterns.patterns.length > 3) {
      issues.push(`...and ${aiPatterns.patterns.length - 3} more`);
    }
  }
  
  if (score > 85) {
    highlights.push(`Content appears original and human-written`);
  } else if (score > 70) {
    highlights.push(`Mostly original with some common patterns`);
  }
  
  return {
    score,
    maxScore: 100,
    percentage: score,
    issues,
    highlights
  };
}

function evaluateAIPatterns(aiPatterns: ReturnType<typeof detectAIPatterns>) {
  const score = 100 - aiPatterns.confidence;
  const issues: string[] = [];
  const highlights: string[] = [];
  
  if (aiPatterns.confidence > 30) {
    issues.push(`${aiPatterns.confidence}% AI pattern confidence detected`);
  }
  
  if (score > 90) {
    highlights.push(`Very low AI pattern detection`);
  } else if (score > 80) {
    highlights.push(`Minimal AI patterns detected`);
  }
  
  return {
    score,
    maxScore: 100,
    percentage: score,
    issues,
    highlights
  };
}

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

function generateSuggestions(breakdown: QualityMetrics['breakdown']): string[] {
  const suggestions: string[] = [];
  
  // Find the three lowest scoring areas
  const scores = Object.entries(breakdown)
    .map(([key, detail]) => ({ key, score: (detail as any).percentage }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
  
  scores.forEach(({ key, score }) => {
    if (score < 80) {
      const detail = breakdown[key as keyof typeof breakdown];
      if (detail.issues.length > 0) {
        suggestions.push(`${key}: ${detail.issues[0]}`);
      }
    }
  });
  
  return suggestions;
}