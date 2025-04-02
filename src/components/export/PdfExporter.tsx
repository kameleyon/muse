import React, { useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import MarkdownVisualizer from '@/components/content/visualization/MarkdownVisualizer';
import { htmlToMarkdown } from '@/lib/htmlToMarkdown';

interface PdfExporterProps {
  content: string; // HTML content
  title?: string;
  fileName?: string;
  onExportComplete?: (url: string) => void;
  onExportError?: (error: Error) => void;
}

/**
 * PdfExporter - Component that renders content for PDF export
 * Formats the content to match the content editor's appearance
 */
const PdfExporter: React.FC<PdfExporterProps> = ({
  content,
  title = 'Markdown Export',
  fileName = 'document-export',
  onExportComplete,
  onExportError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  
  // Convert HTML to Markdown
  useEffect(() => {
    if (content) {
      const markdown = htmlToMarkdown(content);
      setMarkdownContent(markdown);
    }
  }, [content]);

  // Generate a unique ID for the document
  const documentId = useRef(
    Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15)
  );

  // Function to generate PDF
  const generatePdf = async () => {
    if (!containerRef.current || isExporting) return;
    
    setIsExporting(true);
    
    try {
      // Create PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set document properties
      const fullTitle = `${documentId.current} - ${title}`;
      doc.setProperties({
        title: fullTitle,
        subject: 'Generated Document',
        author: 'MagicMuse',
        keywords: 'MagicMuse, PDF, Document',
        creator: 'MagicMuse PDF Generator'
      });
      
      // Get page dimensions
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();
      const margin = 15; // Page margin
      
      // Skip title page - removed as requested
      
      // Capture content area
      const canvas = await html2canvas(containerRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Calculate content dimensions
      const contentWidth = pdfWidth - (margin * 2);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const aspectRatio = imgHeight / imgWidth;
      const scaledImgHeight = contentWidth * aspectRatio;
      
      // Add content directly to pages without a title page
      let position = 0;
      const contentHeight = pdfHeight - (margin * 2);
      const totalPages = Math.ceil(scaledImgHeight / contentHeight);
      
      for (let i = 0; i < totalPages; i++) {
        // Add a new page for each content section
        if (i > 0) {
          doc.addPage();
        }
        
        // Calculate position for current page
        const pdfImageY = margin - position;
        
        // Add image slice to page
        doc.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin,
          pdfImageY,
          contentWidth,
          scaledImgHeight,
          undefined,
          'FAST'
        );
        
        position += contentHeight;
        
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i + 1} of ${totalPages}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pdfHeight - 10);
      }
      
      // Generate blob URL
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      
      setExportUrl(url);
      if (onExportComplete) {
        onExportComplete(url);
      }
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      if (onExportError && error instanceof Error) {
        onExportError(error);
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Trigger PDF generation when component mounts
  useEffect(() => {
    if (markdownContent) {
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => {
        generatePdf();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [markdownContent]);

  return (
    <div>
      {/* Hidden content container for PDF generation */}
      <div 
        ref={containerRef} 
        style={{ 
          width: '800px',
          padding: '30px',
          backgroundColor: 'white',
          fontFamily: 'system-ui, sans-serif',
          position: 'absolute',
          left: '-9999px',
          top: '0'
        }}
      >
        <MarkdownVisualizer
          content={markdownContent}
          enhanceVisuals={true}
          brandColors={{
            primary: '#ae5630',
            secondary: '#232321',
            accent: '#9d4e2c',
            highlight: '#9d4e2c',
            background: '#ffffff'
          }}
          fonts={{
            headingFont: 'Comfortaa, sans-serif',
            bodyFont: 'Questrial, sans-serif'
          }}
          options={{
            showCharts: true,
            showTables: true,
            showDiagrams: true,
            chartHeight: 350,
            animateCharts: false
          }}
        />
      </div>
      
      {/* Status display */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        {isExporting ? (
          <p>Generating PDF...</p>
        ) : exportUrl ? (
          <div>
            <p>PDF Generated Successfully!</p>
            <a 
              href={exportUrl} 
              download={`${fileName}.pdf`}
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#ae5630',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                margin: '10px 0'
              }}
            >
              Download PDF
            </a>
      <iframe 
        src={exportUrl} 
        style={{ 
          width: '100%', 
          height: '800px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginTop: '20px'
        }}
      />
          </div>
        ) : (
          <p>Preparing export...</p>
        )}
      </div>
    </div>
  );
};

export default PdfExporter;
