import { executeOpenRouterRequest } from './openrouter';
import { cleanJsonResponse } from '../utils/jsonUtils';
import config from '../config';

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

interface ScoreDetail {
  score: number;
  maxScore: number;
  percentage: number;
  issues: string[];
  highlights: string[];
}

export async function evaluateAudienceAlignment(
  content: string,
  bookContext: BookContext,
  contentAnalysis: any
): Promise<ScoreDetail> {
  const prompt = `Analyze this content for alignment with the target audience.

Target Audience: ${bookContext.targetAudience?.demographics || 'General'}
Pain Points: ${bookContext.targetAudience?.painPoints?.join(', ') || 'N/A'}
Desires: ${bookContext.targetAudience?.desires?.join(', ') || 'N/A'}
Tone: ${bookContext.tone}
Style: ${bookContext.style}

Content to analyze (first 1000 chars):
${content.substring(0, 1000)}...

Evaluate:
1. Does the content address the audience's pain points?
2. Does it speak to their desires?
3. Is the tone appropriate?
4. Are examples relevant to this audience?

Respond with a JSON object:
{
  "score": 0-100,
  "issues": ["issue1", "issue2"],
  "highlights": ["positive1", "positive2"]
}`;

  try {
    const response = await executeOpenRouterRequest({
      model: config.openRouter.defaultResearchModel,
      messages: [
        { role: 'system', content: 'You are an expert content analyst. Respond only with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenRouter for audience alignment');
    }
    const result = cleanJsonResponse(content);

    if (typeof result.score !== 'number') {
      throw new Error('Invalid score in response from OpenRouter for audience alignment');
    }

    return {
      score: result.score,
      maxScore: 100,
      percentage: result.score,
      issues: result.issues || [],
      highlights: result.highlights || []
    };
  } catch (error: any) {
    console.error('Error evaluating audience alignment:', error);
    throw new Error(`Failed to evaluate audience alignment: ${error.message}`);
  }
}

export async function evaluateAccuracy(
  content: string,
  bookContext: BookContext,
  chapterContext: ChapterContext
): Promise<ScoreDetail> {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];

  // Check if content matches chapter description
  const keyTopics = chapterContext.keyTopics || [];
  const coveredTopics = keyTopics.filter(topic => 
    content.toLowerCase().includes(topic.toLowerCase())
  );

  if (coveredTopics.length < keyTopics.length * 0.7) {
    score -= 20;
    issues.push(`Missing key topics: ${keyTopics.filter(t => !coveredTopics.includes(t)).join(', ')}`);
  } else {
    highlights.push('All key topics covered');
  }

  // Check for citations/references
  const citations = (content.match(/\([^)]+,\s*\d{4}\)/g) || []).length;
  if (citations < 3) {
    score -= 15;
    issues.push('Insufficient citations/references');
  } else {
    highlights.push(`Good citation count: ${citations}`);
  }

  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

export async function evaluateCorrectness(content: string): Promise<ScoreDetail> {
  const prompt = `Check this content for grammatical and spelling errors:

${content.substring(0, 2000)}...

Identify:
1. Grammar errors
2. Spelling mistakes
3. Punctuation issues
4. Sentence structure problems

Respond with JSON:
{
  "errorCount": number,
  "errors": ["error1", "error2"],
  "score": 0-100
}`;

  try {
    const response = await executeOpenRouterRequest({
      model: config.openRouter.defaultResearchModel ,
      messages: [
        { role: 'system', content: 'You are a professional editor. Respond only with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenRouter for correctness');
    }
    const result = cleanJsonResponse(content);

    if (typeof result.errorCount !== 'number') {
      throw new Error('Invalid errorCount in response from OpenRouter for correctness');
    }
    const score = Math.max(0, 100 - result.errorCount * 5);

    return {
      score,
      maxScore: 100,
      percentage: score,
      issues: result.errors?.slice(0, 3) || [],
      highlights: score > 90 ? ['Excellent grammar and spelling'] : ['Good grammar and spelling']
    };
  } catch (error: any) {
    console.error('Error evaluating correctness:', error);
    throw new Error(`Failed to evaluate correctness: ${error.message}`);
  }
}

export function evaluateStyleGuide(content: string, bookContext: BookContext): ScoreDetail {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];

  // Check tone consistency
  const formalWords = (content.match(/\b(furthermore|moreover|nevertheless|consequently|therefore)\b/gi) || []).length;
  const informalWords = (content.match(/\b(cool|awesome|stuff|things|basically|actually)\b/gi) || []).length;

  if (bookContext.tone === 'conversational' && formalWords > 5) {
    score -= 10;
    issues.push('Too formal for conversational tone');
  } else if (bookContext.tone === 'formal' && informalWords > 3) {
    score -= 10;
    issues.push('Too informal for formal tone');
  } else {
    highlights.push('Tone matches style guide');
  }

  // Check for consistent formatting
  const hasConsistentHeadings = content.includes('##') || content.includes('###');
  if (!hasConsistentHeadings) {
    score -= 5;
    issues.push('Missing section headings');
  }

  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

export function evaluateDelivery(content: string, contentAnalysis: any): ScoreDetail {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];

  // Check for clear introduction
  const firstParagraph = content.split('\n\n')[0];
  if (firstParagraph && firstParagraph.length < 50) {
    score -= 10;
    issues.push('Weak introduction');
  } else if (firstParagraph && firstParagraph.length > 100) {
    highlights.push('Strong opening paragraph');
  }

  // Check for conclusion
  const paragraphs = content.split('\n\n');
  const lastParagraph = paragraphs[paragraphs.length - 1];
  
  if (lastParagraph && lastParagraph.length < 50) {
    score -= 10;
    issues.push('Weak conclusion');
  }

  // Check flow and transitions
  const transitionWords = (content.match(/\b(however|therefore|furthermore|additionally|consequently|meanwhile|subsequently)\b/gi) || []).length;
  const expectedTransitions = Math.floor(contentAnalysis.paragraphCount / 3);
  
  if (transitionWords < expectedTransitions) {
    score -= 5;
    issues.push('Needs more transition words for better flow');
  } else if (transitionWords > expectedTransitions * 3) {
    score -= 5;
    issues.push('Overuse of transition words');
  } else {
    highlights.push('Good use of transitions');
  }

  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

export async function evaluatePurposeAlignment(
  content: string,
  bookContext: BookContext,
  chapterContext: ChapterContext
): Promise<ScoreDetail> {
  let score = 100;
  const issues: string[] = [];
  const highlights: string[] = [];

  // Check if content fulfills chapter purpose
  const chapterDescription = chapterContext.description.toLowerCase();
  const contentLower = content.toLowerCase();
  
  // Extract key concepts from chapter description
  const descriptionWords = chapterDescription.split(/\s+/).filter(w => w.length > 4);
  const coveredConcepts = descriptionWords.filter(word => contentLower.includes(word));
  
  const coverageRatio = coveredConcepts.length / descriptionWords.length;
  
  if (coverageRatio < 0.5) {
    score -= 25;
    issues.push('Content doesn\'t fully align with chapter purpose');
  } else if (coverageRatio > 0.8) {
    highlights.push('Excellent alignment with chapter purpose');
  }

  // Check if it addresses the book's unique value proposition
  if (bookContext.marketResearch?.uniqueValue) {
    const uniqueValueMentioned = contentLower.includes(bookContext.marketResearch.uniqueValue.toLowerCase().substring(0, 20));
    if (!uniqueValueMentioned && chapterContext.number < 3) {
      score -= 10;
      issues.push('Should reinforce book\'s unique value');
    }
  }

  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    highlights
  };
}

export async function evaluateFactualAccuracy(
  content: string,
  bookContext: BookContext
): Promise<ScoreDetail> {
  const prompt = `Fact-check this content about ${bookContext.topic}:

${content.substring(0, 1500)}...

Identify:
1. Any factual errors or inaccuracies
2. Outdated information
3. Misleading statements
4. Unsupported claims

Respond with JSON:
{
  "factualErrors": ["error1", "error2"],
  "unsupportedClaims": ["claim1", "claim2"],
  "score": 0-100
}`;

  try {
    const response = await executeOpenRouterRequest({
      model: config.openRouter.defaultResearchModel ,
      messages: [
        { role: 'system', content: 'You are a fact-checker with expertise in various domains. Respond only with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenRouter for factual accuracy');
    }
    const result = cleanJsonResponse(content);

    if (typeof result.score !== 'number') {
      throw new Error('Invalid score in response from OpenRouter for factual accuracy');
    }

    const issues = [
      ...((result.factualErrors || []).map((e: string) => `Factual error: ${e}`)),
      ...((result.unsupportedClaims || []).map((c: string) => `Unsupported: ${c}`))
    ];

    return {
      score: result.score,
      maxScore: 100,
      percentage: result.score,
      issues: issues.slice(0, 3),
      highlights: result.score > 95 ? ['All facts appear accurate'] : ['Facts appear mostly accurate']
    };
  } catch (error: any) {
    console.error('Error evaluating factual accuracy:', error);
    throw new Error(`Failed to evaluate factual accuracy: ${error.message}`);
  }
}
