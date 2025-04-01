import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lightbulb, CheckSquare, Loader2, RefreshCw, ArrowRight } from 'lucide-react';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import * as qaService from '@/services/qaService';

// Define Suggestion type (matching ProjectArea state)
type Suggestion = { id: string; text: string; impact: string; effort: string; type?: string; details?: string; };

// Define Props
interface RefinementPanelProps {
  suggestions: Suggestion[];
  onImplement: (id: string) => void;
  onCompare: (id: string) => void;
  onPolish: () => void;
  isLoading: boolean;
}

const RefinementPanel: React.FC<RefinementPanelProps> = ({
  suggestions: propSuggestions = [],
  onImplement,
  onCompare,
  onPolish,
  isLoading: propIsLoading
}) => {
  const [localSuggestions, setLocalSuggestions] = useState<Suggestion[]>([]);
  const [localIsLoading, setLocalIsLoading] = useState<boolean>(false);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<{ original: string; improved: string; differences: string[] } | null>(null);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  
  // Get project ID and editor content from store
  const { projectId, editorContent, setEditorContent } = useProjectWorkflowStore();
  const dispatch = useDispatch();
  
  // Use either local state or props (for backward compatibility)
  const displaySuggestions = localSuggestions.length > 0 ? localSuggestions : propSuggestions;
  const displayIsLoading = localIsLoading || propIsLoading;
  
  // Load suggestions on mount if we have a project ID and content
  useEffect(() => {
    if (projectId && editorContent && displaySuggestions.length === 0 && !displayIsLoading) {
      loadSuggestions();
    }
  }, [projectId, editorContent]);
  
  const loadSuggestions = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for analysis'
      }));
      return;
    }
    
    setLocalIsLoading(true);
    setActiveOperation('suggestions');
    
    try {
      const suggestions = await qaService.getImprovementSuggestions(projectId, editorContent);
      setLocalSuggestions(suggestions);
      
      dispatch(addToast({
        type: 'success',
        message: `Generated ${suggestions.length} improvement suggestions`
      }));
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to generate suggestions'
      }));
      
      setLocalSuggestions([{
        id: `error-${Date.now()}`,
        text: `Error generating suggestions: ${error instanceof Error ? error.message : String(error)}`,
        impact: 'Medium',
        effort: 'Medium'
      }]);
    } finally {
      setLocalIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const handleImplementSuggestion = async (id: string) => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available to modify'
      }));
      return;
    }
    
    setLocalIsLoading(true);
    setActiveOperation('implement');
    setSelectedSuggestionId(id);
    
    try {
      const updatedContent = await qaService.implementSuggestion(projectId, id, editorContent);
      
      // Update the editor content
      setEditorContent(updatedContent);
      
      dispatch(addToast({
        type: 'success',
        message: 'Suggestion implemented successfully'
      }));
      
      // Also call the original handler for backward compatibility
      onImplement(id);
    } catch (error) {
      console.error('Failed to implement suggestion:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to implement suggestion'
      }));
    } finally {
      setLocalIsLoading(false);
      setActiveOperation(null);
      setSelectedSuggestionId(null);
    }
  };
  
  const handleCompareSuggestion = async (id: string) => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available to compare'
      }));
      return;
    }
    
    setLocalIsLoading(true);
    setActiveOperation('compare');
    setSelectedSuggestionId(id);
    setComparisonData(null);
    
    try {
      const comparison = await qaService.compareSuggestion(projectId, id, editorContent);
      setComparisonData(comparison);
      
      // Also call the original handler for backward compatibility
      onCompare(id);
    } catch (error) {
      console.error('Failed to compare suggestion:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Failed to compare suggestion'
      }));
    } finally {
      setLocalIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const handleRunFinalPolish = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available to polish'
      }));
      return;
    }
    
    setLocalIsLoading(true);
    setActiveOperation('polish');
    
    try {
      const { content, result } = await qaService.applyFinalPolish(projectId, editorContent);
      
      // Update the editor content
      setEditorContent(content);
      
      dispatch(addToast({
        type: result.status === 'Completed' ? 'success' : 'error',
        message: result.status === 'Completed' 
          ? `Polish complete: Fixed ${result.issues.fixed} issues` 
          : 'Polish failed'
      }));
      
      // Also call the original handler for backward compatibility
      onPolish();
    } catch (error) {
      console.error('Final polish failed:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Final polish failed'
      }));
    } finally {
      setLocalIsLoading(false);
      setActiveOperation(null);
    }
  };
  
  const closeComparison = () => {
    setComparisonData(null);
    setSelectedSuggestionId(null);
  };
  
  const getImpactClass = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-neutral-medium';
      default: return 'text-neutral-medium';
    }
  };
  
  const getEffortClass = (effort: string) => {
    switch (effort.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-neutral-medium';
    }
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2 flex justify-between items-center">
        <span>Refinement Recommendations</span>
        {!displayIsLoading && !comparisonData && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={loadSuggestions}
            title="Refresh suggestions"
            disabled={!projectId || !editorContent}
          >
            <RefreshCw size={14} />
          </Button>
        )}
      </h4>
      
      {displayIsLoading && (
        <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-neutral-dark">
              {activeOperation === 'suggestions' && 'Generating suggestions...'}
              {activeOperation === 'implement' && 'Implementing suggestion...'}
              {activeOperation === 'compare' && 'Comparing versions...'}
              {activeOperation === 'polish' && 'Applying final polish...'}
              {!activeOperation && 'Processing...'}
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Comparison View */}
        {comparisonData && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium text-sm">Suggestion Comparison</h5>
              <Button variant="ghost" size="sm" onClick={closeComparison} className="h-6 w-6 p-0">
                <ArrowRight size={14} />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2 border rounded-md bg-white/50">
                <h6 className="font-medium mb-1">Original</h6>
                <p className="text-neutral-medium whitespace-pre-wrap">{comparisonData.original}</p>
              </div>
              
              <div className="p-2 border rounded-md bg-green-50/50">
                <h6 className="font-medium mb-1">Improved</h6>
                <p className="text-neutral-medium whitespace-pre-wrap">{comparisonData.improved}</p>
              </div>
            </div>
            
            <div className="mt-3 p-2 border rounded-md bg-white/50">
              <h6 className="font-medium mb-1">Changes</h6>
              <ul className="text-xs space-y-1">
                {comparisonData.differences.map((diff, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="mt-0.5">•</span>
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-end mt-3">
              <Button 
                variant="primary" 
                size="sm" 
                className="text-xs text-white"
                onClick={() => selectedSuggestionId && handleImplementSuggestion(selectedSuggestionId)}
                disabled={!selectedSuggestionId}
              >
                Apply Changes
              </Button>
            </div>
          </div>
        )}
        
        {!comparisonData && (
          <>
            {/* AI Suggestions */}
            <div>
              <label className="settings-label flex items-center gap-1 mb-2"><Lightbulb size={14}/> AI Suggestions</label>
              {displaySuggestions.length === 0 && !displayIsLoading ? (
                <div className="text-center text-neutral-medium italic p-4">
                  <p className="mb-4">No suggestions available.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadSuggestions}
                    disabled={!projectId || !editorContent}
                  >
                    Generate Suggestions
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                  {displaySuggestions.map(sug => (
                    <li key={sug.id} className="p-2 border rounded-md bg-white/50 text-xs">
                      <p className="mb-1">{sug.text}</p>
                      <div className="flex justify-between items-center text-neutral-medium">
                        <span className="text-[10px] uppercase">
                          <span className={getImpactClass(sug.impact)}>IMPACT: {sug.impact}</span> | 
                          <span className={getEffortClass(sug.effort)}> EFFORT: {sug.effort}</span>
                        </span>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs p-0 h-auto text-primary hover:bg-primary/10" 
                            onClick={() => handleImplementSuggestion(sug.id)} 
                            disabled={displayIsLoading}
                          >
                            Implement
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs p-0 h-auto text-neutral-dark hover:bg-neutral-light/50" 
                            onClick={() => handleCompareSuggestion(sug.id)} 
                            disabled={displayIsLoading}
                          >
                            Compare
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Final Polishing */}
            <div>
              <label className="settings-label flex items-center gap-1 mb-2"><CheckSquare size={14}/> Final Polish</label>
              <p className="text-xs text-neutral-medium mb-2">Run consistency checks and final proofreading.</p>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full" 
                onClick={handleRunFinalPolish} 
                disabled={displayIsLoading || !editorContent}
              >
                {activeOperation === 'polish' ? <Loader2 size={14} className="animate-spin mr-1"/> : null}
                Run Final Polish
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

// Export the component
export default RefinementPanel;