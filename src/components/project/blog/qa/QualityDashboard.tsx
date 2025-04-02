import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { QualityMetrics, Suggestion } from '@/store/projectWorkflowStore';

interface QualityDashboardProps {
  metrics: QualityMetrics | null;
  isLoading: boolean;
  suggestions?: Suggestion[];
  onImplementSuggestion?: (id: string) => void;
  onRunFinalPolish?: () => void;
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({
  metrics,
  isLoading,
  suggestions = [],
  onImplementSuggestion,
  onRunFinalPolish
}) => {
  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold font-heading text-secondary mb-3">Quality Assessment</h3>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-neutral-muted">Analyzing content quality...</p>
        </div>
      ) : !metrics ? (
        <div className="text-center py-8">
          <div className="text-neutral-muted mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h4 className="text-base font-medium text-neutral-dark mb-2">Quality Assessment</h4>
          <p className="text-sm text-neutral-muted mb-4">
            Run content quality analysis to get scores and improvement suggestions.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex justify-center mb-2">
            <div className="quality-score flex items-center justify-center">
              {metrics.overallScore}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-neutral-dark mb-2">Category Scores</h4>
            <div className="space-y-3">
              {metrics.categories.map((category, index) => (
                <div key={index} className="quality-category">
                  <div className="quality-category-title mb-1">
                    {category.name}
                    <span className="quality-category-score">{category.score}</span>
                  </div>
                  <div className="w-full bg-neutral-light/30 rounded-full h-1.5">
                    <div 
                      className="bg-primary rounded-full h-1.5" 
                      style={{ width: `${category.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {metrics.issues && metrics.issues.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-neutral-dark mb-2">Potential Issues</h4>
              <div className="space-y-2">
                {metrics.issues.map((issue, index) => (
                  <div 
                    key={index}
                    className={`p-2 rounded-md text-sm ${
                      issue.severity === 'warning' 
                        ? 'bg-yellow-50 border-l-2 border-yellow-500' 
                        : 'bg-blue-50 border-l-2 border-blue-500'
                    }`}
                  >
                    {issue.text}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {suggestions && suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-neutral-dark mb-2">Improvement Suggestions</h4>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id}
                    className="p-3 bg-neutral-light/10 rounded-md border border-neutral-light"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm">{suggestion.text}</div>
                      <div className="flex items-center space-x-1 text-xs">
                        <span className={`px-1.5 py-0.5 rounded-full ${
                          suggestion.impact === 'High' 
                            ? 'bg-green-100 text-green-800' 
                            : suggestion.impact === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {suggestion.impact} Impact
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-neutral-light/40 text-neutral-dark">
                          {suggestion.effort} Effort
                        </span>
                      </div>
                    </div>
                    
                    {onImplementSuggestion && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7 px-2 flex-1"
                          onClick={() => onImplementSuggestion(suggestion.id)}
                        >
                          Implement
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {onRunFinalPolish && (
            <div className="pt-3 border-t border-neutral-light">
              <Button 
                className="w-full" 
                onClick={onRunFinalPolish}
                disabled={isLoading}
              >
                Run Final Polish
              </Button>
              <p className="text-xs text-neutral-muted text-center mt-2">
                Automatically implement all high-impact, low-effort improvements
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default QualityDashboard;
