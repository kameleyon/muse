import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, Pause, RotateCcw, Download, Loader } from 'lucide-react';
import ContentGenerationPreview from '@/components/project/editing/ContentGenerationPreview';
import * as contentGenerationService from '@/services/contentGenerationService';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';

interface TypingEffectDemoProps {
  initialContent?: string;
  className?: string;
}

/**
 * A demo component for the typing effect
 */
const TypingEffectDemo: React.FC<TypingEffectDemoProps> = ({
  initialContent = '',
  className = ''
}) => {
  const [content, setContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  
  // Get project ID from store
  const { projectId } = useProjectWorkflowStore();
  const dispatch = useDispatch();
  
  // Generate content with typing effect
  const handleGenerate = async () => {
    if (!prompt) {
      dispatch(addToast({
        type: 'warning',
        message: 'Please enter a prompt first'
      }));
      return;
    }
    
    if (!projectId) {
      dispatch(addToast({
        type: 'error',
        message: 'No project ID available'
      }));
      return;
    }
    
    setIsGenerating(true);
    setContent('');
    
    const blocks: string[] = [];
    
    try {
      await contentGenerationService.generateContentWithTypingEffect(
        {
          projectId,
          prompt,
          systemPrompt: 'You are an expert content creator. Generate content in clear, concise blocks. Use markdown formatting for structure.'
        },
        {
          onBlock: (block) => {
            blocks.push(block);
            setContent(blocks.join('\n\n'));
          },
          onComplete: (fullContent) => {
            setContent(fullContent);
            setIsGenerating(false);
            dispatch(addToast({
              type: 'success',
              message: 'Content generation complete'
            }));
          },
          onError: (error) => {
            console.error('Content generation error:', error);
            setIsGenerating(false);
            dispatch(addToast({
              type: 'error',
              message: `Error generating content: ${error instanceof Error ? error.message : String(error)}`
            }));
          }
        }
      );
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      setIsGenerating(false);
      dispatch(addToast({
        type: 'error',
        message: `Error generating content: ${error instanceof Error ? error.message : String(error)}`
      }));
    }
  };
  
  return (
    <Card className={`p-4 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Content Generation with Typing Effect</h2>
      
      <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium mb-1">
          Enter a prompt:
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Enter a prompt for content generation..."
          disabled={isGenerating}
        />
      </div>
      
      <div className="flex justify-between mb-4">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
        >
          {isGenerating ? (
            <>
              <Loader className="animate-spin mr-2" size={16} />
              Generating...
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              Generate with Typing Effect
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setContent('')}
          disabled={isGenerating || !content}
        >
          <RotateCcw size={16} className="mr-2" />
          Clear
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-md border min-h-[300px] max-h-[500px] overflow-y-auto">
        {content ? (
          <ContentGenerationPreview content={content} />
        ) : (
          <div className="text-gray-400 italic">
            Generated content will appear here with a typing effect...
          </div>
        )}
      </div>
    </Card>
  );
};

export default TypingEffectDemo;
