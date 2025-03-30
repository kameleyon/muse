// src/services/contentGenerationService.ts

// Read environment variables (Vite specific)
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const CONTENT_MODEL = import.meta.env.VITE_DEFAULT_CONTENT_MODEL || 'google/gemini-2.5-pro-exp-03-25:free';
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
  factCheckLevel?: 'basic' | 'standard' | 'thorough';
  useResearchModel?: boolean; 
  // temperature?: number; 
}

interface GeneratedContent {
  sectionId?: string; 
  content: string; 
  modelUsed?: string;
  finishReason?: string;
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
            content: "You are an expert assistant helping to create professional pitch decks. " +
                     "Always format your responses using Markdown with appropriate headings, " +
                     "bullet points, and formatting. Provide complete, comprehensive content based on the user's prompt." 
          }, 
          { role: "user", content: params.prompt } 
        ],
        // Consider adding max_tokens if responses are truncated
        // max_tokens: 4000, 
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
    // Check for Anthropic format
    else if (result.content && Array.isArray(result.content) && result.content.length > 0) {
      const contentBlock = result.content[0];
      if (contentBlock && contentBlock.type === 'text' && typeof contentBlock.text === 'string') {
        generatedText = contentBlock.text.trim();
      }
      if (typeof result.stop_reason === 'string') {
        finishReason = result.stop_reason;
      }
    }
    // Check for Google Gemini format (might be nested differently)
    else if (result.candidates && Array.isArray(result.candidates) && result.candidates.length > 0) {
        const candidate = result.candidates[0];
        if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts) && candidate.content.parts.length > 0) {
            generatedText = candidate.content.parts[0].text?.trim() || '';
        }
        if (typeof candidate.finishReason === 'string') {
            finishReason = candidate.finishReason;
        }
    }
    // Fallback for other potential direct text responses
    else if (typeof result.text === 'string') {
      generatedText = result.text.trim();
      finishReason = 'direct_text';
    } 
    else if (typeof result.content === 'string') { // Less common, but possible
      generatedText = result.content.trim();
      finishReason = 'direct_content';
    }

    // Handle cases where parsing failed or content is empty
    if (!generatedText) {
      console.warn("Could not extract generated text from API response:", JSON.stringify(result, null, 2));
      generatedText = `Error: Could not parse response from ${modelToUse}. See console for details.`;
      finishReason = 'parsing_failed';
    }
    
    console.log(`API Response from ${modelToUse}: Finish Reason - ${finishReason}`);
    console.log("Generated Text Preview:", generatedText.substring(0, 200) + '...');

    // Basic check to ensure some structure if the model failed to provide it
    if (generatedText && !generatedText.startsWith('#') && !generatedText.startsWith('Error:') && finishReason !== 'parsing_failed') {
      console.warn("Generated content lacks expected Markdown heading. Prepending a default title.");
      generatedText = `# Generated Content\n\n${generatedText}`;
    }

    return { 
      content: generatedText, 
      modelUsed: modelToUse, 
      finishReason: finishReason 
    };

  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    const errorMessage = `Error generating content: ${error instanceof Error ? error.message : String(error)}`;
    console.log("Returning error content:", errorMessage);
    return { content: errorMessage, finishReason: 'exception' };
  }
};

/**
 * Applies a template to the project structure (Placeholder - likely involves multiple generation calls).
 * @param projectId - The ID of the project.
 * @param templateId - The ID of the template to apply.
 * @returns Promise resolving when complete.
 */
export const applyTemplate = async (projectId: string, templateId: string): Promise<void> => {
  console.log('API CALL: applyTemplate', projectId, templateId);
  // This would likely involve fetching template structure and then calling generateContent for each section
  await new Promise(resolve => setTimeout(resolve, 400));
};

/**
 * Enhances existing content using AI (Uses generateContent).
 * @param projectId - The ID of the project.
 * @param sectionId - The ID of the section to enhance.
 * @param content - The existing content.
 * @param enhancementType - e.g., 'clarity', 'persuasion', 'tone_adjust'
 * @returns Promise resolving to the enhanced content.
 */
export const enhanceContent = async (projectId: string, sectionId: string, content: string, enhancementType: string): Promise<GeneratedContent> => {
  console.log('API CALL: enhanceContent', projectId, sectionId, enhancementType);
  const prompt = `Enhance the following content for ${enhancementType}:\n\n${content}`;
  // Use the standard content model for enhancement
  return generateContent({ projectId, sectionId, prompt, useResearchModel: false }); 
};

/**
 * Verifies facts within generated or provided content using the research model.
 * @param projectId - The ID of the project.
 * @param content - The content containing claims to verify.
 * @returns Promise resolving to an array of fact check results.
 */
export const verifyFacts = async (projectId: string, content: string): Promise<FactCheckResult[]> => {
  console.log('API CALL: verifyFacts using research model', projectId);
  const prompt = `Verify the factual claims in the following text. For each claim, state if it is verified, not verified, or uncertain. Provide a source or explanation where possible:\n\n${content}`;
  
  try {
    const result = await generateContent({ projectId, prompt, useResearchModel: true });
    console.log("Raw fact check response:", result.content);
    
    // --- Robust Parsing for Fact Check Results ---
    const results: FactCheckResult[] = [];
    const lines = result.content.split('\n');
    
    lines.forEach(line => {
      const claimMatch = line.match(/Claim:\s*(.*)/i);
      const statusMatch = line.match(/Status:\s*(Verified|Not Verified|Uncertain)/i);
      const sourceMatch = line.match(/Source:\s*(.*)/i);
      const explanationMatch = line.match(/Explanation:\s*(.*)/i);

      if (claimMatch && statusMatch) {
        results.push({
          claim: claimMatch[1].trim(),
          verified: statusMatch[1].toLowerCase() === 'verified',
          source: sourceMatch ? sourceMatch[1].trim() : undefined,
          explanation: explanationMatch ? explanationMatch[1].trim() : (statusMatch[1].toLowerCase() !== 'verified' ? 'No specific explanation provided.' : undefined)
        });
      } else if (line.includes("Verified") || line.includes("Not Verified") || line.includes("Uncertain")) {
        // Attempt to capture less structured lines
        const claim = line.split(/Verified|Not Verified|Uncertain/i)[0]?.trim() || 'Unknown Claim';
        const verified = line.includes("Verified");
        results.push({ claim, verified, explanation: line });
      }
    });

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

// Add more functions as needed (getGenerationStatus, adjustParameters, etc.)