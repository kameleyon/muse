import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addToast } from '@/store/slices/uiSlice';
import openRouterService from '@/services/ai/openrouter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Form, FormGroup, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ResearchPanelProps {
  onAddToContent?: (text: string) => void;
}

/**
 * Research Panel component for fact-checking and web research
 * Uses the GPT-4o Search model for up-to-date information
 */
const ResearchPanel: React.FC<ResearchPanelProps> = ({ onAddToContent }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Handle research query
  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      setSearchProgress(0);

      // Generate research question
      const prompt = `
      I need factual information about: "${query}"
      
      Please search the web for accurate, up-to-date information on this topic.
      Provide a well-structured response with:
      1. A comprehensive answer with verified facts
      2. Citations to authoritative sources where appropriate
      3. Any relevant dates or statistics
      
      If there are conflicting viewpoints, please present them fairly.
      `;

      // Research model (gpt-4o-search-preview)
      const researchModel = openRouterService.getAvailableModels().find(
        model => model.category === 'research'
      )?.id || 'openai/gpt-4o-search-preview';

      // Generate content with progress tracking
      const response = await openRouterService.generateContent({
        prompt,
        model: researchModel,
        maxTokens: 1500,
        temperature: 0.3,
        systemPrompt: "You are a research assistant with access to the latest information. Your task is to provide accurate, factual information with proper citations.",
        onProgress: (progress) => setSearchProgress(progress)
      });

      // Get generated content
      const result = response.choices[0]?.message?.content || '';
      setSearchResults(result);
      
      // Add to search history
      setSearchHistory([query, ...searchHistory.slice(0, 4)]);
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Research completed successfully',
        })
      );
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to conduct research',
        })
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Handle adding research to content
  const handleAddToContent = () => {
    if (onAddToContent && searchResults) {
      onAddToContent(searchResults);
      dispatch(
        addToast({
          type: 'success',
          message: 'Research added to content',
        })
      );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Research & Fact Check</CardTitle>
        <CardDescription>
          Search the web for accurate, up-to-date information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleResearch}>
          <FormGroup>
            <FormLabel htmlFor="query">Research Query</FormLabel>
            <div className="flex gap-2">
              <Input
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a topic to research..."
                disabled={isSearching}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isSearching || !query.trim()}
                isLoading={isSearching}
              >
                {isSearching ? `${Math.round(searchProgress)}%` : 'Research'}
              </Button>
            </div>
          </FormGroup>
        </Form>

        {searchHistory.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Recent Searches</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  className="text-xs bg-neutral-light/30 dark:bg-neutral-dark/30 text-neutral-medium px-2 py-1 rounded-full hover:bg-neutral-light/50 dark:hover:bg-neutral-dark/50"
                  onClick={() => setQuery(item)}
                  disabled={isSearching}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Results</p>
          <div 
            className={`bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark rounded-md p-4 h-[280px] overflow-y-auto ${
              isSearching ? 'animate-pulse' : ''
            }`}
          >
            {isSearching ? (
              <div className="flex flex-col space-y-4">
                <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-3/4"></div>
                <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-1/2"></div>
                <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-5/6"></div>
                <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-2/3"></div>
              </div>
            ) : searchResults ? (
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm">{searchResults}</pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-neutral-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-center">
                  Enter a topic to search for factual information
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {searchResults && onAddToContent && (
        <CardFooter>
          <Button onClick={handleAddToContent} className="w-full">
            Add to Content
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ResearchPanel;
