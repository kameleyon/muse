import axios from 'axios';
import config from '../config';
import logger from '../utils/logger';

interface OpenRouterRequestParams {
  prompt: string;
  model: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
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
      temperature: params.temperature || 0.7,
      top_p: params.top_p || 1,
      frequency_penalty: params.frequency_penalty || 0,
      presence_penalty: params.presence_penalty || 0,
      stop: params.stop || null,
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