import React, { useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import MarkdownVisualizer from '@/components/content/visualization/MarkdownVisualizer';
import { htmlToMarkdown } from '@/lib/htmlToMarkdown';

interface PdfExporterProps {
  content: string;
  title?: string;
  fileName?: string;
  onExportComplete?: (url: string) => void;
  onExportError?: (error: Error) => void;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    highlight?: string;
    background?: string;
  };
}

/**
 * Simplified PdfExporter that uses a single-pass direct rendering approach
 * to ensure consistency and reliability
 */
const PdfExporter: React.FC<PdfExporterProps> = ({
  content,
  title = 'Document Export',
  fileName = 'document-export',
  onExportComplete,
  onExportError,
  brandColors = {
    primary: '#ae5630',
    secondary: '#232321',
    accent: '#9d4e2c',
    highlight: '#9d4e2c',
    background: '#ffffff'
  }
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Clean up the content by removing unwanted elements
  useEffect(() => {
    if (content) {
      try {
        // Remove logo and back to QA references
        let processedContent = content
          .replace(/<div[^>]*logo[^>]*>.*?<\/div>/gi, '')
          .replace(/Logo/gi, '')
          .replace(/<button[^>]*>.*?Back to QA.*?<\/button>/gi, '')
          .replace(/Back to QA/gi, '');
        
        // Convert to markdown
        const markdown = htmlToMarkdown(processedContent);
        setMarkdownContent(markdown);
      } catch (err) {
        console.error("Error processing content:", err);
        if (onExportError) onExportError(err as Error);
      }
    }
  }, [content]);
  
  // Apply styling to container when markdown is ready
  useEffect(() => {
    if (markdownContent && containerRef.current) {
      // Add styling to container
      const container = containerRef.current;
      container.style.width = '800px';
      container.style.padding = '40px';
      container.style.backgroundColor = brandColors.background ?? '#ffffff'; // Default to white if undefined
      container.style.color = '#333333';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.fontSize = '14px';
      container.style.lineHeight = '1.5';
      
      // Signal that the container is ready for rendering
      setTimeout(() => setIsReady(true), 1000);
    }
  }, [markdownContent, brandColors]);
  
  // When ready, start the PDF generation
  useEffect(() => {
    if (isReady && containerRef.current && !isExporting && !exportUrl) {
      generateSimplePdf();
    }
  }, [isReady, isExporting, exportUrl]);
  
  // Simple, straightforward PDF generation
  const generateSimplePdf = async () => {
    if (!containerRef.current) return;
    
    setIsExporting(true);
    console.log('Starting simple PDF generation');
    
    try {
      const container = containerRef.current;
      
      // Ensure container is visible for rendering
      container.style.position = 'absolute';
      container.style.left = '0';
      container.style.top = '0';
      container.style.zIndex = '-9999';
      container.style.visibility = 'visible';
      
      // Add to body for rendering if not already there
      if (!document.body.contains(container)) {
        document.body.appendChild(container);
      }
      
      // Get document natural measurements
      const docHeight = container.scrollHeight;
      const docWidth = container.offsetWidth;
      
      console.log(`Document dimensions: ${docWidth}x${docHeight}px`);
      
      // Create new jsPDF instance with A4 page size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      
      // A4 dimensions in points
      const a4Width = 595;
      const a4Height = 842;
      
      // Calculate scale to fit content width to page width, with margins
      const margin = 40;
      const contentWidth = a4Width - (margin * 2);
      const scale = contentWidth / docWidth;
      
      // Calculate total scaled height
      const scaledHeight = docHeight * scale;
      const contentHeight = a4Height - (margin * 2);
      
      // Calculate number of pages needed
      const pageCount = Math.ceil(scaledHeight / contentHeight);
      console.log(`Document will require ${pageCount} pages at scale ${scale.toFixed(2)}`);
      
      // Generate each page
      const promises = [];
      
      for (let i = 0; i < pageCount; i++) {
        const yPos = i * (contentHeight / scale);
        const remainingHeight = Math.min(contentHeight / scale, docHeight - yPos);
        
        console.log(`Rendering page ${i + 1}, starting at y=${yPos}px, height=${remainingHeight}px`);
        
        // Create a promise to render this page segment
        const promise = html2canvas(container, {
          y: yPos,
          height: remainingHeight,
          width: docWidth,
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: brandColors.background,
          logging: false
        }).then(canvas => {
          // Add a new page for all pages after the first
          if (i > 0) {
            pdf.addPage();
          }
          
          // Add the rendered section to the PDF
          pdf.addImage(
            canvas.toDataURL('image/jpeg', 0.95),
            'JPEG',
            margin,
            margin,
            contentWidth,
            (canvas.height * contentWidth) / canvas.width
          );
          
          // Add page number
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          
          // Page number at bottom center
          pdf.text(
            `Page ${i + 1} of ${pageCount}`,
            a4Width / 2,
            a4Height - 20,
            { align: 'center' }
          );
          
          // Generation date at bottom left
          pdf.text(
            `Generated: ${new Date().toLocaleDateString()}`,
            margin,
            a4Height - 20
          );
          
          return i + 1; // Return page number for tracking progress
        });
        
        promises.push(promise);
      }
      
      // Wait for all pages to be rendered
      await Promise.all(promises);
      
      // Generate PDF blob
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      
      // Set URL and complete
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
      
      // Clean up - remove container from body if it was added
      if (containerRef.current && document.body.contains(containerRef.current)) {
        document.body.removeChild(containerRef.current);
      }
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Revoke object URL to avoid memory leaks
      if (exportUrl) {
        URL.revokeObjectURL(exportUrl);
      }
      
      // Remove container from body only if it's a direct child
      if (containerRef.current && containerRef.current.parentNode === document.body) {
        document.body.removeChild(containerRef.current);
      }
    };
  }, [exportUrl]);
  
  return (
    <div className="pdf-exporter">
      {/* Hidden container that will be used for rendering the PDF */}
      <div 
        id="content-for-pdf"
        ref={containerRef} 
        style={{ 
          visibility: 'hidden',
          position: 'absolute',
          left: '-9999px',
          top: '0',
          zIndex: '-1000',
        }}
      >
        <MarkdownVisualizer
          content={markdownContent}
          enhanceVisuals={true}
          brandColors={brandColors}
          fonts={{
            headingFont: 'Arial, sans-serif',
            bodyFont: 'Arial, sans-serif'
          }}
          options={{
            showCharts: true, 
            showTables: true,
            showDiagrams: true,
            chartHeight: 300,
            animateCharts: false
          }}
        />
      </div>
      
      {/* Status display */}
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        marginTop: '20px' 
      }}>
        {isExporting ? (
          <div>
            <div style={{ margin: '20px 0' }}>
              <div style={{
                width: '40px',
                height: '40px',
                margin: '0 auto 20px',
                border: `3px solid ${brandColors.primary}30`,
                borderTop: `3px solid ${brandColors.primary}`,
                borderRadius: '50%',
                animation: 'spin 1.5s linear infinite'
              }}/>
              
              <p style={{ 
                color: brandColors.secondary,
                marginBottom: '10px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                Generating PDF
              </p>
              
              <p style={{ color: '#666', fontSize: '14px' }}>
                Please wait while we create your document...
              </p>
            </div>
            
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : exportUrl ? (
          <div>
            <div style={{ 
              backgroundColor: '#f0f9f0', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #d0e9d0'
            }}>
              <p style={{ 
                color: '#2a6a2a', 
                fontWeight: 'bold',
                fontSize: '16px',
                marginBottom: '10px' 
              }}>
                PDF Generated Successfully!
              </p>
              
              <a 
                href={exportUrl} 
                download={`${fileName}.pdf`}
                style={{
                  display: 'inline-block',
                  padding: '12px 25px',
                  backgroundColor: brandColors.primary,
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  margin: '10px 0',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Download PDF
              </a>
            </div>
            
            <div style={{ 
              border: `1px solid #e0e0e0`,
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <iframe 
                src={exportUrl} 
                title="PDF Preview"
                style={{ 
                  width: '100%', 
                  height: '600px', 
                  border: 'none',
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ padding: '30px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              margin: '0 auto 20px',
              border: `3px solid ${brandColors.primary}30`,
              borderTop: `3px solid ${brandColors.primary}`,
              borderRadius: '50%',
              animation: 'spin 1.5s linear infinite'
            }}/>
            
            <p style={{ 
              color: brandColors.secondary,
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Preparing Document
            </p>
            
            <p style={{ color: '#666', fontSize: '14px' }}>
              {!markdownContent ? "Processing content..." : 
               !isReady ? "Formatting document..." : 
               "Analyzing document structure..."}
            </p>
            
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfExporter;