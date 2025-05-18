import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { useProjectWorkflowStore, Suggestion, FactCheckResult as FactCheckResultType } from '@/store/projectWorkflowStore'; // Import FactCheckResultType
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
// Import the actual service functions
import {
  runQualityCheck,
  verifyFacts,
  runFinancialCheck,
  regenerateWithSuggestions
} from '@/services/contentGenerationService';

// Define result types based on service function return types (or shared types if available)
// These might need adjustment if the actual API response differs from the service stubs
type QualityCheckResult = Awaited<ReturnType<typeof runQualityCheck>>;
// FactCheckResultType is already imported from the store
type FinancialCheckResult = Awaited<ReturnType<typeof runFinancialCheck>>;

export const ComprehensiveQAPanel: React.FC = () => {
  const dispatch = useDispatch();
  // Get necessary state and setters from the store
  const {
    projectId,
    editorContent,
    setEditorContent,
    generatedContentPreview,
    factCheckResults, // Use existing store state for fact check results
    setFactCheckResults // Use existing store setter
  } = useProjectWorkflowStore();

  // State for check statuses and results (excluding fact check, which uses store)
  const [qualityStatus, setQualityStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [factCheckStatus, setFactCheckStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle'); // Keep local status for button
  const [financialStatus, setFinancialStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');

  const [qualityResult, setQualityResult] = useState<QualityCheckResult | null>(null);
  // Financial result state remains local
  const [financialResult, setFinancialResult] = useState<FinancialCheckResult | null>(null);

  // State for suggestions and selection
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [isRegenerating, setIsRegenerating] = useState(false);

  // --- Real Check Handlers ---

  const handleRunQualityCheck = useCallback(async () => {
    if (!projectId) {
      dispatch(addToast({ type: 'error', message: 'Project ID is missing.' }));
      return;
    }
    setQualityStatus('running');
    setQualityResult(null);
    // Clear only quality suggestions
    setSuggestions(prev => prev.filter(s => s.type !== 'quality'));
    dispatch(addToast({ type: 'info', message: 'Running Quality Check...' }));

    try {
      const contentToCheck = editorContent || generatedContentPreview || '';
      const result = await runQualityCheck(projectId, contentToCheck);
      setQualityResult(result);
      // Add suggestions from the result, ensuring they have unique IDs if needed
      if (result.suggestions) {
         // Ensure suggestions have unique IDs before adding
         const uniqueSuggestions = result.suggestions.map((s, index) => ({
            ...s,
            id: s.id || `q_sug_${Date.now()}_${index}` // Generate ID if missing
         }));
        setSuggestions(prev => [...prev.filter(s => s.type !== 'quality'), ...uniqueSuggestions]);
      }
      setQualityStatus('done');
      dispatch(addToast({ type: 'success', message: 'Quality Check Complete.' }));
    } catch (error) {
      console.error('Quality Check failed:', error);
      setQualityStatus('error');
      dispatch(addToast({ type: 'error', message: `Quality Check failed: ${error instanceof Error ? error.message : 'Unknown error'}` }));
    }
  }, [projectId, editorContent, generatedContentPreview, dispatch]);

  const handleRunFactCheck = useCallback(async () => {
    if (!projectId) {
      dispatch(addToast({ type: 'error', message: 'Project ID is missing.' }));
      return;
    }
    setFactCheckStatus('running');
    setFactCheckResults([]); // Clear results in the store
    // Clear only fact suggestions
    setSuggestions(prev => prev.filter(s => s.type !== 'fact'));
    dispatch(addToast({ type: 'info', message: 'Running Fact Check...' }));

    try {
      const contentToCheck = editorContent || generatedContentPreview || '';
      const results: FactCheckResultType[] = await verifyFacts(projectId, contentToCheck);
      setFactCheckResults(results); // Update the store

      // Generate suggestions based on failed verifications
      const newSuggestions: Suggestion[] = results
        .filter(r => !r.verified && r.claim !== 'Verification Process') // Exclude process errors
        .map((r, i) => ({
          id: `f_sug_${Date.now()}_${i}`, // Ensure unique ID
          text: `Review claim: "${r.claim}". ${r.explanation || 'Verification failed or uncertain.'}`,
          impact: 'High',
          effort: 'Medium',
          type: 'fact'
        }));

      setSuggestions(prev => [...prev.filter(s => s.type !== 'fact'), ...newSuggestions]);
      setFactCheckStatus('done');
      dispatch(addToast({ type: 'success', message: 'Fact Check Complete.' }));
    } catch (error) {
      console.error('Fact Check failed:', error);
      setFactCheckStatus('error');
      // Update store with error state
      setFactCheckResults([{ claim: 'Fact Check Process', verified: false, explanation: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]);
      dispatch(addToast({ type: 'error', message: `Fact Check failed: ${error instanceof Error ? error.message : 'Unknown error'}` }));
    }
  }, [projectId, editorContent, generatedContentPreview, dispatch, setFactCheckResults]);

  const handleRunFinancialCheck = useCallback(async () => {
    if (!projectId) {
      dispatch(addToast({ type: 'error', message: 'Project ID is missing.' }));
      return;
    }
    setFinancialStatus('running');
    setFinancialResult(null);
    // Clear only financial suggestions
    setSuggestions(prev => prev.filter(s => s.type !== 'financial'));
    dispatch(addToast({ type: 'info', message: 'Running Financial Validation...' }));

    try {
      const contentToCheck = editorContent || generatedContentPreview || '';
      if (!contentToCheck.trim()) {
        setFinancialStatus('error');
        dispatch(addToast({ type: 'error', message: 'No content available for financial validation.' }));
        return;
      }
      const result = await runFinancialCheck(projectId, contentToCheck);
      setFinancialResult(result);
       // Add suggestions from the result, ensuring they have unique IDs if needed
      if (result.suggestions) {
         // Ensure suggestions have unique IDs before adding
         const uniqueSuggestions = result.suggestions.map((s, index) => ({
            ...s,
            id: s.id || `fin_sug_${Date.now()}_${index}` // Generate ID if missing
         }));
        setSuggestions(prev => [...prev.filter(s => s.type !== 'financial'), ...uniqueSuggestions]);
      }
      setFinancialStatus('done');
      dispatch(addToast({ type: 'success', message: 'Financial Validation Complete.' }));
    } catch (error) {
      console.error('Financial Check failed:', error);
      setFinancialStatus('error');
      dispatch(addToast({ type: 'error', message: `Financial Check failed: ${error instanceof Error ? error.message : 'Unknown error'}` }));
    }
  }, [projectId, editorContent, generatedContentPreview, dispatch]);

  // --- Suggestion Selection ---
  const handleSuggestionToggle = (suggestionId: string) => {
    setSelectedSuggestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(suggestionId)) {
        newSet.delete(suggestionId);
      } else {
        newSet.add(suggestionId);
      }
      return newSet;
    });
  };

  // --- Regeneration Handler ---
  const handleRegenerate = useCallback(async () => {
     if (!projectId) {
       dispatch(addToast({ type: 'error', message: 'Project ID is missing. Cannot regenerate.' }));
       return;
     }
     if (selectedSuggestions.size === 0) {
       dispatch(addToast({ type: 'warning', message: 'Please select at least one suggestion to apply.' }));
       return;
     }

     setIsRegenerating(true);
     const selectedSuggestionDetails = suggestions.filter(s => selectedSuggestions.has(s.id));
     console.log('Regenerating content with suggestions:', selectedSuggestionDetails.map(s => s.id));
     dispatch(addToast({ type: 'info', message: 'Regenerating content based on selected suggestions...' }));

     try {
       const currentContent = editorContent || generatedContentPreview || '';
       // Call the actual service function
       const result = await regenerateWithSuggestions(projectId, currentContent, selectedSuggestionDetails);

       if (result.success && result.newContent) {
         setEditorContent(result.newContent); // Update the editor content in the store
         dispatch(addToast({ type: 'success', message: 'Content regenerated successfully!' }));
         setSelectedSuggestions(new Set()); // Clear selection after regeneration
         // Optionally clear suggestions or mark applied ones
         // setSuggestions(prev => prev.filter(s => !selectedSuggestions.has(s.id)));
       } else {
         throw new Error(result.error || 'Regeneration failed or returned no content.');
       }
     } catch (error) {
       console.error('Regeneration failed:', error);
       dispatch(addToast({ type: 'error', message: `Regeneration failed: ${error instanceof Error ? error.message : 'Unknown error'}` }));
     } finally {
       setIsRegenerating(false);
     }
  }, [projectId, selectedSuggestions, suggestions, editorContent, generatedContentPreview, dispatch, setEditorContent]);


  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative space-y-6">
      <h3 className="text-xl font-semibold font-heading text-secondary/90 mb-4 border-b border-neutral-light/40 pb-2">
        Comprehensive QA & Refinement
      </h3>

      {/* Check Sections */}
      <div className="flex flex-col space-y-4">
        {/* Quality Check */}
        <Card className="p-3 bg-white/50">
          <div className="flex flex-row items-center justify-between">
            <h4 className="font-semibold text-neutral-dark">Quality Check</h4>
            <Button onClick={handleRunQualityCheck} disabled={qualityStatus === 'running'} size="sm" className="ml-2">
              {qualityStatus === 'running' ? 'Running...' : 'Run Quality Check'}
            </Button>
          </div>
          {qualityStatus === 'done' && qualityResult && (
            <div className="mt-2 text-sm">
              <p>Overall Score: {qualityResult.score}/100</p>
              {qualityResult.issues.length > 0 && (
                <>
                  <p className="font-medium mt-1">Issues Found:</p>
                  <ul className="list-disc list-inside text-red-600">
                    {qualityResult.issues.map((issue, i) => <li key={`q_issue_${i}`}>{issue}</li>)}
                  </ul>
                </>
              )}
            </div>
          )}
           {qualityStatus === 'error' && <p className="mt-2 text-sm text-red-500">Error running check.</p>}
        </Card>

        {/* Fact Check */}
        <Card className="p-3 bg-white/50">
          <div className="flex flex-row items-center justify-between">
            <h4 className="font-semibold text-neutral-dark">Fact Check</h4>
            <Button onClick={handleRunFactCheck} disabled={factCheckStatus === 'running'} size="sm" className="ml-2">
              {factCheckStatus === 'running' ? 'Running...' : 'Run Fact Check'}
            </Button>
          </div>
          {/* Display fact check results from the store */}
          {(factCheckStatus === 'done' || factCheckStatus === 'error') && factCheckResults && factCheckResults.length > 0 && (
             <div className="mt-2 text-sm space-y-1 max-h-20 overflow-y-auto">
               {factCheckResults.map((item, i) => (
                 <p key={`fact_${i}`} className={item.verified ? 'text-green-600' : 'text-orange-600'}>
                   "{item.claim}" - {item.verified ? 'Verified' : 'Needs Review'} {item.explanation ? `(${item.explanation})` : ''}
                 </p>
               ))}
             </div>
          )}
           {factCheckStatus === 'error' && (!factCheckResults || factCheckResults.length === 0) && <p className="mt-2 text-sm text-red-500">Error running check.</p>}
        </Card>

        {/* Financial Check */}
        <Card className="p-3 bg-white/50">
          <div className="flex flex-row items-center justify-between">
            <h4 className="font-semibold text-neutral-dark">Financial Validation</h4>
            <Button onClick={handleRunFinancialCheck} disabled={financialStatus === 'running'} size="sm" className="ml-2">
              {financialStatus === 'running' ? 'Running...' : 'Validate Financials'}
            </Button>
          </div>
           {financialStatus === 'done' && financialResult && (
            <div className="mt-2 text-sm">
              <p>Coherence: {financialResult.coherence}</p>
              {financialResult.issues.length > 0 && (
                 <>
                  <p className="font-medium mt-1">Issues Found:</p>
                  <ul className="list-disc list-inside text-red-600">
                    {financialResult.issues.map((issue, i) => <li key={`fin_issue_${i}`}>{issue}</li>)}
                  </ul>
                </>
              )}
            </div>
          )}
           {financialStatus === 'error' && <p className="mt-2 text-sm text-red-500">Error running check.</p>}
        </Card>
      </div>

      {/* Suggestions Section */}
      {/* Only show suggestions section if there are any suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-6 border-t border-neutral-light/40 pt-4">
          <h4 className="font-semibold text-neutral-dark mb-3">Actionable Suggestions</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-start space-x-2 p-2 border rounded bg-white/60 text-sm hover:bg-blue-50 transition-colors">
                <Checkbox
                  id={`suggestion-${suggestion.id}`}
                  checked={selectedSuggestions.has(suggestion.id)}
                  onCheckedChange={() => handleSuggestionToggle(suggestion.id)}
                  className="mt-1"
                  aria-label={`Select suggestion: ${suggestion.text}`}
                />
                <Label htmlFor={`suggestion-${suggestion.id}`} className="flex-1 cursor-pointer">
                  {suggestion.text}
                  <span className="block text-xs text-neutral-medium">
                    (Impact: {suggestion.impact}, Effort: {suggestion.effort}, Type: {suggestion.type || 'general'})
                  </span>
                </Label>
              </div>
            ))}
          </div>

          {/* Regeneration Button - Moved inside suggestions section */}
          <div className="mt-4 flex justify-end border-t border-neutral-light/40 pt-4">
             <Button
               onClick={handleRegenerate}
               disabled={selectedSuggestions.size === 0 || isRegenerating || qualityStatus === 'running' || factCheckStatus === 'running' || financialStatus === 'running'}
               variant="primary"
               title={selectedSuggestions.size === 0 ? "Select one or more suggestions to enable regeneration" : ""}
             >
               {isRegenerating ? 'Regenerating...' : `Regenerate with ${selectedSuggestions.size} Suggestion(s)`}
             </Button>
          </div>
        </div>
      )}

    </Card>
  );
};