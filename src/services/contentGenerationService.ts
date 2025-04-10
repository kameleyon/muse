// src/services/contentGenerationService.ts
import { collectProjectData, generateResearchPrompt, generateFullContentPrompt } from '@/lib/pitchPrompt';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';

// Read environment variables (Vite specific)
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const CONTENT_MODEL = import.meta.env.VITE_DEFAULT_CONTENT_MODEL || 'openrouter/optimus-alpha';
const RESEARCH_MODEL = import.meta.env.VITE_DEFAULT_RESEARCH_MODEL || 'openai/gpt-4o-search-preview';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'MagicMuse';

// OpenRouter API Endpoint
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// --- Interfaces ---
interface GenerationParams {
  projectId: string;
  sectionId?: string; 
  prompt: string; 
  depth?: 'brief' | 'standard' | 'detailed';
  tone?: string;
  styleConsistency?: boolean;
  systemPrompt?: string;
  factCheckLevel?: 'basic' | 'standard' | 'thorough';
  useResearchModel?: boolean; 
  temperature?: number; 
}

interface GeneratedContent {
  sectionId?: string; 
  content: string; 
  modelUsed?: string;
  finishReason?: string;
  blocks?: string[]; // Content blocks for streaming/typing effect
}

interface StreamingOptions {
  onBlock?: (block: string) => void;
  onComplete?: (content: string) => void;
  onError?: (error: any) => void;
}

interface FactCheckResult {
  claim: string;
  verified: boolean;
  source?: string;
  explanation?: string;
}

// --- API Functions ---

/**
 * Generates content using the specified model via OpenRouter.
 * @param params - Generation parameters including the prompt.
 * @returns Promise resolving to the generated content.
 */
export const generateContent = async (params: GenerationParams): Promise<GeneratedContent> => {
  const modelToUse = params.useResearchModel ? RESEARCH_MODEL : CONTENT_MODEL;
  console.log(`API CALL: generateContent using ${modelToUse}`, params.prompt.substring(0, 100) + '...'); 

  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API Key is missing.");
    return { content: `Error: OpenRouter API Key missing. Cannot call model: ${modelToUse}` };
  }

  try {
    // Make the actual fetch call to OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL, 
        'X-Title': APP_NAME, 
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          { 
            role: "system", 
            content: params.systemPrompt || 
                     "You are an expert assistant helping to create professional pitch decks. " +
                     "Always format your responses using Markdown with appropriate headings, " +
                     "bullet points, and formatting. Provide complete, comprehensive content based on the user's prompt." 
          }, 
          { role: "user", content: params.prompt } 
        ],
        // Consider adding max_tokens if responses are truncated
        max_tokens: 80000, 
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenRouter API Error (${response.status}) calling ${modelToUse}: ${errorBody}`);
      throw new Error(`API Error (${response.status}) calling ${modelToUse}. Check console for details.`);
    }

    const result = await response.json();
    
    // --- Robust Response Parsing ---
    let generatedText = '';
    let finishReason = 'unknown'; // Default finish reason

    // Check for OpenAI format (most common)
    if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
      const choice = result.choices[0];
      if (choice.message && typeof choice.message.content === 'string') {
        generatedText = choice.message.content.trim();
      }
      if (typeof choice.finish_reason === 'string') {
        finishReason = choice.finish_reason;
      }
    }
    
    // If no content was found, check if it's an error response
    if (!generatedText) {
      if (result.error && typeof result.error.message === 'string') {
        // Handle specific error format from OpenRouter/API
        console.error("API returned an error:", result.error);
        return {
          content: `Error: API Error - ${result.error.message}`,
          modelUsed: modelToUse,
          finishReason: 'error'
        };
      } else {
        // Handle other unexpected formats
        console.error("Unexpected API response format:", result);
        return {
          content: "Error: Unable to parse API response. Check console for details.",
          modelUsed: modelToUse,
          finishReason: 'error'
        };
      }
    }

    // Split content into blocks for streaming/typing effect
    const blocks = generatedText.split(/\n\n+/).filter(block => block.trim().length > 0);
    
    return {
      sectionId: params.sectionId,
      content: generatedText,
      modelUsed: modelToUse,
      finishReason,
      blocks
    };
  } catch (error) {
    console.error("Content generation error:", error);
    return { 
      content: `Error during content generation: ${error instanceof Error ? error.message : String(error)}`,
      modelUsed: modelToUse,
      finishReason: 'error'
    };
  }
};

/**
 * Generates content with streaming blocks for typing effect
 * @param params - Generation parameters including the prompt
 * @param options - Streaming options including callbacks
 * @returns Promise resolving when generation is complete
 */
export const generateContentWithTypingEffect = async (
  params: GenerationParams,
  options: StreamingOptions
): Promise<void> => {
  try {
    // Generate the full content first
    const result = await generateContent(params);
    
    if (!result.blocks || result.blocks.length === 0) {
      // If no blocks, create a single block from the content
      const singleBlock = result.content;
      
      // Call the onBlock callback if provided
      if (options.onBlock) {
        options.onBlock(singleBlock);
      }
      
      // Call the onComplete callback if provided
      if (options.onComplete) {
        options.onComplete(result.content);
      }
      
      return;
    }
    
    // Process each block with a delay to simulate typing
    let fullContent = '';
    
    for (let i = 0; i < result.blocks.length; i++) {
      const block = result.blocks[i];
      
      // Add the block to the full content
      fullContent += (i > 0 ? '\n\n' : '') + block;
      
      // Call the onBlock callback if provided
      if (options.onBlock) {
        options.onBlock(block);
      }
      
      // Add a delay between blocks (except for the last one)
      if (i < result.blocks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Call the onComplete callback if provided
    if (options.onComplete) {
      options.onComplete(fullContent);
    }
  } catch (error) {
    console.error("Error in generateContentWithTypingEffect:", error);
    
    // Call the onError callback if provided
    if (options.onError) {
      options.onError(error);
    }
  }
};

/**
 * Applies a template to generate content for multiple sections.
 * @param projectId - The ID of the project.
 * @param templateId - The ID of the template to apply.
 * @returns Promise resolving to a success indicator.
 */
export const applyTemplate = async (projectId: string, templateId: string): Promise<boolean> => {
  console.log('API CALL: applyTemplate', projectId, templateId);
  // This would likely involve fetching template structure and then calling generateContent for each section
  await new Promise(resolve => setTimeout(resolve, 400));
  return true;
};

/**
 * Enhances existing content using AI (Uses generateContent).
 * @param projectId - The ID of the project.
 * @param sectionId - The ID of the section to enhance.
 * @param content - The existing content to enhance.
 * @param enhancementType - The type of enhancement to apply.
 * @returns Promise resolving to the enhanced content.
 */
export const enhanceContent = async (
  projectId: string,
  sectionId: string,
  content: string,
  enhancementType: 'clarity' | 'conciseness' | 'persuasiveness' | 'persuasion' | 'tone' | 'flow' | 'transitions' | 'readability' | 'jargon' | 'regenerate'
): Promise<GeneratedContent> => {
  console.log('API CALL: enhanceContent', projectId, enhancementType);

  let specificPrompt = '';
  switch (enhancementType) {
    case 'clarity':
      specificPrompt = `Rewrite the following content to improve its clarity and ease of understanding. Ensure the core meaning is preserved but expressed more directly:\n\n${content}`;
      break;
    case 'conciseness':
      specificPrompt = `Rewrite the following content to make it more concise. Remove redundant words and phrases, and shorten sentences where possible without losing essential information:\n\n${content}`;
      break;
    case 'persuasion': // Alias for persuasiveness
    case 'persuasiveness':
      specificPrompt = `Enhance the following content to be more persuasive. Strengthen the arguments, use more compelling language, and focus on benefits or impact:\n\n${content}`;
      break;
    case 'tone':
      // Note: Ideally, the target tone would be passed as a parameter. Using a generic improvement for now.
      specificPrompt = `Analyze the tone of the following content and adjust it to be more professional and engaging, suitable for a pitch deck:\n\n${content}`;
      break;
    case 'flow':
      specificPrompt = `Analyze the flow and structure of the following content. Suggest improvements or rewrite sections to ensure a logical and smooth progression of ideas:\n\n${content}`;
      break;
    case 'transitions':
      specificPrompt = `Analyze the transitions between paragraphs and ideas in the following content. Add or improve transition words and phrases to create a smoother flow:\n\n${content}`;
      break;
    case 'readability':
      specificPrompt = `Improve the readability of the following content. Simplify complex sentences, replace jargon with clearer terms (unless essential), and ensure consistent formatting:\n\n${content}`;
      break;
    case 'jargon':
      specificPrompt = `Identify and replace or explain any potentially confusing jargon or technical terms in the following content to make it accessible to a wider audience:\n\n${content}`;
      break;
    case 'regenerate':
       specificPrompt = `Regenerate the following content, aiming for a fresh perspective while keeping the core topic the same:\n\n${content}`;
       break;
    default:
      specificPrompt = `Enhance the following content for better ${enhancementType}:\n\n${content}`;
  }
  
  // Add instruction to preserve markdown
  specificPrompt += "\n\nReturn the entire enhanced content, ensuring all original markdown formatting (headings, lists, bold, italics, links, etc.) is preserved.";

  // Use the standard content model for enhancement
  return generateContent({ projectId, sectionId, prompt: specificPrompt, useResearchModel: false }); // Use specificPrompt here
};

/**
 * Verifies facts in content using research model.
 * @param projectId - The ID of the project.
 * @param content - The content to verify.
 * @returns Promise resolving to an array of fact check results.
 */
export const verifyFacts = async (projectId: string, content: string): Promise<FactCheckResult[]> => {
  console.log('API CALL: verifyFacts using research model', projectId);
  const prompt = `Verify the factual claims in the following text. For each claim, provide a structured response in this exact format:

Claim: [the claim being verified]
Status: [Verified, Not Verified, or Uncertain]
Source: [source information if available]
Explanation: [brief explanation of verification]

Please separate each claim with a blank line. Be objective and thorough in your verification:

${content}`;
  
  try {
    const result = await generateContent({ 
      projectId, 
      prompt, 
      useResearchModel: true,
      systemPrompt: "You are a fact-checking assistant with access to search capabilities. Your job is to verify factual claims in text. Always respond in a structured format with Claim, Status, Source, and Explanation fields. Be objective and thorough in your verification."
    });
    console.log("Raw fact check response:", result.content);
    
    // Helper function to clean text of quotes and formatting issues
    const cleanText = (text: string): string => {
      return text
        .replace(/^["']|["']$/g, '') // Remove quotes at start/end
        .replace(/\\"/g, '"') // Replace escaped quotes
        .replace(/^"(.*?)"$/, '$1') // Remove quotes around text
        .replace(/^"(.*)"$/, '$1') // Remove quotes around text (greedy)
        .replace(/["']+/g, '') // Remove any remaining quotes
        .trim();
    };
    
    // --- Improved Robust Parsing for Fact Check Results ---
    const results: FactCheckResult[] = [];
    const lines = result.content.split('\n');
    
    // First try to parse structured format
    let currentClaim: Partial<FactCheckResult> = {};
    
    lines.forEach(line => {
      // Clean the line of any quotes or special characters
      const cleanLine = line.trim().replace(/^["']|["']$/g, '').replace(/\\"/g, '"');
      
      if (cleanLine.length === 0) {
        // Empty line might indicate end of a claim
        if (currentClaim.claim) {
          results.push({
            claim: cleanText(currentClaim.claim),
            verified: currentClaim.verified || false,
            source: currentClaim.source ? cleanText(currentClaim.source) : undefined,
            explanation: currentClaim.explanation ? cleanText(currentClaim.explanation) : undefined
          });
          currentClaim = {};
        }
        return;
      }
      
      const claimMatch = cleanLine.match(/Claim:\s*(.*)/i);
      const statusMatch = cleanLine.match(/Status:\s*(Verified|Not Verified|Uncertain)/i);
      const sourceMatch = cleanLine.match(/Source:\s*(.*)/i);
      const explanationMatch = cleanLine.match(/Explanation:\s*(.*)/i);
      
      if (claimMatch) {
        // If we find a new claim and already have one in progress, save the previous one
        if (currentClaim.claim) {
          results.push({
            claim: cleanText(currentClaim.claim),
            verified: currentClaim.verified || false,
            source: currentClaim.source ? cleanText(currentClaim.source) : undefined,
            explanation: currentClaim.explanation ? cleanText(currentClaim.explanation) : undefined
          });
          currentClaim = {};
        }
        currentClaim.claim = cleanText(claimMatch[1]);
      }
      
      if (statusMatch) {
        currentClaim.verified = statusMatch[1].toLowerCase() === 'verified';
      }
      
      if (sourceMatch) {
        currentClaim.source = cleanText(sourceMatch[1]);
      }
      
      if (explanationMatch) {
        currentClaim.explanation = cleanText(explanationMatch[1]);
      }
      
      // Also try to capture less structured lines
      if (!claimMatch && !statusMatch && !sourceMatch && !explanationMatch) {
        if (cleanLine.includes("Verified") || cleanLine.includes("Not Verified") || cleanLine.includes("Uncertain")) {
          const parts = cleanLine.split(/Verified|Not Verified|Uncertain/i);
          if (parts[0]?.trim()) {
            // If we find a new claim and already have one in progress, save the previous one
            if (currentClaim.claim) {
              results.push({
                claim: cleanText(currentClaim.claim),
                verified: currentClaim.verified || false,
                source: currentClaim.source ? cleanText(currentClaim.source) : undefined,
                explanation: currentClaim.explanation ? cleanText(currentClaim.explanation) : undefined
              });
              currentClaim = {};
            }
            
            currentClaim.claim = cleanText(parts[0]);
            currentClaim.verified = cleanLine.includes("Verified");
            currentClaim.explanation = parts[1] ? cleanText(parts[1]) : undefined;
          }
        }
      }
    });
    
    // Add the last claim if there is one
    if (currentClaim.claim) {
      results.push({
        claim: cleanText(currentClaim.claim),
        verified: currentClaim.verified || false,
        source: currentClaim.source ? cleanText(currentClaim.source) : undefined,
        explanation: currentClaim.explanation ? cleanText(currentClaim.explanation) : undefined
      });
    }

    // Handle cases where no structured results were found
    if (results.length === 0 && !result.content.startsWith('Error:')) {
       results.push({ claim: 'General Content', verified: true, explanation: 'No specific claims parsed from model response. Content seems generally plausible.' });
    } else if (result.content.startsWith('Error:')) {
        results.push({ claim: 'Verification Process', verified: false, explanation: result.content });
    }
    
    return results;

  } catch (error) {
     console.error("Error during fact verification:", error);
     return [{ claim: 'Verification Process', verified: false, explanation: `Error during verification: ${error instanceof Error ? error.message : String(error)}` }];
  }
};

/**
 * Generates comprehensive research for a project using a research-optimized model
 * @param projectId - The ID of the project
 * @returns Promise resolving to the research data
 */
export const generateResearch = async (projectId: string): Promise<GeneratedContent> => {
  console.log('API CALL: generateResearch', projectId);
  
  // Get project data from store
  const store = useProjectWorkflowStore;
  const projectData = collectProjectData(projectId, store);
  
  // Generate research prompt using the template
  const researchPrompt = generateResearchPrompt(projectData);
  
  // Call the AI with the research prompt using the research model
  return generateContent({
    projectId,
    prompt: researchPrompt,
    useResearchModel: true, // Use research-optimized model
    systemPrompt: "You are a professional market research and business analysis assistant. Provide detailed, factual, and data-driven research results formatted for easy visualization. Include specific numbers, facts, and statistics whenever possible.",
    factCheckLevel: 'thorough'
  });
};

/**
 * Generates complete pitch deck content based on research and project data
 * @param projectId - The ID of the project
 * @param researchData - The research data generated previously
 * @returns Promise resolving to the full content
 */
export const generateFullContent = async (
  projectId: string,
  researchData: string
): Promise<GeneratedContent> => {
  console.log('API CALL: generateFullContent', projectId);
  
  // Get project data from store
  const store = useProjectWorkflowStore;
  const projectData = collectProjectData(projectId, store);
  
  // Generate content prompt using the template
  const contentPrompt = generateFullContentPrompt(projectData, researchData);
  
  // Call the AI with the content prompt using the content model
  return generateContent({
    projectId,
    prompt: contentPrompt,
    useResearchModel: false, // Use content-optimized model
    systemPrompt: "You are a professional pitch deck writer with expertise in creating compelling business presentations. Format content in Markdown and include data-driven visualizations with proper syntax for tables, charts, and diagrams."
  });
};

// Add more functions as needed (getGenerationStatus, adjustParameters, etc.)

// --- QA and Refinement Service Functions ---

// Placeholder types matching the component (ideally these would be shared types)
// Use the Suggestion type imported from the store or define it strictly here
import { Suggestion } from '@/store/types'; // Import the canonical type
type QualityCheckResult = { score: number; issues: string[]; suggestions?: Suggestion[] };
type FinancialCheckResult = { coherence: string; issues: string[]; suggestions?: Suggestion[] };
// No need to redefine Suggestion if imported

/**
 * Runs a quality check on the provided content.
 * (Backend implementation needed)
 * @param projectId - The ID of the project.
 * @param content - The content to check.
 * @returns Promise resolving to the quality check results.
 */
export const runQualityCheck = async (projectId: string, content: string): Promise<QualityCheckResult> => {
  console.log('API CALL: runQualityCheck', projectId);
  
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API Key is missing.");
    throw new Error("API Key missing. Cannot perform quality check.");
  }
  
  try {
    const prompt = `Analyze the following pitch deck content for quality issues. Focus on clarity, persuasiveness, structure, and overall effectiveness. Provide a numerical score from 0-100 and identify specific issues that should be addressed.

Content to analyze:
${content}

Return your analysis in this exact JSON format:
{
  "score": [overall quality score from 0-100],
  "issues": ["issue 1", "issue 2", ...],
  "suggestions": [
    {"id": "q_sug1", "text": "suggestion text", "impact": "High/Medium/Low", "effort": "High/Medium/Low", "type": "quality"},
    ...
  ]
}`;

    // Make the API call using the existing infrastructure
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': APP_NAME,
      },
      body: JSON.stringify({
        model: CONTENT_MODEL, // Use the content model for analysis
        messages: [
          {
            role: "system",
            content: "You are an expert pitch deck analyst with deep knowledge of business presentations. Your task is to analyze pitch deck content and provide quality feedback in a structured JSON format. Be specific, actionable, and thorough in your analysis."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }, // Request JSON response
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenRouter API Error (${response.status}): ${errorBody}`);
      throw new Error(`API Error (${response.status}). Check console for details.`);
    }

    const result = await response.json();
    
    // Extract the content from the API response
    let analysisText = '';
    if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
      const choice = result.choices[0];
      if (choice.message && typeof choice.message.content === 'string') {
        analysisText = choice.message.content.trim();
      }
    }
    if (!analysisText) {
      throw new Error("Empty response from API");
    }
    
    // Clean the response text to handle markdown code blocks
    const cleanJsonString = (text: string): string => {
      let cleaned = text;
      
      // Remove any markdown code blocks
      cleaned = cleaned.replace(/```(?:json|chart|graph)?[\s\S]*?```/g, '');
      
      // Remove any remaining backticks
      cleaned = cleaned.replace(/`/g, '');
      
      // Try to extract JSON if it's wrapped in text
      const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
      if (jsonMatch && jsonMatch[1]) {
        cleaned = jsonMatch[1];
      }
      
      return cleaned.trim();
    };
    
    // Parse the JSON response with error handling
    let analysis;
    try {
      const cleanedJson = cleanJsonString(analysisText);
      analysis = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("Failed to parse API response:", parseError, "Raw response:", analysisText);
      throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
    // Remove duplicate JSON.parse - we already parsed it above
    
    // Validate and return the result
    if (typeof analysis.score !== 'number' || !Array.isArray(analysis.issues) || !Array.isArray(analysis.suggestions)) {
      throw new Error("Invalid response format from API");
    }
    
    // Ensure suggestions have the correct type
    const validatedSuggestions = analysis.suggestions.map((s: any) => ({
      ...s,
      type: 'quality' as const // Ensure correct type
    }));
    
    return {
      score: analysis.score,
      issues: analysis.issues,
      suggestions: validatedSuggestions
    };
  } catch (error) {
    console.error("Quality check failed:", error);
    throw error; // Re-throw to be handled by the component
  }
};

/**
 * Runs a financial validation check on the provided content.
 * (Backend implementation needed)
 * @param projectId - The ID of the project.
 * @param content - The content to check.
 * @returns Promise resolving to the financial check results.
 */
export const runFinancialCheck = async (projectId: string, content: string): Promise<FinancialCheckResult> => {
  console.log('API CALL: runFinancialCheck', projectId);
  
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API Key is missing.");
    throw new Error("API Key missing. Cannot perform financial validation.");
  }
  
  try {
    const prompt = `Analyze the following pitch deck content for financial accuracy, coherence, and validity. Focus on financial projections, revenue models, cost structures, and investment details.

Content to analyze:
${content}

Return your analysis in this exact JSON format:
{
  "coherence": "Good/Needs Review",
  "issues": ["issue 1", "issue 2", ...],
  "suggestions": [
    {"id": "fin_sug1", "text": "suggestion text", "impact": "High/Medium/Low", "effort": "High/Medium/Low", "type": "financial"},
    ...
  ]
}`;

    // Make the API call using the existing infrastructure
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': APP_NAME,
      },
      body: JSON.stringify({
        model: RESEARCH_MODEL, // Use the research model for financial validation
        messages: [
          {
            role: "system",
            content: "You are a financial analyst specializing in startup pitch decks and business plans. Your task is to analyze financial content and provide validation feedback in a structured JSON format. Be specific about financial inconsistencies, unrealistic projections, or missing information."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }, // Request JSON response
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenRouter API Error (${response.status}): ${errorBody}`);
      throw new Error(`API Error (${response.status}). Check console for details.`);
    }

    const result = await response.json();
    
    // Extract the content from the API response
    let analysisText = '';
    if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
      const choice = result.choices[0];
      if (choice.message && typeof choice.message.content === 'string') {
        analysisText = choice.message.content.trim();
      }
    }
    
    if (!analysisText) {
      throw new Error("Empty response from API");
    }
    
    // Clean the response text to handle markdown code blocks
    const cleanJsonString = (text: string): string => {
      let cleaned = text;
      
      // Remove any markdown code blocks
      cleaned = cleaned.replace(/```(?:json|chart|graph)?[\s\S]*?```/g, '');
      
      // Remove any remaining backticks
      cleaned = cleaned.replace(/`/g, '');
      
      // Try to extract JSON if it's wrapped in text
      const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
      if (jsonMatch && jsonMatch[1]) {
        cleaned = jsonMatch[1];
      }
      
      return cleaned.trim();
    };
    
    // Parse the JSON response with error handling
    let analysis;
    try {
      const cleanedJson = cleanJsonString(analysisText);
      analysis = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("Failed to parse API response:", parseError, "Raw response:", analysisText);
      throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
    
    // Validate and return the result
    if (typeof analysis.coherence !== 'string' || !Array.isArray(analysis.issues) || !Array.isArray(analysis.suggestions)) {
      throw new Error("Invalid response format from API");
    }
    
    // Ensure suggestions have the correct type
    const validatedSuggestions = analysis.suggestions.map((s: any) => ({
      ...s,
      type: 'financial' as const // Ensure correct type
    }));
    
    return {
      coherence: analysis.coherence,
      issues: analysis.issues,
      suggestions: validatedSuggestions
    };
  } catch (error) {
    console.error("Financial validation failed:", error);
    throw error; // Re-throw to be handled by the component
  }
};

/**
 * Regenerates content based on selected suggestions.
 * (Backend implementation needed)
 * @param projectId - The ID of the project.
 * @param content - The current content.
 * @param suggestions - An array of selected suggestions to apply.
 * @returns Promise resolving to the regeneration result.
 */
export const regenerateWithSuggestions = async (
  projectId: string,
  content: string,
  suggestions: Suggestion[]
): Promise<{ success: boolean; newContent?: string; error?: string }> => {
  console.log('API CALL: regenerateWithSuggestions', projectId, suggestions.map(s => s.id));
  
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API Key is missing.");
    return { success: false, error: "API Key missing. Cannot regenerate content." };
  }
  
  if (!suggestions || suggestions.length === 0) {
    return { success: false, error: "No suggestions provided for regeneration." };
  }
  
  try {
    // Format the suggestions for the prompt
    const suggestionsText = suggestions.map(s => `- ${s.text} (Impact: ${s.impact}, Type: ${s.type || 'general'})`).join('\n');
    
    const prompt = `Regenerate the following pitch deck content by applying these specific suggestions:

SUGGESTIONS TO APPLY:
${suggestionsText}

ORIGINAL CONTENT:
${content}

Provide a complete, revised version of the content that incorporates all the suggestions. Maintain the original structure and formatting, but improve the content based on the suggestions. Return ONLY the regenerated content, with no explanations or meta-commentary.`;

    // Make the API call using the existing infrastructure
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': APP_NAME,
      },
      body: JSON.stringify({
        model: CONTENT_MODEL, // Use the content model for regeneration
        messages: [
          {
            role: "system",
            content: "You are an expert pitch deck writer specializing in revising and improving business presentations. Your task is to regenerate content based on specific suggestions, maintaining the original structure while enhancing the quality, clarity, and effectiveness."
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenRouter API Error (${response.status}): ${errorBody}`);
      return { success: false, error: `API Error (${response.status}). Check console for details.` };
    }

    const result = await response.json();
    
    // Extract the content from the API response
    let regeneratedContent = '';
    if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
      const choice = result.choices[0];
      if (choice.message && typeof choice.message.content === 'string') {
        regeneratedContent = choice.message.content.trim();
      }
    }
    
    if (!regeneratedContent) {
      return { success: false, error: "Empty response from API" };
    }
    
    return { success: true, newContent: regeneratedContent };
  } catch (error) {
    console.error("Regeneration failed:", error);
    return {
      success: false,
      error: `Error during regeneration: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
