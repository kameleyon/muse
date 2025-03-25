import axios from 'axios';

// Get the API key from environment variables
const API_BASE_URL = '/api/ai';

// Models
const RESEARCH_MODEL = import.meta.env.VITE_DEFAULT_RESEARCH_MODEL || "openai/gpt-4o-mine";
const CONVERSATION_MODEL = 'anthropic/claude-3-haiku-20240307';

// For proper API payload formatting - not all models use the same API schema
const isClaudeModel = (model: string) => model.includes('anthropic/claude');

// Model definitions
export interface AIModel {
  id: string;
  name: string;
  description: string;
  strengths: string;
  costPer1KTokens: number;
  category: 'chat' | 'research' | 'creative';
}

// Available models
export const availableModels: AIModel[] = [
  {
    id: 'anthropic/claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    description: 'Fast, affordable AI assistant for everyday tasks',
    strengths: 'Quick responses, balanced quality and speed',
    costPer1KTokens: 0.00025,
    category: 'chat'
  },
  {
    id: 'anthropic/claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: 'Most powerful Claude model for complex tasks',
    strengths: 'Complex reasoning, nuanced instructions, creative tasks',
    costPer1KTokens: 0.00300,
    category: 'creative'
  },
  {
    id: 'openai/gpt-4o-mine',
    name: 'GPT-4o',
    description: 'OpenAI\'s latest and most capable model',
    strengths: 'Versatile performance, balanced reasoning, knowledge',
    costPer1KTokens: 0.00100,
    category: 'chat'
  },
  {
    id: 'openai/gpt-4o-search-preview',
    name: 'GPT-4o Search',
    description: 'Research model with web search capability',
    strengths: 'Up-to-date information, factual responses, research',
    costPer1KTokens: 0.00200,
    category: 'research'
  }
];

// Content preset definitions
export interface ContentPreset {
  id: string;
  name: string;
  description: string;
  type: string;
  parameters: {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
  };
}

// Content presets
export const contentPresets: ContentPreset[] = [
  {
    id: 'blog-expert',
    name: 'Expert Blog Post',
    description: 'Creates in-depth, authoritative blog content with research',
    type: 'blog',
    parameters: {
      model: 'anthropic/claude-3-opus-20240229',
      temperature: 0.7,
      maxTokens: 1500,
      systemPrompt: 'You are an expert content writer with deep knowledge in the topic. Create an authoritative blog post with well-researched information, relevant examples, and actionable insights.'
    }
  },
  {
    id: 'blog-casual',
    name: 'Conversational Blog',
    description: 'Friendly, approachable blog style with personal voice',
    type: 'blog',
    parameters: {
      model: 'anthropic/claude-3-haiku-20240307',
      temperature: 0.8,
      maxTokens: 1200,
      systemPrompt: 'You are a friendly, conversational writer creating an engaging blog post. Use a personal, approachable tone with casual language. Include personal anecdotes, conversational asides, and a warm, authentic voice.'
    }
  },
  {
    id: 'social-engaging',
    name: 'Engaging Social Post',
    description: 'Creates attention-grabbing social content',
    type: 'social',
    parameters: {
      model: 'openai/gpt-4o-mine',
      temperature: 0.9,
      maxTokens: 300,
      systemPrompt: 'You are a social media expert creating engaging, shareable content. Write attention-grabbing posts that encourage engagement. Use concise, impactful language with appropriate hooks and calls-to-action.'
    }
  },
  {
    id: 'email-professional',
    name: 'Professional Email',
    description: 'Formal business emails with clarity and professionalism',
    type: 'email',
    parameters: {
      model: 'anthropic/claude-3-haiku-20240307',
      temperature: 0.6,
      maxTokens: 600,
      systemPrompt: 'You are a professional business writer creating a formal email. Use clear, concise language with appropriate business etiquette. Maintain a professional tone while being direct and purpose-driven.'
    }
  }
];

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerateContentOptions {
  prompt: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  onProgress?: (progress: number) => void;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

// Define the system prompt for the chat model
const CHAT_SYSTEM_PROMPT = `You are a helpful AI assistant with a casual tone and friendly demeanor, highly knowledgeable in all types of written content. Your responses should be professional yet warm and welcoming, with a hint of humor when appropriate. Avoid using emojis. Provide detailed and accurate information when answering questions.

Your personality traits:
- Professional but approachable
- Knowledgeable and helpful
- Warm and friendly
- Occasionally humorous in a subtle way
- Clear and concise in explanations
- Respectful and considerate

When responding, aim to be conversational but not overly casual, maintain a natural language flow, and be genuinely helpful without being stuffy or formal.`;

// Function to generate a response from the conversational model
export const generateChatResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    console.log('Sending request to OpenRouter API with Claude 3 Haiku model');
    
    // Check if messages array is properly formatted
    if (!messages || messages.length === 0) {
      console.error('Error: Messages array is empty or undefined');
      return 'I apologize, but there was an error with the conversation history. Please try again.';
    }
    
    // Create a properly formatted request payload
    const payload = {
      model: CONVERSATION_MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024
    };
    
    // Add detailed logging to help debug the issue
    console.log('Complete request payload for debugging:');
    console.log(JSON.stringify({
      endpoint: `${API_BASE_URL}/generate`,
      method: 'POST',
      body: {
        prompt: messages[messages.length - 1].content,
        messages: messages,
        type: 'chat',
        parameters: {
          model: CONVERSATION_MODEL,
          temperature: 0.7,
          max_tokens: 1024
        }
      }
    }, null, 2));
    
    const response = await axios.post<OpenRouterResponse>(
      `${API_BASE_URL}/generate`,
      {
        prompt: messages[messages.length - 1].content,
        type: 'chat',
        parameters: {
          model: CONVERSATION_MODEL,
          temperature: 0.7,
          max_tokens: 1024
        }
      }
    );

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      console.error('No choices in response:', response.data);
      return 'I apologize, but I was unable to generate a response.';
    }
  } catch (error) {
    console.error('Error generating chat response:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', error.response?.data);
      console.error('API Error Status:', error.response?.status);
      console.error('API Error Headers:', error.response?.headers);
      console.error('API Request Details:', error.config);
      
      if (error.response?.status === 500) {
        console.error('Server error occurred. Payload may be malformed.');
      }
      
      return `I apologize, but there was an error processing your request (Status: ${error.response?.status || 'Unknown'}). Please try again later.`;
    }
    return 'I apologize, but there was an error processing your request. Please try again later.';
  }
};

// Function to generate a response from the research model with web search capability
export const generateResearchResponse = async (query: string): Promise<string> => {
  try {
    console.log('Sending request to OpenRouter API with search model');
    const systemPrompt = 'You are a knowledgeable research assistant that provides helpful, accurate, and up-to-date information. Use web search results to answer questions thoroughly and cite sources when appropriate.';
    
    const payload = {
      model: RESEARCH_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.5,
      max_tokens: 1500,
      tools: [{ type: "web-search" }]
    };
    
    console.log('Research request payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post<OpenRouterResponse>(
      `${API_BASE_URL}/generate`,
      {
        prompt: query,
        type: 'research',
        parameters: {
          model: RESEARCH_MODEL,
          temperature: 0.5,
          max_tokens: 1500,
          tools: [{ type: "web-search" }]
        }
      }
    );

    console.log('Research response status:', response.status);
    console.log('Research response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      console.error('No choices in response:', response.data);
      return 'I apologize, but I was unable to find relevant information.';
    }
  } catch (error) {
    console.error('Error generating research response:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', error.response?.data);
      console.error('API Error Status:', error.response?.status);
    }
    return 'I apologize, but there was an error processing your research request. Please try again later.';
  }
};

// Generate content with progress tracking
export const generateContent = async (options: GenerateContentOptions): Promise<OpenRouterResponse> => {
  try {
    const { prompt, model, maxTokens = 1000, temperature = 0.7, systemPrompt = CHAT_SYSTEM_PROMPT, onProgress } = options;
    
    // Mock progress updates for UI
    if (onProgress) {
      const mockProgressInterval = setInterval(() => {
        const randomIncrement = Math.random() * 10;
        onProgress(Math.min((mockProgressCount += randomIncrement), 95));
      }, 300);
      
      // Clear interval after completion or failure
      setTimeout(() => clearInterval(mockProgressInterval), 5000);
    }
    
    const response = await axios.post<OpenRouterResponse>(
      `${API_BASE_URL}/generate`,
      {
        prompt,
        type: model.includes('search') ? 'research' : 'chat',
        parameters: {
          model,
          temperature,
          max_tokens: maxTokens
        }
      }
    );

    // Complete progress
    if (onProgress) {
      onProgress(100);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content. Please try again later.');
  }
};

// Variable to track mock progress
let mockProgressCount = 0;

// Mock implementation for testing in case the API is not available
export const generateMockResponse = (prompt: string): string => {
  if (prompt.toLowerCase().includes('weather')) {
    return "The weather today is sunny with a high of 75°F. There's a slight chance of rain in the evening.";
  } else if (prompt.toLowerCase().includes('hello') || prompt.toLowerCase().includes('hi')) {
    return "Hello! How can I assist you today?";
  } else if (prompt.toLowerCase().includes('help')) {
    return "I'm here to help! You can ask me questions, request information, or get assistance with various tasks. What would you like help with?";
  } else {
    return "Thank you for your message. I'm a helpful AI assistant ready to answer your questions. Could you provide more details about what you'd like to know?";
  }
};

// Get available models
export const getAvailableModels = (): AIModel[] => {
  return availableModels;
};

// Direct access to system prompt for use in the context
export const getChatSystemPrompt = (): string => {
  return CHAT_SYSTEM_PROMPT;
};

// Simple function to check if API is available
export const isConfigured = (): boolean => {
  return true; // Always return true since we're using the server API
};

// Default export for the service
const openRouterService = {
  generateChatResponse,
  generateResearchResponse,
  generateContent,
  getAvailableModels,
  getChatSystemPrompt,
  isConfigured
};

export default openRouterService;