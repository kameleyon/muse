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
    setLoading(true); // Optional: show a loading state

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    });

    const pageMargin = 20; // mm
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * pageMargin;
    // const contentHeight = pageHeight - 2 * pageMargin; // Usable height per page

    let currentY = pageMargin;
    let pageNumber = 1;

    const addPageIfNeeded = (elementHeight: number) => {
      if (currentY + elementHeight > pageHeight - pageMargin) {
        doc.addPage();
        pageNumber++;
        currentY = pageMargin;
        addFooter();
      }
    };
    
    const addFooter = () => {
      doc.setFontSize(10);
      doc.setTextColor(102, 102, 102); // #666
      const text = `Page ${pageNumber}`;
      const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;
      const x = (pageWidth - textWidth) / 2;
      const y = pageHeight - 10; // 10mm from bottom
      doc.text(text, x, y, { pageNumber: pageNumber } as any); // Hack to ensure it's on current page
    };


    const addHtmlContent = async (htmlString: string, isCoverPage = false) => {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px'; // Off-screen
      container.style.width = `${contentWidth * (96 / 25.4)}px`; // Convert mm to px for canvas
      container.style.padding = '10px'; // Some padding for rendering
      container.style.backgroundColor = 'white';
      container.innerHTML = htmlString;
      document.body.appendChild(container);

      // Apply specific styles for PDF rendering
      container.querySelectorAll('h1, h2, h3, .cover-title, .cover-subtitle, .cover-author').forEach(el => {
        (el as HTMLElement).style.fontFamily = "'Comfortaa', 'Helvetica Neue', Arial, sans-serif";
      });
      container.querySelectorAll('body, p, li').forEach(el => {
        (el as HTMLElement).style.fontFamily = "'Questrial', Arial, sans-serif";
      });
      
      if (isCoverPage) {
        const coverPageDiv = container.querySelector('.cover-page-content') as HTMLElement;
        if (coverPageDiv) {
            coverPageDiv.style.display = 'flex';
            coverPageDiv.style.flexDirection = 'column';
            coverPageDiv.style.justifyContent = 'center';
            coverPageDiv.style.alignItems = 'center';
            coverPageDiv.style.height = `${(pageHeight - 2 * pageMargin) * (96/25.4) * 0.8}px`; // 80% of content height
            coverPageDiv.style.textAlign = 'center';
        }
      }


      const canvas = await html2canvas(container, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false, // Reduce console noise
        width: container.scrollWidth,
        height: container.scrollHeight,
        windowWidth: container.scrollWidth,
      });
      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

      addPageIfNeeded(imgHeight);
      doc.addImage(imgData, 'PNG', pageMargin, currentY, contentWidth, imgHeight, undefined, 'FAST');
      currentY += imgHeight + 5; // Add some spacing
    };
    
    // --- Cover Page ---
    if (book.structure?.coverPageDetails) {
      let coverHtml = `<div class="cover-page-content" style="font-size: 12pt;">`;
      coverHtml += `<div class="cover-title" style="font-size: 24pt; font-weight: bold; margin-bottom: 15px;">${book.structure.coverPageDetails.title || 'Untitled Book'}</div>`;
      if (book.structure.coverPageDetails.subtitle) {
        coverHtml += `<div class="cover-subtitle" style="font-size: 18pt; margin-bottom: 10px;">${book.structure.coverPageDetails.subtitle}</div>`;
      }
      if (book.structure.coverPageDetails.authorName) {
        coverHtml += `<div class="cover-author" style="font-size: 14pt; margin-top: 20px;">By ${book.structure.coverPageDetails.authorName}</div>`;
      }
      coverHtml += `</div>`;
      await addHtmlContent(coverHtml, true);
      currentY = pageHeight; // Force new page after cover
    }

    // --- Table of Contents (Simplified) ---
    let tocHtml = `<div style="font-size: 11pt;"> <h1 style="font-size: 18pt; text-align: center; margin-bottom: 15px;">Table of Contents</h1> <ul style="list-style: none; padding-left: 0;">`;
    const addTocEntry = (label: string, level: number = 0) => {
      tocHtml += `<li style="margin-bottom: 5px; margin-left: ${level * 15}px;">${label}</li>`;
    };

    if (book.structure?.acknowledgement) addTocEntry('Acknowledgement');
    if (book.structure?.prologue) addTocEntry('Prologue');
    if (book.structure?.introduction) addTocEntry('Introduction');

    if (book.structure?.parts && book.structure.parts.length > 0) {
      book.structure.parts.forEach(part => {
        addTocEntry(`Part ${part.partNumber}: ${part.partTitle}`, 0);
        part.chapters.forEach(chapStruct => {
          addTocEntry(`Chapter ${chapStruct.number}: ${chapStruct.title}`, 1);
        });
      });
    } else {
      (book.chapters || []).sort((a,b) => a.number - b.number).forEach(chapter => {
        addTocEntry(`Chapter ${chapter.number}: ${chapter.title}`, 0);
      });
    }
    if (book.structure?.conclusion) addTocEntry('Conclusion');
    if (book.structure?.appendix) addTocEntry('Appendix');
    if (book.structure?.references) addTocEntry('References');
    tocHtml += `</ul></div>`;
    
    if (tocHtml.includes('<li>')) { // Only add ToC if it has items
        await addHtmlContent(tocHtml);
        currentY = pageHeight; // Force new page after ToC
    }
    
    // --- Content Sections ---
    const parseAndAddMarkdown = async (title: string | null, markdownContent: string | undefined | null, headingLevel: 'h1' | 'h2' | 'h3' = 'h1') => {
      if (!markdownContent && !title) return;
      
      let sectionHtml = `<div style="font-size: 11pt; line-height: 1.5;">`;
      if (title) {
        const titleFontSize = headingLevel === 'h1' ? '16pt' : (headingLevel === 'h2' ? '14pt' : '12pt');
        sectionHtml += `<${headingLevel} style="font-size: ${titleFontSize}; font-weight: bold; margin-bottom: 10px;">${title}</${headingLevel}>`;
      }
      if (markdownContent) {
        try {
          const parsedHtml = await marked(markdownContent);
          sectionHtml += typeof parsedHtml === 'string' ? parsedHtml : '';
        } catch (e) {
          console.error("Markdown parsing error:", e);
          sectionHtml += `<p><em>Error parsing content.</em></p>`;
        }
      }
      sectionHtml += `</div>`;
      await addHtmlContent(sectionHtml);
    };

    if (book.structure?.acknowledgement) await parseAndAddMarkdown('Acknowledgement', book.structure.acknowledgement, 'h1');
    if (book.structure?.prologue) await parseAndAddMarkdown('Prologue', book.structure.prologue, 'h1');
    if (book.structure?.introduction) await parseAndAddMarkdown('Introduction', book.structure.introduction, 'h1');

    if (book.structure?.parts && book.structure.parts.length > 0) {
      for (const part of book.structure.parts) {
        await parseAndAddMarkdown(`Part ${part.partNumber}: ${part.partTitle}`, null, 'h1');
        for (const chapStruct of part.chapters) {
          const chapter = (book.chapters || []).find(c => c.number === chapStruct.number && c.title === chapStruct.title);
          let chapterContent = `<div style="font-size: 11pt; line-height: 1.5;">`;
          chapterContent += `<h2 style="font-size: 14pt; font-weight: bold; margin-bottom: 8px;">Chapter ${chapStruct.number}: ${chapStruct.title}</h2>`;
          if (chapStruct.description) {
            chapterContent += `<p style="font-style: italic; margin-bottom: 8px;">${chapStruct.description}</p>`;
          }
          if (chapter?.content) {
            try {
              const parsed = await marked(chapter.content);
              chapterContent += typeof parsed === 'string' ? parsed : '';
            } catch (e) { chapterContent += `<p><em>Error parsing chapter content.</em></p>`; }
          } else {
            chapterContent += `<p><em>Content not available.</em></p>`;
          }
          chapterContent += `</div>`;
          await addHtmlContent(chapterContent);
        }
      }
    } else {
      const sortedChapters = [...(book.chapters || [])].sort((a,b) => a.number - b.number);
      for (const chapter of sortedChapters) {
        let chapterContent = `<div style="font-size: 11pt; line-height: 1.5;">`;
        chapterContent += `<h2 style="font-size: 14pt; font-weight: bold; margin-bottom: 8px;">Chapter ${chapter.number}: ${chapter.title}</h2>`;
        if (chapter.metadata?.description) {
          chapterContent += `<p style="font-style: italic; margin-bottom: 8px;">${chapter.metadata.description}</p>`;
        }
        if (chapter.content) {
           try {
              const parsed = await marked(chapter.content);
              chapterContent += typeof parsed === 'string' ? parsed : '';
            } catch (e) { chapterContent += `<p><em>Error parsing chapter content.</em></p>`; }
        } else {
          chapterContent += `<p><em>Content not available.</em></p>`;
        }
        chapterContent += `</div>`;
        await addHtmlContent(chapterContent);
      }
    }

    if (book.structure?.conclusion) await parseAndAddMarkdown('Conclusion', book.structure.conclusion, 'h1');
    if (book.structure?.appendix) await parseAndAddMarkdown('Appendix', book.structure.appendix, 'h1');
    if (book.structure?.references) await parseAndAddMarkdown('References', book.structure.references, 'h1');

    // Add footer to the last page
    addFooter();

    try {
      doc.save(`${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'book'}.pdf`);
    } catch (e) {
      console.error("Error saving PDF:", e);
      setError("Failed to save PDF. Check console for details.");
    } finally {
      setLoading(false); // End loading state
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
