import axios from 'axios';
import { OpenRouterService } from './openrouter';

// Qwen specific interfaces
interface QwenMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface QwenRequest {
  model: string;
  messages: QwenMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  stream?: boolean;
}

interface QwenResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
    index: number;
  }[];
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// MagicMuse default system prompt
const DEFAULT_MAGIC_MUSE_PROMPT = `You are MagicMuse, an expert in writing diverse types of content with a strong grasp of grammar, structure, and tone for various audiences. Your style is casual, witty, and elegant, with a touch of zestiness. When chatting, you use natural language akin to texting in a chat box. Maintain a friendly yet professional demeanor, avoiding emojis. Provide responses as "You" and aim for a natural conversation flow.`;

export class QwenService extends OpenRouterService {
  private readonly qwenModel: string;

  constructor(
    apiKey?: string,
    baseUrl: string = 'https://openrouter.ai/api/v1',
    qwenModel?: string
  ) {
    super(apiKey, baseUrl);
    this.qwenModel = qwenModel || import.meta.env.VITE_DEFAULT_CHAT_MODEL || 'qwen/qwen-plus';
  }

  /**
   * Generate a chat response using the Qwen model
   */
  public async generateChatResponse(params: {
    messages: QwenMessage[];
    maxTokens?: number;
    temperature?: number;
    top_p?: number;
    systemPrompt?: string;
    stream?: boolean;
    onStream?: (chunk: string) => void;
  }): Promise<QwenResponse> {
    const {
      messages,
      maxTokens = 800,
      temperature = 0.6,  // Ensures structured tone with witty elements
      top_p = 0.5,  // Allows better word diversity while keeping coherence
      systemPrompt = DEFAULT_MAGIC_MUSE_PROMPT,
      stream = false,
      onStream
    } = params;

    // Custom parameters for advanced control (not in the params interface)
    const repetitionPenalty = 2.5;  // Prevents repetitive phrases but keeps natural flow
    const lengthPenalty = 1.0;  // Balanced output length
    const styleGuidance = 0.7;  // Ensures witty, casual formatting
    const textGuidance = 0.85;  // Keeps content conversational and natural

    // Ensure the first message is a system message
    const allMessages: QwenMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages.filter(m => m.role !== 'system')
    ];

    try {
      // Prepare the request data
      const requestData: QwenRequest = {
        model: this.qwenModel,
        messages: allMessages,
        max_tokens: maxTokens,
        temperature,
        top_p,
        presence_penalty: 1.2,
        frequency_penalty: 1.2,
        stream
      };
      
      console.log("Sending to OpenRouter:", {
        model: this.qwenModel,
        messages: allMessages,
        params: {
          temperature,
          top_p,
          presence_penalty: 1.2,
          frequency_penalty: 1.2
        }
      });

      // Always use the real API
      // No more mocks in development mode

      // For streaming responses
      if (stream && onStream) {
        return this.streamChatResponse(requestData, onStream);
      }

      // For regular responses
      try {
        console.log("Making API request to OpenRouter with model:", this.qwenModel);
        console.log("API Key (first 5 chars):", import.meta.env.VITE_OPENROUTER_API_KEY?.substring(0, 5) + "...");
        
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              'HTTP-Referer': 'https://magicmuse.io',
              'X-Title': 'MagicMuse.io',
            },
          }
        );
        
        console.log("Received response from OpenRouter:", response.data);
        return response.data as QwenResponse;
      } catch (apiError: any) {
        console.error("OpenRouter API Error:", apiError);
        console.error("Error response:", apiError.response?.data);
        throw apiError;
      }
    } catch (error: any) {
      console.error('Qwen API Error:', error);
      
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        throw new Error('Network Error: Could not connect to OpenRouter API');
      } else {
        throw new Error(`Error: ${error.message}`);
      }
    }
  }

  /**
   * Handle streaming responses
   */
  private async streamChatResponse(
    requestData: QwenRequest,
    onStream: (chunk: string) => void
  ): Promise<QwenResponse> {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://magicmuse.io',
            'X-Title': 'MagicMuse.io',
          },
          responseType: 'stream',
        }
      );

      let completeResponse: QwenResponse = {
        id: '',
        choices: [{
          message: {
            content: '',
            role: 'assistant'
          },
          finish_reason: '',
          index: 0
        }],
        model: this.qwenModel,
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };

      return new Promise((resolve, reject) => {
        let buffer = '';

        response.data.on('data', (chunk: Buffer) => {
          const chunkStr = chunk.toString();
          buffer += chunkStr;

          // Process each line (event)
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const eventData = line.slice(6).trim();
              
              if (eventData === '[DONE]') {
                return;
              }

              try {
                const parsedData = JSON.parse(eventData);
                
                if (parsedData.choices && parsedData.choices[0]?.delta?.content) {
                  const content = parsedData.choices[0].delta.content;
                  onStream(content);
                  
                  // Update the complete response
                  completeResponse.choices[0].message.content += content;
                }
                
                if (parsedData.id) {
                  completeResponse.id = parsedData.id;
                }
                
                if (parsedData.model) {
                  completeResponse.model = parsedData.model;
                }
              } catch (err) {
                console.error('Error parsing stream data:', err);
              }
            }
          }
        });

        response.data.on('end', () => {
          resolve(completeResponse);
        });

        response.data.on('error', (err: Error) => {
          reject(err);
        });
      });
    } catch (error: any) {
      console.error('Streaming API Error:', error);
      throw error;
    }
  }
  /**
   * Generate mock responses for development
   */
  private async mockQwenChatResponse(requestData: QwenRequest): Promise<QwenResponse> {
    // Extract the last user message
    const lastUserMessage = [...requestData.messages].reverse()
      .find(m => m.role === 'user')?.content || '';
    
    // Generate a mock response based on the user's message
    let responseContent = '';
    
    if (lastUserMessage.toLowerCase().includes('hello') || lastUserMessage.toLowerCase().includes('hi')) {
      responseContent = "Hey there! I'm MagicMuse, your content writing assistant. How can I help you today? Need some creative help or just want to chat about your writing project?";
    } else if (lastUserMessage.toLowerCase().includes('help')) {
      responseContent = "I'd be happy to help. What kind of content are you looking to create? Blog posts, marketing copy, social media content? Let me know what you're working on and I'll assist with my casual yet professional touch.";
    } else if (lastUserMessage.toLowerCase().includes('blog')) {
      responseContent = "Blog posts are my specialty. What's your topic? I can help brainstorm ideas, create outlines, or draft the full piece. My writing style blends professionalism with conversational flair—exactly what readers love.";
    } else if (lastUserMessage.toLowerCase().includes('thank')) {
      responseContent = "You're welcome! Always a pleasure to help with your content needs. Let me know if there's anything else you'd like to work on together.";
    } else if (lastUserMessage.toLowerCase().includes('error') || lastUserMessage.toLowerCase().includes('not working')) {
      // For testing error handling
      await new Promise(resolve => setTimeout(resolve, 800));
      throw new Error("Mock error response for testing");
    } else {
      responseContent = "Thanks for your message. I'm MagicMuse, your writing assistant with a flair for creating content that resonates. What would you like to work on today? I'm here to help bring your ideas to life with that perfect balance of professionalism and personality.";
    }

    // Simulate a delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: 'mock-qwen-response-id',
      choices: [
        {
          message: {
            content: responseContent,
            role: 'assistant',
          },
          finish_reason: 'stop',
          index: 0,
        },
      ],
      model: this.qwenModel,
      usage: {
        prompt_tokens: lastUserMessage.length / 4,
        completion_tokens: responseContent.length / 4,
        total_tokens: (lastUserMessage.length + responseContent.length) / 4,
      },
    };
  }
}

// Export singleton instance
export default new QwenService();
