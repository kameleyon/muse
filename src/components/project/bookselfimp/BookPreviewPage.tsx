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
    console.log('=== PDF GENERATION START ===');
    console.log('Book object:', book);
    console.log('Book ID:', book?.id);
    console.log('Book Title:', book?.title);
    console.log('Book Structure exists:', !!book?.structure);
    console.log('Book Chapters count:', book?.chapters?.length || 0);
    
    if (!book) {
      console.error('No book object available');
      return;
    }
    
    // Log chapter details
    console.log('\n=== CHAPTER DETAILS ===');
    book.chapters?.forEach((chapter, index) => {
      console.log(`\nChapter at index ${index}:`);
      console.log(`  - ID: ${chapter.id}`);
      console.log(`  - Number property: ${chapter.number}`);
      console.log(`  - Title: "${chapter.title}"`);
      console.log(`  - Content length: ${chapter.content?.length || 0} characters`);
      console.log(`  - Content preview: ${chapter.content?.substring(0, 100)}...`);
      console.log(`  - Has content: ${!!chapter.content}`);
      console.log(`  - Content type: ${typeof chapter.content}`);
      
      // Special note about chapter numbering
      if (chapter.title === 'The Myth of Universal Willpower') {
        console.log(`  *** NOTE: This is "The Myth of Universal Willpower" chapter`);
        console.log(`      It has number=${chapter.number} but contains content`);
      }
      if (chapter.title === 'Discovering Your Habit Personality') {
        console.log(`  *** NOTE: This is "Discovering Your Habit Personality" chapter`);
        console.log(`      It has number=${chapter.number} and content length=${chapter.content?.length || 0}`);
      }
    });
    
    setPdfLoading(true); 
    setError('');

    try {
      console.log('\n=== GENERATING HTML ===');
      // Create HTML content with proper styling
      const htmlContent = generateBookHTML();
      console.log('Generated HTML length:', htmlContent.length);
      console.log('HTML preview (first 500 chars):', htmlContent.substring(0, 500));
      console.log('HTML preview (last 500 chars):', htmlContent.substring(htmlContent.length - 500));
      
      // Check if HTML contains chapter content
      const hasChapterContent = htmlContent.includes('Chapter 1:') || htmlContent.includes('Chapter 2:');
      console.log('HTML contains chapter markers:', hasChapterContent);
      
      // Additional HTML validation
      console.log('\n=== HTML VALIDATION ===');
      console.log('HTML starts with DOCTYPE:', htmlContent.startsWith('\n    <!DOCTYPE html>'));
      console.log('HTML ends with </html>:', htmlContent.endsWith('</html>'));
      console.log('HTML contains <body>:', htmlContent.includes('<body>'));
      console.log('HTML contains </body>:', htmlContent.includes('</body>'));
      
      // Check for potential problematic characters
      const nullBytes = (htmlContent.match(/\x00/g) || []).length;
      console.log('Null bytes found:', nullBytes);
      
      // Check HTML structure
      const bodyStart = htmlContent.indexOf('<body>');
      const bodyEnd = htmlContent.indexOf('</body>');
      console.log('Body tag positions - start:', bodyStart, 'end:', bodyEnd);
      
      if (bodyStart > -1 && bodyEnd > -1) {
        const bodyContent = htmlContent.substring(bodyStart + 6, bodyEnd);
        console.log('Body content length:', bodyContent.length);
        console.log('Body contains Chapter 1:', bodyContent.includes('Chapter 1'));
        console.log('Body contains Chapter 2:', bodyContent.includes('Chapter 2'));
      }
      
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
      
      console.log('\n=== PDF OPTIONS ===');
      console.log('PDF options:', JSON.stringify(options, null, 2));

      console.log('\n=== CREATING PDF ===');
      console.log('Passing HTML to html2pdf...');
      console.log('HTML null check:', htmlContent === null);
      console.log('HTML undefined check:', htmlContent === undefined);
      console.log('HTML empty check:', htmlContent === '');
      console.log('HTML type:', typeof htmlContent);
      
      // Try different approaches to debug the issue
      console.log('Creating html2pdf instance...');
      
      try {
        // Method 1: Direct chaining (original approach)
        console.log('Attempting direct chaining method...');
        await html2pdf().set(options).from(htmlContent).save();
        console.log('Direct chaining method succeeded');
      } catch (e1) {
        console.error('Direct chaining failed:', (e1 as Error).message);
        
        try {
          // Method 2: Step by step with element
          console.log('\nAttempting element-based method...');
          const element = document.createElement('div');
          element.innerHTML = htmlContent;
          console.log('Created div element with HTML content');
          console.log('Element children count:', element.children.length);
          console.log('Element innerHTML length:', element.innerHTML.length);
          
          await html2pdf().set(options).from(element).save();
          console.log('Element-based method succeeded');
        } catch (e2) {
          console.error('Element-based method failed:', (e2 as Error).message);
          
          // Method 3: Create a temporary container in DOM
          console.log('\nAttempting DOM-based method...');
          const tempContainer = document.createElement('div');
          tempContainer.id = 'pdf-temp-container';
          tempContainer.style.position = 'absolute';
          tempContainer.style.left = '-9999px';
          tempContainer.style.top = '-9999px';
          tempContainer.innerHTML = htmlContent;
          document.body.appendChild(tempContainer);
          console.log('Added temp container to DOM');
          
          try {
            await html2pdf().set(options).from(tempContainer).save();
            console.log('DOM-based method succeeded');
          } catch (e3) {
            console.error('DOM-based method failed:', (e3 as Error).message);
          } finally {
            document.body.removeChild(tempContainer);
            console.log('Removed temp container from DOM');
          }
        }
      }
      
      console.log('PDF generation completed');
    } catch (e) {
      console.error("\n=== PDF GENERATION ERROR ===");
      console.error("Error generating PDF:", e);
      console.error("Error stack:", (e as Error).stack);
      setError("Failed to generate PDF. Check console for details.");
    } finally {
      setPdfLoading(false); 
      console.log('=== PDF GENERATION END ===\n');
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
    h1, h2, h3,
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
      page-break-before: auto;       /* Let content flow naturally */
      page-break-after: avoid;
    }
    
    /* Only force page breaks for major sections */
    h1.new-page {
      page-break-before: always;
    }

    /* Special first-chapter titles 
    h1.prologue-title, h1.introduction-title {
      font-size: 17pt;
      text-align: center;
      margin: 0 0 40px;
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
    
    .empty-chapter p {
      margin: 0;
      font-style: italic;
      color: #666;
      font-size: 10pt;
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
      margin: 25px 0 7px;
      line-height: 1.3;
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
      line-height: 1.8;
    }
    
    .toc-item.indent {
       margin-left: 20px;
     }

    .part-title {
      font-family: 'Comfortaa', sans-serif;
      font-size: 24pt;
      font-weight: 700;
      color: var(--primary-color);
      margin: 60px 0 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;  
      page-break-before: always;
      page-break-after: auto;  /* Don't force a page break after */
    }
  </style>
</head>
<body>
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
    html += `<h1 class="toc-title new-page">Table of Contents</h1>`;
    
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
      console.log('Processing acknowledgement, length:', book.structure.acknowledgement.length);
      const ackHTML = markdownToHTML(book.structure.acknowledgement);
      console.log('Acknowledgement HTML length:', ackHTML.length);
      html += `<h1 class="new-page">Acknowledgement</h1>${ackHTML}`;
    }
    
    if (book.structure?.prologue) {
      console.log('Processing prologue, length:', book.structure.prologue.length);
      const prologueHTML = markdownToHTML(book.structure.prologue);
      console.log('Prologue HTML length:', prologueHTML.length);
      html += `<h1 class="prologue-title">Prologue</h1>${prologueHTML}`;
    }
    
    if (book.structure?.introduction) {
      console.log('Processing introduction, length:', book.structure.introduction.length);
      const introHTML = markdownToHTML(book.structure.introduction);
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
            // Add new-page class only for chapters with content
            html += `<h1 class="new-page">Chapter ${chapStruct.number}: ${chapStruct.title}</h1>`;
            if (chapStruct.description) {
              html += `<p class="chapter-description">${chapStruct.description}</p>`;
            }
            
            console.log(`  Converting markdown to HTML for chapter ${chapter.number}`);
            
            // Special debugging for Chapter 2
            if (chapter.number === 2) {
              console.log('  *** SPECIAL DEBUG FOR CHAPTER 2 ***');
              console.log('  Chapter 2 content first 500 chars:', chapter.content.substring(0, 500));
              console.log('  Chapter 2 content last 500 chars:', chapter.content.substring(chapter.content.length - 500));
              console.log('  Chapter 2 contains Unicode:', /[^\x00-\x7F]/.test(chapter.content));
              console.log('  Chapter 2 contains null bytes:', chapter.content.includes('\x00'));
              
              // Check for invisible characters
              const invisibleChars = chapter.content.match(/[\x00-\x1F\x7F-\x9F]/g);
              if (invisibleChars) {
                console.log('  Chapter 2 invisible characters found:', invisibleChars.length);
                console.log('  First few invisible char codes:', invisibleChars.slice(0, 10).map(c => c.charCodeAt(0)));
              }
            }
            
            const convertedHTML = markdownToHTML(chapter.content);
            console.log(`  Converted HTML length: ${convertedHTML.length}`);
            console.log(`  Converted HTML preview: ${convertedHTML.substring(0, 200)}...`);
            
            // More debugging for Chapter 2
            if (chapter.number === 2) {
              console.log('  Chapter 2 converted HTML is empty:', convertedHTML === '');
              console.log('  Chapter 2 converted HTML is whitespace only:', convertedHTML.trim() === '');
            }
            
            html += convertedHTML;
          } else {
            console.log(`  WARNING: No content for chapter ${chapStruct.number}`);
            // Group empty chapters together without page breaks
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
          html += `<h1 class="new-page">Chapter ${chapter.number}: ${chapter.title}</h1>`;
          if (chapter.metadata?.description) {
            html += `<p class="chapter-description">${chapter.metadata.description}</p>`;
          }
          
          console.log(`  Converting markdown to HTML...`);
          
          // Special debugging for Chapter 2
          if (chapter.number === 2) {
            console.log('  *** SPECIAL DEBUG FOR CHAPTER 2 (non-parts) ***');
            console.log('  Chapter 2 content first 500 chars:', chapter.content.substring(0, 500));
            console.log('  Chapter 2 content last 500 chars:', chapter.content.substring(chapter.content.length - 500));
            console.log('  Chapter 2 contains Unicode:', /[^\x00-\x7F]/.test(chapter.content));
            console.log('  Chapter 2 contains null bytes:', chapter.content.includes('\x00'));
            
            // Check for invisible characters
            const invisibleChars = chapter.content.match(/[\x00-\x1F\x7F-\x9F]/g);
            if (invisibleChars) {
              console.log('  Chapter 2 invisible characters found:', invisibleChars.length);
              console.log('  First few invisible char codes:', invisibleChars.slice(0, 10).map(c => c.charCodeAt(0)));
            }
          }
          
          const convertedHTML = markdownToHTML(chapter.content);
          console.log(`  Converted HTML length: ${convertedHTML.length}`);
          console.log(`  Converted HTML preview: ${convertedHTML.substring(0, 200)}...`);
          
          // More debugging for Chapter 2
          if (chapter.number === 2) {
            console.log('  Chapter 2 converted HTML is empty:', convertedHTML === '');
            console.log('  Chapter 2 converted HTML is whitespace only:', convertedHTML.trim() === '');
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
      console.log('\nProcessing conclusion, length:', book.structure.conclusion.length);
      const conclusionHTML = markdownToHTML(book.structure.conclusion);
      console.log('Conclusion HTML length:', conclusionHTML.length);
      html += `<h1 class="new-page">Conclusion</h1>${conclusionHTML}`;
    }
    
    if (book.structure?.appendix) {
      console.log('\nProcessing appendix, length:', book.structure.appendix.length);
      const appendixHTML = markdownToHTML(book.structure.appendix);
      console.log('Appendix HTML length:', appendixHTML.length);
      html += `<h1 class="new-page">Appendix</h1>${appendixHTML}`;
    }
    
    if (book.structure?.references) {
      console.log('\nProcessing references, length:', book.structure.references.length);
      const referencesHTML = markdownToHTML(book.structure.references);
      console.log('References HTML length:', referencesHTML.length);
      html += `<h1 class="new-page">References</h1>${referencesHTML}`;
    }

    html += `</body></html>`;
    
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
    
    // Check Chapter 2 specific content
    const chapter2Start = html.indexOf('Chapter 2: Discovering Your Habit Personality');
    if (chapter2Start > -1) {
      const chapter2End = html.indexOf('<h1', chapter2Start + 1);
      const chapter2Section = chapter2End > -1 ? html.substring(chapter2Start, chapter2End) : html.substring(chapter2Start);
      console.log('\n--- CHAPTER 2 SECTION ANALYSIS ---');
      console.log('Chapter 2 section length:', chapter2Section.length);
      console.log('Chapter 2 paragraph tags:', (chapter2Section.match(/<p>/g) || []).length);
      console.log('Chapter 2 line breaks:', (chapter2Section.match(/<br>/g) || []).length);
    }
    
    console.log('--- generateBookHTML END ---\n');
    
    return html;
  };

  const markdownToHTML = (markdown: string | null | undefined): string => {
    if (!markdown) return '';
  
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
    let html = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (match: string, lang: string, code: string): string => {
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
  
    // Headers (h1-h6) with id generation for anchoring
    const generateId = (text: string): string => {
      return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    };
  
    // Headers (keeping h1 for PDF compatibility, but you might want to adjust)
    html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
    // Key Points (custom syntax: ***...***) - Handle multiline
    html = html.replace(/\*\*\*([\s\S]*?)\*\*\*/g, (match: string, content: string): string => {
      const lines = content.trim()
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);
      
      // Check if it's a list-based key points section
      const hasListItems = lines.some(line => line.startsWith('-') || line.startsWith('*') || line.startsWith('+'));
      
      if (hasListItems) {
        // Process as a list
        let listContent = '<ul>\n';
        lines.forEach((line: string) => {
          if (line.match(/^[-*+]\s+(.+)$/)) {
            const content = line.replace(/^[-*+]\s+/, '');
            listContent += `  <li>${content}</li>\n`;
          } else if (line.length > 0) {
            // Handle title or non-list content
            if (!listContent.includes('<h4>')) {
              listContent = `<h4>${line}</h4>\n` + listContent;
            }
          }
        });
        listContent += '</ul>';
        return `<div class="key-points">${listContent}</div>`;
      } else {
        // Process as regular content
        const processedContent = lines.join('<br>');
        return `<div class="key-points">${processedContent}</div>`;
      }
    });
  
    // Horizontal rules
    html = html.replace(/^([-*_])\1{2,}$/gm, '<hr>');
  
    // Blockquotes (simple version for compatibility)
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Merge consecutive blockquotes
    html = html.replace(/(<\/blockquote>\s*<blockquote>)/g, '<br>');
  
    // Tables - Enhanced with better parsing
    html = html.replace(/^\|(.+)\|\s*\n\|([\s\-:|]+)\|\s*\n((?:\|.+\|\s*\n?)*)/gm, 
      (match: string, headerRow: string, alignmentRow: string, bodyRows: string): string => {
        // Parse alignment
        const alignments = alignmentRow.split('|')
          .map((cell: string) => cell.trim())
          .filter((cell: string) => cell.length > 0)
          .map((cell: string) => {
            if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
            if (cell.endsWith(':')) return 'right';
            if (cell.startsWith(':')) return 'left';
            return '';
          });
  
        // Process header
        const headerCells = headerRow.split('|')
          .map((cell: string) => cell.trim())
          .filter((cell: string) => cell.length > 0);
        
        const headerHtml = headerCells
          .map((cell: string, i: number) => {
            const align = alignments[i] ? ` style="text-align: ${alignments[i]}"` : '';
            return `<th${align}>${cell}</th>`;
          })
          .join('');
  
        // Process body rows
        const rows = bodyRows.trim().split('\n').filter((row: string) => row.trim().length > 0);
        const bodyHtml = rows.map((row: string) => {
          const cells = row.split('|')
            .map((cell: string) => cell.trim())
            .filter((cell: string, index: number, arr: string[]) => {
              // Keep cells that are between pipe symbols
              return index > 0 && index < arr.length - 1;
            });
          
          const cellsHtml = cells
            .map((cell: string, i: number) => {
              const align = alignments[i] ? ` style="text-align: ${alignments[i]}"` : '';
              return `<td${align}>${cell}</td>`;
            })
            .join('');
          
          return `<tr>${cellsHtml}</tr>`;
        }).join('\n    ');
  
        return `<table>
    <thead>
      <tr>${headerHtml}</tr>
    </thead>
    <tbody>
      ${bodyHtml}
    </tbody>
  </table>`;
      }
    );
  
    // Task lists
    html = html.replace(/^- \[([ x])\] (.+)$/gm, (match: string, checked: string, text: string): string => {
      const isChecked = checked === 'x' ? ' checked' : '';
      return `<li class="task-list-item"><input type="checkbox" disabled${isChecked}> ${text}</li>`;
    });
  
    // Lists - Simple version for better compatibility
    // First mark list items
    html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<oli>$2</oli>');
    html = html.replace(/^[-*+]\s+(?!\[[ x]\])(.+)$/gm, '<uli>$1</uli>');
    
    // Wrap consecutive items
    html = html.replace(/((?:<oli>.*?<\/oli>\s*)+)/g, '<ol>$1</ol>');
    html = html.replace(/((?:<uli>.*?<\/uli>\s*)+)/g, '<ul>$1</ul>');
    
    // Convert to proper li tags
    html = html.replace(/<oli>/g, '<li>');
    html = html.replace(/<\/oli>/g, '</li>');
    html = html.replace(/<uli>/g, '<li>');
    html = html.replace(/<\/uli>/g, '</li>');
  
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  
    // Strong emphasis (bold) - Must come before single * for italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  
    // Emphasis (italic) - After bold to avoid conflicts
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
  
    // Strikethrough
    html = html.replace(/~~([^~]+?)~~/g, '<del>$1</del>');
  
    // Line breaks (two spaces at end of line)
    html = html.replace(/  $/gm, '<br>');
  
    // Paragraphs - More sophisticated handling
    const paragraphize = (text: string): string => {
      // Split into blocks
      const blocks = text.split(/\n{2,}/);
      
      return blocks.map((block: string) => {
        block = block.trim();
        
        // Don't wrap if it's already wrapped in block-level elements
        if (block.match(/^<(?:h[1-6]|ul|ol|li|blockquote|pre|table|div|hr)/)) {
          return block;
        }
        
        // Don't wrap if it's a code block placeholder
        if (block.match(/^__CODE_BLOCK_\d+__$/)) {
          return block;
        }
        
        // Don't wrap empty blocks
        if (!block) {
          return '';
        }
        
        // Wrap in paragraph tags
        return `<p>${block}</p>`;
      }).filter((block: string) => block).join('\n\n');
    };
    
    html = paragraphize(html);
  
    // Restore code blocks and inline code
    codeBlocks.forEach((code: string, index: number) => {
      html = html.replace(`__CODE_BLOCK_${index}__`, code);
    });
    
    inlineCode.forEach((code: string, index: number) => {
      html = html.replace(`__INLINE_CODE_${index}__`, code);
    });
  
    // Clean up any remaining paragraph issues
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>(<(?:h[1-6]|ul|ol|li|blockquote|pre|table|div|hr))/g, '$1');
    html = html.replace(/(<\/(?:h[1-6]|ul|ol|li|blockquote|pre|table|div|hr)>)<\/p>/g, '$1');
  
    // Clean up extra newlines
    html = html.replace(/\n{3,}/g, '\n\n');
  
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
