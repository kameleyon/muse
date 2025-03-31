// src/services/exportService.ts
import { cleanupJsonCodeBlocks } from '@/utils/markdownFormatter'; // Keep cleanup for potential direct content use elsewhere
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable'; // Keep for potential future table handling if needed directly

// Placeholder for API base URL
const API_BASE_URL = '/api/export';

// --- Types ---
export type ExportFormat = 'pptx' | 'pdf' | 'google_slides' | 'html5' | 'video' | 'mobile' | 'print'; // Export type

interface ExportOptions {
  format: ExportFormat;
  versionId?: string; // Optional: specify version to export
  options?: {
    password?: string;
    tracking?: boolean;
    quality?: 'high' | 'standard';
    includeNotes?: boolean;
  };
}

export interface ExportResult { // Export interface
  downloadUrl?: string; // URL to download the exported file
  shareUrl?: string; // URL for sharing (e.g., Google Slides)
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string; // ID to track async export jobs
}

// Define the brand colors interface (might be used for title/footer)
interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  title?: string;
}

// --- API Functions ---

/**
 * Initiates an export job for a project.
 * @param projectId - The ID of the project to export.
 * @param options - Export configuration options.
 * @returns Promise resolving to the initial export status or result.
 */
export const exportProject = async (projectId: string, options: ExportOptions): Promise<ExportResult> => {
  console.log('API CALL: exportProject', projectId, options);
  // Replace with actual fetch/axios call
  // This might be an async job, returning a jobId initially
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate job start delay

  // Simulate immediate completion for simple formats, or pending for complex ones
  if (options.format === 'pdf' || options.format === 'pptx') {
    // Note: PDF generation is now handled client-side by generateFormattedPdf
    // This simulation might need adjustment depending on how PDF export is triggered
    return {
      status: 'completed',
      downloadUrl: `/exports/${projectId}_${options.format}_${Date.now()}.${options.format === 'pdf' ? 'pdf' : 'pptx'}` // Placeholder URL
    };
  } else {
     return { status: 'pending', jobId: `export_${Date.now()}` };
  }
};

/**
 * Checks the status of an asynchronous export job.
 * @param jobId - The ID of the export job.
 * @returns Promise resolving to the current export status or result.
 */
export const getExportStatus = async (jobId: string): Promise<ExportResult> => {
  console.log('API CALL: getExportStatus', jobId);
   // Replace with actual fetch/axios call
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate progress -> completion
  if (Math.random() > 0.3) { // Simulate still processing
     return { status: 'processing', jobId };
  } else {
     // Simulate completion (determine format based on jobId or another way)
     const format = 'google_slides'; // Example
     return {
       status: 'completed',
       shareUrl: `https://docs.google.com/presentation/d/example_${jobId}`,
       jobId
     };
  }
};

/**
 * Generates a PDF from an HTML content string using html2canvas and jsPDF.
 * Preserves styling and layout by rendering the HTML temporarily.
 * @param projectId - The ID of the project (used for filename/title).
 * @param htmlContent - The HTML content string to export.
 * @param brandColors - Optional brand colors (currently used for title/footer).
 * @returns Promise resolving to the export result with a blob URL.
 */
export const generateFormattedPdf = async (
  projectId: string,
  htmlContent: string, // Accept HTML string
  brandColors?: BrandColors
): Promise<ExportResult> => {
  console.log('API CALL: generateFormattedPdf using html2canvas from string', projectId);

  if (!htmlContent) {
    console.error('PDF generation failed: HTML content string not provided.');
    return { status: 'failed' };
  }

  // --- 1. Create a temporary element to render HTML ---
  const tempContainer = document.createElement('div');
  // Apply styles to make it render off-screen but with a defined width
  // Use a fixed width similar to the editor's expected rendering width for consistency
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px'; // Move off-screen
  tempContainer.style.top = '0';
  tempContainer.style.width = '800px'; // Adjust width as needed, e.g., based on editor width
  tempContainer.style.padding = '15px'; // Simulate some padding
  tempContainer.style.backgroundColor = 'white'; // Ensure a background
  tempContainer.innerHTML = htmlContent; // Set the content

  // Append to body to allow rendering
  document.body.appendChild(tempContainer);

  let pdfBlobUrl: string | null = null;
  let exportStatus: 'completed' | 'failed' = 'failed'; // Default to failed

  try {
    // --- 2. Capture the temporary element using html2canvas ---
    const canvas = await html2canvas(tempContainer, {
      scale: 2, // Increase scale for better resolution
      useCORS: true,
      logging: false,
      // Ensure background is captured if needed
      backgroundColor: '#ffffff',
    });

    // --- 3. Prepare jsPDF Document ---
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    const margin = 15; // Page margin
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = pdfHeight - (margin * 2);

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const aspectRatio = imgHeight / imgWidth;
    const scaledImgHeight = contentWidth * aspectRatio;

    // Set document properties
    const title = brandColors?.title || `MagicMuse Document - ${projectId}`;
    doc.setProperties({
      title: title,
      subject: 'Generated by MagicMuse',
      author: 'MagicMuse',
      keywords: 'MagicMuse, PDF, Document',
      creator: 'MagicMuse PDF Generator (html2canvas)'
    });

    // --- 4. Add Title Page (Optional) ---
    const primaryColor = brandColors?.primary || '#ae5630';
    const secondaryColor = brandColors?.secondary || '#232321';
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);

    doc.setFontSize(22);
    doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    doc.text(title, pdfWidth / 2, 40, { align: 'center', maxWidth: contentWidth });

    doc.setFontSize(12);
    doc.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 55, { align: 'center' });

    doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    doc.setLineWidth(0.5);
    doc.line(margin, 65, pdfWidth - margin, 65);

    // --- 5. Add Captured Content with Paging ---
    let position = 0;
    const totalPages = Math.ceil(scaledImgHeight / contentHeight);

    if (totalPages > 0) {
      doc.addPage();
      const pdfImageY = margin - position;
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
    }

    for (let i = 2; i <= totalPages; i++) {
      doc.addPage();
      const pdfImageY = margin - position;
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
    }

    // --- 6. Add Footer to All Content Pages ---
    const finalPageCount = doc.getNumberOfPages();
    for (let i = 2; i <= finalPageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i - 1} of ${finalPageCount - 1}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      doc.text(`Generated by MagicMuse`, margin, pdfHeight - 10);
    }

    // --- 7. Generate Blob URL ---
    const pdfBlob = doc.output('blob');
    pdfBlobUrl = URL.createObjectURL(pdfBlob);
    exportStatus = 'completed';

  } catch (error) {
    console.error('PDF generation using html2canvas failed:', error);
    exportStatus = 'failed';
  } finally {
    // --- 8. Clean up: Remove the temporary element ---
    if (tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer);
    }
  }

  // --- 9. Return Result ---
  return {
    status: exportStatus,
    downloadUrl: pdfBlobUrl ?? undefined // Return blob URL if successful
  };
};

// Add more functions as needed (batchExport, getExportHistory, etc.)