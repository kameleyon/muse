import axios from 'axios';

// OpenRouter API interface
interface OpenRouterRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
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
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Available models configuration
export const availableModels = [
  {
    id: 'anthropic/claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet',
    description: 'Newest and recommended model for content generation',
    maxTokens: 200000,
    costPer1KTokens: 0.0035,
    strengths: 'Exceptional quality content with superior reasoning capabilities',
    category: 'content',
  },
  {
    id: 'anthropic/claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: 'Most powerful model for expert-level analysis and content',
    maxTokens: 200000,
    costPer1KTokens: 0.015,
    strengths: 'Premium content with exceptional depth and quality',
    category: 'content',
  },
  {
    id: 'anthropic/claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    description: 'Balanced model for complex reasoning and content creation',
    maxTokens: 200000,
    costPer1KTokens: 0.003,
    strengths: 'High-quality content with good reasoning capabilities',
    category: 'content',
  },
  {
    id: 'anthropic/claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    description: 'Fast and cost-effective model for efficient tasks',
    maxTokens: 200000,
    costPer1KTokens: 0.00025,
    strengths: 'Quick responses, efficient for shorter content',
    category: 'content',
  },
  {
    id: 'openai/gpt-4o-search-preview',
    name: 'GPT-4o Search',
    description: 'Specialized model for internet research and fact-checking',
    maxTokens: 128000,
    costPer1KTokens: 0.012,
    strengths: 'Web search capabilities for up-to-date information and verification',
    category: 'research',
  },
  {
    id: 'openai/gpt-4o-2024-05-13',
    name: 'GPT-4o',
    description: 'Latest OpenAI model with advanced capabilities',
    maxTokens: 128000,
    costPer1KTokens: 0.01,
    strengths: 'Versatile with strong performance across various tasks',
    category: 'content',
  },
];

// Content presets configuration
export const contentPresets = [
  {
    id: 'blog-professional',
    name: 'Professional Blog Post',
    description: 'Clear, informative content for business blogs',
    type: 'blog',
    parameters: {
      model: 'anthropic/claude-3.7-sonnet',
      temperature: 0.7,
      max_tokens: 1500,
    },
  },
  {
    id: 'blog-casual',
    name: 'Casual Blog Post',
    description: 'Conversational, engaging content for personal blogs',
    type: 'blog',
    parameters: {
      model: 'anthropic/claude-3.7-sonnet',
      temperature: 0.8,
      max_tokens: 1200,
    },
  },
  {
    id: 'marketing-persuasive',
    name: 'Persuasive Marketing',
    description: 'Compelling copy that drives conversions',
    type: 'marketing',
    parameters: {
      model: 'anthropic/claude-3.7-sonnet',
      temperature: 0.75,
      max_tokens: 800,
    },
  },
  {
    id: 'social-engaging',
    name: 'Engaging Social Posts',
    description: 'Attention-grabbing content for social media',
    type: 'social',
    parameters: {
      model: 'anthropic/claude-3.7-sonnet',
      temperature: 0.9,
      max_tokens: 400,
    },
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Formal, well-structured content for academic purposes',
    type: 'academic',
    parameters: {
      model: 'anthropic/claude-3-opus-20240229',
      temperature: 0.5,
      max_tokens: 2000,
    },
  },
  {
    id: 'factcheck-research',
    name: 'Fact Check & Research',
    description: 'Verify information and conduct web research',
    type: 'research',
    parameters: {
      model: 'openai/gpt-4o-search-preview',
      temperature: 0.3,
      max_tokens: 1500,
    },
  },
];

// Main API class for handling OpenRouter interactions
export class OpenRouterService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly defaultModel: string;

  constructor(
    apiKey?: string,
    baseUrl: string = 'https://openrouter.ai/api/v1',
    defaultModel?: string
  ) {
    this.apiKey = apiKey || import.meta.env.VITE_OPENROUTER_API_KEY;
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel || import.meta.env.VITE_DEFAULT_CONTENT_MODEL || 'anthropic/claude-3.7-sonnet';
  }

  // Get the API key
  public getApiKey(): string {
    return this.apiKey;
  }

  // Check if API key is set
  public isConfigured(): boolean {
    return !!this.apiKey;
  }

  // Generate content using OpenRouter API
  public async generateContent(params: {
    prompt: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
    onProgress?: (progress: number) => void;
  }): Promise<OpenRouterResponse> {
    const { 
      prompt, 
      model = this.defaultModel, 
      maxTokens = 1000, 
      temperature = 0.7,
      systemPrompt = 'You are a professional content generator who creates high-quality, engaging, and accurate content.'
    } = params;

    // Mock implementation with simulated progress for demo purposes
    if (process.env.NODE_ENV === 'development' && !this.apiKey) {
      return this.mockGenerateContent(params);
    }

    try {
      const requestData: OpenRouterRequest = {
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature,
        top_p: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
      };

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://magicmuse.io',
            'X-Title': 'MagicMuse.io',
          },
        }
      );

      return response.data as OpenRouterResponse;
    } catch (error: any) {
      console.error('OpenRouter API Error:', error);
      
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        throw new Error('Network Error: Could not connect to OpenRouter API');
      } else {
        throw new Error(`Error: ${error.message}`);
      }
    }
  }

  // Mock implementation for development without API key
  private async mockGenerateContent(params: {
    prompt: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    onProgress?: (progress: number) => void;
  }): Promise<OpenRouterResponse> {
    const { prompt, model = this.defaultModel } = params;
    
    // Simulate progress updates
    if (params.onProgress) {
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        params.onProgress((i / steps) * 100);
      }
    }

    // Extract topic for mock content
    const topicMatch = prompt.match(/about "([^"]+)"/);
    const topic = topicMatch ? topicMatch[1] : 'Sample Topic';
    
    // Generate mock content based on model
    const mockContent = this.getMockContentForModel(model, topic);

    return {
      id: 'mock-response-id',
      choices: [
        {
          message: {
            content: mockContent,
            role: 'assistant',
          },
          finish_reason: 'stop',
          index: 0,
        },
      ],
      model,
      usage: {
        prompt_tokens: prompt.length / 4,
        completion_tokens: mockContent.length / 4,
        total_tokens: (prompt.length + mockContent.length) / 4,
      },
    };
  }

  // Generate different mock content based on model
  private getMockContentForModel(model: string, topic: string): string {
    const modelType = model.includes('haiku') 
      ? 'concise' 
      : model.includes('opus') 
        ? 'comprehensive' 
        : 'balanced';

    if (modelType === 'concise') {
      return `# ${topic}\n\nA brief overview of ${topic} highlighting the most important aspects to consider.\n\n## Key Points\n\n- ${topic} has become increasingly important in today's context\n- Several factors contribute to the significance of ${topic}\n- Understanding ${topic} can lead to better outcomes\n\n## Conclusion\n\nIn summary, ${topic} represents an important area that deserves attention and further exploration.`;
    } else if (modelType === 'comprehensive') {
      return `# ${topic}: A Comprehensive Analysis\n\n## Introduction\n\n${topic} represents one of the most fascinating areas of study in its field, with implications that extend across multiple domains. This analysis aims to provide a thorough examination of ${topic}, its historical context, current applications, and future potential.\n\n## Historical Context\n\nThe development of ${topic} can be traced back through several distinct phases of evolution. Initially conceptualized as a response to growing needs in the field, ${topic} has undergone significant refinement and expansion over time.\n\n## Current Applications\n\n${topic} finds application in numerous contexts, including:\n\n1. **Primary Application Area** - Detailed examination of how ${topic} addresses key challenges\n2. **Secondary Application Area** - Analysis of additional use cases and implementation strategies\n3. **Emerging Application Area** - Exploration of new directions and innovative approaches\n\n## Theoretical Framework\n\nThe conceptual foundations of ${topic} rest on several key principles that provide structure and coherence to its application. These principles include:\n\n- **Core Principle One** - Explanation and implications\n- **Core Principle Two** - Explanation and implications\n- **Core Principle Three** - Explanation and implications\n\n## Future Directions\n\nAs ${topic} continues to evolve, several promising avenues for future development emerge:\n\n- Potential integration with complementary fields\n- Technological advancements that may enhance implementation\n- Addressing current limitations and challenges\n\n## Conclusion\n\nThis comprehensive analysis demonstrates the significance and potential of ${topic}. By understanding its historical context, current applications, theoretical framework, and future directions, stakeholders can better leverage ${topic} to address complex challenges and create valuable solutions.`;
    } else {
      return `# ${topic}\n\n## Introduction\n\n${topic} has emerged as an important area of focus, combining theoretical insights with practical applications. This article explores the key aspects of ${topic} and its relevance in contemporary contexts.\n\n## Background\n\nUnderstanding the evolution of ${topic} provides essential context for appreciating its current significance. Over time, ${topic} has developed from initial concepts into a robust framework with diverse applications.\n\n## Key Components\n\n${topic} can be understood through several critical components:\n\n1. **Primary Component** - Details and significance\n2. **Secondary Component** - Details and significance\n3. **Supporting Component** - Details and significance\n\n## Practical Applications\n\nThe value of ${topic} becomes apparent when examining its applications:\n\n- Application in primary context\n- Application in secondary context\n- Emerging applications\n\n## Challenges and Opportunities\n\nWhile ${topic} offers significant benefits, several challenges and opportunities warrant consideration:\n\n- Current limitations and approaches to address them\n- Opportunities for enhancement and expansion\n- Future directions for research and development\n\n## Conclusion\n\n${topic} represents a valuable area for continued exploration and application. By addressing current challenges and leveraging emerging opportunities, ${topic} can deliver increasing value in various contexts.`;
    }
  }

  // Get a list of available models
  public getAvailableModels() {
    return availableModels;
  }

  // Get content presets
  public getContentPresets() {
    return contentPresets;
  }

  // Get presets by content type
  public getPresetsByType(type: string) {
    return contentPresets.filter(preset => preset.type === type);
  }
}

// Export singleton instance
export default new OpenRouterService();