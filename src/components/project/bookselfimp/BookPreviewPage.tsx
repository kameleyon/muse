import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Edit2, ChevronDown, ChevronRight, FileText, File } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { bookService } from '../../../lib/books';
import type { Book, Chapter, BookStructure } from '../../../types/books';
import MarkdownEditor from '../../MarkdownEditor';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; // Ensure html2canvas is imported
import { marked } from 'marked';

// Helper function to add page numbers
const addFooters = (doc: jsPDF, pageCount: number) => {
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102); // #666
    const text = `Page ${i}`;
    const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;
    const x = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    const y = doc.internal.pageSize.getHeight() - 10; // 10mm from bottom
    doc.text(text, x, y);
  }
};


const BookPreviewPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
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

    const currentChapters = book.chapters || [];
    let htmlContent = `
      <html>
        <head>
          <style>
            @page { 
              size: A4; 
              margin: 20mm; 
              @bottom-center {
                content: "Page " counter(page);
                font-size: 10pt;
                color: #666;
              }
            }
            body { font-family: 'Questrial', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333; }
            .page-break { page-break-after: always; }
            .cover-page { 
              display: flex; 
              flex-direction: column; 
              justify-content: center; 
              align-items: center; 
              height: 90vh; /* Adjusted for better centering with margins */
              text-align: center;
              /* Ensure it doesn't cause an immediate break if empty */
              min-height: 50vh; 
            }
            /* Apply Comfortaa to heading elements and specific classes */
            h1, h2, h3, .cover-title, .cover-subtitle, .cover-author, .toc-title, .toc-part { 
              font-family: 'Comfortaa', 'Helvetica Neue', Arial, sans-serif; 
            }
            /* Ensure only one body rule is active */
            body { font-family: 'Questrial', Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #333; } /* Target: 10pt final */

            .cover-title { font-size: 18pt; font-weight: bold; margin-bottom: 10px; } /* Target: 18pt final */
            .cover-subtitle { font-size: 14pt; margin-bottom: 6px; } /* Target: 14pt final */
            .cover-author { font-size: 11pt; margin-top: 12px; } /* Target: 11pt final */
            h1 { font-size: 14pt; font-weight: bold; margin-bottom: 6px; } /* Section titles, Target: 14pt final */
            h2 { font-size: 12pt; font-weight: bold; margin-bottom: 5px; } /* Chapter titles, Target: 12pt final */
            h3 { font-size: 11pt; font-weight: bold; margin-bottom: 4px; } /* Sub-headings, Target: 11pt final */
            p { margin-bottom: 6px; font-size: 10pt; } 
            .toc-title { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 10px; } /* Target: 14pt final */
            .toc-list { list-style: none; padding-left: 0; }
            .toc-list li { margin-bottom: 4px; font-size: 10pt; }
            .toc-part { font-weight: bold; margin-top: 15px; }
            .toc-chapter { margin-left: 20px; }
            .content-section { margin-top: 20px; min-height: 1px; /* Ensure section is not completely collapsed */ }
          </style>
        </head>
        <body>
    `;

    // Cover Page
    let hasContentForPage = false;
    if (book.structure?.coverPageDetails) {
      htmlContent += `<div class="cover-page">`;
      htmlContent += `<div class="cover-title">${book.structure.coverPageDetails.title || 'Untitled Book'}</div>`;
      if (book.structure.coverPageDetails.subtitle) {
        htmlContent += `<div class="cover-subtitle">${book.structure.coverPageDetails.subtitle}</div>`;
      }
      if (book.structure.coverPageDetails.authorName) {
        htmlContent += `<div class="cover-author">By ${book.structure.coverPageDetails.authorName}</div>`;
      }
      htmlContent += `</div>`;
      hasContentForPage = true;
    }
    if(hasContentForPage) htmlContent += `<div class="page-break"></div>`;
    hasContentForPage = false;

    // Table of Contents
    let tocHtml = `<div class="toc-title">Table of Contents</div><ul class="toc-list">`;
    if (book.structure?.acknowledgement) tocHtml += `<li>Acknowledgement</li>`;
    if (book.structure?.prologue) tocHtml += `<li>Prologue</li>`;
    if (book.structure?.introduction) tocHtml += `<li>Introduction</li>`;

    if (book.structure?.parts && book.structure.parts.length > 0) {
      book.structure.parts.forEach(part => {
        tocHtml += `<li class="toc-part">${part.partTitle}</li>`;
        part.chapters.forEach(chapStruct => {
          tocHtml += `<li class="toc-chapter">Chapter ${chapStruct.number}: ${chapStruct.title}</li>`;
        });
      });
    } else {
      currentChapters.sort((a,b) => a.number - b.number).forEach(chapter => {
        tocHtml += `<li class="toc-chapter">Chapter ${chapter.number}: ${chapter.title}</li>`;
      });
    }
    if (book.structure?.conclusion) tocHtml += `<li>Conclusion</li>`;
    if (book.structure?.appendix) tocHtml += `<li>Appendix</li>`;
    if (book.structure?.references) tocHtml += `<li>References</li>`;
    tocHtml += `</ul>`;
    if (tocHtml.includes('<li>')) { // Only add ToC if it has items
        htmlContent += tocHtml;
        hasContentForPage = true;
    }
    if(hasContentForPage) htmlContent += `<div class="page-break"></div>`;
    // Helper to safely parse markdown
    const parseMarkdown = async (md: string | undefined | null): Promise<string> => {
      if (!md) return '';
      try {
        const result = await marked(md);
        return typeof result === 'string' ? result : ''; // Ensure it's a string
      } catch (e) {
        console.error("Markdown parsing error:", e);
        return ''; // Return empty string on error
      }
    };

    // Content Sections
    const addSection = async (title: string, markdownInput: string | undefined | null, isPreRenderedHtml = false) => {
      let sectionHtml = '';
      if (isPreRenderedHtml && typeof markdownInput === 'string') {
        sectionHtml = markdownInput;
      } else if (typeof markdownInput === 'string') {
        sectionHtml = await parseMarkdown(markdownInput);
      }

      if (title || (sectionHtml && sectionHtml.trim() !== '')) {
        htmlContent += `<div class="content-section">`;
        if (title && !isPreRenderedHtml) { // Title for regular sections that are not pre-rendered (like chapters)
             htmlContent += `<h1>${title}</h1>`;
        }
        htmlContent += sectionHtml;
        htmlContent += `</div>`;
        htmlContent += `<div class="page-break"></div>`;
        return true;
      }
      return false;
    };
    
    await addSection('Acknowledgement', book.structure?.acknowledgement);
    await addSection('Prologue', book.structure?.prologue);
    await addSection('Introduction', book.structure?.introduction);

    if (book.structure?.parts && book.structure.parts.length > 0) {
      for (const part of book.structure.parts) {
        await addSection(part.partTitle, null); // Part Title only
        for (const chapStruct of part.chapters) {
          const chapter = currentChapters.find(c => c.number === chapStruct.number);
          if (chapter) {
            let chapterHtml = `<h2>Chapter ${chapter.number}: ${chapter.title}</h2>`;
            if (chapter.metadata?.description) chapterHtml += `<p><em>${chapter.metadata.description}</em></p>`;
            chapterHtml += await parseMarkdown(chapter.content || '*Not written yet.*');
            await addSection('', chapterHtml, true); // Pass pre-rendered HTML
          }
        }
      }
    } else {
      const sortedChapters = [...currentChapters].sort((a,b) => a.number - b.number);
      for (const chapter of sortedChapters) {
        let chapterHtml = `<h2>Chapter ${chapter.number}: ${chapter.title}</h2>`;
        if (chapter.metadata?.description) chapterHtml += `<p><em>${chapter.metadata.description}</em></p>`;
        chapterHtml += await parseMarkdown(chapter.content || '*Not written yet.*');
        await addSection('', chapterHtml, true); // Pass pre-rendered HTML
      }
    }

    await addSection('Conclusion', book.structure?.conclusion);
    await addSection('Appendix', book.structure?.appendix);
    await addSection('References', book.structure?.references);
    
    // Remove last page break if it exists
    if (htmlContent.endsWith(`<div class="page-break"></div>`)) {
        htmlContent = htmlContent.substring(0, htmlContent.length - `<div class="page-break"></div>`.length);
    }

    htmlContent += `</body></html>`; // Close the main HTML structure

    const pdfDoc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    });

    const pdfMargins = { top: 20, right: 20, bottom: 20, left: 20 };
    const contentWidth = pdfDoc.internal.pageSize.getWidth() - pdfMargins.left - pdfMargins.right;
    const contentHeight = pdfDoc.internal.pageSize.getHeight() - pdfMargins.top - pdfMargins.bottom;

    // Split the HTML content by our page break delimiter
    // The delimiter itself will be consumed by split. We wrap content in a common root for html2canvas.
    const htmlChunks = htmlContent.split('<div class="page-break"></div>');

    try {
      const originalHeadContent = htmlContent.substring(htmlContent.indexOf('<head>') + '<head>'.length, htmlContent.indexOf('</head>'));

      for (let i = 0; i < htmlChunks.length; i++) {
        const chunkHtmlFragment = htmlChunks[i]; // This is a fragment of the original body's content
        
        // If a chunk is only whitespace (e.g. from multiple page-break divs), skip it.
        // However, the first chunk (cover page) and ToC might be valid even if short.
        // The split naturally removes the delimiter, so empty strings between delimiters are possible.
        if (!chunkHtmlFragment.trim() && i > 0) { // Allow first chunk even if it seems empty (e.g. only a cover page with no text)
            // A more robust check would be if chunkHtmlFragment results in no visible elements.
            // For now, if it's not the first page and it's empty, we assume it's an accidental empty page from splitting.
            console.warn(`Skipping potentially empty HTML chunk at index ${i}`);
            continue;
        }

        // For each chunk, create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '1024px'; // Fixed width for rendering consistency
        tempContainer.style.padding = '0';
        tempContainer.style.backgroundColor = 'white';
        
        // Each chunkHtmlFragment is part of the original body.
        // We need to reconstruct a full HTML document for html2canvas for each chunk.
        tempContainer.innerHTML = `<html><head>${originalHeadContent}</head><body>${chunkHtmlFragment}</body></html>`;
        
        document.body.appendChild(tempContainer);

        const canvas = await html2canvas(tempContainer, {
          scale: 2, // Use scale 2 for better image quality
          useCORS: true,
          logging: true,
          width: tempContainer.scrollWidth,
          height: tempContainer.scrollHeight,
          windowWidth: tempContainer.scrollWidth,
        });
        
        document.body.removeChild(tempContainer);

        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdfDoc.getImageProperties(imgData);
        const imgAspectRatio = imgProps.height / imgProps.width;
        const pdfImageHeight = contentWidth * imgAspectRatio;

        if (i > 0) {
          pdfDoc.addPage();
        }

        // If pdfImageHeight is greater than contentHeight, it will be clipped by jsPDF.
        // For simplicity now, we add it; true multi-page for a single oversized chunk is complex.
        pdfDoc.addImage(imgData, 'PNG', pdfMargins.left, pdfMargins.top, contentWidth, pdfImageHeight, undefined, 'FAST');
      }

      const totalPages = pdfDoc.internal.pages.length; // Direct page count
      if (totalPages > 0) {
        addFooters(pdfDoc, totalPages);
      }

      pdfDoc.save(`${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'book'}.pdf`);

    } catch (e) {
      console.error("Error generating PDF with multi-canvas approach:", e);
      setError("Failed to generate PDF. Check console for details.");
    }
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (error || !book) {
    return <div className="text-center py-12"><p className="text-xl text-neutral-dark">Book not found or an error occurred.</p>{error && <p className="text-sm text-red-500 mt-2">{error}</p>}</div>;
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
            <h1 className="text-3xl font-heading font-semibold text-secondary">
              {book.title}
            </h1>
            {book.structure?.subtitle && (
              <p className="text-lg text-neutral-medium mt-2">
                {book.structure.subtitle}
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
              className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary-hover transition-colors flex items-center"
            >
              <File className="w-4 h-4 mr-2" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 w-full ">
        {book.structure?.coverPageDetails && (
          <div className="p-6 bg-white rounded-lg shadow-sm text-center border-2 border-primary/70">
            <h1 className="text-4xl font-heading font-bold text-primary">{book.structure.coverPageDetails.title}</h1>
            {book.structure.coverPageDetails.subtitle && <p className="text-2xl text-neutral-dark mt-2">{book.structure.coverPageDetails.subtitle}</p>}
            {book.structure.coverPageDetails.authorName && <p className="text-lg text-neutral-medium mt-4">By {book.structure.coverPageDetails.authorName}</p>}
          </div>
        )}

        {/* Render Acknowledgement if it exists as a top-level string */}
        {book.structure?.acknowledgement && (
          <div className="p-6">
            <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">Acknowledgement</h2>
            {renderSectionContent(book.structure.acknowledgement)}
          </div>
        )}

        {/* Render Prologue if it's a top-level string AND not already in parts */}
        {book.structure?.prologue && !isSectionInParts('prologue') && (
          <div className="p-6">
            <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">Prologue</h2>
            {renderSectionContent(book.structure.prologue)}
          </div>
        )}

        {/* Render Introduction if it's a top-level string AND not already in parts */}
        {book.structure?.introduction && !isSectionInParts('introduction') && (
          <div className="p-6">
            <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">Introduction</h2>
            {renderSectionContent(book.structure.introduction)}
          </div>
        )}

        {book.structure?.parts?.map((part, partIndex) => (
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
        {(!book.structure?.parts || book.structure.parts.length === 0) && allBookChapters.length > 0 && (
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
        {book.structure?.conclusion && !isSectionInParts('conclusion') && (
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">Conclusion</h2>
            {renderSectionContent(book.structure.conclusion)}
          </div>
        )}
        {/* Render Appendix and References if they exist as top-level strings */}
        {book.structure?.appendix && (
           <div className="p-6 bg-white rounded-lg shadow-sm">
             <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">Appendix</h2>
             {renderSectionContent(book.structure.appendix)}
           </div>
        )}
        {book.structure?.references && (
           <div className="p-6 bg-white rounded-lg shadow-sm">
             <h2 className="text-2xl font-heading font-semibold text-secondary mb-3 capitalize">References</h2>
             {renderSectionContent(book.structure.references)}
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
