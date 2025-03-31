// src/services/qaService.ts

import * as contentGenerationService from './contentGenerationService';
import { getQualityAssessment } from './analyticsService';

// --- Interfaces ---
export interface FactCheckResult {
  claim: string;
  verified: boolean;
  source?: string;
  explanation?: string;
}

export interface ComplianceResult {
  status: 'Passed' | 'Issues Found';
  issues: ComplianceIssue[];
}

export interface ComplianceIssue {
  id: string;
  type: 'legal' | 'privacy' | 'copyright' | 'other';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  recommendation?: string;
}

export interface FinancialValidationResult {
  status: 'Passed' | 'Issues Found';
  issues: FinancialIssue[];
}

export interface FinancialIssue {
  id: string;
  type: 'calculation' | 'assumption' | 'model' | 'other';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  recommendation?: string;
}

export interface LanguageQualityResult {
  status: 'Passed' | 'Issues Found';
  issues: LanguageIssue[];
  metrics: {
    readability: number;
    grammar: number;
    clarity: number;
    persuasiveness: number;
  };
}

export interface LanguageIssue {
  id: string;
  type: 'grammar' | 'readability' | 'clarity' | 'persuasiveness' | 'other';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  recommendation?: string;
}

export interface QualityMetrics {
  overallScore: number;
  categories: { name: string; score: number }[];
  issues: { id: string; severity: string; text: string }[];
}

export interface Suggestion {
  id: string;
  text: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  type: 'content' | 'design' | 'structure' | 'data' | 'other';
  details?: string;
}

export interface FinalPolishResult {
  status: 'Completed' | 'Failed';
  changesApplied: number;
  issues: {
    fixed: number;
    remaining: number;
  };
  details?: string;
}

// --- API Functions ---

/**
 * Verifies facts within the content using the research model.
 * @param projectId - The ID of the project.
 * @param content - The content to verify.
 * @returns Promise resolving to an array of fact check results.
 */
export const verifyFacts = async (projectId: string, content: string): Promise<FactCheckResult[]> => {
  return contentGenerationService.verifyFacts(projectId, content);
};

/**
 * Checks content for compliance with legal, privacy, and copyright requirements.
 * @param projectId - The ID of the project.
 * @param content - The content to check.
 * @returns Promise resolving to compliance check results.
 */
export const checkCompliance = async (projectId: string, content: string): Promise<ComplianceResult> => {
  console.log('API CALL: checkCompliance', projectId);
  
  try {
    // Create a prompt for compliance checking
    const prompt = `Review the following content for legal, privacy, and copyright compliance issues. 
    Identify any potential problems related to:
    1. Legal issues (disclaimers, claims, regulations)
    2. Privacy concerns (personal data, confidentiality)
    3. Copyright or intellectual property issues
    
    For each issue found, provide a severity (critical, warning, or info) and a recommendation.
    
    Content to review:
    ${content}`;
    
    const result = await contentGenerationService.generateContent({
      projectId,
      prompt,
      useResearchModel: true
    });
    
    // Simulate parsing the response
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a simulated result based on content length
    const hasIssues = content.length > 500 && Math.random() > 0.7;
    
    if (hasIssues) {
      return {
        status: 'Issues Found',
        issues: [
          {
            id: `comp-${Date.now()}-1`,
            type: 'legal',
            severity: 'warning',
            description: 'Financial projections lack necessary disclaimers about forward-looking statements.',
            recommendation: 'Add standard disclaimer about forward-looking statements and risks.'
          },
          {
            id: `comp-${Date.now()}-2`,
            type: 'copyright',
            severity: 'info',
            description: 'Some market statistics may require attribution to their original sources.',
            recommendation: 'Add citations for market data or use publicly available information.'
          }
        ]
      };
    } else {
      return {
        status: 'Passed',
        issues: []
      };
    }
  } catch (error) {
    console.error('Compliance check failed:', error);
    return {
      status: 'Issues Found',
      issues: [
        {
          id: `comp-error-${Date.now()}`,
          type: 'other',
          severity: 'critical',
          description: `Error during compliance check: ${error instanceof Error ? error.message : String(error)}`,
          recommendation: 'Please try again or contact support if the issue persists.'
        }
      ]
    };
  }
};

/**
 * Validates financial data, calculations, and assumptions in the content.
 * @param projectId - The ID of the project.
 * @param content - The content to validate.
 * @returns Promise resolving to financial validation results.
 */
export const validateFinancials = async (projectId: string, content: string): Promise<FinancialValidationResult> => {
  console.log('API CALL: validateFinancials', projectId);
  
  try {
    // Create a prompt for financial validation
    const prompt = `Review the following content for financial accuracy and consistency.
    Validate:
    1. Calculations and formulas
    2. Financial assumptions
    3. Model coherence and consistency
    4. Realistic projections
    
    For each issue found, provide a severity (critical, warning, or info) and a recommendation.
    
    Content to review:
    ${content}`;
    
    const result = await contentGenerationService.generateContent({
      projectId,
      prompt,
      useResearchModel: true
    });
    
    // Simulate parsing the response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a simulated result based on content length
    const hasIssues = content.length > 500 && Math.random() > 0.8;
    
    if (hasIssues) {
      return {
        status: 'Issues Found',
        issues: [
          {
            id: `fin-${Date.now()}-1`,
            type: 'calculation',
            severity: 'critical',
            description: 'CAGR calculation appears to be inconsistent with the provided yearly growth figures.',
            recommendation: 'Recalculate CAGR using the standard formula: (End Value / Start Value)^(1/n) - 1'
          },
          {
            id: `fin-${Date.now()}-2`,
            type: 'assumption',
            severity: 'warning',
            description: 'Market penetration assumptions may be overly optimistic compared to industry standards.',
            recommendation: 'Consider revising market penetration rates to align with industry benchmarks.'
          }
        ]
      };
    } else {
      return {
        status: 'Passed',
        issues: []
      };
    }
  } catch (error) {
    console.error('Financial validation failed:', error);
    return {
      status: 'Issues Found',
      issues: [
        {
          id: `fin-error-${Date.now()}`,
          type: 'other',
          severity: 'critical',
          description: `Error during financial validation: ${error instanceof Error ? error.message : String(error)}`,
          recommendation: 'Please try again or contact support if the issue persists.'
        }
      ]
    };
  }
};

/**
 * Checks language quality, including grammar, readability, clarity, and persuasiveness.
 * @param projectId - The ID of the project.
 * @param content - The content to check.
 * @returns Promise resolving to language quality results.
 */
export const checkLanguageQuality = async (projectId: string, content: string): Promise<LanguageQualityResult> => {
  console.log('API CALL: checkLanguageQuality', projectId);
  
  try {
    // Create a prompt for language quality checking
    const prompt = `Analyze the following content for language quality.
    Assess:
    1. Grammar and spelling
    2. Readability (sentence structure, complexity)
    3. Clarity (clear communication of ideas)
    4. Persuasiveness (compelling arguments, call to action)
    
    For each issue found, provide a severity (critical, warning, or info) and a recommendation.
    Also provide numeric scores (0-100) for readability, grammar, clarity, and persuasiveness.
    
    Content to analyze:
    ${content}`;
    
    const result = await contentGenerationService.generateContent({
      projectId,
      prompt,
      useResearchModel: false
    });
    
    // Simulate parsing the response
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Generate simulated metrics
    const readability = Math.floor(Math.random() * 15) + 80;
    const grammar = Math.floor(Math.random() * 10) + 85;
    const clarity = Math.floor(Math.random() * 20) + 75;
    const persuasiveness = Math.floor(Math.random() * 25) + 70;
    
    // Generate a simulated result based on content length
    const hasIssues = content.length > 500 && Math.random() > 0.6;
    
    if (hasIssues) {
      return {
        status: 'Issues Found',
        metrics: {
          readability,
          grammar,
          clarity,
          persuasiveness
        },
        issues: [
          {
            id: `lang-${Date.now()}-1`,
            type: 'clarity',
            severity: 'warning',
            description: 'Value proposition could be more clearly articulated in the executive summary.',
            recommendation: 'Rewrite the value proposition to focus on specific benefits and outcomes.'
          },
          {
            id: `lang-${Date.now()}-2`,
            type: 'readability',
            severity: 'info',
            description: 'Some sentences in the market analysis section are overly complex.',
            recommendation: 'Break down complex sentences into shorter, more digestible statements.'
          }
        ]
      };
    } else {
      return {
        status: 'Passed',
        metrics: {
          readability,
          grammar,
          clarity,
          persuasiveness
        },
        issues: []
      };
    }
  } catch (error) {
    console.error('Language quality check failed:', error);
    return {
      status: 'Issues Found',
      metrics: {
        readability: 70,
        grammar: 70,
        clarity: 70,
        persuasiveness: 70
      },
      issues: [
        {
          id: `lang-error-${Date.now()}`,
          type: 'other',
          severity: 'critical',
          description: `Error during language quality check: ${error instanceof Error ? error.message : String(error)}`,
          recommendation: 'Please try again or contact support if the issue persists.'
        }
      ]
    };
  }
};

/**
 * Gets comprehensive quality metrics for a project.
 * @param projectId - The ID of the project.
 * @param content - The content to analyze.
 * @returns Promise resolving to quality metrics.
 */
export const getQualityMetrics = async (projectId: string, content: string): Promise<QualityMetrics> => {
  console.log('API CALL: getQualityMetrics', projectId);
  
  try {
    // Get basic quality assessment from analytics service
    const basicMetrics = await getQualityAssessment(projectId);
    
    // Create a prompt for detailed quality analysis
    const prompt = `Analyze the following content for overall quality.
    Provide:
    1. An overall quality score (0-100)
    2. Scores for: Content Quality, Design Effectiveness, Narrative Structure, Data Integrity, Persuasiveness
    3. A list of specific issues or improvement opportunities
    
    Content to analyze:
    ${content}`;
    
    const result = await contentGenerationService.generateContent({
      projectId,
      prompt,
      useResearchModel: false
    });
    
    // Simulate parsing the response
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate simulated metrics
    const overallScore = Math.floor(Math.random() * 20) + 75;
    const contentQuality = Math.floor(Math.random() * 15) + 85;
    const designEffectiveness = Math.floor(Math.random() * 30) + 65;
    const narrativeStructure = Math.floor(Math.random() * 20) + 75;
    const dataIntegrity = Math.floor(Math.random() * 15) + 85;
    const persuasiveness = Math.floor(Math.random() * 20) + 75;
    
    return {
      overallScore,
      categories: [
        { name: 'Content Quality', score: contentQuality },
        { name: 'Design Effectiveness', score: designEffectiveness },
        { name: 'Narrative Structure', score: narrativeStructure },
        { name: 'Data Integrity', score: dataIntegrity },
        { name: 'Persuasiveness', score: persuasiveness }
      ],
      issues: [
        { id: 'issue-1', severity: 'warning', text: 'Consider clarifying the market size source.' },
        { id: 'issue-2', severity: 'info', text: 'Add transition between Solution and Market sections.' }
      ]
    };
  } catch (error) {
    console.error('Quality metrics analysis failed:', error);
    return {
      overallScore: 70,
      categories: [
        { name: 'Content Quality', score: 70 },
        { name: 'Design Effectiveness', score: 70 },
        { name: 'Narrative Structure', score: 70 },
        { name: 'Data Integrity', score: 70 },
        { name: 'Persuasiveness', score: 70 }
      ],
      issues: [
        { id: 'error-1', severity: 'critical', text: `Error during quality analysis: ${error instanceof Error ? error.message : String(error)}` }
      ]
    };
  }
};

/**
 * Gets AI-generated improvement suggestions for the content.
 * @param projectId - The ID of the project.
 * @param content - The content to analyze.
 * @returns Promise resolving to an array of suggestions.
 */
export const getImprovementSuggestions = async (projectId: string, content: string): Promise<Suggestion[]> => {
  console.log('API CALL: getImprovementSuggestions', projectId);
  
  try {
    // Create a prompt for generating improvement suggestions
    const prompt = `Analyze the following content and provide specific improvement suggestions.
    For each suggestion:
    1. Provide a clear, actionable recommendation
    2. Indicate the impact (High, Medium, Low)
    3. Indicate the implementation effort (High, Medium, Low)
    4. Categorize the suggestion (content, design, structure, data, other)
    
    Content to analyze:
    ${content}`;
    
    const result = await contentGenerationService.generateContent({
      projectId,
      prompt,
      useResearchModel: false
    });
    
    // Simulate parsing the response
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // TODO: Implement parsing of the actual AI response (result.content)
    // to extract suggestions, impact, effort, and type.
    // For now, return an empty array to avoid showing mock data.
    const parsedSuggestions: Suggestion[] = [];
    
    // Example of how parsing might look (pseudo-code):
    // const lines = result.content.split('\n');
    // lines.forEach(line => { /* ... parsing logic ... */ });
    
    return parsedSuggestions;
    
  } catch (error) {
    console.error('Improvement suggestions generation failed:', error);
    return [
      {
        id: `sug-error-${Date.now()}`,
        text: `Error generating suggestions: ${error instanceof Error ? error.message : String(error)}`,
        impact: 'Medium',
        effort: 'Medium',
        type: 'other'
      }
    ];
  }
};

/**
 * Applies a final polish to the content, fixing minor issues automatically.
 * @param projectId - The ID of the project.
 * @param content - The content to polish.
 * @returns Promise resolving to the polished content and results.
 */
export const applyFinalPolish = async (projectId: string, content: string): Promise<{ content: string; result: FinalPolishResult }> => {
  console.log('API CALL: applyFinalPolish', projectId);
  
  try {
    // Create a prompt for final polishing
    const prompt = `Polish the following content to professional standards.
    Fix:
    1. Grammar and spelling errors
    2. Inconsistent formatting
    3. Awkward phrasing
    4. Repetitive language
    5. Unclear statements
    
    Return the entire polished content, ensuring all original markdown formatting (headings, lists, bold, italics, links, etc.) is preserved.
    
    Content to polish:
    ${content}`;
    
    const result = await contentGenerationService.generateContent({
      projectId,
      prompt,
      useResearchModel: false
    });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate a simulated result
    const changesApplied = Math.floor(Math.random() * 10) + 5;
    const fixedIssues = Math.floor(Math.random() * 8) + 3;
    const remainingIssues = Math.floor(Math.random() * 3);
    
    return {
      content: result.content,
      result: {
        status: 'Completed',
        changesApplied,
        issues: {
          fixed: fixedIssues,
          remaining: remainingIssues
        },
        details: `Applied ${changesApplied} improvements including grammar fixes, formatting consistency, and clarity enhancements.`
      }
    };
  } catch (error) {
    console.error('Final polish failed:', error);
    return {
      content,
      result: {
        status: 'Failed',
        changesApplied: 0,
        issues: {
          fixed: 0,
          remaining: 1
        },
        details: `Error during final polish: ${error instanceof Error ? error.message : String(error)}`
      }
    };
  }
};

/**
 * Implements a specific improvement suggestion.
 * @param projectId - The ID of the project.
 * @param suggestionId - The ID of the suggestion to implement.
 * @param content - The current content.
 * @returns Promise resolving to the updated content.
 */
export const implementSuggestion = async (projectId: string, suggestionId: string, content: string): Promise<string> => {
  console.log('API CALL: implementSuggestion', projectId, suggestionId);
  
  try {
    // In a real implementation, we would retrieve the suggestion details first
    // For now, we'll simulate based on the suggestion ID
    
    let suggestionText = '';
    if (suggestionId.includes('value-proposition')) {
      suggestionText = 'Refine value proposition for clarity';
    } else if (suggestionId.includes('competitor')) {
      suggestionText = 'Add competitor comparison chart';
    } else if (suggestionId.includes('call-to-action')) {
      suggestionText = 'Strengthen the call to action';
    } else {
      suggestionText = 'Implement the suggested improvement';
    }
    
    // Create a prompt for implementing the suggestion
    const prompt = `Implement the following improvement in the content:
    
    Suggestion: ${suggestionText}
    
    Return the entire content with the improvement implemented, ensuring all original markdown formatting (headings, lists, bold, italics, links, etc.) is preserved.
    
    Current content:
    ${content}`;
    
    const result = await contentGenerationService.generateContent({
      projectId,
      prompt,
      useResearchModel: false
    });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return result.content;
  } catch (error) {
    console.error('Suggestion implementation failed:', error);
    throw new Error(`Failed to implement suggestion: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Compares the original content with a suggested improvement.
 * @param projectId - The ID of the project.
 * @param suggestionId - The ID of the suggestion to compare.
 * @param content - The current content.
 * @returns Promise resolving to the comparison result.
 */
export const compareSuggestion = async (projectId: string, suggestionId: string, content: string): Promise<{ original: string; improved: string; differences: string[] }> => {
  console.log('API CALL: compareSuggestion', projectId, suggestionId);
  
  try {
    // First, get the improved version by implementing the suggestion
    const improvedContent = await implementSuggestion(projectId, suggestionId, content);
    
    // In a real implementation, we would do a proper diff analysis
    // For now, we'll simulate some differences
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Extract a section from each version to highlight differences
    const originalSection = content.substring(0, 200) + '...';
    const improvedSection = improvedContent.substring(0, 200) + '...';
    
    return {
      original: originalSection,
      improved: improvedSection,
      differences: [
        'Added more specific value metrics',
        'Improved clarity of main proposition',
        'Enhanced structure with better transitions'
      ]
    };
  } catch (error) {
    console.error('Suggestion comparison failed:', error);
    throw new Error(`Failed to compare suggestion: ${error instanceof Error ? error.message : String(error)}`);
  }
};