import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, Settings, Loader2 } from 'lucide-react'; // Icons
import * as exportService from '@/services/exportService'; // Import the service

// Define types matching service
type ExportFormat = 'pptx' | 'pdf' | 'google_slides' | 'html5' | 'video' | 'mobile' | 'print';

interface ExportConfigurationProps {
  onGenerateClientPdf: () => Promise<void>; // Function for client-side PDF
  isGeneratingClientPdf: boolean; // Loading state for client-side PDF
  clientPdfStatus: 'idle' | 'generating' | 'success' | 'error'; // Status for client-side PDF
}

const ExportConfiguration: React.FC<ExportConfigurationProps> = ({ 
  onGenerateClientPdf, 
  isGeneratingClientPdf, 
  clientPdfStatus 
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false); // For backend exports
  const [exportResult, setExportResult] = useState<exportService.ExportResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleExport = async () => {
    setExportResult(null); // Clear previous result (both backend and client)
    
    if (selectedFormat === 'pdf') {
      // --- Client-side PDF generation ---
      setIsExporting(true); // Use the general exporting flag for button state
      await onGenerateClientPdf(); 
      // Status (success/error) is managed in ProjectArea via clientPdfStatus prop
      // We might not need to setExportResult here if we display clientPdfStatus directly
      // For simplicity now, let's keep setIsExporting tied to the client generation
      setIsExporting(false); 
    } else {
      // --- Backend export for other formats ---
      setIsExporting(true);
      try {
        const result = await exportService.exportProject('temp-project-id', { format: selectedFormat }); 
        setExportResult(result);
        // TODO: Handle pending status with polling getExportStatus if needed
        if (result.status === 'completed' && result.downloadUrl) {
           console.log("Export complete, download URL:", result.downloadUrl);
        } else if (result.status === 'completed' && result.shareUrl) {
           console.log("Export complete, share URL:", result.shareUrl);
        } else if (result.status === 'pending') {
           console.log("Export pending, Job ID:", result.jobId);
           // Start polling getExportStatus(result.jobId) here
           // Keep isExporting true if pending
           return; // Exit early to keep loading state
        }
      } catch (error) {
        console.error("Backend export failed:", error);
        setExportResult({ status: 'failed' }); // Indicate failure
      } finally {
        // Only set exporting false if not pending
        if (exportResult?.status !== 'pending') { 
           setIsExporting(false);
        }
      }
    }
  };

  // Determine overall loading state considering both backend and client generation
  const isLoading = isExporting || isGeneratingClientPdf;

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Export Configuration</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Format Selection */}
        <div className="md:col-span-2">
          <label htmlFor="exportFormat" className="settings-label mb-1">Export Format</label>
          <select 
             id="exportFormat" 
             className="settings-input" 
             value={selectedFormat} 
             onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
             disabled={isLoading} // Use combined loading state
          >
            <option value="pdf">PDF</option>
            <option value="pptx">PowerPoint (PPTX)</option>
            <option value="google_slides">Google Slides</option>
            <option value="html5">HTML5 Interactive</option>
            {/* Add other formats later */}
          </select>
           <Button variant="link" size="sm" className="mt-1 p-0 h-auto text-xs" onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options...
           </Button>
        </div>

        {/* Export Button */}
        <Button 
           size="lg" 
           className="w-full md:w-auto text-white" // Adjust width
           onClick={handleExport} 
           disabled={isLoading} // Use combined loading state
        >
          {isLoading ? <Loader2 size={18} className="animate-spin mr-2"/> : <Download size={18} className="mr-2"/>}
          {isLoading ? 'Processing...' : `Export as ${selectedFormat.toUpperCase()}`} {/* Simplified loading text */}
        </Button>
      </div>

       {/* Advanced Options (Collapsible) */}
       {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-neutral-light/40 space-y-2">
             <h5 className="text-sm font-medium text-neutral-dark flex items-center gap-1"><Settings size={14}/> Advanced PDF Options (Example)</h5>
             <div className="flex items-center gap-2">
                <input type="checkbox" id="pdf-security" />
                <label htmlFor="pdf-security" className="text-xs text-neutral-medium">Add Password Protection</label>
             </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pdf-tracking" />
                <label htmlFor="pdf-tracking" className="text-xs text-neutral-medium">Enable Analytics Tracking</label>
             </div>
          </div>
       )}

       {/* Export Result Display */}
       {(exportResult || clientPdfStatus !== 'idle') && (
         <div className={`mt-3 text-xs p-2 rounded border ${
           selectedFormat === 'pdf' 
             ? (clientPdfStatus === 'success' ? 'bg-green-100 border-green-300 text-green-800' :
                clientPdfStatus === 'generating' ? 'bg-blue-100 border-blue-300 text-blue-800' :
                clientPdfStatus === 'error' ? 'bg-red-100 border-red-300 text-red-800' : 
                'bg-gray-100 border-gray-300 text-gray-800') // Should not hit idle if shown
             : (exportResult?.status === 'completed' ? 'bg-green-100 border-green-300 text-green-800' : 
                exportResult?.status === 'pending' ? 'bg-blue-100 border-blue-300 text-blue-800' : 
                'bg-red-100 border-red-300 text-red-800') // failed or other
         }`}>
           {selectedFormat === 'pdf' ? 
             (clientPdfStatus === 'success' ? 'Status: PDF generated. Download should start.' :
              clientPdfStatus === 'generating' ? 'Status: Generating PDF...' :
              clientPdfStatus === 'error' ? 'Status: PDF generation failed. Check console.' : 
              'Status: Ready') // Idle case
             : exportResult ? // Check if backend result exists
               (<>
                 Status: {exportResult.status}. 
                 {exportResult.downloadUrl && <a href={exportResult.downloadUrl} target="_blank" rel="noreferrer" className="underline ml-1">Download Link</a>}
                 {exportResult.shareUrl && <a href={exportResult.shareUrl} target="_blank" rel="noreferrer" className="underline ml-1">Share Link</a>}
                 {exportResult.jobId && ` (Job ID: ${exportResult.jobId})`}
                 {exportResult.status === 'failed' && ' Please check console for errors.'}
               </>)
             : 'Status: Ready' // Default if no backend result yet
           }
         </div>
       )}
    </Card>
  );
};

export default ExportConfiguration;