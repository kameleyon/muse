// src/utils/export/exportUtils.ts
import jsPDF from 'jspdf';
import TurndownService from 'turndown';

/**
 * Exports HTML content as a PDF file.
 * Note: Basic implementation, styling and complex layouts might require more advanced setup.
 * @param htmlContent The HTML string to export.
 * @param filename The desired name for the output PDF file (without extension).
 */
export const exportHtmlToPdf = (htmlContent: string, filename: string = 'document'): void => {
  try {
    const pdf = new jsPDF();

    // Basic HTML rendering - jsPDF's `html` method has limitations.
    // For complex HTML, consider libraries like html2canvas + jsPDF.
    // This example adds the HTML as simple text, which might lose formatting.
    // A better approach might parse the HTML and add elements manually or use `html` method carefully.

    // Example using the 'html' method (might need html2canvas for better results)
    // Requires careful setup and might not work perfectly out-of-the-box.
    // pdf.html(htmlContent, {
    //   callback: function (doc) {
    //     doc.save(`${filename}.pdf`);
    //   },
    //   x: 10,
    //   y: 10,
    //   width: 180, // Adjust width as needed
    //   windowWidth: 800 // Adjust simulated window width
    // });

    // Simpler text-based approach (loses formatting):
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    pdf.text(element.innerText || '', 10, 10); // Add text content
    pdf.save(`${filename}.pdf`);

    console.log(`Exported ${filename}.pdf successfully (basic text).`);

  } catch (error) {
    console.error('Failed to export HTML to PDF:', error);
    alert('Failed to export PDF. Please try again.');
  }
};

/**
 * Converts HTML content to Markdown using Turndown.
 * @param htmlContent The HTML string to convert.
 * @returns The converted Markdown string.
 */
export const convertHtmlToMarkdown = (htmlContent: string): string => {
  try {
    const turndownService = new TurndownService({
        headingStyle: 'atx', // Use # for headings
        codeBlockStyle: 'fenced', // Use ``` for code blocks
    });
    // Add specific rules if needed, e.g., for custom elements or styling nuances
    // turndownService.addRule(...)
    const markdown = turndownService.turndown(htmlContent);
    return markdown;
  } catch (error) {
    console.error('Failed to convert HTML to Markdown:', error);
    return ''; // Return empty string or throw error as appropriate
  }
};

/**
 * Triggers a download of text content as a file.
 * @param content The text content (e.g., Markdown).
 * @param filename The desired filename (including extension).
 * @param mimeType The MIME type for the file (e.g., 'text/markdown').
 */
export const downloadTextFile = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
    try {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`Triggered download for ${filename}.`);
    } catch (error) {
        console.error(`Failed to download ${filename}:`, error);
        alert(`Failed to download ${filename}. Please try again.`);
    }
};

/**
 * Exports HTML content as a Markdown file (.md).
 * @param htmlContent The HTML string to export.
 * @param filename The desired name for the output MD file (without extension).
 */
export const exportHtmlToMarkdownFile = (htmlContent: string, filename: string = 'document'): void => {
    const markdownContent = convertHtmlToMarkdown(htmlContent);
    if (markdownContent) {
        downloadTextFile(markdownContent, `${filename}.md`, 'text/markdown;charset=utf-8');
    } else {
        alert('Failed to convert content to Markdown for export.');
    }
};

// Add other export/conversion utilities as needed