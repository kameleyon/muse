import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PdfExporter from '@/components/export/PdfExporter';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Download, FileText } from 'lucide-react';

/**
 * PdfExport - Page for exporting content as PDF
 * Renders content in a format that matches the content editor
 */
const PdfExport: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('Markdown Export');
  const [fileName, setFileName] = useState<string>('document-export');
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  
  // Parse state from location
  useEffect(() => {
    if (location.state) {
      const { content: stateContent, title: stateTitle, fileName: stateFileName } = location.state as {
        content?: string;
        title?: string;
        fileName?: string;
      };
      
      if (stateContent) {
        setContent(stateContent);
      }
      
      if (stateTitle) {
        setTitle(stateTitle);
      }
      
      if (stateFileName) {
        setFileName(stateFileName);
      }
    }
  }, [location]);
  
  // Handle export completion
  const handleExportComplete = (url: string) => {
    setExportUrl(url);
  };
  
  // Handle export error
  const handleExportError = (error: Error) => {
    console.error('Export error:', error);
    // Could add error state and display to user
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle download button click
  const handleDownload = () => {
    if (exportUrl) {
      const link = document.createElement('a');
      link.href = exportUrl;
      link.download = `${fileName}.pdf`;
      link.click();
    }
  };
  
  // Handle open in new tab
  const handleOpenInNewTab = () => {
    if (exportUrl) {
      window.open(exportUrl, '_blank');
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold text-center text-primary">PDF Export</h1>
        
        {exportUrl && (
          <div className="flex gap-2">
            <Button 
              variant="primary" 
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2"
            >
              Open in New Tab
            </Button>
          </div>
        )}
      </div>
      
      {content ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-neutral-100 border-b border-neutral-200 flex items-center gap-3">
            <FileText size={20} className="text-primary" />
            <span className="font-medium">{title}</span>
          </div>
          
          <PdfExporter
            content={content}
            title={title}
            fileName={fileName}
            onExportComplete={handleExportComplete}
            onExportError={handleExportError}
          />
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-lg text-neutral-500">No content provided for export.</p>
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mt-4"
          >
            Return to Editor
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdfExport;
