import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootState } from '@/store/store';
import { setGenerating, setGenerationProgress, addToast } from '@/store/slices/uiSlice';
import { addContentItem } from '@/store/slices/contentSlice';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import {
  Form,
  FormGroup,
  FormLabel,
  FormError,
  FormHint,
  FormActions,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import ModelSelector from '@/components/content/generation/ModelSelector';
import PresetSelector from '@/components/content/generation/PresetSelector';
import ContentExport from '@/components/content/ContentExport';
import ResearchPanel from '@/components/content/research/ResearchPanel';

// Content types
const contentTypes = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'marketing', label: 'Marketing Copy' },
  { value: 'creative', label: 'Creative Writing' },
  { value: 'academic', label: 'Academic Content' },
  { value: 'social', label: 'Social Media Post' },
];

// Tone options
const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'humorous', label: 'Humorous' },
];

// Length options
const lengthOptions = [
  { value: 'short', label: 'Short (150-300 words)' },
  { value: 'medium', label: 'Medium (300-600 words)' },
  { value: 'long', label: 'Long (600-1000 words)' },
  { value: 'comprehensive', label: 'Comprehensive (1000+ words)' },
];

// Model options
const modelOptions = [
  { value: 'anthropic/claude-3-haiku-20240307', label: 'Claude 3 Haiku (Fast & Efficient)' },
  { value: 'anthropic/claude-3-sonnet-20240229', label: 'Claude 3 Sonnet (Balanced)' },
  { value: 'anthropic/claude-3-opus-20240229', label: 'Claude 3 Opus (Highest Quality)' },
];

// Form schema
const contentGeneratorSchema = z.object({
  type: z.string().min(1, 'Content type is required'),
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  tone: z.string().min(1, 'Tone is required'),
  length: z.string().min(1, 'Length is required'),
  keywords: z.string().optional(),
  model: z.string().min(1, 'AI model is required'),
  additionalInstructions: z.string().optional(),
});

type ContentGeneratorFormData = z.infer<typeof contentGeneratorSchema>;

// Function to build specific prompts based on content type
const buildPrompt = (data: ContentGeneratorFormData) => {
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

// Helper function to get content type label
const getContentTypeLabel = (type: string): string => {
  const contentType = contentTypes.find(t => t.value === type);
  return contentType ? contentType.label.toLowerCase() : type;
};

const ContentGenerator: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [showExport, setShowExport] = useState(false);
  const { isGenerating, generationProgress } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get('type');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContentGeneratorFormData>({
    resolver: zodResolver(contentGeneratorSchema),
    defaultValues: {
      type: typeFromUrl || 'blog',
      topic: '',
      tone: 'professional',
      length: 'medium',
      keywords: '',
      model: 'anthropic/claude-3-sonnet-20240229',
      additionalInstructions: '',
    },
  });

  // Effect to set type from URL if provided
  useEffect(() => {
    if (typeFromUrl && contentTypes.some(t => t.value === typeFromUrl)) {
      setValue('type', typeFromUrl);
    }
  }, [typeFromUrl, setValue]);

  // Mock function to simulate content generation - in production this would call our API
  const generateContent = async (data: ContentGeneratorFormData) => {
    try {
      dispatch(setGenerating(true));
      
      // Get the full prompt
      const prompt = buildPrompt(data);
      
      // In production, this would be an API call to our backend, which would then call OpenRouter
      // Simulate API call with progress
      const totalSteps = 10;
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise((r) => setTimeout(r, 300));
        dispatch(setGenerationProgress((i / totalSteps) * 100));
      }

      // Generate mock content
      const mockResponseContent = `# ${data.topic}

## Introduction

This is a ${data.tone} ${getContentTypeLabel(data.type)} about ${data.topic}, generated with MagicMuse.

## Main Content

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.

## Second Section

Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.

## Conclusion

In conclusion, this was a demonstration of content generation with MagicMuse. In a real implementation, this would be high-quality AI-generated content from our OpenRouter API integration.`;

      // Set the generated content
      setGeneratedContent(mockResponseContent);
      
      // Add to content store
      const now = new Date().toISOString();
      dispatch(
        addContentItem({
          id: Date.now().toString(),
          title: data.topic,
          content: mockResponseContent,
          type: data.type as any,
          createdAt: now,
          updatedAt: now,
          userId: 'current-user',
          tags: data.keywords ? data.keywords.split(',').map(k => k.trim()) : [],
          isPrivate: true,
          version: 1,
        })
      );
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Content generated successfully!',
        })
      );
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to generate content',
        })
      );
    } finally {
      dispatch(setGenerating(false));
    }
  };

  // Helpful tips based on content type
  const getTipsForContentType = (type: string) => {
    switch (type) {
      case 'blog':
        return 'For effective blog posts, specify a clear target audience and consider including a question to engage readers.';
      case 'marketing':
        return 'Great marketing copy focuses on benefits rather than features. Include your target audience and the key value proposition.';
      case 'creative':
        return 'Be specific about the style, genre, or mood you want to evoke in your creative writing.';
      case 'academic':
        return 'Specify the academic field and any specific formatting guidelines or citation styles you need.';
      case 'social':
        return 'Consider specifying the platform (e.g., Twitter, LinkedIn, Instagram) as each has different optimal content formats.';
      default:
        return 'Provide as much specific detail as possible to get the best results.';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Content Generator</h1>
        <p className="text-neutral-medium max-w-3xl">
          Create professional, creative, and engaging content in seconds with our AI-powered
          content generator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Generation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>What would you like to create?</CardTitle>
              <CardDescription>
                Configure your content generation settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form onSubmit={handleSubmit(generateContent)}>
                <FormGroup>
                  <FormLabel htmlFor="type" required>
                    Content Type
                  </FormLabel>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        id="type"
                        options={contentTypes}
                        error={errors.type?.message}
                        disabled={isGenerating}
                        {...field}
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="topic" required>
                    Topic
                  </FormLabel>
                  <Input
                    id="topic"
                    placeholder="Enter the main topic or subject"
                    error={errors.topic?.message}
                    disabled={isGenerating}
                    {...register('topic')}
                  />
                </FormGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup>
                    <FormLabel htmlFor="tone" required>
                      Tone
                    </FormLabel>
                    <Controller
                      control={control}
                      name="tone"
                      render={({ field }) => (
                        <Select
                          id="tone"
                          options={toneOptions}
                          error={errors.tone?.message}
                          disabled={isGenerating}
                          {...field}
                        />
                      )}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="length" required>
                      Length
                    </FormLabel>
                    <Controller
                      control={control}
                      name="length"
                      render={({ field }) => (
                        <Select
                          id="length"
                          options={lengthOptions}
                          error={errors.length?.message}
                          disabled={isGenerating}
                          {...field}
                        />
                      )}
                    />
                  </FormGroup>
                </div>

                <FormGroup>
                  <FormLabel htmlFor="keywords">
                    Keywords (comma separated)
                  </FormLabel>
                  <Input
                    id="keywords"
                    placeholder="product, benefits, features"
                    error={errors.keywords?.message}
                    disabled={isGenerating}
                    {...register('keywords')}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="model" required>
                    AI Model
                  </FormLabel>
                  <Controller
                    control={control}
                    name="model"
                    render={({ field }) => (
                      <ModelSelector
                        selectedModel={field.value}
                        onSelect={(model) => field.onChange(model)}
                        disabled={isGenerating}
                      />
                    )}
                  />
                  <FormHint>
                    Higher quality models may take longer to generate content but produce better results.
                  </FormHint>
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="additionalInstructions">
                    Additional Instructions
                  </FormLabel>
                  <textarea
                    id="additionalInstructions"
                    className="w-full px-3 py-2 rounded-md border border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark text-secondary dark:text-neutral-white focus:outline-none focus:ring-2 focus:ring-accent-teal transition-all duration-200 h-24 resize-y"
                    placeholder="Any specific requirements or guidelines..."
                    disabled={isGenerating}
                    {...register('additionalInstructions')}
                  />
                </FormGroup>

                <div className="mt-6 border-t border-neutral-light dark:border-neutral-dark pt-6">
                  <PresetSelector
                    contentType={control._formValues.type}
                    selectedPreset={null}
                    onSelect={(preset) => {
                      // Apply preset settings
                      setValue('model', preset.parameters.model);
                      setValue('tone', preset.parameters.tone || 'professional');
                      setValue('length', preset.parameters.length || 'medium');
                      // Show success message
                      dispatch(
                        addToast({
                          type: 'success',
                          message: `Applied "${preset.name}" preset`,
                        })
                      );
                    }}
                    disabled={isGenerating}
                  />
                </div>
                
                <div className="p-4 mt-4 bg-neutral-light/20 dark:bg-neutral-dark/50 rounded-md">
                  <h3 className="font-medium mb-2">Tips:</h3>
                  <p className="text-sm text-neutral-medium">
                    {getTipsForContentType(control._formValues.type)}
                  </p>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={isGenerating}
                    disabled={isGenerating}
                  >
                    {isGenerating
                      ? `Generating... ${Math.round(generationProgress)}%`
                      : 'Generate Content'}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Content Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                {generatedContent
                  ? 'Your generated content is ready'
                  : 'Content will appear here after generation'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark rounded-md p-4 min-h-[400px] max-h-[600px] overflow-y-auto ${
                  isGenerating ? 'animate-pulse' : ''
                }`}
              >
                {isGenerating ? (
                  <div className="flex flex-col space-y-4">
                    <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-1/2"></div>
                    <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-5/6"></div>
                    <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-2/3"></div>
                    <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-1/2"></div>
                    <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-5/6"></div>
                  </div>
                ) : generatedContent ? (
                  <div className="prose dark:prose-invert max-w-none">
                    {/* In a real app, we'd use a markdown renderer here */}
                    <pre className="whitespace-pre-wrap font-sans">{generatedContent}</pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-neutral-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <p className="text-center">
                      Fill out the form and click "Generate Content" to create
                      your content
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            {generatedContent && (
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    // In a real app, this would copy the content to clipboard
                    navigator.clipboard.writeText(generatedContent);
                    dispatch(
                      addToast({
                        type: 'success',
                        message: 'Content copied to clipboard',
                      })
                    );
                  }}
                >
                  Copy
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowExport(true)}
                  >
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // In a real app, this would save the content to the library
                      dispatch(
                        addToast({
                          type: 'success',
                          message: 'Content saved to library',
                        })
                      );
                      navigate('/library');
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      // In a real app, this would edit the content
                      // For now, just navigate to the library
                      navigate('/library');
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
      
      {/* Research Panel */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold font-heading mb-4">Research & Fact Check</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <ResearchPanel
            onAddToContent={(researchText) => {
              // Append research text to the generated content
              if (generatedContent) {
                const combinedContent = `${generatedContent}\n\n## Research Notes\n\n${researchText}`;
                setGeneratedContent(combinedContent);
              } else {
                setGeneratedContent(researchText);
              }
            }}
          />
        </motion.div>
      </div>
      
      {/* Content Export Modal */}
      <ContentExport
        content={generatedContent}
        title={control._formValues.topic || "Generated Content"}
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
};

export default ContentGenerator;
