import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Edit2, ChevronDown, ChevronRight, FileText, File } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { bookService } from '../../../lib/books';
import type { Book, Chapter, BookStructure } from '../../../types/books';
import MarkdownEditor from '../../MarkdownEditor';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const BookPreviewPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const loadBookData = useCallback(async () => {
    console.log('\n=== LOADING BOOK DATA ===');
    console.log('Book ID:', bookId);
    
    if (!bookId) {
      console.log('No bookId provided, returning');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching book data from service...');
      const bookData = await bookService.getBook(bookId);
      
      console.log('Book data received:');
      console.log('  - ID:', bookData?.id);
      console.log('  - Title:', bookData?.title);
      console.log('  - Has structure:', !!bookData?.structure);
      console.log('  - Chapters count:', bookData?.chapters?.length || 0);
      
      if (bookData?.chapters) {
        console.log('\nChapters in loaded book:');
        bookData.chapters.forEach((ch, idx) => {
          console.log(`  [${idx}] Chapter ${ch.number}: "${ch.title}"`);
          console.log(`       - Content length: ${ch.content?.length || 0}`);
          console.log(`       - Has content: ${!!ch.content}`);
        });
      }
      
      setBook(bookData);
      console.log('Book data set to state');
    } catch (err: any) {
      console.error('Error loading book:', err);
      setError(err.message || 'Failed to load book');
    } finally {
      setLoading(false);
      console.log('=== BOOK DATA LOADING COMPLETE ===\n');
    }
  }, [bookId]);

  useEffect(() => {
    loadBookData();
  }, [loadBookData]);

  const downloadMarkdownFile = () => {
    if (!book) return;
    const currentChapters = book.chapters || [];
    let markdownContent = `# ${book.title}\n\n`;

    if (book.structure?.subtitle) {
      markdownContent += `## ${book.structure.subtitle}\n\n`;
    }
    if (book.structure?.coverPageDetails?.authorName) {
      markdownContent += `By ${book.structure.coverPageDetails.authorName}\n\n`;
    }
    markdownContent += '---\n\n';

    const sections: Array<{ title?: string, content?: string, isChapter?: boolean, chapterData?: Chapter, partTitle?: string }> = [];

    if (book.structure?.acknowledgement) sections.push({ title: 'Acknowledgement', content: book.structure.acknowledgement });
    if (book.structure?.prologue) sections.push({ title: 'Prologue', content: book.structure.prologue });
    if (book.structure?.introduction) sections.push({ title: 'Introduction', content: book.structure.introduction });

    if (book.structure?.parts && book.structure.parts.length > 0) {
      book.structure.parts.forEach(part => {
        sections.push({ partTitle: part.partTitle });
        part.chapters.forEach(chapStruct => {
          const chapter = currentChapters.find(c => c.number === chapStruct.number);
          if (chapter) sections.push({ isChapter: true, chapterData: chapter, title: `Chapter ${chapter.number}: ${chapter.title}` });
        });
      });
    } else {
      currentChapters.forEach(chapter => sections.push({ isChapter: true, chapterData: chapter, title: `Chapter ${chapter.number}: ${chapter.title}` }));
    }

    if (book.structure?.conclusion) sections.push({ title: 'Conclusion', content: book.structure.conclusion });
    if (book.structure?.appendix) sections.push({ title: 'Appendix', content: book.structure.appendix });
    if (book.structure?.references) sections.push({ title: 'References', content: book.structure.references });
    
    sections.forEach(sec => {
      if (sec.partTitle) {
        markdownContent += `## ${sec.partTitle}\n\n`;
      } else if (sec.isChapter && sec.chapterData) {
        markdownContent += `### ${sec.title}\n\n`;
        if (sec.chapterData.metadata?.description) markdownContent += `${sec.chapterData.metadata.description}\n\n`;
        markdownContent += `${sec.chapterData.content || '*Not written yet.*'}\n\n`;
      } else if (sec.title && sec.content) {
        markdownContent += `## ${sec.title}\n\n${sec.content}\n\n`;
      }
      markdownContent += '---\n\n';
    });

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'book'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPdfFile = async () => {
    console.log('=== HYBRID PDF GENERATION START ===');
    
    if (!book) {
      console.error('No book object available');
      return;
    }
    
    setPdfLoading(true);
    setPdfProgress(0);
    setError('');

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter'
      });

      // PDF dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 72; // 1 inch = 72 points
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Font settings
      const titleFontSize = 24;
      const h1FontSize = 17;
      const h2FontSize = 15;
      const h3FontSize = 13;
      const normalFontSize = 11;
      const lineHeight = 1.5;

      // Helper functions
      const addNewPage = () => {
        pdf.addPage();
        yPosition = margin;
      };

      const checkPageBreak = (requiredSpace: number, forceNewPage: boolean = false) => {
        if (forceNewPage || yPosition + requiredSpace > pageHeight - margin) {
          addNewPage();
        }
      };

      const wrapText = (text: string, maxWidth: number): string[] => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach(word => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = pdf.getTextWidth(testLine);
          
          if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        
        if (currentLine) {
          lines.push(currentLine);
        }
        
        return lines;
      };

      const addText = (text: string, fontSize: number, options: { bold?: boolean; italic?: boolean; color?: string; indent?: number } = {}) => {
        pdf.setFontSize(fontSize);
        
        if (options.bold && options.italic) {
          pdf.setFont('georgia', 'bolditalic');
        } else if (options.bold) {
          pdf.setFont('georgia', 'bold');
        } else if (options.italic) {
          pdf.setFont('georgia', 'italic');
        } else {
          pdf.setFont('georgia', 'normal');
        }

        if (options.color) {
          const rgb = options.color.match(/\d+/g);
          if (rgb) {
            pdf.setTextColor(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
          }
        } else {
          pdf.setTextColor(51, 51, 51); // #333
        }

        const xPos = margin + (options.indent || 0);
        const lines = wrapText(text, contentWidth - (options.indent || 0));
        
        lines.forEach(line => {
          checkPageBreak(fontSize * lineHeight);
          pdf.text(line, xPos, yPosition);
          yPosition += fontSize * lineHeight;
        });

        // Reset color
        pdf.setTextColor(51, 51, 51);
      };

      const addParagraph = (text: string, indent: number = 50) => {
        yPosition += normalFontSize * 0.5; // Space before paragraph
        addText(text, normalFontSize, { indent });
        yPosition += normalFontSize * 0.5; // Space after paragraph
      };

      const renderComplexElement = async (elementHtml: string, maxWidth: number = contentWidth) => {
        checkPageBreak(100); // Ensure space for element
        
        // Create temporary container attached to DOM
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = `${maxWidth}px`;
        tempContainer.innerHTML = elementHtml;
        document.body.appendChild(tempContainer);
        
        try {
          const canvas = await html2canvas(tempContainer.firstElementChild as HTMLElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: null
          });

          const imgData = canvas.toDataURL('image/png');
          const imgHeight = (canvas.height * maxWidth) / canvas.width;
          
          checkPageBreak(imgHeight);
          pdf.addImage(imgData, 'PNG', margin, yPosition, maxWidth, imgHeight);
          yPosition += imgHeight + 10;
        } finally {
          // Clean up
          document.body.removeChild(tempContainer);
        }
      };

      // Process book content
      const processMarkdownContent = async (markdown: string) => {
        if (!markdown) return;

        const normalizedContent = normalizePastedContent(markdown);
        const lines = normalizedContent.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (!line) {
            yPosition += normalFontSize * 0.5;
            continue;
          }

          // Headers
          if (line.startsWith('#### ')) {
            checkPageBreak(h3FontSize * 2);
            addText(line.substring(5), h3FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
            yPosition += h3FontSize * 0.5;
          } else if (line.startsWith('### ')) {
            checkPageBreak(h3FontSize * 2);
            addText(line.substring(4), h3FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
            yPosition += h3FontSize * 0.5;
          } else if (line.startsWith('## ')) {
            checkPageBreak(h2FontSize * 2);
            addText(line.substring(3), h2FontSize, { bold: true });
            yPosition += h2FontSize * 0.5;
          } else if (line.startsWith('# ')) {
            checkPageBreak(h1FontSize * 2, true); // Force new page for h1
            addText(line.substring(2), h1FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
            yPosition += h1FontSize;
          }
          // Lists
          else if (line.match(/^[-*+]\s+/)) {
            checkPageBreak(normalFontSize * 2);
            const bullet = '• ';
            const listText = line.replace(/^[-*+]\s+/, '');
            pdf.setFontSize(normalFontSize);
            pdf.text(bullet, margin, yPosition);
            const bulletWidth = pdf.getTextWidth(bullet);
            addText(listText, normalFontSize, { indent: bulletWidth + 10 });
          }
          // Numbered lists
          else if (line.match(/^\d+\.\s+/)) {
            checkPageBreak(normalFontSize * 2);
            const match = line.match(/^(\d+\.)\s+(.*)$/);
            if (match) {
              const number = match[1] + ' ';
              const listText = match[2];
              pdf.setFontSize(normalFontSize);
              pdf.text(number, margin, yPosition);
              const numberWidth = pdf.getTextWidth(number);
              addText(listText, normalFontSize, { indent: numberWidth + 10 });
            }
          }
          // Key points (special handling)
          else if (line.includes('+$$$+')) {
            // For key points, we'll need to render as HTML
            const keyPointsMatch = normalizedContent.match(/\+\$\$\$\+([\s\S]+?)\+\$\$\$\+/);
            if (keyPointsMatch) {
              const keyPointsHtml = `
                <div style="border-radius:0.75rem;border:1px solid rgba(120,113,108,.70);background:rgba(120,113,108,.15);padding:1rem;font-weight:500;color:#57534E;font-size:0.875rem;">
                  <h4 style="margin:0 0 0.5rem 0;font-size:1rem;color:#57534E;">Key Points</h4>
                  ${keyPointsMatch[1].split('\n').filter(p => p.trim()).map(point =>
                    `<p style="margin:0.5rem 0;">• ${point.trim()}</p>`
                  ).join('')}
                </div>
              `;
              
              await renderComplexElement(keyPointsHtml);
              
              // Force page break after key points
              addNewPage();
              
              // Skip the lines that were part of key points
              while (i < lines.length && !lines[i].includes('+$$$+')) i++;
              i++; // Skip closing marker
            }
          }
          // Tables (render as HTML)
          else if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
            let tableHtml = '<table style="width:100%;border-collapse:collapse;border:1px solid #ccc;">';
            
            // Header
            const headers = line.split('|').filter(h => h.trim());
            tableHtml += '<tr>';
            headers.forEach(header => {
              tableHtml += `<th style="border:1px solid #ccc;padding:8px;background:#f0f0f0;">${header.trim()}</th>`;
            });
            tableHtml += '</tr>';
            
            // Skip separator line
            i += 2;
            
            // Body rows
            while (i < lines.length && lines[i].includes('|')) {
              const cells = lines[i].split('|').filter(c => c.trim());
              tableHtml += '<tr>';
              cells.forEach(cell => {
                tableHtml += `<td style="border:1px solid #ccc;padding:8px;">${cell.trim()}</td>`;
              });
              tableHtml += '</tr>';
              i++;
            }
            
            tableHtml += '</table>';
            
            const tableContainer = `<div>${tableHtml}</div>`;
            await renderComplexElement(tableContainer);
            i--; // Adjust counter
          }
          // Blockquotes
          else if (line.startsWith('> ')) {
            checkPageBreak(normalFontSize * 3);
            const quoteText = line.substring(2);
            yPosition += normalFontSize * 0.5;
            pdf.setDrawColor(174, 86, 48);
            pdf.setLineWidth(2);
            pdf.line(margin - 10, yPosition - normalFontSize, margin - 10, yPosition + normalFontSize);
            addText(quoteText, normalFontSize, { italic: true, indent: 20 });
            yPosition += normalFontSize * 0.5;
          }
          // Regular paragraphs
          else {
            addParagraph(line);
          }
        }
      };

      // Start PDF generation
      setPdfProgress(10);

      // Cover Page
      if (book.structure?.coverPageDetails) {
        checkPageBreak(pageHeight, true);
        
        // Center vertically
        yPosition = pageHeight / 3;
        
        // Title
        if (book.structure.coverPageDetails.title) {
          pdf.setFontSize(30);
          pdf.setFont('georgia', 'bold');
          pdf.setTextColor(174, 86, 48);
          const titleLines = wrapText(book.structure.coverPageDetails.title, contentWidth);
          titleLines.forEach(line => {
            const textWidth = pdf.getTextWidth(line);
            pdf.text(line, (pageWidth - textWidth) / 2, yPosition);
            yPosition += 36;
          });
        }
        
        // Subtitle
        if (book.structure.coverPageDetails.subtitle) {
          yPosition += 20;
          pdf.setFontSize(18);
          pdf.setFont('georgia', 'normal');
          pdf.setTextColor(102, 102, 102);
          const subtitleLines = wrapText(book.structure.coverPageDetails.subtitle, contentWidth);
          subtitleLines.forEach(line => {
            const textWidth = pdf.getTextWidth(line);
            pdf.text(line, (pageWidth - textWidth) / 2, yPosition);
            yPosition += 22;
          });
        }
        
        // Author
        if (book.structure.coverPageDetails.authorName) {
          yPosition += 40;
          pdf.setFontSize(14);
          pdf.setTextColor(174, 86, 48);
          const authorText = `By ${book.structure.coverPageDetails.authorName}`;
          const textWidth = pdf.getTextWidth(authorText);
          pdf.text(authorText, (pageWidth - textWidth) / 2, yPosition);
        }
      }

      setPdfProgress(20);

      // Table of Contents
      addNewPage();
      addText('Table of Contents', 18, { bold: true, color: 'rgb(174, 86, 48)' });
      yPosition += 30;

      const tocItems: { title: string; isSection: boolean }[] = [];
      
      if (book.structure?.acknowledgement) tocItems.push({ title: 'Acknowledgement', isSection: true });
      if (book.structure?.prologue) tocItems.push({ title: 'Prologue', isSection: true });
      if (book.structure?.introduction) tocItems.push({ title: 'Introduction', isSection: true });

      if (book.structure?.parts && book.structure.parts.length > 0) {
        book.structure.parts.forEach(part => {
          tocItems.push({ title: `Part ${part.partNumber}: ${part.partTitle}`, isSection: true });
          part.chapters.forEach(chapStruct => {
            tocItems.push({ title: `Chapter ${chapStruct.number}: ${chapStruct.title}`, isSection: false });
          });
        });
      } else if (book.chapters) {
        book.chapters.sort((a, b) => a.number - b.number).forEach(chapter => {
          tocItems.push({ title: `Chapter ${chapter.number}: ${chapter.title}`, isSection: true });
        });
      }

      if (book.structure?.conclusion) tocItems.push({ title: 'Conclusion', isSection: true });
      if (book.structure?.appendix) tocItems.push({ title: 'Appendix', isSection: true });
      if (book.structure?.references) tocItems.push({ title: 'References', isSection: true });

      tocItems.forEach(item => {
        checkPageBreak(normalFontSize * 2);
        if (item.isSection) {
          addText(item.title, normalFontSize, { bold: true });
        } else {
          addText(item.title, normalFontSize, { indent: 20 });
        }
      });

      setPdfProgress(30);

      // Content sections with chunking
      const totalSections = tocItems.filter(item => item.isSection).length;
      let processedSections = 0;

      // Helper to update progress
      const updateProgress = () => {
        processedSections++;
        const progress = 30 + Math.round((processedSections / totalSections) * 60);
        setPdfProgress(progress);
      };

      // Process sections
      if (book.structure?.acknowledgement) {
        addNewPage();
        addText('Acknowledgement', h1FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
        yPosition += h1FontSize;
        await processMarkdownContent(book.structure.acknowledgement);
        updateProgress();
      }

      if (book.structure?.prologue) {
        addNewPage();
        addText('Prologue', h1FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
        yPosition += h1FontSize;
        await processMarkdownContent(book.structure.prologue);
        updateProgress();
      }

      if (book.structure?.introduction) {
        addNewPage();
        addText('Introduction', h1FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
        yPosition += h1FontSize;
        await processMarkdownContent(book.structure.introduction);
        updateProgress();
      }

      // Chapters
      const allChapters = book.chapters || [];
      const sortedChapters = [...allChapters].sort((a, b) => a.number - b.number);

      if (book.structure?.parts && book.structure.parts.length > 0) {
        for (const part of book.structure.parts) {
          // Part title page
          addNewPage();
          yPosition = pageHeight / 2 - 50;
          pdf.setFontSize(24);
          pdf.setFont('georgia', 'bold');
          pdf.setTextColor(174, 86, 48);
          const partTitle = `Part ${part.partNumber}: ${part.partTitle}`;
          const textWidth = pdf.getTextWidth(partTitle);
          pdf.text(partTitle, (pageWidth - textWidth) / 2, yPosition);
          updateProgress();

          // Chapters in part
          for (const chapStruct of part.chapters) {
            const chapter = sortedChapters.find(c =>
              (c.number === chapStruct.number && c.title === chapStruct.title) ||
              c.title === chapStruct.title ||
              c.number === chapStruct.number
            );

            if (chapter?.content) {
              addNewPage();
              addText(`Chapter ${chapStruct.number}: ${chapStruct.title}`, h1FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
              yPosition += h1FontSize;

              if (chapStruct.description) {
                addText(chapStruct.description, normalFontSize, { italic: true });
                yPosition += normalFontSize;
              }

              await processMarkdownContent(chapter.content);
              updateProgress();
            }
          }
        }
      } else {
        // No parts structure
        for (const chapter of sortedChapters) {
          if (chapter.content) {
            addNewPage();
            addText(`Chapter ${chapter.number}: ${chapter.title}`, h1FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
            yPosition += h1FontSize;

            if (chapter.metadata?.description) {
              addText(chapter.metadata.description, normalFontSize, { italic: true });
              yPosition += normalFontSize;
            }

            await processMarkdownContent(chapter.content);
            updateProgress();
          }
        }
      }

      if (book.structure?.conclusion) {
        addNewPage();
        addText('Conclusion', h1FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
        yPosition += h1FontSize;
        await processMarkdownContent(book.structure.conclusion);
        updateProgress();
      }

      if (book.structure?.appendix) {
        addNewPage();
        addText('Appendix', h1FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
        yPosition += h1FontSize;
        await processMarkdownContent(book.structure.appendix);
        updateProgress();
      }

      if (book.structure?.references) {
        addNewPage();
        addText('References', h1FontSize, { bold: true, color: 'rgb(174, 86, 48)' });
        yPosition += h1FontSize;
        await processMarkdownContent(book.structure.references);
        updateProgress();
      }

      setPdfProgress(95);

      // Save PDF
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      
      // Download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'book'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setPdfProgress(100);
      console.log('PDF generation completed successfully');
      
      // Reset progress after a short delay
      setTimeout(() => setPdfProgress(0), 1000);
      
    } catch (e) {
      console.error("Error generating PDF:", e);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
      console.log('=== HYBRID PDF GENERATION END ===');
    }
  };

  const generateBookHTML = () => {
    console.log('\n--- generateBookHTML START ---');
    console.log('Book available:', !!book);
    
    if (!book) {
      console.error('No book in generateBookHTML');
      return '';
    }
    
    let html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">

  <!-- Google fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&family=Questrial&display=swap" rel="stylesheet">

  <style>
    /* ---------- 1) SHEET MARGINS ---------- */
    @page {
      margin: 36pt;           /* 0.5-inch on every edge */
    }

    /* ---------- 2) ROOT & BODY ---------- */
    :root {
      --primary-color: #ae5630;
      --primary-light: rgba(174, 86, 48, 0.20);
    }

    body {
      font-family: 'Questrial', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.89;
      color: #333;
      margin: 0;                     /* @page already handles the real margin */
    }

    /* ---------- 3) UNIVERSAL PAGE-BREAK HELPERS ---------- */
    h1, h2, h3, h4, h5, h6,
    p,
    ul,
    ol,
    li,
    table,
    blockquote,
    .quote,
    .attention,
    .key-points {
      page-break-inside: avoid;
    }

    /* Widows / orphans for all paragraphs */
    p { orphans: 2; widows: 2; margin-bottom: 16px; }
    p { text-indent: 50px;  }   /* entire paragraph shifts right */


    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      display: table;
      margin-bottom: 15px;
    }

    li:before {
      content: "•";
      display: table-cell;
      padding-right: 0.75rem;
      font-weight: bold;
      vertical-align: top;
    }



    /* ---------- 4) COVER PAGE ---------- */
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;                 /* fills the sheet neatly */
      text-align: center;
      page-break-after: always;
    }

    .cover-title   { font-family: 'Comfortaa', sans-serif; font-size: 30pt; font-weight: 700; color: var(--primary-color); margin: 0 0 20px; }
    .cover-subtitle{ font-family: 'Comfortaa', sans-serif; font-size: 18pt;             color: #666;               margin: 0 0 20px; }
    .cover-author  { font-family: 'Comfortaa', sans-serif; font-size: 14pt;             color: var(--primary-color); }

    /* ---------- 5) HEADINGS ---------- */
    h1 {
      font-family: 'Comfortaa', sans-serif;
      font-size: 17pt;
      font-weight: 700;
      color: var(--primary-color);
      margin: 40px 0 15px;           /* generous but safe */
      line-height: 1.8;
      page-break-before: always;     /* start new page but WITHOUT huge top offset */
      
    }

    /* Special first-chapter titles */
    h1.prologue-title, h1.introduction-title {
      font-size: 17pt;
      text-align: center;
      margin: 0 0 40px;
      page-break-before: always;
    }

      /* Only force page breaks for major sections 
    h1.new-page {
      page-break-before: always;
    }*/

   
    /* Empty chapter styling */
    .empty-chapter {
      margin: 20px 0;
      padding: 10px;
      background: var(--primary-light);
      border-radius: 8px;
      page-break-inside: avoid;
    }
    
    .empty-chapter h1 {
      font-size: 14pt;
      margin: 0 0 5px;
      page-break-before: auto;
    }
    
    

    h2 {
      font-family: 'Comfortaa', sans-serif;
      font-size: 15pt;
      font-weight: 700;
      color: #333;
      margin: 30px 0 10px;
      line-height: 1.3;
    }

    h3 {
      font-family: 'Comfortaa', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      color: var(--primary-color);
      margin: 25px 0 7px;
      line-height: 1.3;
    }

    h4 {
      font-family: 'Comfortaa', sans-serif;
      font-size: 12pt;
      font-weight: 700;
      line-height: 1.6;
      color: #333;
    }

    /* ---------- 5.5) LISTS ---------- */
    ul, ol {
      margin: 16px 0;
      padding-left: 24px;
    }
    
    ul {
      list-style-type: disc;
    }
    
    ol {
      list-style-type: decimal;
    }
    
    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }

    /* ---------- 6) TABLES ---------- */
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 10pt;
      margin: 20px 0;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(120, 113, 108, 0.7);
    }

    th, td {
      padding: 10px 10px;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid rgba(120, 113, 108, 0.7);
      border-right: 1px solid rgba(120, 113, 108, 0.7);
      color: rgba(120, 113, 108, 0.9);
    }

    th:last-child,
    td:last-child        { border-right: none; }
    tr:last-child  td    { border-bottom: none; }
    th                   { background: rgba(120, 113, 108, 0.85); color: #ffffff; font-size: 10pt; font-weight: regular;}
    tr:nth-child(even)   { background: rgba(120, 113, 108, 0.05); rgba(120, 113, 108, 0.9); font-size: 9pt; font-weight: regular;}

    /* ---------- 7) CALLOUTS / BLOCKQUOTES ---------- */
    .quote,
    .attention,
    blockquote {
      font-style: italic;
      border-left: 3px solid var(--primary-color);
      background: var(--primary-light);
      padding: 10px;
      margin: 20px 0;
    }

    /* ---------- 8) KEY-POINTS BOX ---------- */
    
    .key-points{
      border-radius:0.75rem;
      border:1px solid rgba(120,113,108,.70);
      background:rgba(120,113,108,.15);
      padding:1rem;
      margin:1rem;
      font-weight:500;
      color:#57534E;
      font-size:0.875rem;
      page-break-after: always;
    }

    .key-points ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .key-points li {
      display: table;
      margin-bottom: 15px;
    }

    .key-points li:before {
      content: "•";
      display: table-cell;
      padding-right: 0.75rem;
      font-weight: bold;
    }

    .key-points h4 {
      margin: 0 0 0.5rem 0;
      font-size: 12pt;
      color: #57534E;
      font-weight: 700;
    }
    /* ---------- 9) TABLE-OF-CONTENTS & PART PAGES ---------- */
    .toc-title {
      font-family: 'Comfortaa', sans-serif;
      font-size: 18pt;
      font-weight: 700;
      text-align: center;
      color: var(--primary-color);
      margin: 0 0 30px;
      page-break-before: always;
    }
    
    .toc-item.indent {
       margin-left: 20px;
     }

    .chapter-description {
      font-style: italic;
      padding: 15px;
      margin-top: 20px;
      font-size: 10pt;
      color: rgba(120, 113, 108);
    }

    hr.chapter-separator {
      margin-top: 20px;
      margin-bottom: 20px; /* Adjust this to push it lower */
      border: none;
      border-bottom: 1px solid rgba(120, 113, 108, 0.7);
    }



    .part-title {
      font-family: 'Comfortaa', sans-serif;
      font-size: 24pt;
      font-weight: 700;
      align-items: center;
      height: 100vh;     
      text-align: center;   
      color: var(--primary-color);
      margin: 0 0 40px;
      page-break-before: always;
      page-break-after: always;
    }
  </style>
</head>
<body>
<div className="w-full">
    `;

    // Cover Page
    console.log('\n--- GENERATING COVER PAGE ---');
    if (book.structure?.coverPageDetails) {
      console.log('Cover page details found');
      console.log('  - Title:', book.structure.coverPageDetails.title);
      console.log('  - Subtitle:', book.structure.coverPageDetails.subtitle);
      console.log('  - Author:', book.structure.coverPageDetails.authorName);
      
      html += `<div class="cover-page">`;
      if (book.structure.coverPageDetails.title) {
        html += `<div class="cover-title">${book.structure.coverPageDetails.title}</div>`;
      }
      if (book.structure.coverPageDetails.subtitle) {
        html += `<div class="cover-subtitle">${book.structure.coverPageDetails.subtitle}</div>`;
      }
      if (book.structure.coverPageDetails.authorName) {
        html += `<div class="cover-author">By ${book.structure.coverPageDetails.authorName}</div>`;
      }
      html += `</div>`;
    } else {
      console.log('No cover page details found');
    }

    // Table of Contents
    console.log('\n--- GENERATING TABLE OF CONTENTS ---');
    html += `<h1 class="toc-title ">Table of Contents</h1>`;
    
    if (book.structure?.acknowledgement) html += `<div class="toc-item">Acknowledgement</div>`;
    if (book.structure?.prologue) html += `<div class="toc-item">Prologue</div>`;
    if (book.structure?.introduction) html += `<div class="toc-item">Introduction</div>`;

    if (book.structure?.parts && book.structure.parts.length > 0) {
      book.structure.parts.forEach(part => {
        html += `<div class="toc-item"><strong>Part ${part.partNumber}: ${part.partTitle}</strong></div>`;
        part.chapters.forEach(chapStruct => {
          html += `<div class="toc-item indent">Chapter ${chapStruct.number}: ${chapStruct.title}</div>`;
        });
      });
    } else {
      (book.chapters || []).sort((a,b) => a.number - b.number).forEach(chapter => {
        html += `<div class="toc-item">Chapter ${chapter.number}: ${chapter.title}</div>`;
      });
    }
    
    if (book.structure?.conclusion) html += `<div class="toc-item">Conclusion</div>`;
    if (book.structure?.appendix) html += `<div class="toc-item">Appendix</div>`;
    if (book.structure?.references) html += `<div class="toc-item">References</div>`;

    // Content Sections
    console.log('\n--- PROCESSING CONTENT SECTIONS ---');
    if (book.structure?.acknowledgement) {
      const normalizedAck = normalizePastedContent(book.structure.acknowledgement);
      console.log('Processing acknowledgement, length:', normalizedAck.length);
      const ackHTML = markdownToHTML(normalizedAck);
      console.log('Acknowledgement HTML length:', ackHTML.length);
      html += `<h1>Acknowledgement</h1>${ackHTML}`;
    }
    
    if (book.structure?.prologue) {
      const normalizedPrologue = normalizePastedContent(book.structure.prologue);
      console.log('Processing prologue, length:', normalizedPrologue.length);
      const prologueHTML = markdownToHTML(normalizedPrologue);
      console.log('Prologue HTML length:', prologueHTML.length);
      html += `<h1 class="prologue-title">Prologue</h1>${prologueHTML}`;
    }
    
    if (book.structure?.introduction) {
      const normalizedIntro = normalizePastedContent(book.structure.introduction);
      console.log('Processing introduction, length:', normalizedIntro.length);
      const introHTML = markdownToHTML(normalizedIntro);
      console.log('Introduction HTML length:', introHTML.length);
      html += `<h1 class="introduction-title">Introduction</h1>${introHTML}`;
    }

    // Parts and Chapters
    console.log('\n--- PROCESSING CHAPTERS ---');
    console.log('Has parts structure:', !!(book.structure?.parts && book.structure.parts.length > 0));
    console.log('Parts count:', book.structure?.parts?.length || 0);
    console.log('Direct chapters count:', book.chapters?.length || 0);
    
    if (book.structure?.parts && book.structure.parts.length > 0) {
      console.log('Processing parts-based structure...');
      for (const part of book.structure.parts) {
        console.log(`\nProcessing Part ${part.partNumber}: ${part.partTitle}`);
        console.log(`Part has ${part.chapters.length} chapters`);
        
        // Part title
        html += `<h1 class="part-title">Part ${part.partNumber}: ${part.partTitle}</h1>`;
        
        // Chapters
        for (const chapStruct of part.chapters) {
          console.log(`\n  Looking for chapter - Number: ${chapStruct.number}, Title: ${chapStruct.title}`);
          
          // Log the matching logic
          const matchByBoth = (book.chapters || []).find(c => c.number === chapStruct.number && c.title === chapStruct.title);
          const matchByNumber = (book.chapters || []).find(c => c.number === chapStruct.number);
          const matchByTitle = (book.chapters || []).find(c => c.title === chapStruct.title);
          
          console.log(`  Match by both number & title: ${!!matchByBoth}`);
          console.log(`  Match by number only: ${!!matchByNumber}`);
          console.log(`  Match by title only: ${!!matchByTitle}`);
          
          const chapter = matchByBoth || matchByTitle || matchByNumber;
          
          if (chapter) {
            console.log(`  Found matching chapter:`);
            console.log(`    - ID: ${chapter.id}`);
            console.log(`    - Number: ${chapter.number}`);
            console.log(`    - Title: ${chapter.title}`);
            console.log(`    - Content length: ${chapter.content?.length || 0}`);
            console.log(`    - Has content: ${!!chapter.content}`);
            console.log(`    - Content is string: ${typeof chapter.content === 'string'}`);
            
            // Check for common issues
            if (chapter.content && chapter.content.length > 0) {
              const trimmedContent = chapter.content.trim();
              console.log(`    - Trimmed content length: ${trimmedContent.length}`);
              console.log(`    - Starts with whitespace: ${chapter.content !== trimmedContent}`);
              console.log(`    - First 50 chars: "${chapter.content.substring(0, 50).replace(/\n/g, '\\n')}"`);
            }
          } else {
            console.log(`  WARNING: No matching chapter found!`);
            console.log(`  Available chapters in book.chapters:`);
            (book.chapters || []).forEach((ch, idx) => {
              console.log(`    [${idx}] Number: ${ch.number}, Title: "${ch.title}"`);
            });
          }
          
          if (chapter?.content) {
            // NORMALIZE CONTENT BEFORE ANY PROCESSING
            const normalizedContent = normalizePastedContent(chapter.content);
            chapter.content = normalizedContent; // Update the chapter content
            
            // Add new-page class only for chapters with content
            html += `<h1 >Chapter ${chapStruct.number}: ${chapStruct.title}</h1>`;
            if (chapStruct.description) {
              html += `<p class="chapter-description">${chapStruct.description}<hr class="chapter-separator"></p>`;
            }
            
            console.log(`  Converting markdown to HTML for chapter ${chapter.number}`);
            
           
            
            const convertedHTML = markdownToHTML(chapter.content);
            
            
            
            
            html += convertedHTML;
          } else {
            
            html += `<div class="empty-chapter">
              <h1>Chapter ${chapStruct.number}: ${chapStruct.title}</h1>
              <p>Content not yet available</p>
            </div>`;
          }
        }
      }
    } else {
      console.log('Processing direct chapters (no parts structure)...');
      const sortedChapters = [...(book.chapters || [])].sort((a,b) => a.number - b.number);
      console.log(`Sorted chapters count: ${sortedChapters.length}`);
      
      for (const chapter of sortedChapters) {
        console.log(`\nProcessing Chapter ${chapter.number}: ${chapter.title}`);
        console.log(`  - ID: ${chapter.id}`);
        console.log(`  - Content length: ${chapter.content?.length || 0}`);
        console.log(`  - Has content: ${!!chapter.content}`);
        
        if (chapter.content) {
          // Add new-page class only for chapters with content
          html += `<h1 >Chapter ${chapter.number}: ${chapter.title}</h1>`;
          if (chapter.metadata?.description) {
            html += `<p class="chapter-description">${chapter.metadata.description}</p>`;
          }
          
          console.log(`  Converting markdown to HTML...`);
          
          // Special debugging for chapters with issues
          /*if (chapter.number === 2 || chapter.number === 6) {
            console.log(`  *** SPECIAL DEBUG FOR CHAPTER ${chapter.number} (non-parts) ***`);
            console.log(`  Chapter ${chapter.number} content first 500 chars: ${chapter.content.substring(0, 500)}`);
            console.log(`  Chapter ${chapter.number} content last 500 chars: ${chapter.content.substring(chapter.content.length - 500)}`);
            console.log(`  Chapter ${chapter.number} contains *** patterns: ${chapter.content.includes('***')}`);
            console.log(`  Chapter ${chapter.number} contains +$$$+ patterns: ${chapter.content.includes('+$$$+')}`);
            
            // Count patterns
            const tripleAsterisks = (chapter.content.match(/\*\*\*///g) //|| []).length;
            //const dollarPatterns = (chapter.content.match(/\+\$\$\$\+/g) || []).length;
            //console.log(`  Chapter ${chapter.number} number of *** patterns: ${tripleAsterisks}`);
            //console.log(`  Chapter ${chapter.number} number of +$$$+ patterns: ${dollarPatterns}`);*/
            
            // Check for invisible characters
            /*const invisibleChars = chapter.content.match(/[\x00-\x1F\x7F-\x9F]/g);
            if (invisibleChars) {
              console.log(`  Chapter ${chapter.number} invisible characters found: ${invisibleChars.length}`);
              console.log(`  First few invisible char codes: ${invisibleChars.slice(0, 10).map(c => c.charCodeAt(0))}`);
            }
          }*/
          
          const convertedHTML = markdownToHTML(chapter.content);
          console.log(`  Converted HTML length: ${convertedHTML.length}`);
          console.log(`  Converted HTML preview: ${convertedHTML.substring(0, 200)}...`);
          
          // More debugging for problematic chapters
          if (chapter.number === 2 || chapter.number === 6) {
            console.log(`  Chapter ${chapter.number} converted HTML is empty: ${convertedHTML === ''}`);
            console.log(`  Chapter ${chapter.number} converted HTML is whitespace only: ${convertedHTML.trim() === ''}`);
            
            // Check for problematic HTML patterns
            const keyPointsDivs = (convertedHTML.match(/<div class="key-points mt-4">/g) || []).length;
            console.log(`  Chapter ${chapter.number} contains key-points divs: ${keyPointsDivs}`);
            
            // Check what the *** patterns were converted to
            const hrTags = (convertedHTML.match(/<hr>/g) || []).length;
            console.log(`  Chapter ${chapter.number} contains <hr> tags: ${hrTags}`);
            
            // Show a bit more of the converted HTML for debugging
            if (chapter.number === 6) {
              console.log(`  Chapter 6 HTML preview (first 1000 chars): ${convertedHTML.substring(0, 1000)}`);
            }
          }
          
          html += convertedHTML;
        } else {
          console.log(`  WARNING: No content for chapter ${chapter.number}`);
          // Group empty chapters together without page breaks
          html += `<div class="empty-chapter">
            <h1>Chapter ${chapter.number}: ${chapter.title}</h1>
            <p>Content not yet available</p>
          </div>`;
        }
      }
    }

    if (book.structure?.conclusion) {
      const normalizedConclusion = normalizePastedContent(book.structure.conclusion);
      console.log('\nProcessing conclusion, length:', normalizedConclusion.length);
      const conclusionHTML = markdownToHTML(normalizedConclusion);
      console.log('Conclusion HTML length:', conclusionHTML.length);
      html += `<h1 >Conclusion</h1>${conclusionHTML}`;
    }
    
    if (book.structure?.appendix) {
      const normalizedAppendix = normalizePastedContent(book.structure.appendix);
      console.log('\nProcessing appendix, length:', normalizedAppendix.length);
      const appendixHTML = markdownToHTML(normalizedAppendix);
      console.log('Appendix HTML length:', appendixHTML.length);
      html += `<h1 >Appendix</h1>${appendixHTML}`;
    }
    
    if (book.structure?.references) {
      const normalizedReferences = normalizePastedContent(book.structure.references);
      console.log('\nProcessing references, length:', normalizedReferences.length);
      const referencesHTML = markdownToHTML(normalizedReferences);
      console.log('References HTML length:', referencesHTML.length);
      html += `<h1 >References</h1>${referencesHTML}`;
    }

    html += `</div></body></html>`;
    
    console.log('\n--- HTML GENERATION SUMMARY ---');
    console.log('Total HTML length:', html.length);
    console.log('HTML contains "Chapter 1":', html.includes('Chapter 1'));
    console.log('HTML contains "Chapter 2":', html.includes('Chapter 2'));
    console.log('HTML contains "Content not available":', html.includes('Content not available'));
    
    // Count page break elements
    const h1Count = (html.match(/<h1/g) || []).length;
    const partTitleCount = (html.match(/class="part-title"/g) || []).length;
    const pageBreakCount = h1Count + partTitleCount;
    console.log('\n--- PAGE BREAK ANALYSIS ---');
    console.log('H1 tags (with page-break-before):', h1Count);
    console.log('Part title divs (with page breaks):', partTitleCount);
    console.log('Total potential page breaks:', pageBreakCount);
    console.log('Empty chapters ("Content not available"):', (html.match(/Content not available/g) || []).length);
    
    
    console.log('--- generateBookHTML END ---\n');
    
    return html;
  };

  // ULTRA-AGGRESSIVE normalization - strip ALL non-ASCII characters
  const normalizePastedContent = (raw: string): string => {
    const before = raw.length;
    
    // First pass: replace known problematic characters
    let normalized = raw
      .replace(/[\u2018\u2019\u201A\u201B''`´]/g, "'")  // ALL quote-like chars to straight apostrophe
      .replace(/[\u201C\u201D\u201E\u201F""„]/g, '"')   // ALL double quote-like chars to straight quote
      .replace(/[\u2013\u2014\u2015—–−]/g, '-')         // ALL dash-like chars to hyphen
      .replace(/[\u2026…]/g, '...')                      // ellipsis
      .replace(/[\u00A0\u202F\u2060]/g, ' ')            // ALL space-like chars to regular space
      .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '');     // Remove ALL invisible chars
    
    // Second pass: REMOVE ALL remaining non-ASCII characters (no exceptions)
    normalized = normalized.replace(/[^\x20-\x7E\n\r\t]/g, '');
    
    // Clean up any resulting issues
    normalized = normalized
      .replace(/[ \t]+/g, ' ')        // Multiple spaces/tabs to single space (preserve newlines)
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double newline
      .trim();
    
    const after = normalized.length;
    if (before !== after) {
      console.log(`ULTRA-AGGRESSIVE normalization: ${before} -> ${after} chars (removed ${before - after})`);
    }
    
    return normalized;
  };

  const markdownToHTML = (markdown: string | null | undefined): string => {
    if (!markdown) return '';
  
    // Apply aggressive normalization FIRST
    const normalizedMarkdown = normalizePastedContent(markdown);
  
    // Debug logging for external content issues
    console.log('=== MARKDOWN TO HTML DEBUG ===');
    console.log('Input markdown length:', markdown.length);
    console.log('After normalization length:', normalizedMarkdown.length);
    console.log('First 200 chars of normalized:', normalizedMarkdown.substring(0, 200));
    
    // Check for problematic characters in the ORIGINAL markdown (for logging)
    const invisibleChars = markdown.match(/[\u200B-\u200D\uFEFF]/g);
    const smartQuotes = markdown.match(/[""'']/g);
    const specialDashes = markdown.match(/[—–]/g);
    const nonAscii = markdown.match(/[^\x00-\x7F]/g);
    
    console.log('Invisible characters found:', invisibleChars?.length || 0);
    console.log('Smart quotes found:', smartQuotes?.length || 0);
    console.log('Special dashes found:', specialDashes?.length || 0);
    console.log('Non-ASCII characters found:', nonAscii?.length || 0);
    
    if (nonAscii && nonAscii.length > 0) {
      console.log('Sample non-ASCII characters:', nonAscii.slice(0, 10).map(c => `${c} (U+${c.charCodeAt(0).toString(16).toUpperCase()})`));
    }
  
    // Use the normalized markdown for all processing
    let html = normalizedMarkdown;
  
    // HTML entity encoding for security
    const escapeHtml = (text: string): string => {
      const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, (char: string) => htmlEntities[char] || char);
    };
  
    // Preserve code blocks and inline code before processing
    const codeBlocks: string[] = [];
    const inlineCode: string[] = [];
    
    // Extract fenced code blocks first (```language\n...\n```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match: string, lang: string, code: string): string => {
      const index = codeBlocks.length;
      const className = lang ? ` class="language-${lang}"` : '';
      codeBlocks.push(`<pre><code${className}>${escapeHtml(code.trim())}</code></pre>`);
      return `__CODE_BLOCK_${index}__`;
    });
  
    // Extract inline code (single backticks)
    html = html.replace(/`([^`\n]+)`/g, (match: string, code: string): string => {
      const index = inlineCode.length;
      inlineCode.push(`<code>${escapeHtml(code)}</code>`);
      return `__INLINE_CODE_${index}__`;
    });
  
    // Headers - Using PDF-specific styling (process in order from longest to shortest)
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Key Points - Using exact same syntax and styling as MarkdownEditor
    html = html.replace(/\+\$\$\$\+([\s\S]+?)\+\$\$\$\+/gs, '<div class="key-points">$1</div>');
    
    // Bold - PDF styling
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Italic - PDF styling
    html = html.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
    
    // Process lists - Split into lines and process sequentially
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inUnorderedList = false;
    let inOrderedList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for unordered list items
      if (line.match(/^[-*+]\s+(.+)$/)) {
        if (!inUnorderedList) {
          if (inOrderedList) {
            processedLines.push('</ol>');
            inOrderedList = false;
          }
          processedLines.push('<ul>');
          inUnorderedList = true;
        }
        processedLines.push(line.replace(/^[-*+]\s+(.+)$/, '<li>$1</li>'));
      }
      // Check for ordered list items
      else if (line.match(/^\d+\.\s+(.+)$/)) {
        if (!inOrderedList) {
          if (inUnorderedList) {
            processedLines.push('</ul>');
            inUnorderedList = false;
          }
          processedLines.push('<ol>');
          inOrderedList = true;
        }
        processedLines.push(line.replace(/^\d+\.\s+(.+)$/, '<li>$1</li>'));
      }
      // Regular line - close any open lists
      else {
        if (inUnorderedList) {
          processedLines.push('</ul>');
          inUnorderedList = false;
        }
        if (inOrderedList) {
          processedLines.push('</ol>');
          inOrderedList = false;
        }
        processedLines.push(line);
      }
    }
    
    // Close any remaining open lists
    if (inUnorderedList) {
      processedLines.push('</ul>');
    }
    if (inOrderedList) {
      processedLines.push('</ol>');
    }
    
    html = processedLines.join('\n');
    
    // Blockquotes - PDF styling
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    // Tables - Enhanced styling with rounded corners and custom colors (same as MarkdownEditor)
    html = html.replace(/\|(.+)\|\n\|[-\s|:]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
      // Process header
      const headerCells = header.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell.length > 0)
      const headerHtml = headerCells.map((cell: string) => `<th>${cell}</th>`).join('')
      
      // Process body rows
      const bodyRows = rows.trim().split('\n').filter((row: string) => row.trim().length > 0)
      const bodyHtml = bodyRows.map((row: string) => {
        const cells = row.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell.length > 0)
        const cellsHtml = cells.map((cell: string) => `<td>${cell}</td>`).join('')
        return `<tr>${cellsHtml}</tr>`
      }).join('')
      
      return `<table>
          <thead>
            <tr>${headerHtml}</tr>
          </thead>
          <tbody>
            ${bodyHtml}
          </tbody>
        </table>`
    })
    
    // Paragraphs - Simplified handling for better PDF formatting
    const paragraphize = (text: string): string => {
      console.log('=== PARAGRAPHIZE DEBUG ===');
      console.log('Input text length:', text.length);
      console.log('First 200 chars:', text.substring(0, 200));
      
      // Split into blocks by double line breaks or more
      const blocks = text.split(/\n\s*\n+/);
      console.log('Number of blocks after split:', blocks.length);
      
      const result = blocks.map((block: string, index: number) => {
        block = block.trim();
        
        // Don't wrap if it's already wrapped in block-level elements
        if (block.match(/^<(?:h[1-6]|ul|ol|blockquote|pre|table|div)/)) {
          console.log(`Block ${index}: Already block element`);
          return block;
        }
        
        // Don't wrap if it's a code block placeholder
        if (block.match(/^__CODE_BLOCK_\d+__$/)) {
          console.log(`Block ${index}: Code block placeholder`);
          return block;
        }
        
        // Don't wrap empty blocks
        if (!block) {
          return '';
        }
        
        // For regular text, replace single line breaks with spaces (not <br>)
        // This creates proper paragraphs instead of line-by-line breaks
        const processedBlock = block.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
        console.log(`Block ${index}: Converting to paragraph (${processedBlock.length} chars)`);
        
        // Wrap in paragraph tags
        return `<p>${processedBlock}</p>`;
      }).filter((block: string) => block);
      
      const finalResult = result.join('\n\n');
      console.log('Final paragraphized length:', finalResult.length);
      console.log('=== PARAGRAPHIZE DEBUG END ===');
      
      return finalResult;
    };
    
    html = paragraphize(html)
    
    // Restore code blocks and inline code
    codeBlocks.forEach((code: string, index: number) => {
      html = html.replace(`__CODE_BLOCK_${index}__`, code);
    });
    
    inlineCode.forEach((code: string, index: number) => {
      html = html.replace(`__INLINE_CODE_${index}__`, code);
    });
    
    console.log('Final HTML length after all sanitization:', html.length);
    console.log('Final HTML sample (first 300 chars):', html.substring(0, 300));
    
    return html;
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const allBookChapters = book?.chapters || [];
  
  // Helper to check if a special section is already a chapter in parts
  const isSectionInParts = (sectionTitle: string): boolean => {
    if (!book?.structure?.parts) return false;
    return book.structure.parts.some(part => 
      part.chapters.some(chap => chap.title.toLowerCase() === sectionTitle.toLowerCase())
    );
  };

  const orderedChapters: Chapter[] = [];
  if (book?.structure?.parts && book.structure.parts.length > 0) {
    book.structure.parts.forEach(part => {
      part.chapters.forEach(chapStruct => {
        // Try to find a match based on title first, then number as fallback,
        // because AI might re-number Prologue/Intro as 0 or similar.
        let fullChap = allBookChapters.find(c => c.title === chapStruct.title);
        if (!fullChap) {
          fullChap = allBookChapters.find(c => c.number === chapStruct.number);
        }
        if (fullChap) {
           // Augment with structure details if available, as it's the source of truth from AI
          const augmentedChapter = {
            ...fullChap,
            // Ensure metadata from DB chapter is preserved if structure doesn't have it
            metadata: { 
              ...fullChap.metadata, 
              description: chapStruct.description || fullChap.metadata?.description,
              estimatedWords: chapStruct.estimatedWords || fullChap.metadata?.estimatedWords,
              keyTopics: chapStruct.keyTopics || fullChap.metadata?.keyTopics,
              // keyPoints from structure is primary
              keyPoints: chapStruct.keyPoints 
            }
          };
          orderedChapters.push(augmentedChapter as Chapter);
        } else {
          // If no matching DB chapter, create a temporary one from structure for display
          // This might happen if DB sync is pending or if it's a conceptual chapter like Prologue
          // that doesn't have a direct DB entry yet but is in the AI-generated structure.
          orderedChapters.push({
            id: `struct-${part.partNumber}-${chapStruct.number}-${chapStruct.title.replace(/\s/g, '')}`, // pseudo-id
            book_id: book.id,
            number: chapStruct.number,
            title: chapStruct.title,
            content: '*Content to be generated or linked.*', // Placeholder
            status: 'draft',
            metadata: {
              description: chapStruct.description,
              estimatedWords: chapStruct.estimatedWords,
              keyTopics: chapStruct.keyTopics,
              keyPoints: chapStruct.keyPoints
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as Chapter);
        }
      });
    });
  } else if (allBookChapters.length > 0) { // Ensure standalone chapters are sorted
    orderedChapters.push(...[...allBookChapters].sort((a, b) => a.number - b.number));
  }
  
  const currentChapterIndex = activeChapterId ? orderedChapters.findIndex(ch => ch.id === activeChapterId) : -1;

  const navigateChapter = (direction: 'next' | 'prev') => {
    if (orderedChapters.length === 0) return;
    let newIndex = currentChapterIndex;
    if (currentChapterIndex === -1 && direction === 'next') newIndex = 0; // Start from first if none selected
    else if (currentChapterIndex === -1 && direction === 'prev') newIndex = orderedChapters.length -1; // Start from last
    else newIndex = direction === 'next' ? currentChapterIndex + 1 : currentChapterIndex - 1;

    if (newIndex >= 0 && newIndex < orderedChapters.length) {
      setActiveChapterId(orderedChapters[newIndex].id);
    }
  };

  // Initial page loading, distinct from PDF generation loading
  if (loading && !pdfLoading) { 
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12"></div></div>;
  }

  if (error && !pdfLoading || (!book && !loading && !pdfLoading)) { // Show error if not related to PDF generation, or if book failed to load
    return <div className="flex justify-center py-12"><p className="text-xl text-neutral-dark">Book not found or an error occurred.</p>{error && <p className="text-sm text-red-500 mt-2">{error}</p>}</div>;
  }
  
  // If book is null and still loading the main page data, show main loader
  if (!book && loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12"></div></div>;
  }

  // If book is null after loading, it means it wasn't found or there was an error handled by the above.
  // This check is to satisfy TypeScript further down, though the above should catch it.
  if (!book) {
    return <div className="flex justify-center py-12"><p className="text-xl text-neutral-dark">Book data is not available.</p></div>;
  }

  const renderSectionContent = (content: string | undefined) => {
    if (!content) return <p className="italic text-secondary">No content available.</p>;
    return (
      <div className="text text-sm sm:text lg:text-md xl:text-lg  w-full mt-2">
        <MarkdownEditor value={content} onChange={() => {}} readOnly={true} />
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md py-8 px-6 min-h-screen relative">
      {/* PDF Generation Floating Window */}
      {pdfLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-xl max-w-md w-full mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Generating PDF</h3>
            <p className="text-gray-600 mb-4">Please wait while we create your book...</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${pdfProgress}%` }}
              ></div>
            </div>
            
            {/* Progress Text */}
            <p className="text-sm text-gray-500">
              {pdfProgress > 0 ? `${pdfProgress}% complete` : 'Preparing...'}
            </p>
          </div>
        </div>
      )}
      
      <div className="mb-8 px-6">
        <button
          onClick={() => navigate('/book-library')}
          className="flex items-center text-neutral-medium hover:text-secondary mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Library
        </button>
        <div className="flex justify-between items-start ">
          <div>
            <h1 className="text-xl font-heading font-semibold text-secondary">
              {book!.title}
            </h1>
            {book!.structure?.subtitle && (
              <p className="text-lg text-neutral-medium mt-2">
                {book!.structure.subtitle}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/book/${bookId}/edit`)}
              className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors flex items-center"
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </button>
            <button
              onClick={downloadMarkdownFile}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" /> Download MD
            </button>
            <div className="relative">
              <button
                onClick={() => downloadPdfFile()}
                disabled={pdfLoading}
                className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary-hover transition-colors flex items-center disabled:opacity-50 relative overflow-hidden"
              >
                {pdfLoading && pdfProgress > 0 && (
                  <div
                    className="absolute inset-0 bg-secondary-hover transition-all duration-300 ease-out"
                    style={{ width: `${pdfProgress}%` }}
                  />
                )}
                <span className="relative z-10 flex items-center">
                  {pdfLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <File className="w-4 h-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="h-6 mt-2">
          {error && <p className="text-sm text-red-500 text-right">{error}</p>}
        </div> 
      </div>

      <div className="space-y-6 w-full relative" style={{ minHeight: '500px' }}>
        {book!.structure?.coverPageDetails && (
          <div className="p-6 bg-white rounded-lg shadow-sm text-center border-2 border-primary/70">
            <h1 className="text-4xl font-heading font-bold text-primary">{book!.structure.coverPageDetails.title}</h1>
            {book!.structure.coverPageDetails.subtitle && <p className="text-2xl text-neutral-dark mt-2">{book!.structure.coverPageDetails.subtitle}</p>}
            {book!.structure.coverPageDetails.authorName && <p className="text-lg text-neutral-medium mt-4">By {book!.structure.coverPageDetails.authorName}</p>}
          </div>
        )}

        {/* Render Acknowledgement if it exists as a top-level string */}
        {book!.structure?.acknowledgement && (
          <div className="p-6">
            <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">Acknowledgement</h2>
            {renderSectionContent(book!.structure.acknowledgement)}
          </div>
        )}

        {/* Render Prologue if it's a top-level string AND not already in parts */}
        {book!.structure?.prologue && !isSectionInParts('prologue') && (
          <div className="p-6">
            <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">Prologue</h2>
            {renderSectionContent(book!.structure.prologue)}
          </div>
        )}

        {/* Render Introduction if it's a top-level string AND not already in parts */}
        {book!.structure?.introduction && !isSectionInParts('introduction') && (
          <div className="p-6">
            <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">Introduction</h2>
            {renderSectionContent(book!.structure.introduction)}
          </div>
        )}

        {book!.structure?.parts?.map((part, partIndex) => (
          <div key={`part-${partIndex}`} className="p-6 bg-white rounded-lg shadow-sm">
            <button
              onClick={() => toggleSection(`part-${partIndex}`)}
              className="w-full text-left flex justify-between items-center py-2"
            >
              <h2 className="text-2xl font-heading font-semibold text-secondary hover:text-primary transition-colors">
                Part {part.partNumber}: {part.partTitle}
              </h2>
              {expandedSections[`part-${partIndex}`] ? <ChevronDown className="w-5 h-5 text-secondary" /> : <ChevronRight className="w-5 h-5 text-secondary" />}
            </button>
            {expandedSections[`part-${partIndex}`] && (
              <div className="mt-2 pl-4 border-l-2 border-primary/20 space-y-4">
                {part.chapters.map(chapterStruct => {
                  // Find the corresponding full chapter data from orderedChapters (which includes augmented/temporary ones)
                  const chapterToDisplay = orderedChapters.find(
                    ch => ch.title === chapterStruct.title && (ch.number === chapterStruct.number || chapterStruct.number === 0) // Allow number 0 for Prologue/Intro
                  );
                  if (!chapterToDisplay) return null;
                  
                  // Prioritize keyPoints and estimatedWords from chapterStruct (from AI's BookStructure)
                  // as this is the source of truth for these fields based on the prompt.
                  const chapterKeyPoints = chapterStruct.keyPoints; 
                  const chapterEstimatedWords = chapterStruct.estimatedWords;
                  // Description can be from chapterStruct or fallback to chapterToDisplay (DB version)
                  const chapterDescription = chapterStruct.description || chapterToDisplay.metadata?.description;


                  return (
                    <div key={chapterToDisplay.id} className="py-2">
                      <button onClick={() => setActiveChapterId(chapterToDisplay.id)} className="text-lg font-medium text-primary-dark hover:underline">
                        {chapterToDisplay.title} {/* Display title directly, number might be 0 for special chapters */}
                        {chapterToDisplay.number > 0 && ` (Chapter ${chapterToDisplay.number})`}
                      </button>
                      {activeChapterId === chapterToDisplay.id && (
                        <div className="mt-3 pl-4 space-y-3">
                          {chapterDescription && (
                            <p className="text-sm text-neutral-medium italic">{chapterDescription}</p>
                          )}
                          {chapterKeyPoints && chapterKeyPoints.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-neutral-dark mb-1">Key Points:</h4>
                              <ul className="list-disc list-inside text-sm text-neutral-dark space-y-0.5">
                                {chapterKeyPoints.map((point: string, idx: number) => (
                                  <li key={idx}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {chapterEstimatedWords && (
                            <p className="text-xs text-neutral-medium mt-1">~{chapterEstimatedWords} words</p>
                          )}
                          <div className="mt-2">
                           {renderSectionContent(chapterToDisplay.content)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        
        {/* Fallback for books without 'parts' structure but with chapters */}
        {(!book!.structure?.parts || book!.structure.parts.length === 0) && allBookChapters.length > 0 && (
           <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-heading font-semibold text-secondary mb-3">Chapters</h2>
              <div className="space-y-4">
                {allBookChapters.sort((a,b) => a.number - b.number).map(chapter => ( // Ensure sorted
                   <div key={chapter.id} className="py-2">
                      <button onClick={() => setActiveChapterId(chapter.id)} className="text-lg font-medium text-primary-dark hover:underline">
                        Chapter {chapter.number}: {chapter.title}
                      </button>
                      {activeChapterId === chapter.id && (
                        <div className="mt-3 pl-4 space-y-3">
                          {chapter.metadata?.description && (
                            <p className="text-sm text-neutral-medium italic">{chapter.metadata.description}</p>
                          )}
                          {chapter.metadata?.keyTopics && chapter.metadata.keyTopics.length > 0 && ( // Using keyTopics as fallback
                            <div>
                              <h4 className="text-sm font-semibold text-neutral-dark mb-1">Key Topics:</h4>
                              <ul className="list-disc list-inside text-sm text-neutral-dark space-y-0.5">
                                {chapter.metadata.keyTopics.map((point, idx) => (
                                  <li key={idx}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {chapter.metadata?.estimatedWords && (
                            <p className="text-xs text-neutral-medium mt-1">~{chapter.metadata.estimatedWords} words</p>
                          )}
                          <div className="mt-2">
                            {renderSectionContent(chapter.content)}
                          </div>
                        </div>
                      )}
                    </div>
                ))}
              </div>
           </div>
        )}

        {/* Render Conclusion if it's a top-level string AND not already in parts */}
        {book!.structure?.conclusion && !isSectionInParts('conclusion') && (
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">Conclusion</h2>
            {renderSectionContent(book!.structure.conclusion)}
          </div>
        )}
        {/* Render Appendix and References if they exist as top-level strings */}
        {book!.structure?.appendix && (
           <div className="p-6 bg-white rounded-lg shadow-sm">
             <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">Appendix</h2>
             {renderSectionContent(book!.structure.appendix)}
           </div>
        )}
        {book!.structure?.references && (
           <div className="p-6 bg-white rounded-lg shadow-sm">
             <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">References</h2>
             {renderSectionContent(book!.structure.references)}
           </div>
        )}
        
        {orderedChapters.length > 0 && (
          <div className="mt-10 pt-6 border-t border-neutral-light flex justify-between items-center">
            <button
              onClick={() => navigateChapter('prev')}
              disabled={currentChapterIndex <= 0}
              className="px-4 py-2 bg-neutral-medium text-white rounded-lg disabled:opacity-50 hover:bg-neutral-dark flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2"/> Previous
            </button>
            {currentChapterIndex !== -1 && orderedChapters[currentChapterIndex] && (
                 <span className="text-neutral-medium text-sm">
                    Viewing: Chapter {orderedChapters[currentChapterIndex].number} - {orderedChapters[currentChapterIndex].title}
                 </span>
            )}
            <button
              onClick={() => navigateChapter('next')}
              disabled={currentChapterIndex >= orderedChapters.length - 1 || currentChapterIndex === -1 && orderedChapters.length > 0}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary-dark flex items-center"
            >
              Next <ChevronRight className="w-4 h-4 ml-2"/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPreviewPage;
