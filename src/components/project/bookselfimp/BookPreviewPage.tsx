import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Edit2, ChevronDown, ChevronRight, FileText, File } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { bookService } from '../../../lib/books';
import type { Book, Chapter, BookStructure } from '../../../types/books';
import MarkdownEditor from '../../MarkdownEditor';
import html2pdf from 'html2pdf.js';

const BookPreviewPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const loadBookData = useCallback(async () => {
    if (!bookId) return;
    try {
      setLoading(true);
      const bookData = await bookService.getBook(bookId);
      setBook(bookData);
    } catch (err: any) {
      setError(err.message || 'Failed to load book');
    } finally {
      setLoading(false);
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
    if (!book) return;
    setPdfLoading(true); 
    setError('');

    try {
      // Create HTML content with proper styling
      const htmlContent = generateBookHTML();
      
      const options = {
        margin: [1, 1, 1, 1], // Changed from single number to array [top, right, bottom, left]
        filename: `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'book'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1,
          useCORS: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait'
        }
      };

      await html2pdf().set(options).from(htmlContent).save();
    } catch (e) {
      console.error("Error generating PDF:", e);
      setError("Failed to generate PDF. Check console for details.");
    } finally {
      setPdfLoading(false); 
    }
  };

  const generateBookHTML = () => {
    if (!book) return '';
    
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
      page-break-after: avoid;
    }

    /* Special first-chapter titles */
    h1.prologue-title, h1.introduction-title {
      font-size: 17pt;
      text-align: center;
      margin: 0 0 40px;
      page-break-before: always;
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
      border:1px solid rgba(168,162,158,.70);
      background:rgba(214,211,209,.15);
      padding:1rem;
      margin:1rem 0;
      font:500 0.9rem 'Questrial',sans-serif;
      color:#57534E;
      line-height: 1.6;
      
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

    .part-title {
      font-family: 'Comfortaa', sans-serif;
      font-size: 24pt;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;        
      color: var(--primary-color);
      margin: 0 0 40px;
      page-break-before: always;
      page-break-after: always;
    }
  </style>
</head>
<body>
    `;

    // Cover Page
    if (book.structure?.coverPageDetails) {
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
    }

    // Table of Contents
    html += `<h1 class="toc-title">Table of Contents</h1>`;
    
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
    if (book.structure?.acknowledgement) {
      html += `<h1>Acknowledgement</h1>${markdownToHTML(book.structure.acknowledgement)}`;
    }
    
    if (book.structure?.prologue) {
      html += `<h1 class="prologue-title">Prologue</h1>${markdownToHTML(book.structure.prologue)}`;
    }
    
    if (book.structure?.introduction) {
      html += `<h1 class="introduction-title">Introduction</h1>${markdownToHTML(book.structure.introduction)}`;
    }

    // Parts and Chapters
    if (book.structure?.parts && book.structure.parts.length > 0) {
      for (const part of book.structure.parts) {
        // Part title on its own page
        html += `<div class="part-title">Part ${part.partNumber}: ${part.partTitle}</div>`;
        
        // Chapters
        for (const chapStruct of part.chapters) {
          const chapter = (book.chapters || []).find(c => c.number === chapStruct.number && c.title === chapStruct.title);
          
          html += `<h1>Chapter ${chapStruct.number}: ${chapStruct.title}</h1>`;
          if (chapStruct.description) {
            html += `<p class="chapter-description">${chapStruct.description}</p>`;
          }
          if (chapter?.content) {
            html += markdownToHTML(chapter.content);
          } else {
            html += '<p>Content not available.</p>';
          }
        }
      }
    } else {
      const sortedChapters = [...(book.chapters || [])].sort((a,b) => a.number - b.number);
      for (const chapter of sortedChapters) {
        html += `<h1>Chapter ${chapter.number}: ${chapter.title}</h1>`;
        if (chapter.metadata?.description) {
          html += `<p class="chapter-description">${chapter.metadata.description}</p>`;
        }
        if (chapter.content) {
          html += markdownToHTML(chapter.content);
        } else {
          html += '<p>Content not available.</p>';
        }
      }
    }

    if (book.structure?.conclusion) {
      html += `<h1>Conclusion</h1>${markdownToHTML(book.structure.conclusion)}`;
    }
    
    if (book.structure?.appendix) {
      html += `<h1>Appendix</h1>${markdownToHTML(book.structure.appendix)}`;
    }
    
    if (book.structure?.references) {
      html += `<h1>References</h1>${markdownToHTML(book.structure.references)}`;
    }

    html += `</body></html>`;
    return html;
  };

  const markdownToHTML = (markdown: string | null | undefined): string => {
    if (!markdown) return '';
    
    // Debug: Check if content contains *** patterns
    if (markdown.includes('***')) {
      console.log('Found *** patterns in content:', markdown.substring(markdown.indexOf('***'), markdown.indexOf('***') + 100));
    }
    
    // Basic markdown rendering
    let html = markdown
    
    // Headers
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')

    // Key Points 
    html = html.replace(/\*\*\*([\s\S]+?)\*\*\*/gs, '<div class="key-points">$1</div>')
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Lists
    html = html.replace(/^- (.+)$/gm, (match, content) => {
      // Check if this is inside a key-points block
      return `<li>${content.trim()}</li>`;
    });
    
    // Wrap consecutive li elements more carefully
    html = html.replace(
      /((?:<li>.*?<\/li>\s*)+)/g,
      (match) => `<ul>${match}</ul>`
    );
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    
    // Tables - Enhanced styling with rounded corners and custom colors
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
    
    // Code blocks
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>')
    html = '<p>' + html + '</p>'
    
    // Clean-ups for stray wrappers
    html = html.replace(/<p><\/p>/g, '')
    html = html.replace(/<p>(<h[1-6])/g, '$1')
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    html = html.replace(/<p>(<blockquote>)/g, '$1')
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')
    html = html.replace(/<p>(<table>)/g, '$1')
    html = html.replace(/(<\/table>)<\/p>/g, '$1')
    html = html.replace(/<p>(<ul>)/g, '$1')
    html = html.replace(/(<\/ul>)<\/p>/g, '$1')
    html = html.replace(/<p>(<div class="key-points">)/g, '$1')
    html = html.replace(/(<\/div>)<\/p>/g, '$1')
       
    return html
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
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (error && !pdfLoading || (!book && !loading && !pdfLoading)) { // Show error if not related to PDF generation, or if book failed to load
    return <div className="text-center py-12"><p className="text-xl text-neutral-dark">Book not found or an error occurred.</p>{error && <p className="text-sm text-red-500 mt-2">{error}</p>}</div>;
  }
  
  // If book is null and still loading the main page data, show main loader
  if (!book && loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  // If book is null after loading, it means it wasn't found or there was an error handled by the above.
  // This check is to satisfy TypeScript further down, though the above should catch it.
  if (!book) {
    return <div className="text-center py-12"><p className="text-xl text-neutral-dark">Book data is not available.</p></div>;
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
    <div className="w-full bg-white rounded-2xl shadow-md py-8 px-6">
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
            <button
              onClick={downloadPdfFile}
              disabled={pdfLoading}
              className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary-hover transition-colors flex items-center disabled:opacity-50"
            >
              {pdfLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <File className="w-4 h-4 mr-2" />
              )}
              {pdfLoading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
        {error && pdfLoading && <p className="text-sm text-red-500 mt-2 text-right">{error}</p>} 
      </div>

      <div className="space-y-6 w-full ">
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
