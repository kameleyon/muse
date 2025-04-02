import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader2 } from 'lucide-react';

interface SEOPanelProps {
  onRunSEOCheck: () => void;
  seoStatus: string | null;
  isLoading: boolean;
}

const SEOPanel: React.FC<SEOPanelProps> = ({
  onRunSEOCheck,
  seoStatus,
  isLoading
}) => {
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  
  // SEO score based on status
  const getSEOScore = () => {
    if (!seoStatus) return null;
    
    switch (seoStatus) {
      case 'Optimized':
        return { score: 86, color: 'text-green-600' };
      case 'Partially Optimized':
        return { score: 72, color: 'text-yellow-600' };
      case 'Needs Improvement':
        return { score: 58, color: 'text-red-600' };
      case 'Running':
        return { score: '...', color: 'text-blue-600' };
      default:
        return null;
    }
  };
  
  const seoScore = getSEOScore();

  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold font-heading text-secondary mb-3">SEO Optimization</h3>
      
      <div className="space-y-5">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-neutral-dark block mb-1">Focus Keyword</label>
            <Input
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="Primary keyword or phrase"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-neutral-dark block mb-1">Secondary Keywords</label>
            <Input
              value={secondaryKeywords}
              onChange={(e) => setSecondaryKeywords(e.target.value)}
              placeholder="Comma-separated list of secondary keywords"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-neutral-dark block mb-1">SEO Title</label>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Optimized title for search engines"
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-neutral-muted">Recommended: 50-60 characters</span>
              <span className={`text-xs ${seoTitle.length > 60 ? 'text-red-500' : 'text-neutral-muted'}`}>
                {seoTitle.length}/60
              </span>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-neutral-dark block mb-1">Meta Description</label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Brief description for search engine results"
              rows={3}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-neutral-muted">Recommended: 150-160 characters</span>
              <span className={`text-xs ${metaDescription.length > 160 ? 'text-red-500' : 'text-neutral-muted'}`}>
                {metaDescription.length}/160
              </span>
            </div>
          </div>
          
          <Button
            onClick={onRunSEOCheck}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing SEO...
              </>
            ) : (
              'Run SEO Analysis'
            )}
          </Button>
        </div>
        
        {(seoStatus && seoStatus !== 'Running') && (
          <div className="pt-4 border-t border-neutral-light space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-neutral-dark">SEO Score</h4>
              {seoScore && (
                <div className={`text-xl font-bold ${seoScore.color}`}>
                  {seoScore.score}/100
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="seo-checklist-item">
                <div className={`flex-shrink-0 ${
                  seoStatus === 'Optimized' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {seoStatus === 'Optimized' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="text-sm">Keyword Usage</div>
                  <div className="text-xs text-neutral-muted">
                    {seoStatus === 'Optimized' 
                      ? 'Optimal keyword density and placement.' 
                      : 'Improve keyword usage in headings and first paragraph.'}
                  </div>
                </div>
              </div>
              
              <div className="seo-checklist-item">
                <div className={`flex-shrink-0 ${
                  seoStatus === 'Optimized' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {seoStatus === 'Optimized' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="text-sm">Title & Meta Description</div>
                  <div className="text-xs text-neutral-muted">
                    {seoStatus === 'Optimized' 
                      ? 'Well-optimized title and meta description.' 
                      : 'Title or meta description needs improvement.'}
                  </div>
                </div>
              </div>
              
              <div className="seo-checklist-item">
                <div className={`flex-shrink-0 ${
                  seoStatus === 'Optimized' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {seoStatus === 'Optimized' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="text-sm">Heading Structure</div>
                  <div className="text-xs text-neutral-muted">
                    {seoStatus === 'Optimized' 
                      ? 'Good heading hierarchy and organization.' 
                      : 'Heading structure needs improvement.'}
                  </div>
                </div>
              </div>
              
              <div className="seo-checklist-item">
                <div className={`flex-shrink-0 ${
                  seoStatus === 'Optimized' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {seoStatus === 'Optimized' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="text-sm">Internal Links & Media</div>
                  <div className="text-xs text-neutral-muted">
                    {seoStatus === 'Optimized' 
                      ? 'Good use of internal links and optimized images.' 
                      : 'Add more internal links and optimize images.'}
                  </div>
                </div>
              </div>
            </div>
            
            {seoStatus !== 'Optimized' && (
              <Button className="w-full">
                Apply SEO Improvements
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SEOPanel;
