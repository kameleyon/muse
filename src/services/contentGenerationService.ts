// src/services/contentGenerationService.ts

// Read environment variables (Vite specific)
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const CONTENT_MODEL = import.meta.env.VITE_DEFAULT_CONTENT_MODEL || 'google/gemini-2.5-pro-exp-03-25:free'; // Changed default model
const RESEARCH_MODEL = import.meta.env.VITE_DEFAULT_RESEARCH_MODEL || 'openai/gpt-4o-search-preview'; // Keep research model for now, unless specified otherwise
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173'; // Get site URL for referrer
const APP_NAME = import.meta.env.VITE_APP_NAME || 'MagicMuse'; // Get app name for title

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
  // Add other parameters like temperature, max_tokens if needed
  // temperature?: number; 
}

interface GeneratedContent {
  sectionId?: string; 
  content: string; 
  modelUsed?: string;
  finishReason?: string;
  // ... other metadata like model used, tokens, etc.
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
  console.log(`API CALL: generateContent using ${modelToUse}`, params.prompt.substring(0, 100) + '...'); // Log start of prompt

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
        // Add site URL/App name for OpenRouter tracking
        'HTTP-Referer': SITE_URL, 
        'X-Title': APP_NAME, 
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          // TODO: Add a more sophisticated system prompt based on role/task
          { role: "system", content: "You are an expert assistant helping to create professional pitch decks." }, 
          { role: "user", content: params.prompt } 
          // Add other parameters like temperature, max_tokens based on params
          // temperature: params.temperature || 0.7, 
        ],
        // stream: true, // Consider implementing streaming later for better UX
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenRouter API Error (${response.status}): ${errorBody}`);
      throw new Error(`API Error (${response.status}) calling ${modelToUse}. Check console for details.`);
    }

    const result = await response.json();
    const generatedText = result.choices?.[0]?.message?.content || '';
    const finishReason = result.choices?.[0]?.finish_reason;
    
    console.log(`API Response from ${modelToUse}: Finish Reason - ${finishReason}`);
    // console.log("Generated Text:", generatedText.substring(0, 200) + '...'); // Log beginning of response

    return { 
        content: generatedText, 
        modelUsed: modelToUse, 
        finishReason: finishReason 
    };

  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    return { content: `Error generating content: ${error instanceof Error ? error.message : String(error)}` };
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
    // TODO: Implement robust parsing of the research model's response 
    // to extract structured FactCheckResult objects. This is highly dependent 
    // on the model's output format.
    
    // Simple placeholder parsing simulation:
    const simulatedResults: FactCheckResult[] = [];
    if (result.content.includes("Market size is $10B - Verified")) {
       simulatedResults.push({ claim: 'Market size is $10B', verified: true, source: 'Simulated Source', explanation: 'Model indicated verification.' });
    }
     if (result.content.includes("Competitor X has Y feature - Not Verified")) {
       simulatedResults.push({ claim: 'Competitor X has Y feature', verified: false, explanation: 'Model indicated lack of verification.' });
    }
    if (simulatedResults.length === 0 && !result.content.startsWith('Error:')) {
       simulatedResults.push({ claim: 'General Content', verified: true, explanation: 'No specific claims parsed from model response.' });
    } else if (result.content.startsWith('Error:')) {
        simulatedResults.push({ claim: 'Verification Process', verified: false, explanation: result.content });
    }
    return simulatedResults;

  } catch (error) {
     console.error("Error during fact verification:", error);
     return [{ claim: 'Verification Process', verified: false, explanation: `Error during verification: ${error instanceof Error ? error.message : String(error)}` }];
  }
};

// Add more functions as needed (getGenerationStatus, adjustParameters, etc.)