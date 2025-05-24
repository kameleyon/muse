import React, { useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import MarkdownVisualizer from '@/components/content/visualization/MarkdownVisualizer';
import { htmlToMarkdown } from '@/lib/htmlToMarkdown';

interface PdfExporterProps {
  content: string;
  title?: string;
  fileName?: string;
  templateId?: string; // Add template ID to control styling
  onExportComplete?: (url: string) => void;
  onExportError?: (error: Error) => void;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    highlight?: string;
    background?: string;
  };
  fonts?: {
    headingFont?: string;
    bodyFont?: string;
  };
}

// Template-specific styling configurations
const TEMPLATE_STYLES: Record<string, {
  fonts: { headingFont: string; bodyFont: string };
  extraStyles?: React.CSSProperties;
}> = {
  'minimalist-pro': {
    fonts: {
      headingFont: 'Helvetica, Arial, sans-serif',
      bodyFont: 'Helvetica, Arial, sans-serif'
    },
    extraStyles: {
      lineHeight: '1.8',
      letterSpacing: '0.01em'
    }
  },
  'corporate-blue': {
    fonts: {
      headingFont: 'Georgia, serif',
      bodyFont: 'Arial, sans-serif'
    },
    extraStyles: {
      lineHeight: '1.6'
    }
  },
  'creative-splash': {
    fonts: {
      headingFont: 'Segoe UI, Roboto, sans-serif',
      bodyFont: 'Segoe UI, Roboto, sans-serif'
    },
    extraStyles: {
      lineHeight: '1.7',
      letterSpacing: '0.02em'
    }
  },
  'data-focus': {
    fonts: {
      headingFont: 'Tahoma, sans-serif',
      bodyFont: 'Tahoma, sans-serif'
    },
    extraStyles: {
      letterSpacing: '0'
    }
  },
  'narrative-arc': {
    fonts: {
      headingFont: 'Palatino, serif',
      bodyFont: 'Palatino, serif'
    },
    extraStyles: {
      lineHeight: '1.8',
      letterSpacing: '0.01em'
    }
  },
  'tech-startup': {
    fonts: {
      headingFont: 'Consolas, monospace',
      bodyFont: 'Arial, sans-serif'
    }
  },
  'elegant-gradient': {
    fonts: {
      headingFont: 'Garamond, serif',
      bodyFont: 'Garamond, serif'
    },
    extraStyles: {
      lineHeight: '1.6',
      letterSpacing: '0.02em'
    }
  },
  'bold-contrast': {
    fonts: {
      headingFont: 'Impact, sans-serif',
      bodyFont: 'Arial, sans-serif'
    },
    extraStyles: {
      letterSpacing: '0.02em',
      fontWeight: '500'
    }
  }
};

/**
 * Enhanced PdfExporter that maintains template styling with consistent branding
 */
const PdfExporter: React.FC<PdfExporterProps> = ({
  content,
  title = 'Document Export',
  fileName = 'document-export',
  templateId = 'minimalist-pro', // Default to minimalist if no template specified
  onExportComplete,
  onExportError,
  brandColors = {
    primary: '#ae5630',
    secondary: '#232321',
    accent: '#9d4e2c',
    highlight: '#9d4e2c',
    background: '#ffffff'
  },
  fonts
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
        let markdown = htmlToMarkdown(processedContent);
        
        // Format code blocks with Mermaid syntax for better PDF display
        markdown = markdown.replace(/```graph TB\s+([\s\S]*?)```/g, (match, code) => {
          return `\n<div class="diagram-block">\n<div class="diagram-title">Business Model Diagram</div>\n<pre class="diagram-content">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>\n</div>\n`;
        });
        
        // Format chart data blocks for better PDF display
        markdown = markdown.replace(/```chart\s+([\s\S]*?)```/g, (match, code) => {
          let title = "Chart Data";
          try {
            // Try to detect chart type from the data
            if (code.includes('"revenue"') || code.includes('"sales"')) {
              title = "Revenue Chart";
            } else if (code.includes('"market"') || code.includes('"share"')) {
              title = "Market Analysis";
            } else if (code.includes('"trend"')) {
              title = "Trend Analysis";
            }
          } catch (e) {}
          
          return `\n<div class="chart-data">\n<div class="chart-title">${title}</div>\n${code}\n</div>\n`;
        });
        
        // Enhanced table rendering with proper styling
        markdown = markdown.replace(/```(\s*\|.*\|[\s\S]*?\|.*\|)\s*```/g, (match, tableContent) => {
          return `\n<div class="table-container">\n<div class="table-title">Comparison Data</div>\n${tableContent}\n</div>\n`;
        });
        
        // Remove horizontal rules and other slide separators
        markdown = markdown.replace(/^\s*---+\s*$/gm, '');
        markdown = markdown.replace(/^\s*\*\*\*+\s*$/gm, '');
        markdown = markdown.replace(/<!--\s*slide-separator\s*-->/gi, '');
        
        // Remove code block style syntax markers (```css, ```ts, etc) 
        markdown = markdown.replace(/```(css|js|typescript|json|xml|html|bash|shell)\n/g, "```\n");
        
        setMarkdownContent(markdown);
      } catch (err) {
        console.error("Error processing content:", err);
        if (onExportError) onExportError(err as Error);
      }
    }
  }, [content, onExportError]);
  
  // Apply styling to container when markdown is ready
  useEffect(() => {
    if (markdownContent && containerRef.current) {
      // Add styling to container
      const container = containerRef.current;
      // Get template-specific styling
      const templateStyle = TEMPLATE_STYLES[templateId] || TEMPLATE_STYLES['minimalist-pro'];
      const templateFonts = fonts || templateStyle.fonts;
      
      // Apply styles with increased width for better readability
      container.style.width = '850px';
      container.style.padding = '60px 60px 50px 60px';
      container.style.backgroundColor = brandColors.background || '#ffffff';
      container.style.color = '#333333';
      
      // Apply font family
      if (templateFonts.bodyFont) {
        container.style.fontFamily = templateFonts.bodyFont;
      } else {
        container.style.fontFamily = 'Arial, sans-serif';
      }
      
      container.style.fontSize = '14px';
      
      // Default line height
      container.style.lineHeight = '1.5';
      
      // Apply template-specific line height if available
      if (templateStyle.extraStyles && typeof templateStyle.extraStyles.lineHeight === 'string') {
        container.style.lineHeight = templateStyle.extraStyles.lineHeight;
      }
      
      // Apply other template-specific styles
      if (templateStyle.extraStyles) {
        if (typeof templateStyle.extraStyles.letterSpacing === 'string') {
          container.style.letterSpacing = templateStyle.extraStyles.letterSpacing;
        }
        
        if (typeof templateStyle.extraStyles.fontWeight === 'string') {
          container.style.fontWeight = templateStyle.extraStyles.fontWeight;
        }
      }
      
      // Enhanced styles for better PDF rendering
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        #content-for-pdf {
          color: #333333;
          padding-bottom: 65px; /* Extra space at bottom */
        }
        
        #content-for-pdf h1, #content-for-pdf h2, #content-for-pdf h3, #content-for-pdf h4, #content-for-pdf h5, #content-for-pdf h6 {
          font-family: ${templateFonts.headingFont || 'Arial, sans-serif'};
          margin-top: 1.5em;
          margin-bottom: 0.1em;
          page-break-after: avoid;
          page-break-inside: avoid;
          color: ${brandColors.primary || '#ae5630'};
        }
        
        #content-for-pdf h1 {
          font-size: 26px;
          color: ${brandColors.primary || '#ae5630'};
          border-bottom: 2px solid ${brandColors.primary + '30' || '#ae563030'};
          padding-bottom: 8px;
        }
        
        #content-for-pdf h2 {
          font-size: 22px;
          color: ${brandColors.secondary || '#232321'};
        }
        
        #content-for-pdf h3 {
          font-size: 18px;
          color: ${brandColors.secondary || '#232321'};
        }
        
        #content-for-pdf h4 {
          font-size: 16px;
          color: ${brandColors.accent || '#9d4e2c'};
        }
        
        #content-for-pdf p {
          margin-bottom: 1em;
          line-height: ${typeof templateStyle.extraStyles?.lineHeight === 'string' ? 
            templateStyle.extraStyles.lineHeight : '1.5'};
          orphans: 3;
          widows: 3;
          word-wrap: break-word;
          overflow-wrap: break-word;
          page-break-inside: avoid;
        }
        
        #content-for-pdf strong {
          color: ${brandColors.primary || '#ae5630'};
          font-weight: 600;
        }
        
        #content-for-pdf em {
          color: ${brandColors.secondary || '#232321'};
        }
        
        #content-for-pdf a {
          color: ${brandColors.accent || '#9d4e2c'};
          text-decoration: none;
          border-bottom: 1px dotted ${brandColors.accent || '#9d4e2c'};
        }
        
        #content-for-pdf ul, #content-for-pdf ol {
          padding-left: 1.5rem;
          margin-top: 0.05em;
          margin-bottom: 1rem;
          page-break-inside: avoid;
        }
        
        #content-for-pdf li {
          margin-bottom: 0.25rem;
          page-break-inside: avoid;
          orphans: 2;
          widows: 2;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        #content-for-pdf pre {
          background-color: #f6f8fa;
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.4;
          white-space: pre-wrap;
          margin-bottom: 1.5em;
          page-break-inside: avoid;
          border: 1px solid #e1e4e8;
          max-width: 100%;
        }
        
        #content-for-pdf code {
          font-family: 'Courier New', monospace;
          background-color: rgba(0, 0, 0, 0.05);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
        }
        
        #content-for-pdf pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
        }
        
        #content-for-pdf .table-container {
          margin: 30px 0;
          page-break-inside: avoid;
          background: #ffffff;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          overflow: hidden;
        }
        
        #content-for-pdf .table-title {
          font-family: ${templateFonts.headingFont || 'Arial, sans-serif'};
          font-size: 15px;
          font-weight: bold;
          text-align: center;
          padding: 10px;
          background-color: ${brandColors.primary + '15' || '#ae563015'};
          color: ${brandColors.secondary || '#232321'};
          border-bottom: 1px solid #e0e0e0;
        }
        
        #content-for-pdf table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
          font-size: 14px;
        }
        
        #content-for-pdf th, #content-for-pdf td {
          border: 1px solid #ddd;
          padding: 12px 15px;
          text-align: left;
          vertical-align: top;
        }
        
        #content-for-pdf th {
          background-color: ${brandColors.primary + '10' || '#ae563010'};
          border-bottom: 2px solid ${brandColors.primary + '30' || '#ae563030'};
          font-weight: bold;
          color: ${brandColors.primary || '#ae5630'};
          font-size: 14px;
        }
        
        #content-for-pdf tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        #content-for-pdf tr:hover {
          background-color: #f5f5f5;
        }
        
        #content-for-pdf blockquote {
          border-left: 4px solid ${brandColors.accent || '#9d4e2c'};
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          margin-bottom: 1rem;
          font-style: italic;
          color: #555;
        }
        
        #content-for-pdf hr {
          display: none;
        }
        
        #content-for-pdf img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
          page-break-inside: avoid;
        }
        
        #content-for-pdf .chart-data,
        #content-for-pdf .mermaid-diagram,
        #content-for-pdf .diagram-block {
          text-align: center;
          margin: 20px auto;
          page-break-inside: avoid;
          max-width: 100%;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
        }
        
        #content-for-pdf .chart-title,
        #content-for-pdf .diagram-title {
          font-family: ${templateFonts.headingFont || 'Arial, sans-serif'};
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          color: ${brandColors.primary || '#ae5630'};
          border-bottom: 1px solid ${brandColors.primary + '30' || '#ae563030'};
          padding-bottom: 5px;
        }
        
        #content-for-pdf .diagram-content {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.4;
          text-align: left;
          white-space: pre-wrap;
          padding: 10px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 3px;
          overflow-x: auto;
          max-width: 100%;
        }
      `;
      container.appendChild(styleEl);
      
      // Signal that the container is ready for rendering
      setTimeout(() => setIsReady(true), 1000);
    }
  }, [markdownContent, brandColors, templateId, fonts]);
  
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
      // Use slightly wider margins to improve readability
      const a4Width = 595;
      const a4Height = 842;
      
      // Calculate scale to fit content width to page width, with margins
      const margin = 50;
      const contentWidth = a4Width - (margin * 2);
      const scale = contentWidth / docWidth;
      
      // Calculate total scaled height
      const scaledHeight = docHeight * scale;
      const contentHeight = a4Height - (margin * 2);
      
      // Calculate number of pages needed
      const pageCount = Math.ceil(scaledHeight / contentHeight);
      console.log(`Document will require ${pageCount} pages at scale ${scale.toFixed(2)}`);
      
      // Helper function to find safe break points (avoid cutting text)
      const findSafeBreakPoint = (startY: number, maxHeight: number): number => {
        // Make container visible temporarily for accurate measurements
        const originalPosition = container.style.position;
        const originalLeft = container.style.left;
        container.style.position = 'absolute';
        container.style.left = '0';
        
        const elements = Array.from(container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, div, ul, ol'));
        let bestBreakPoint = maxHeight * 0.75; // Start more conservative
        let foundGoodBreak = false;
        
        // Look for elements that would be good break points
        const goodBreakPoints: number[] = [];
        
        for (const element of elements) {
          const rect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const elementTop = rect.top - containerRect.top - startY;
          const elementBottom = elementTop + rect.height;
          
          // Skip elements completely before our range
          if (elementBottom <= 10) continue;
          
          // For text content elements, avoid splitting them
          if (['P', 'LI', 'BLOCKQUOTE', 'PRE'].includes(element.tagName)) {
            // If element would be cut off, break before it
            if (elementTop >= 0 && elementTop < maxHeight && elementBottom > maxHeight) {
              goodBreakPoints.push(elementTop - 10); // Small buffer
              foundGoodBreak = true;
            }
            // If element ends cleanly within range, it's a good break point
            else if (elementBottom > 0 && elementBottom <= maxHeight - 50) {
              goodBreakPoints.push(elementBottom + 5); // Small buffer after
              foundGoodBreak = true;
            }
          }
          
          // For headings, ensure they stay with following content
          if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
            // Never break right after a heading
            if (elementBottom > 0 && elementBottom < maxHeight - 100) {
              // Find next content element
              const nextElement = element.nextElementSibling;
              if (nextElement) {
                const nextRect = nextElement.getBoundingClientRect();
                const nextTop = nextRect.top - containerRect.top - startY;
                const nextBottom = nextTop + nextRect.height;
                
                // If heading + next element fit, don't break between them
                if (nextBottom <= maxHeight) {
                  continue;
                } else {
                  // Break before the heading instead
                  goodBreakPoints.push(elementTop - 10);
                  foundGoodBreak = true;
                }
              }
            }
          }
        }
        
        // Restore container position
        container.style.position = originalPosition;
        container.style.left = originalLeft;
        
        if (foundGoodBreak && goodBreakPoints.length > 0) {
          // Find the best break point (closest to ideal height but not exceeding)
          const idealHeight = maxHeight * 0.85;
          bestBreakPoint = goodBreakPoints.reduce((best, current) => {
            if (current <= maxHeight && current >= maxHeight * 0.5) {
              return Math.abs(current - idealHeight) < Math.abs(best - idealHeight) ? current : best;
            }
            return best;
          }, goodBreakPoints[0]);
        }
        
        // Ensure minimum and maximum bounds
        bestBreakPoint = Math.max(bestBreakPoint, maxHeight * 0.5);
        bestBreakPoint = Math.min(bestBreakPoint, maxHeight);
        
        return bestBreakPoint;
      };

      // Generate each page with intelligent break points
      const promises = [];
      let currentY = 0;
      let pageIndex = 0;
      
      while (currentY < docHeight && pageIndex < 50) { // Safety limit
        const maxPageHeight = contentHeight / scale;
        const remainingContent = docHeight - currentY;
        
        let pageHeight;
        if (remainingContent <= maxPageHeight) {
          // Last page - use remaining content
          pageHeight = remainingContent;
        } else {
          // Find safe break point
          pageHeight = findSafeBreakPoint(currentY, maxPageHeight);
        }
        
        console.log(`Rendering page ${pageIndex + 1}, starting at y=${currentY}px, height=${pageHeight}px`);
        
        // Create a promise to render this page segment
        const promise = html2canvas(container, {
          y: currentY,
          height: pageHeight,
          width: docWidth,
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: brandColors.background || '#ffffff',
          logging: false
        }).then(canvas => {
          // Add a new page for all pages after the first
          if (pageIndex > 0) {
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
          
          // Add header with title
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            title,
            margin,
            margin / 2
          );
          
          // Page number at bottom right
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            `Page ${pageIndex + 1}`,
            a4Width - margin,
            a4Height - 20,
            { align: 'right' }
          );
          
          // Generation date at bottom left
          pdf.text(
            `Generated: ${new Date().toLocaleDateString()}`,
            margin,
            a4Height - 20
          );
          
          return pageIndex + 1; // Return page number for tracking progress
        });
        
        promises.push(promise);
        currentY += pageHeight;
        pageIndex++;
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
          fonts={fonts || TEMPLATE_STYLES[templateId]?.fonts || {
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
