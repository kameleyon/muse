import React from 'react';
import { useSelector } from 'react-redux';
import { Controller, UseFormReturn } from 'react-hook-form';
import { RootState } from '@/store/store';
import { addToast } from '@/store/slices/uiSlice';
import { ContentGeneratorFormData } from '@/types/content';

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

interface ContentGeneratorFormProps {
  form: UseFormReturn<ContentGeneratorFormData>;
  onSubmit: (data: ContentGeneratorFormData) => void;
  dispatch: any;
}

const ContentGeneratorForm: React.FC<ContentGeneratorFormProps> = ({
  form,
  onSubmit,
  dispatch,
}) => {
  const { isGenerating, generationProgress } = useSelector((state: RootState) => state.ui);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
  );
};

export default ContentGeneratorForm;