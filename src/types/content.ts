import { z } from 'zod';

// Form schema for content generator
export const contentGeneratorSchema = z.object({
  type: z.string().min(1, 'Content type is required'),
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  tone: z.string().min(1, 'Tone is required'),
  length: z.string().min(1, 'Length is required'),
  keywords: z.string().optional(),
  model: z.string().min(1, 'AI model is required'),
  additionalInstructions: z.string().optional(),
});

export type ContentGeneratorFormData = z.infer<typeof contentGeneratorSchema>;

// Content types that can be generated
export type ContentType = 
  | 'blog' 
  | 'marketing' 
  | 'creative' 
  | 'academic' 
  | 'social';

// Types for content storage
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
  isPrivate: boolean;
  version: number;
}

// Model options
export interface ModelOption {
  value: string;
  label: string;
  description?: string;
  cost?: number;
  speed?: 'fast' | 'medium' | 'slow';
}

// Preset types
export interface ContentPreset {
  id: string;
  name: string;
  description: string;
  contentType: ContentType;
  parameters: {
    model: string;
    tone?: string;
    length?: string;
    promptTemplate?: string;
  };
  isDefault?: boolean;
  isCustom?: boolean;
}

// Function to build specific prompts based on content type
export const buildPrompt = (data: ContentGeneratorFormData): string => {
  const keywordsText = data.keywords 
    ? `Include the following keywords: ${data.keywords.split(',').join(', ').trim()}.` 
    : '';
    
  const additionalText = data.additionalInstructions 
    ? `Additional instructions: ${data.additionalInstructions}` 
    : '';

  let lengthText = '';
  switch (data.length) {
    case 'short':
      lengthText = 'Keep it concise, between 150-300 words.';
      break;
    case 'medium':
      lengthText = 'Write a medium-length piece, between 300-600 words.';
      break;
    case 'long':
      lengthText = 'Create a detailed piece, between 600-1000 words.';
      break;
    case 'comprehensive':
      lengthText = 'Make it comprehensive, with 1000+ words covering the topic in depth.';
      break;
  }

  // Helper function to get content type label
  const getContentTypeLabel = (type: string): string => {
    const contentTypes = [
      { value: 'blog', label: 'Blog Post' },
      { value: 'marketing', label: 'Marketing Copy' },
      { value: 'creative', label: 'Creative Writing' },
      { value: 'academic', label: 'Academic Content' },
      { value: 'social', label: 'Social Media Post' },
    ];
    const contentType = contentTypes.find(t => t.value === type);
    return contentType ? contentType.label.toLowerCase() : type;
  };

  // Base prompt that adapts to the content type
  let prompt = `Create a ${data.tone} ${getContentTypeLabel(data.type)} about "${data.topic}".
${lengthText}
${keywordsText}
${additionalText}`;

  // Specific additions based on content type
  switch (data.type) {
    case 'blog':
      prompt += `
Structure the blog post with:
- An engaging headline
- An introduction that hooks the reader
- 3-5 clearly defined sections with subheadings
- A conclusion with a call to action
Format the output as markdown.`;
      break;
    case 'marketing':
      prompt += `
Structure the marketing copy with:
- An attention-grabbing headline
- Clear value propositions
- Persuasive elements that address customer pain points
- A strong, compelling call to action
Format the output as markdown.`;
      break;
    case 'creative':
      prompt += `
Make it creative, engaging, and original with:
- Strong narrative elements
- Vivid imagery and descriptions
- Engaging characters or concepts
- A satisfying conclusion
Format the output as markdown.`;
      break;
    case 'academic':
      prompt += `
Structure the academic content with:
- A clear thesis or research question
- Well-organized arguments supported by evidence
- Logical flow between points
- A conclusive summary that reinforces the main points
Format the output as markdown with proper citations where appropriate.`;
      break;
    case 'social':
      prompt += `
Optimize this social media post for engagement with:
- Attention-grabbing opening
- Concise and clear messaging
- A call to action or question to encourage interaction
- Strategic use of emoji where appropriate (but not excessive)
Format the output as plain text.`;
      break;
  }

  return prompt;
};
