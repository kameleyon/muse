import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { RootState } from '@/store/store';
import { setGenerating, setGenerationProgress, addToast } from '@/store/slices/uiSlice';
import { addContentItem } from '@/store/slices/contentSlice';
import { contentGeneratorSchema, ContentGeneratorFormData, buildPrompt } from '@/types/content';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';

// Lazy loaded components to reduce initial bundle size
const ContentGeneratorForm = lazy(() => 
  import('@/components/content/generator/ContentGeneratorForm')
);
const ContentGeneratorPreview = lazy(() => 
  import('@/components/content/generator/ContentGeneratorPreview')
);
const ContentExport = lazy(() => 
  import('@/components/content/ContentExport')
);
const ResearchPanel = lazy(() => 
  import('@/components/content/research/ResearchPanel')
);

// Loading placeholder
const LoadingComponent = () => (
  <div className="animate-pulse p-4">
    <div className="h-8 bg-neutral-light dark:bg-neutral-dark rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-2/3 mb-2"></div>
    <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-3/4 mb-2"></div>
  </div>
);

const ContentGenerator: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [showExport, setShowExport] = useState(false);
  const { isGenerating, generationProgress } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get('type');

  const form = useForm<ContentGeneratorFormData>({
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
    if (typeFromUrl && ['blog', 'marketing', 'creative', 'academic', 'social'].includes(typeFromUrl)) {
      form.setValue('type', typeFromUrl);
    }
  }, [typeFromUrl, form]);

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

This is a ${data.tone} ${data.type} about ${data.topic}, generated with MagicMuse.

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
              <Suspense fallback={<LoadingComponent />}>
                <ContentGeneratorForm 
                  form={form} 
                  onSubmit={generateContent} 
                  dispatch={dispatch} 
                />
              </Suspense>
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
              <Suspense fallback={<LoadingComponent />}>
                <ContentGeneratorPreview 
                  content={generatedContent} 
                  isGenerating={isGenerating}
                  onExport={() => setShowExport(true)}
                />
              </Suspense>
            </CardContent>
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
          <Suspense fallback={<LoadingComponent />}>
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
          </Suspense>
        </motion.div>
      </div>
      
      {/* Content Export Modal */}
      {showExport && (
        <Suspense fallback={null}>
          <ContentExport
            content={generatedContent}
            title={form.getValues().topic || "Generated Content"}
            isOpen={showExport}
            onClose={() => setShowExport(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ContentGenerator;