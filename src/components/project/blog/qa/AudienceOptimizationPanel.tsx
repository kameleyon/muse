import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { FactCheckResult } from '@/store/projectWorkflowStore';

interface AudienceOptimizationPanelProps {
  onRunReadabilityCheck: () => void;
  onRunAudienceCheck: () => void;
  onRunFactCheck: () => void;
  readabilityStatus: string | null;
  audienceAlignmentStatus: string | null;
  factCheckResults: FactCheckResult[];
  isLoading: boolean;
}

const AudienceOptimizationPanel: React.FC<AudienceOptimizationPanelProps> = ({
  onRunReadabilityCheck,
  onRunAudienceCheck,
  onRunFactCheck,
  readabilityStatus,
  audienceAlignmentStatus,
  factCheckResults,
  isLoading
}) => {
  // Get readability metrics based on status
  const getReadabilityMetrics = () => {
    if (!readabilityStatus || readabilityStatus === 'Running') return null;
    
    const metrics = {
      'Good': {
        score: 'A',
        level: 'Grade 7-8',
        fleschScore: 68,
        avgSentenceLength: 16,
        color: 'text-green-600'
      },
      'Fair': {
        score: 'B',
        level: 'Grade 9-10',
        fleschScore: 58,
        avgSentenceLength: 19,
        color: 'text-yellow-600'
      },
      'Needs Improvement': {
        score: 'C',
        level: 'Grade 11-12',
        fleschScore: 49,
        avgSentenceLength: 22,
        color: 'text-red-600'
      }
    };
    
    return metrics[readabilityStatus as keyof typeof metrics] || null;
  };
  
  const readabilityMetrics = getReadabilityMetrics();

  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold font-heading text-secondary mb-4">Audience Optimization</h3>
      
      <div className="space-y-6">
        {/* Readability Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-neutral-dark">Readability Analysis</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRunReadabilityCheck}
              disabled={isLoading || readabilityStatus === 'Running'}
            >
              {readabilityStatus === 'Running' ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Readability'
              )}
            </Button>
          </div>
          
          {readabilityMetrics ? (
            <div className="bg-neutral-light/10 p-3 rounded-md">
              <div className="flex items-center gap-3 mb-3">
                <div className={`text-2xl font-bold ${readabilityMetrics.color}`}>
                  {readabilityMetrics.score}
                </div>
                <div>
                  <div className="text-sm font-medium">Reading Level: {readabilityMetrics.level}</div>
                  <div className="text-xs text-neutral-muted">Flesch Reading Ease: {readabilityMetrics.fleschScore}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-neutral-muted">Avg. Sentence Length</div>
                  <div className="font-medium">{readabilityMetrics.avgSentenceLength} words</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-muted">Complex Words</div>
                  <div className="font-medium">12%</div>
                </div>
              </div>
              
              {readabilityStatus !== 'Good' && (
                <Button 
                  className="w-full mt-3" 
                  size="sm"
                >
                  Simplify Content
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-neutral-light/10 p-3 rounded-md text-center py-4">
              <p className="text-sm text-neutral-muted">
                {readabilityStatus === 'Running' 
                  ? 'Analyzing readability...' 
                  : 'Run readability check to see how accessible your content is to your target audience.'}
              </p>
            </div>
          )}
        </div>
        
        {/* Audience Alignment Section */}
        <div className="space-y-3 pt-4 border-t border-neutral-light">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-neutral-dark">Audience Alignment</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRunAudienceCheck}
              disabled={isLoading || audienceAlignmentStatus === 'Running'}
            >
              {audienceAlignmentStatus === 'Running' ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Alignment'
              )}
            </Button>
          </div>
          
          {audienceAlignmentStatus && audienceAlignmentStatus !== 'Running' ? (
            <div className="bg-neutral-light/10 p-3 rounded-md">
              <div className="flex items-center gap-3 mb-3">
                <div className={`text-xl font-bold ${
                  audienceAlignmentStatus === 'Well Aligned' ? 'text-green-600' : 
                  audienceAlignmentStatus === 'Partially Aligned' ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {audienceAlignmentStatus}
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Topic Relevance</span>
                  <span className={audienceAlignmentStatus === 'Well Aligned' ? 'text-green-600' : 'text-yellow-600'}>
                    {audienceAlignmentStatus === 'Well Aligned' ? 'High' : 'Medium'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Addressing Pain Points</span>
                  <span className={audienceAlignmentStatus === 'Well Aligned' ? 'text-green-600' : 'text-yellow-600'}>
                    {audienceAlignmentStatus === 'Well Aligned' ? 'Strong' : 'Moderate'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Meeting Objectives</span>
                  <span className={audienceAlignmentStatus === 'Well Aligned' ? 'text-green-600' : 'text-red-600'}>
                    {audienceAlignmentStatus === 'Well Aligned' ? 'Yes' : 'Partially'}
                  </span>
                </div>
              </div>
              
              {audienceAlignmentStatus !== 'Well Aligned' && (
                <Button 
                  className="w-full" 
                  size="sm"
                >
                  Improve Audience Alignment
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-neutral-light/10 p-3 rounded-md text-center py-4">
              <p className="text-sm text-neutral-muted">
                {audienceAlignmentStatus === 'Running' 
                  ? 'Analyzing audience alignment...' 
                  : 'Check how well your content aligns with your target audience.'}
              </p>
            </div>
          )}
        </div>
        
        {/* Fact Checking Section */}
        <div className="space-y-3 pt-4 border-t border-neutral-light">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-neutral-dark">Fact Verification</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRunFactCheck}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Facts'
              )}
            </Button>
          </div>
          
          {factCheckResults.length > 0 ? (
            <div className="space-y-2">
              {factCheckResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md border-l-2 ${
                    result.verified ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={result.verified ? 'text-green-500' : 'text-red-500'}>
                      {result.verified ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {result.claim}
                      </div>
                      {result.explanation && (
                        <div className="text-xs text-neutral-muted mt-1">
                          {result.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {factCheckResults.some(result => !result.verified) && (
                <Button 
                  className="w-full mt-2" 
                  size="sm"
                >
                  Correct Inaccuracies
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-neutral-light/10 p-3 rounded-md text-center py-4">
              <p className="text-sm text-neutral-muted">
                {isLoading 
                  ? 'Verifying factual claims...' 
                  : 'Verify the accuracy of factual claims in your content.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AudienceOptimizationPanel;
