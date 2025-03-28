import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, AlertTriangle, Scale, Languages, Loader2 } from 'lucide-react'; // Added Loader2

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
  financialValidationStatus: Status; // Corrected prop name
  languageCheckStatus: Status; // Corrected prop name
  isLoading: boolean; // General loading state for QA checks
}

const ValidationInterface: React.FC<ValidationInterfaceProps> = ({
  onVerifyFacts,
  onCheckCompliance,
  onValidateFinancials,
  onCheckLanguage,
  factCheckResults,
  complianceStatus,
  financialValidationStatus, // Corrected destructuring
  languageCheckStatus, // Corrected destructuring
  isLoading
}) => {

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
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Content Validation</h4>
      <div className="space-y-4">
        {/* Fact Verification */}
        <div className="p-3 border rounded-md bg-white/50">
          <label className="settings-label flex items-center gap-1 mb-2"><CheckCircle size={14}/> Fact Verification</label>
          <p className="text-xs text-neutral-medium mb-2">Check claims, sources, and data accuracy using the research model.</p>
          <div className="text-sm mb-2">
             Status: {isLoading && complianceStatus !== 'Running' && financialValidationStatus !== 'Running' && languageCheckStatus !== 'Running' ?
                <span className="text-blue-600 flex items-center gap-1"><Loader2 size={14} className="animate-spin"/> Running...</span> : 
                factCheckResults.length > 0 ? 
                   (factCheckResults.some(r => !r.verified && !r.claim.startsWith('Error')) ? 
                      <span className="text-red-600 flex items-center gap-1"><AlertTriangle size={14}/> Issues Found</span> : 
                      factCheckResults.some(r => r.claim.startsWith('Error')) ?
                      <span className="text-red-600 flex items-center gap-1"><AlertTriangle size={14}/> Error</span> :
                      <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Checked</span>) : 
                   <span className="text-neutral-medium">Not Run</span>
             }
          </div>
          {/* Display results */}
          {factCheckResults.length > 0 && (
             <ul className="text-xs space-y-1 mb-2 max-h-20 overflow-y-auto custom-scrollbar border-t pt-2">
                {factCheckResults.map((res, i) => (
                   <li key={i} className={res.verified ? 'text-green-700' : res.claim.startsWith('Error') ? 'text-red-700 font-semibold' : 'text-red-700'}>
                      <strong>{res.claim}:</strong> {res.verified ? 'Verified' : 'Not Verified/Error'} {res.explanation && `(${res.explanation})`} {res.source && `[Source: ${res.source}]`}
                   </li>
                ))}
             </ul>
          )}
          <Button variant="outline" size="sm" className="text-xs" onClick={onVerifyFacts} disabled={isLoading}>
             {isLoading && complianceStatus !== 'Running' && financialValidationStatus !== 'Running' && languageCheckStatus !== 'Running' ? 'Checking...' : 'Run Fact Check'}
          </Button>
        </div>

        {/* Compliance Checking */}
         <div className="p-3 border rounded-md bg-white/50">
          <label className="settings-label flex items-center gap-1 mb-2"><Scale size={14}/> Compliance Checking</label>
          <p className="text-xs text-neutral-medium mb-2">Review for legal, privacy, and copyright adherence (Simulated).</p>
           <div className="text-sm mb-2">Status: {renderStatus(complianceStatus)}</div>
          <Button variant="outline" size="sm" className="text-xs" onClick={onCheckCompliance} disabled={isLoading || complianceStatus === 'Running'}>
             {complianceStatus === 'Running' ? 'Checking...' : 'Run Compliance Check'}
          </Button>
        </div>

        {/* Financial Validation */}
         <div className="p-3 border rounded-md bg-white/50">
          <label className="settings-label flex items-center gap-1 mb-2"><Scale size={14}/> Financial Validation</label>
          <p className="text-xs text-neutral-medium mb-2">Verify calculations, assumptions, and model coherence (Simulated).</p>
           <div className="text-sm mb-2">Status: {renderStatus(financialValidationStatus)}</div>
          <Button variant="outline" size="sm" className="text-xs" onClick={onValidateFinancials} disabled={isLoading || financialValidationStatus === 'Running'}>
             {financialValidationStatus === 'Running' ? 'Validating...' : 'Validate Financials'}
          </Button>
        </div>

        {/* Language Quality */}
         <div className="p-3 border rounded-md bg-white/50">
          <label className="settings-label flex items-center gap-1 mb-2"><Languages size={14}/> Language Quality</label>
          <p className="text-xs text-neutral-medium mb-2">Assess grammar, readability, clarity, and persuasiveness (Simulated).</p>
           <div className="text-sm mb-2">Status: {renderStatus(languageCheckStatus)}</div>
          <Button variant="outline" size="sm" className="text-xs" onClick={onCheckLanguage} disabled={isLoading || languageCheckStatus === 'Running'}>
             {languageCheckStatus === 'Running' ? 'Checking...' : 'Check Language'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ValidationInterface;