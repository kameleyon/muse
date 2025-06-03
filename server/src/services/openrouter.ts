import axios from 'axios';
import config from '../config';
import logger from '../utils/logger';

interface OpenRouterRequestParams {
  prompt: string;
  model: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number; // Often similar to repetition_penalty
  presence_penalty?: number;  // Often similar to repetition_penalty
  repetition_penalty?: number; // As requested by user
  length_penalty?: number;     // As requested by user
  // style_guidance and text_guidance are less common standard LLM params,
  // they might be specific to certain models or custom interpretations.
  // We'll pass them through if OpenRouter/models support them.
  style_guidance?: number;     // As requested by user
  text_guidance?: number;      // As requested by user
  stop?: string[];
  messages?: Array<{role: string; content: string}>;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
    index: number;
  }[];
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const executeOpenRouterRequest = async (params: OpenRouterRequestParams): Promise<OpenRouterResponse> => {
  try {
    // Ensure we have messages to send to the API
    const messages = params.messages || [
      {
        role: 'user',
        content: params.prompt,
      },
    ];
    
    const requestData = {
      model: params.model,
      messages,
      max_tokens: params.max_tokens || 1000,
      temperature: params.temperature !== undefined ? params.temperature : 0.7,
      top_p: params.top_p !== undefined ? params.top_p : 1,
      frequency_penalty: params.frequency_penalty !== undefined ? params.frequency_penalty : 0,
      presence_penalty: params.presence_penalty !== undefined ? params.presence_penalty : 0,
      stop: params.stop || null,
      // Add new parameters, ensuring they are only included if defined in params
      ...(params.repetition_penalty !== undefined && { repetition_penalty: params.repetition_penalty }),
      ...(params.length_penalty !== undefined && { length_penalty: params.length_penalty }),
      ...(params.style_guidance !== undefined && { style_guidance: params.style_guidance }),
      ...(params.text_guidance !== undefined && { text_guidance: params.text_guidance }),
    };

    logger.info(`Making OpenRouter request to model: ${params.model}`);
    
    const response = await axios.post(
      `${config.openRouter.baseUrl}/chat/completions`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openRouter.apiKey}`,
          'HTTP-Referer': 'https://magicmuse.io',
          'X-Title': 'MagicMuse.io',
        },
      }
    );

    const responseData = response.data as OpenRouterResponse;
    
    logger.info(`OpenRouter request successful. Tokens used: ${responseData.usage.total_tokens}`);
    
    return responseData;
  } catch (error: any) {
    if (error.response) {
      // Enhanced error logging with more details
      logger.error(
        `OpenRouter API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      );
      logger.error(`Request was for model: ${params.model}`);
      
      // Check for specific error types
      if (error.response.status === 401 || error.response.status === 403) {
        logger.error('Authentication error - check API key validity and permissions');
        throw new Error(`OpenRouter API authentication error: ${error.response.data.error?.message || 'Invalid API key or insufficient permissions'}`);
      } else if (error.response.status === 404) {
        logger.error(`Model not found: ${params.model}`);
        throw new Error(`OpenRouter API error: Model "${params.model}" not found or not available`);
      } else if (error.response.status === 429) {
        logger.error('Rate limit exceeded');
        throw new Error('OpenRouter API rate limit exceeded. Please try again later.');
      } else if (error.response.status === 500) {
        logger.error('OpenRouter internal server error');
        throw new Error(`OpenRouter API server error: ${error.response.data.error?.message || 'Internal server error'}`);
      } else {
        throw new Error(`OpenRouter API error: ${error.response.data.error?.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      logger.error(`OpenRouter API request error: ${error.message}`);
      throw new Error('Could not connect to OpenRouter API. Please check your network connection.');
    } else {
      logger.error(`OpenRouter client error: ${error.message}`);
      throw error;
    }
  }
};