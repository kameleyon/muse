import axios from 'axios';

// Get the API key from environment variables
const API_BASE_URL = '/api/ai';

// Models
const RESEARCH_MODEL = import.meta.env.VITE_DEFAULT_RESEARCH_MODEL || "openai/gpt-4o-mine";
const CONVERSATION_MODEL = 'anthropic/claude-3-haiku-20240307';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
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
    
    // Create a properly formatted request payload
    const payload = {
      model: CONVERSATION_MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024
    };
    
    console.log('Request payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post<OpenRouterResponse>(
      `${API_BASE_URL}/generate`,
      {
        prompt: messages[messages.length - 1].content,
        type: 'chat',
        parameters: {
          model: CONVERSATION_MODEL,
          messages: messages,
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
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
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

// Direct access to system prompt for use in the context
export const getChatSystemPrompt = (): string => {
  return CHAT_SYSTEM_PROMPT;
};

// Simple function to check if API is available
export const isConfigured = (): boolean => {
  return true; // Always return true since we're using the server API
};
