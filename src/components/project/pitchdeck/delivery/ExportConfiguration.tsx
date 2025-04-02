import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, Settings, Loader2, RefreshCw, Check, AlertTriangle, X } from 'lucide-react';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import * as exportService from '@/services/exportService';
import PdfExporter from '@/components/export/PdfExporter';

// Define types matching service
type ExportFormat = 'pptx' | 'pdf' | 'google_slides' | 'html5' | 'video' | 'mobile' | 'print';

interface ExportConfigurationProps {
  onGenerateClientPdf?: () => Promise<void>;
  isGeneratingClientPdf?: boolean;
  clientPdfStatus?: 'idle' | 'generating' | 'success' | 'error';
}

const ExportConfiguration: React.FC<ExportConfigurationProps> = ({ 
  onGenerateClientPdf, 
  isGeneratingClientPdf, 
  clientPdfStatus = 'idle'
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<exportService.ExportResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfExportUrl, setPdfExportUrl] = useState<string | null>(null);
  const [exportOptions, setExportOptions] = useState({
    password: false,
    tracking: false,
    highQuality: true,
    includeNotes: true
  });
  
  // Get project ID from store
  const { projectId, editorContent } = useProjectWorkflowStore();
  const dispatch = useDispatch();
  
  // Clear export result when format changes
  useEffect(() => {
    setExportResult(null);
  }, [selectedFormat]);

  const handleExport = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for export'
      }));
      return;
    }
    
    setExportResult(null);
    setIsExporting(true);
    
    try {
      let result: exportService.ExportResult;
      
      if (selectedFormat === 'pdf') {
        // Use the new formatted PDF generation with markdown and colors
        result = await exportService.generateFormattedPdf(
          projectId, 
          editorContent,
          {
            title: `${projectId} - Markdown Export`,
            fileName: `${projectId}_export`,
            brandColors: {
              primary: '#ae5630',
              secondary: '#232321',
              accent: '#4a90e2',
              title: `${projectId} - Markdown Export`
            }
          }
        );
        
        setExportResult(result);
        
        if (result.status === 'completed') {
          dispatch(addToast({
            type: 'success',
            message: 'PDF generated successfully with markdown formatting'
          }));
          
          if (result.downloadUrl) {
            // Automatically trigger download
            const link = document.createElement('a');
            link.href = result.downloadUrl;
            
            // If it's a blob URL (from jsPDF), set a proper filename
            if (result.downloadUrl.startsWith('blob:')) {
              link.download = `${projectId}_export_${Date.now()}.pdf`;
            } else {
              // For server-side URLs, use the default naming
              link.download = `export-${projectId}.pdf`;
            }
            
            link.click();
          }
        } else {
          dispatch(addToast({
            type: 'error',
            message: 'PDF generation failed'
          }));
        }
      } else {
        // Use standard export for other formats
        result = await exportService.exportProject(projectId, { 
          format: selectedFormat,
          // Include additional options
          options: {
            password: exportOptions.password ? 'secure-password' : undefined,
            tracking: exportOptions.tracking,
            quality: exportOptions.highQuality ? 'high' : 'standard',
            includeNotes: exportOptions.includeNotes
          }
        });
        
        setExportResult(result);
        
        if (result.status === 'completed') {
          dispatch(addToast({
            type: 'success',
            message: `Export to ${selectedFormat.toUpperCase()} completed`
          }));
          
          if (result.downloadUrl) {
            // Automatically trigger download in some browsers
            const link = document.createElement('a');
            link.href = result.downloadUrl;
            link.download = `export-${projectId}.${selectedFormat}`;
            link.click();
          }
        } else if (result.status === 'pending') {
          dispatch(addToast({
            type: 'info',
            message: 'Export job started, check status for updates'
          }));
          
          // Start polling for status updates
          pollExportStatus(result.jobId as string);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Export failed'
      }));
      
      setExportResult({ status: 'failed' });
    } finally {
      if (exportResult?.status !== 'pending') {
        setIsExporting(false);
      }
    }
  };
  
  const pollExportStatus = async (jobId: string) => {
    try {
      const result = await exportService.getExportStatus(jobId);
      setExportResult(result);
      
      if (result.status === 'completed') {
        setIsExporting(false);
        dispatch(addToast({
          type: 'success',
          message: `Export to ${selectedFormat.toUpperCase()} completed`
        }));
      } else if (result.status === 'failed') {
        setIsExporting(false);
        dispatch(addToast({
          type: 'error',
          message: 'Export failed'
        }));
      } else if (result.status === 'processing' || result.status === 'pending') {
        // Continue polling
        setTimeout(() => pollExportStatus(jobId), 2000);
      }
    } catch (error) {
      console.error('Failed to check export status:', error);
      setIsExporting(false);
      setExportResult({ status: 'failed' });
      
      dispatch(addToast({
        type: 'error',
        message: 'Failed to check export status'
      }));
    }
  };
  
  // Determine overall loading state
  const isLoading = isExporting || isGeneratingClientPdf;
  
  // Handle PDF export completion
  const handlePdfExportComplete = (url: string) => {
    setPdfExportUrl(url);
    setIsExporting(false);
    dispatch(addToast({
      type: 'success',
      message: 'PDF generated successfully'
    }));
  };
  
  // Handle PDF export error
  const handlePdfExportError = (error: Error) => {
    console.error('PDF export error:', error);
    setIsExporting(false);
    dispatch(addToast({
      type: 'error',
      message: 'PDF generation failed'
    }));
  };

  // Determine status message and style
  const getStatusInfo = () => {
    if (showPdfPreview) {
      return { message: '', className: '' };
    } else if (selectedFormat === 'pdf' && onGenerateClientPdf) {
      // Client-side PDF status
      switch (clientPdfStatus) {
        case 'generating':
          return { 
            message: 'Generating PDF...', 
            className: 'bg-blue-100 border-blue-300 text-blue-800' 
          };
        case 'success':
          return { 
            message: 'PDF generated. Download should start.', 
            className: 'bg-green-100 border-green-300 text-green-800' 
          };
        case 'error':
          return { 
            message: 'PDF generation failed. Check console.', 
            className: 'bg-red-100 border-red-300 text-red-800' 
          };
        default:
          return { message: '', className: '' };
      }
    } else if (exportResult) {
      // Backend export status
      switch (exportResult.status) {
        case 'pending':
        case 'processing':
          return { 
            message: `Export ${exportResult.status}. Job ID: ${exportResult.jobId}`, 
            className: 'bg-blue-100 border-blue-300 text-blue-800' 
          };
        case 'completed':
          return { 
            message: selectedFormat === 'pdf'
              ? 'PDF generated successfully with markdown formatting.'
              : 'Export completed successfully.',
            className: 'bg-green-100 border-green-300 text-green-800' 
          };
        case 'failed':
          return { 
            message: 'Export failed. Please check console for errors.', 
            className: 'bg-red-100 border-red-300 text-red-800' 
          };
        default:
          return { message: '', className: '' };
      }
    }
    
    return { message: '', className: '' };
  };
  
  const statusInfo = getStatusInfo();

  // Generate PDF directly in the component
  const handleGeneratePdf = () => {
    if (!editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for export'
      }));
      return;
    }
    
    setIsExporting(true);
    setShowPdfPreview(true);
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Export Configuration</h4>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-neutral-dark">
              {selectedFormat === 'pdf' ? 'Generating markdown-formatted PDF...' : `Exporting to ${selectedFormat.toUpperCase()}...`}
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Format Selection */}
        <div className="md:col-span-2">
          <label htmlFor="exportFormat" className="settings-label mb-1">Export Format</label>
          <select 
            id="exportFormat" 
            className="settings-input" 
            value={selectedFormat} 
            onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
            disabled={isLoading}
          >
          <option value="pdf">PDF (Markdown Formatted)</option>
          <option value="pptx" disabled>PowerPoint (PPTX) - Coming Soon</option>
          <option value="google_slides" disabled>Google Slides - Coming Soon</option>
          <option value="html5" disabled>HTML5 Interactive - Coming Soon</option>
          <option value="video" disabled>Video Presentation - Coming Soon</option>
          <option value="mobile" disabled>Mobile-Optimized - Coming Soon</option>
          <option value="print" disabled>Print-Ready - Coming Soon</option>
          </select>
          <Button 
            variant="link" 
            size="sm" 
            className="mt-1 p-0 h-auto text-xs" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={isLoading}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options...
          </Button>
        </div>

        {/* Export Button */}
        <Button 
          size="lg" 
          className="w-full md:w-auto text-white" 
          onClick={selectedFormat === 'pdf' ? handleGeneratePdf : handleExport} 
          disabled={isLoading || !projectId || !editorContent}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin mr-2"/> : <Download size={18} className="mr-2"/>}
          {isLoading ? 'Processing...' : `Export as ${selectedFormat.toUpperCase()}`}
        </Button>
      </div>

      {/* Advanced Options (Collapsible) - Commented out as requested
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-neutral-light/40 space-y-2">
          <h5 className="text-sm font-medium text-neutral-dark flex items-center gap-1">
            <Settings size={14}/> Advanced Export Options
          </h5>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="export-password" 
                checked={exportOptions.password}
                onChange={(e) => setExportOptions({...exportOptions, password: e.target.checked})}
                disabled={isLoading}
              />
              <label htmlFor="export-password" className="text-xs text-neutral-medium">
                Add Password Protection
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="export-tracking" 
                checked={exportOptions.tracking}
                onChange={(e) => setExportOptions({...exportOptions, tracking: e.target.checked})}
                disabled={isLoading}
              />
              <label htmlFor="export-tracking" className="text-xs text-neutral-medium">
                Enable Analytics Tracking
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="export-quality" 
                checked={exportOptions.highQuality}
                onChange={(e) => setExportOptions({...exportOptions, highQuality: e.target.checked})}
                disabled={isLoading}
              />
              <label htmlFor="export-quality" className="text-xs text-neutral-medium">
                High Quality Export
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="export-notes" 
                checked={exportOptions.includeNotes}
                onChange={(e) => setExportOptions({...exportOptions, includeNotes: e.target.checked})}
                disabled={isLoading}
              />
              <label htmlFor="export-notes" className="text-xs text-neutral-medium">
                Include Speaker Notes
              </label>
            </div>
          </div>
        </div>
      )}
      */}

      {/* PDF Preview */}
      {showPdfPreview && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <div className="bg-neutral-100 p-3 flex justify-between items-center border-b">
            <h5 className="font-medium text-neutral-dark">PDF Preview</h5>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowPdfPreview(false)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X size={16} />
            </Button>
          </div>
          <div className="p-0">
            <PdfExporter
              content={editorContent || ''}
              title={`${projectId || 'Document'} - Markdown Export`}
              fileName={`${projectId || 'document'}_export`}
              onExportComplete={handlePdfExportComplete}
              onExportError={handlePdfExportError}
            />
          </div>
        </div>
      )}
      
      {/* Export Result Display */}
      {(!showPdfPreview && statusInfo.message) && (
        <div className={`mt-3 text-xs p-2 rounded border ${statusInfo.className}`}>
          <div className="flex items-start gap-2">
            {clientPdfStatus === 'success' || exportResult?.status === 'completed' ? (
              <Check size={14} className="mt-0.5 flex-shrink-0" />
            ) : clientPdfStatus === 'error' || exportResult?.status === 'failed' ? (
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
            ) : (
              <Loader2 size={14} className="mt-0.5 flex-shrink-0 animate-spin" />
            )}
            
            <div className="flex-grow">
              <p>{statusInfo.message}</p>
              
              {exportResult?.downloadUrl && (
                <div className="flex gap-2 mt-2">
                  <a 
                    href={exportResult.downloadUrl} 
                    download={`${projectId}_export.${selectedFormat}`}
                    className="underline inline-block"
                  >
                    Download File
                  </a>
                  <a 
                    href={exportResult.downloadUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="underline inline-block"
                  >
                    Open in New Tab
                  </a>
                </div>
              )}
              
              {exportResult?.shareUrl && (
                <a 
                  href={exportResult.shareUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="underline mt-1 inline-block ml-3"
                >
                  Open Shared Link
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ExportConfiguration;
