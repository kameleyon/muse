import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, Settings, Loader2 } from 'lucide-react'; // Icons
import * as exportService from '@/services/exportService'; // Import the service

// Define types matching service
type ExportFormat = 'pptx' | 'pdf' | 'google_slides' | 'html5' | 'video' | 'mobile' | 'print';

const ExportConfiguration: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<exportService.ExportResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setExportResult(null); // Clear previous result
    try {
      const result = await exportService.exportProject('temp-project-id', { format: selectedFormat }); // Use selected format
      setExportResult(result);
      // TODO: Handle pending status with polling getExportStatus if needed
      if (result.status === 'completed' && result.downloadUrl) {
         // Optionally trigger download automatically
         // window.location.href = result.downloadUrl; 
         console.log("Export complete, download URL:", result.downloadUrl);
      } else if (result.status === 'completed' && result.shareUrl) {
         console.log("Export complete, share URL:", result.shareUrl);
      } else if (result.status === 'pending') {
         console.log("Export pending, Job ID:", result.jobId);
         // Start polling getExportStatus(result.jobId) here
      }

    } catch (error) {
      console.error("Export failed:", error);
      setExportResult({ status: 'failed' }); // Indicate failure
    } finally {
      // Keep loading true if pending, otherwise set false
      if (exportResult?.status !== 'pending') {
         setIsExporting(false);
      }
    }
  };

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
             disabled={isExporting}
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
           disabled={isExporting}
        >
          {isExporting ? <Loader2 size={18} className="animate-spin mr-2"/> : <Download size={18} className="mr-2"/>}
          {isExporting ? (exportResult?.status === 'pending' ? 'Export Pending...' : 'Exporting...') : `Export as ${selectedFormat.toUpperCase()}`}
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
       {exportResult && (
          <div className={`mt-3 text-xs p-2 rounded border ${
             exportResult.status === 'completed' ? 'bg-green-100 border-green-300 text-green-800' : 
             exportResult.status === 'pending' ? 'bg-blue-100 border-blue-300 text-blue-800' : 
             'bg-red-100 border-red-300 text-red-800'
          }`}>
             Status: {exportResult.status}. 
             {exportResult.downloadUrl && <a href={exportResult.downloadUrl} target="_blank" rel="noreferrer" className="underline ml-1">Download Link</a>}
             {exportResult.shareUrl && <a href={exportResult.shareUrl} target="_blank" rel="noreferrer" className="underline ml-1">Share Link</a>}
             {exportResult.jobId && ` (Job ID: ${exportResult.jobId})`}
             {exportResult.status === 'failed' && ' Please check console for errors.'}
          </div>
       )}
    </Card>
  );
};

export default ExportConfiguration;