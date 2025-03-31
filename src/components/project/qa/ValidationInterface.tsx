import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, AlertTriangle, Scale, Languages, Loader2 } from 'lucide-react';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import * as qaService from '@/services/qaService';

// Define types matching ProjectArea state
type Status = 'Not Run' | 'Running' | 'Passed' | 'Issues Found';
type FactCheckResult = { claim: string; verified: boolean; source?: string; explanation?: string; };

interface ValidationInterfaceProps {
  onVerifyFacts: () => void;
  onCheckCompliance: () => void;
  onValidateFinancials: () => void;
  onCheckLanguage: () => void;
  factCheckResults: FactCheckResult[];
  complianceStatus: Status;
  financialValidationStatus: Status;
  languageCheckStatus: Status;
  isLoading: boolean;
}

const ValidationInterface: React.FC<ValidationInterfaceProps> = ({
  onVerifyFacts,
  onCheckCompliance,
  onValidateFinancials,
  onCheckLanguage,
  factCheckResults,
  complianceStatus,
  financialValidationStatus,
  languageCheckStatus,
  isLoading
}) => {
  const [localFactCheckResults, setLocalFactCheckResults] = useState<FactCheckResult[]>([]);
  const [localComplianceStatus, setLocalComplianceStatus] = useState<Status>('Not Run');
  const [localFinancialStatus, setLocalFinancialStatus] = useState<Status>('Not Run');
  const [localLanguageStatus, setLocalLanguageStatus] = useState<Status>('Not Run');
  const [localIsLoading, setLocalIsLoading] = useState<boolean>(false);
  const [activeCheck, setActiveCheck] = useState<string | null>(null);
  
  // Get project ID and editor content from store
  const { projectId, editorContent } = useProjectWorkflowStore();
  const dispatch = useDispatch();
  
  // Use either local state or props (for backward compatibility)
  const displayFactCheckResults = localFactCheckResults.length > 0 ? localFactCheckResults : factCheckResults;
  const displayComplianceStatus = localComplianceStatus !== 'Not Run' ? localComplianceStatus : complianceStatus;
  const displayFinancialStatus = localFinancialStatus !== 'Not Run' ? localFinancialStatus : financialValidationStatus;
  const displayLanguageStatus = localLanguageStatus !== 'Not Run' ? localLanguageStatus : languageCheckStatus;
  const displayIsLoading = localIsLoading || isLoading;

  const handleVerifyFacts = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for fact checking'
      }));
      return;
    }
    
    setLocalIsLoading(true);
    setActiveCheck('facts');
    setLocalFactCheckResults([]);
    
    try {
      const results = await qaService.verifyFacts(projectId, editorContent);
      setLocalFactCheckResults(results);
      
      dispatch(addToast({
        type: results.some(r => !r.verified) ? 'warning' : 'success',
        message: results.some(r => !r.verified) 
          ? 'Fact check complete: Some issues found' 
          : 'Fact check complete: All claims verified'
      }));
      
      // Also call the original handler for backward compatibility
      onVerifyFacts();
    } catch (error) {
      console.error('Fact verification failed:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Fact verification failed'
      }));
      
      setLocalFactCheckResults([{
        claim: 'Verification Process',
        verified: false,
        explanation: `Error: ${error instanceof Error ? error.message : String(error)}`
      }]);
    } finally {
      setLocalIsLoading(false);
      setActiveCheck(null);
    }
  };
  
  const handleCheckCompliance = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for compliance checking'
      }));
      return;
    }
    
    setLocalIsLoading(true);
    setActiveCheck('compliance');
    setLocalComplianceStatus('Running');
    
    try {
      const result = await qaService.checkCompliance(projectId, editorContent);
      setLocalComplianceStatus(result.status);
      
      dispatch(addToast({
        type: result.status === 'Passed' ? 'success' : 'warning',
        message: result.status === 'Passed' 
          ? 'Compliance check passed' 
          : `Compliance check found ${result.issues.length} issue(s)`
      }));
      
      // Also call the original handler for backward compatibility
      onCheckCompliance();
    } catch (error) {
      console.error('Compliance check failed:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Compliance check failed'
      }));
      
      setLocalComplianceStatus('Issues Found');
    } finally {
      setLocalIsLoading(false);
      setActiveCheck(null);
    }
  };
  
  const handleValidateFinancials = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for financial validation'
      }));
      return;
    }
    
    setLocalIsLoading(true);
    setActiveCheck('financials');
    setLocalFinancialStatus('Running');
    
    try {
      const result = await qaService.validateFinancials(projectId, editorContent);
      setLocalFinancialStatus(result.status);
      
      dispatch(addToast({
        type: result.status === 'Passed' ? 'success' : 'warning',
        message: result.status === 'Passed' 
          ? 'Financial validation passed' 
          : `Financial validation found ${result.issues.length} issue(s)`
      }));
      
      // Also call the original handler for backward compatibility
      onValidateFinancials();
    } catch (error) {
      console.error('Financial validation failed:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Financial validation failed'
      }));
      
      setLocalFinancialStatus('Issues Found');
    } finally {
      setLocalIsLoading(false);
      setActiveCheck(null);
    }
  };
  
  const handleCheckLanguage = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for language quality check'
      }));
      return;
    }
    
    setLocalIsLoading(true);
    setActiveCheck('language');
    setLocalLanguageStatus('Running');
    
    try {
      const result = await qaService.checkLanguageQuality(projectId, editorContent);
      setLocalLanguageStatus(result.status);
      
      dispatch(addToast({
        type: result.status === 'Passed' ? 'success' : 'warning',
        message: result.status === 'Passed' 
          ? 'Language quality check passed' 
          : `Language quality check found ${result.issues.length} issue(s)`
      }));
      
      // Also call the original handler for backward compatibility
      onCheckLanguage();
    } catch (error) {
      console.error('Language quality check failed:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Language quality check failed'
      }));
      
      setLocalLanguageStatus('Issues Found');
    } finally {
      setLocalIsLoading(false);
      setActiveCheck(null);
    }
  };

  const renderStatus = (status: Status) => {
    switch (status) {
      case 'Running':
        return <span className="text-blue-600 flex items-center gap-1"><Loader2 size={14} className="animate-spin"/> Running...</span>;
      case 'Passed':
        return <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Passed</span>;
      case 'Issues Found':
        return <span className="text-red-600 flex items-center gap-1"><AlertTriangle size={14}/> Issues Found</span>;
      case 'Not Run':
      default:
        return <span className="text-neutral-medium">Not Run</span>;
    }
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Content Validation</h4>
      
      {displayIsLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-neutral-dark">
              {activeCheck === 'facts' && 'Verifying facts...'}
              {activeCheck === 'compliance' && 'Checking compliance...'}
              {activeCheck === 'financials' && 'Validating financials...'}
              {activeCheck === 'language' && 'Analyzing language...'}
              {!activeCheck && 'Processing...'}
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Fact Verification */}
        <div className="p-3 border rounded-md bg-white/50">
          <label className="settings-label flex items-center gap-1 mb-2"><CheckCircle size={14}/> Fact Verification</label>
          <p className="text-xs text-neutral-medium mb-2">Check claims, sources, and data accuracy using the research model.</p>
          <div className="text-sm mb-2">
             Status: {activeCheck === 'facts' ?
                <span className="text-blue-600 flex items-center gap-1"><Loader2 size={14} className="animate-spin"/> Running...</span> : 
                displayFactCheckResults.length > 0 ? 
                   (displayFactCheckResults.some(r => !r.verified && !r.claim.startsWith('Error')) ? 
                      <span className="text-red-600 flex items-center gap-1"><AlertTriangle size={14}/> Issues Found</span> : 
                      displayFactCheckResults.some(r => r.claim.startsWith('Error')) ?
                      <span className="text-red-600 flex items-center gap-1"><AlertTriangle size={14}/> Error</span> :
                      <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Checked</span>) : 
                   <span className="text-neutral-medium">Not Run</span>
             }
          </div>
          {/* Display results */}
          {displayFactCheckResults.length > 0 && (
             <ul className="text-xs space-y-1 mb-2 max-h-20 overflow-y-auto custom-scrollbar border-t pt-2">
                {displayFactCheckResults.map((res, i) => (
                   <li key={i} className={res.verified ? 'text-green-700' : res.claim.startsWith('Error') ? 'text-red-700 font-semibold' : 'text-red-700'}>
                      <strong>{res.claim.replace(/^"Status":/, 'Status:').replace(/^"(.*?)"$/, '$1').replace(/^"(.*)"$/, '$1').trim()}</strong>
                      <span className="ml-2">{res.verified ? '✓ Verified' : '✗ Not Verified'}</span>
                      {res.explanation && <span className="block ml-4 mt-1">{res.explanation.replace(/^"(.*?)"$/, '$1').replace(/^"(.*)"$/, '$1').trim()}</span>}
                      {res.source && <span className="block ml-4 italic text-neutral-medium">[Source: {res.source}]</span>}
                   </li>
                ))}
             </ul>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={handleVerifyFacts} 
            disabled={displayIsLoading || !editorContent}
          >
             {activeCheck === 'facts' ? 'Checking...' : 'Run Fact Check'}
          </Button>
        </div>

        {/* Compliance Checking */}
         <div className="p-3 border rounded-md bg-white/50">
          <label className="settings-label flex items-center gap-1 mb-2"><Scale size={14}/> Compliance Checking</label>
          <p className="text-xs text-neutral-medium mb-2">Review for legal, privacy, and copyright adherence.</p>
           <div className="text-sm mb-2">Status: {renderStatus(displayComplianceStatus)}</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={handleCheckCompliance} 
            disabled={displayIsLoading || displayComplianceStatus === 'Running' || !editorContent}
          >
             {displayComplianceStatus === 'Running' ? 'Checking...' : 'Run Compliance Check'}
          </Button>
        </div>

        {/* Financial Validation */}
         <div className="p-3 border rounded-md bg-white/50">
          <label className="settings-label flex items-center gap-1 mb-2"><Scale size={14}/> Financial Validation</label>
          <p className="text-xs text-neutral-medium mb-2">Verify calculations, assumptions, and model coherence.</p>
           <div className="text-sm mb-2">Status: {renderStatus(displayFinancialStatus)}</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={handleValidateFinancials} 
            disabled={displayIsLoading || displayFinancialStatus === 'Running' || !editorContent}
          >
             {displayFinancialStatus === 'Running' ? 'Validating...' : 'Validate Financials'}
          </Button>
        </div>

        {/* Language Quality */}
         <div className="p-3 border rounded-md bg-white/50">
          <label className="settings-label flex items-center gap-1 mb-2"><Languages size={14}/> Language Quality</label>
          <p className="text-xs text-neutral-medium mb-2">Assess grammar, readability, clarity, and persuasiveness.</p>
           <div className="text-sm mb-2">Status: {renderStatus(displayLanguageStatus)}</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={handleCheckLanguage} 
            disabled={displayIsLoading || displayLanguageStatus === 'Running' || !editorContent}
          >
             {displayLanguageStatus === 'Running' ? 'Checking...' : 'Check Language'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ValidationInterface;