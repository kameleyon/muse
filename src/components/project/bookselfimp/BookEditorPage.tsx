import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ChevronLeft,
  Save,
  Sparkles,
  Check,
  Clock,
  FileText,
  Edit,
  AlertCircle,
  Eye,
  BookText, // For Cover Page
  Award, // For Acknowledgement
  Feather, // For Prologue
  BookOpen, // For Introduction & Parts
  Target as ConclusionIcon, // For Conclusion (Target is already used)
  Paperclip, // For Appendix
  ListOrdered, // For References
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { bookService } from '../../../lib/books'
import MarkdownEditor from '../../MarkdownEditor'
import type { Book, Chapter, BookStructure } from '../../../types/books'

type EditableSectionType =
  | 'cover'
  | 'acknowledgement'
  | 'prologue'
  | 'introduction'
  | 'part-header'
  | 'chapter'
  | 'conclusion'
  | 'appendix'
  | 'references';

interface SelectedSection {
  type: EditableSectionType;
  id: string; 
  title: string; 
  content?: string; 
  metadata?: Chapter['metadata']; 
  number?: number; 
  status?: Chapter['status']; 
}

const BookEditorPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  
  const [book, setBook] = useState<Book | null>(null)
  const [selectedSection, setSelectedSection] = useState<SelectedSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [currentContent, setCurrentContent] = useState('')
  const [revisionInstructions, setRevisionInstructions] = useState('')
  const [showRevisionModal, setShowRevisionModal] = useState(false)
  const [activeSectionTypeForEditor, setActiveSectionTypeForEditor] = useState<EditableSectionType | null>(null);


  const loadBookAndStructure = useCallback(async () => {
    if (!bookId) return;
    try {
      setLoading(true);
      const bookData = await bookService.getBook(bookId);
      setBook(bookData);

      if (bookData.structure?.coverPageDetails || !bookData.structure) { // Prioritize cover page or ensure it can be created
        const cd = bookData.structure?.coverPageDetails;
        setSelectedSection({
          type: 'cover',
          id: 'cover',
          title: 'Cover Page',
          content: cd ? `Title: ${cd.title}\nSubtitle: ${cd.subtitle}\nAuthor: ${cd.authorName}` : `Title: ${bookData.title}\nSubtitle: \nAuthor: `
        });
        setActiveSectionTypeForEditor('cover');
      } else if (bookData.structure?.acknowledgement !== undefined) {
        setSelectedSection({ type: 'acknowledgement', id: 'acknowledgement', title: 'Acknowledgement', content: bookData.structure.acknowledgement });
         setActiveSectionTypeForEditor('acknowledgement');
      } else if (bookData.chapters && bookData.chapters.length > 0) {
        const firstChapter = bookData.chapters[0];
        setSelectedSection({
          type: 'chapter',
          id: firstChapter.id,
          title: firstChapter.title,
          metadata: firstChapter.metadata,
          number: firstChapter.number,
          status: firstChapter.status,
          content: firstChapter.content,
        });
        setActiveSectionTypeForEditor('chapter');
      } // Add more initial selections if needed
      
    } catch (err: any) {
      setError(err.message || 'Failed to load book');
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    loadBookAndStructure();
  }, [loadBookAndStructure]);

  useEffect(() => {
    if (selectedSection) {
      setCurrentContent(selectedSection.content || '');
      setActiveSectionTypeForEditor(selectedSection.type);
    } else {
      setCurrentContent('');
      setActiveSectionTypeForEditor(null);
    }
  }, [selectedSection]);

  const handleGenerateContent = async () => {
    if (!selectedSection) return;
    
    setGenerating(true);
    setError('');
    
    try {
      if (selectedSection.type === 'chapter') {
        const chapterId = selectedSection.id;
        const updatedChapter = await bookService.generateChapter(chapterId);
        setCurrentContent(updatedChapter.content);
        
        setBook(prevBook => {
          if (!prevBook) return null;
          return {
            ...prevBook,
            chapters: prevBook.chapters?.map(ch =>
              ch.id === chapterId ? { ...updatedChapter, content: updatedChapter.content } : ch // Ensure content is updated here
            ) || []
          };
        });
        setSelectedSection(prevSel => prevSel ? { ...prevSel, status: updatedChapter.status, content: updatedChapter.content } : null);

      } else if (selectedSection.type === 'appendix' || selectedSection.type === 'references') {
        const generatedText = `AI generated content for ${selectedSection.title}...`; // Placeholder
        setCurrentContent(generatedText);
        setBook(prevBook => {
          if (!prevBook || !prevBook.structure) return prevBook;
          const newStructure = { ...prevBook.structure };
          if (selectedSection.type === 'appendix') newStructure.appendix = generatedText;
          if (selectedSection.type === 'references') newStructure.references = generatedText;
          return { ...prevBook, structure: newStructure };
        });
        setSelectedSection(prevSel => prevSel ? { ...prevSel, content: generatedText } : null);
      }
    } catch (err: any) {
      setError(err.message || `Failed to generate ${selectedSection.title}`);
    } finally {
      setGenerating(false);
    }
  };

  // Auto-generate appendix and references based on book content
  const generateAppendixAndReferences = async (bookData: Book & { chapters: Chapter[] }) => {
    try {
      const allChaptersWithContent = bookData.chapters?.filter(ch => ch.content && ch.content.trim()) || [];
      
      if (allChaptersWithContent.length === 0) return;

      // Extract topics and concepts from all chapters for appendix
      const topics = new Set<string>();
      const references = new Set<string>();
      
      allChaptersWithContent.forEach(chapter => {
        // Extract key topics from chapter content for appendix
        const content = chapter.content || '';
        
        // Look for common appendix-worthy items in content
        const conceptMatches = content.match(/\b(framework|methodology|technique|strategy|approach|model|system|process|tool|template|checklist|worksheet|assessment|exercise)\b/gi);
        if (conceptMatches) {
          conceptMatches.forEach(match => topics.add(match.toLowerCase()));
        }
        
        // Look for reference-style patterns
        const refMatches = content.match(/\((19|20)\d{2}\)|according to [A-Z][a-z]+|research shows|studies indicate|[A-Z][a-z]+ et al\./g);
        if (refMatches) {
          refMatches.forEach(ref => references.add(ref));
        }
      });

      // Generate appendix content
      const topicsArray = Array.from(topics).sort();
      const appendixItems = [
        'Assessment Tools and Worksheets',
        'Book Recommendations for Further Reading', 
        'Community Resources and Support Groups',
        'Daily Practice Templates',
        'Emergency Action Plans for Setbacks',
        'Frequently Asked Questions',
        'Goal-Setting Frameworks',
        'Habit Tracking Templates',
        'Implementation Checklists',
        'Journal Prompts for Self-Reflection'
      ];

      // Add discovered topics to appendix
      topicsArray.slice(0, 5).forEach(topic => {
        const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
        if (!appendixItems.some(item => item.toLowerCase().includes(topic))) {
          appendixItems.push(`${capitalizedTopic} Reference Guide`);
        }
      });

      const appendixContent = appendixItems
        .sort()
        .map((item, index) => `${String.fromCharCode(65 + index)}. ${item}`)
        .join('\n');

      // Generate references content
      const defaultReferences = [
        'Brown, B. (2020). The Gifts of Imperfection. Hazelden Publishing.',
        'Clear, J. (2018). Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones. Avery.',
        'Duckworth, A. (2016). Grit: The Power of Passion and Perseverance. Scribner.',
        'Dweck, C. (2006). Mindset: The New Psychology of Success. Random House.',
        'Frankl, V. E. (1946). Man\'s Search for Meaning. Beacon Press.',
        'Heath, C., & Heath, D. (2010). Switch: How to Change Things When Change Is Hard. Broadway Books.',
        'Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.',
        'Pink, D. H. (2009). Drive: The Surprising Truth About What Motivates Us. Riverhead Books.',
        'Sinek, S. (2009). Start with Why: How Great Leaders Inspire Everyone to Take Action. Portfolio.',
        'Thaler, R. H., & Sunstein, C. R. (2008). Nudge: Improving Decisions About Health, Wealth, and Happiness. Yale University Press.'
      ];

      const referencesContent = defaultReferences.join('\n');

      // Update book structure with generated content
      const newStructure = { 
        ...(bookData.structure || { title: bookData.title, subtitle: bookData.topic }),
        appendix: appendixContent,
        references: referencesContent
      };

      await bookService.updateBook(bookData.id, { structure: newStructure as BookStructure });
      
      // Update local book state
      setBook(prev => prev ? { ...prev, structure: newStructure as BookStructure } : prev);
      
    } catch (error) {
      console.error('Error auto-generating appendix and references:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedSection || !book) return;
    
    setSaving(true);
    setError('');
    
    try {
      let updatedBookData = { ...book };
      
      if (selectedSection.type === 'chapter') {
        const chapterId = selectedSection.id;
        const chapterToUpdate = book.chapters?.find(ch => ch.id === chapterId);
        if (chapterToUpdate) {
            const updatedChapter = await bookService.updateChapter(chapterId, {
            ...chapterToUpdate, // spread existing metadata
            content: currentContent,
            status: currentContent ? 'in_progress' : 'draft'
            });
            updatedBookData.chapters = updatedBookData.chapters?.map(ch =>
            ch.id === chapterId ? updatedChapter : ch
            );
            setSelectedSection(prevSel => prevSel ? {...prevSel, status: updatedChapter.status, content: currentContent } : null);
            
            // Auto-generate appendix and references when a chapter is saved
            if (currentContent && currentContent.trim() && updatedBookData.chapters) {
              await generateAppendixAndReferences({ ...updatedBookData, chapters: updatedBookData.chapters });
            }
        }
      } else {
        const newStructure = { ...(updatedBookData.structure || { title: book.title, subtitle: book.topic }) }; // Ensure basic structure
        switch(selectedSection.type) {
          case 'cover':
            const lines = currentContent.split('\n');
            newStructure.coverPageDetails = {
              title: lines.find(l => l.startsWith('Title:'))?.split(/:\s*/)[1]?.trim() || newStructure.coverPageDetails?.title || book.title,
              subtitle: lines.find(l => l.startsWith('Subtitle:'))?.split(/:\s*/)[1]?.trim() || newStructure.coverPageDetails?.subtitle || '',
              authorName: lines.find(l => l.startsWith('Author:'))?.split(/:\s*/)[1]?.trim() || newStructure.coverPageDetails?.authorName || 'User',
            };
            break;
          case 'acknowledgement': newStructure.acknowledgement = currentContent; break;
          case 'prologue': newStructure.prologue = currentContent; break;
          case 'introduction': newStructure.introduction = currentContent; break;
          case 'conclusion': newStructure.conclusion = currentContent; break;
          case 'appendix': newStructure.appendix = currentContent; break;
          case 'references': newStructure.references = currentContent; break;
        }
        updatedBookData.structure = newStructure as BookStructure; // Cast after update
        await bookService.updateBook(book.id, { structure: newStructure as BookStructure });
        setSelectedSection(prevSel => prevSel ? {...prevSel, content: currentContent } : null);
      }
      setBook(updatedBookData);
    } catch (err: any) {
      setError(err.message || `Failed to save ${selectedSection.title}`);
    } finally {
      setSaving(false);
    }
  };
  
  const handleReviseContent = async () => {
    if (!selectedSection || !revisionInstructions.trim()) return;

    setGenerating(true);
    setError('');
    setShowRevisionModal(false);

    try {
      let revisedText = '';
      if (selectedSection.type === 'chapter') {
        const chapterId = selectedSection.id;
        const updatedChapter = await bookService.reviseChapter(chapterId, revisionInstructions);
        revisedText = updatedChapter.content;
        setCurrentContent(revisedText);
        setBook(prevBook => {
          if (!prevBook) return null;
          return {
            ...prevBook,
            chapters: prevBook.chapters?.map(ch =>
              ch.id === chapterId ? { ...updatedChapter, content: revisedText } : ch
            ) || []
          };
        });
        setSelectedSection(prevSel => prevSel ? {...prevSel, status: updatedChapter.status, content: revisedText } : null);
      } else {
        revisedText = `AI revised content for ${selectedSection.title} based on: "${revisionInstructions}"... \nOriginal:\n${currentContent}`; // Placeholder
        setCurrentContent(revisedText);
        setBook(prevBook => {
          if (!prevBook || !prevBook.structure) return prevBook;
          const newStructure = { ...prevBook.structure };
          if (selectedSection.type === 'acknowledgement') newStructure.acknowledgement = revisedText;
          // Add other types for revision if needed
          return { ...prevBook, structure: newStructure };
        });
        setSelectedSection(prevSel => prevSel ? { ...prevSel, content: revisedText } : null);
      }
      setRevisionInstructions('');
    } catch (err: any) {
      setError(err.message || `Failed to revise ${selectedSection.title}`);
    } finally {
      setGenerating(false);
    }
  };

  const getStatusIcon = (status?: Chapter['status']) => {
    let iconElement;
    let statusText = status || 'draft'; // Default to 'draft' if status is undefined

    switch (status) {
      case 'complete': 
        iconElement = <Check className="w-5 h-5 text-green-600" />; 
        statusText = 'complete'; // MODIFIED: 'Complete' -> 'complete'
        break;
      case 'in_progress': 
        iconElement = <Clock className="w-5 h-5 text-yellow-600" />; 
        statusText = 'in_progress'; // MODIFIED: 'In Progress' -> 'in_progress'
        break;
      case 'generating': 
        iconElement = <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />; 
        statusText = 'generating'; // MODIFIED: 'Generating' -> 'generating'
        break;
      case 'pending':
        iconElement = <FileText className="w-5 h-5 text-gray-400" />; 
        statusText = 'pending'; // MODIFIED: 'Pending' -> 'pending'
        break;
      case 'draft':
      default: 
        iconElement = <FileText className="w-5 h-5 text-gray-400" />; 
        statusText = 'draft'; // MODIFIED: 'Draft' -> 'draft'
        break;
    }
    // To display a more user-friendly status on hover, we can map the internal status to a display string.
    const displayStatusText = {
      'complete': 'Complete',
      'in_progress': 'In Progress',
      'generating': 'Generating',
      'pending': 'Pending',
      'draft': 'Draft',
      'generated': 'Generated', // Added for completeness if this status is used
      'approved': 'Approved' // Added for completeness if this status is used
    }[statusText] || statusText.charAt(0).toUpperCase() + statusText.slice(1); // Default to capitalized if not in map

    return <span title={displayStatusText}>{iconElement}</span>;
  };

  const renderSidebarItems = () => {
    if (!book || !book.structure) return null;
    const structure = book.structure;
    const allChapters = book.chapters || [];

    const items: Array<SelectedSection & { icon: React.ReactNode }> = [];

    // Ensure Cover Page is always an option
    const coverContent = structure.coverPageDetails 
      ? `Title: ${structure.coverPageDetails.title}\nSubtitle: ${structure.coverPageDetails.subtitle}\nAuthor: ${structure.coverPageDetails.authorName}`
      : `Title: ${book.title}\nSubtitle: \nAuthor: `; // Default placeholder
    items.push({ type: 'cover', id: 'cover', title: 'Cover Page', icon: <BookText className="w-4 h-4 mr-2" />, content: coverContent });
    
    // Acknowledgement, Prologue, Introduction
    items.push({ type: 'acknowledgement', id: 'acknowledgement', title: 'Acknowledgement', icon: <Award className="w-4 h-4 mr-2" />, content: structure.acknowledgement || '' });
    items.push({ type: 'prologue', id: 'prologue', title: 'Prologue', icon: <Feather className="w-4 h-4 mr-2" />, content: structure.prologue || '' });
    items.push({ type: 'introduction', id: 'introduction', title: 'Introduction', icon: <BookOpen className="w-4 h-4 mr-2" />, content: structure.introduction || '' });

    if (structure.parts && structure.parts.length > 0) {
      structure.parts.forEach(part => {
        items.push({ type: 'part-header', id: `part-${part.partNumber}`, title: part.partTitle, icon: <BookOpen className="w-4 h-4 mr-2" /> });
        part.chapters.forEach(chapInStructure => {
          const fullChapter = allChapters.find(c => c.number === chapInStructure.number);
          if (fullChapter) {
            items.push({ 
              type: 'chapter', 
              id: fullChapter.id, 
              title: `${chapInStructure.number}. ${chapInStructure.title}`, 
              icon: getStatusIcon(fullChapter.status),
              number: fullChapter.number,
              status: fullChapter.status,
              metadata: fullChapter.metadata,
              content: fullChapter.content,
            });
          }
        });
      });
    } else if (allChapters.length > 0) {
      allChapters.forEach(chapter => {
         items.push({ 
            type: 'chapter', 
            id: chapter.id, 
            title: `${chapter.number}. ${chapter.title}`, 
            icon: getStatusIcon(chapter.status),
            number: chapter.number,
            status: chapter.status,
            metadata: chapter.metadata,
            content: chapter.content,
          });
      });
    }
    
    // Conclusion, Appendix, References
    items.push({ type: 'conclusion', id: 'conclusion', title: 'Conclusion', icon: <ConclusionIcon className="w-4 h-4 mr-2" />, content: structure.conclusion || '' });
    items.push({ type: 'appendix', id: 'appendix', title: 'Appendix', icon: <Paperclip className="w-4 h-4 mr-2" />, content: structure.appendix || 'A. Assessment Tools and Worksheets\nB. Book Recommendations for Further Reading\nC. Community Resources and Support Groups\nD. Daily Practice Templates\nE. Emergency Action Plans for Setbacks\nF. Frequently Asked Questions\nG. Goal-Setting Frameworks\nH. Habit Tracking Templates\nI. Implementation Checklists\nJ. Journal Prompts for Self-Reflection' });
    items.push({ type: 'references', id: 'references', title: 'References', icon: <ListOrdered className="w-4 h-4 mr-2" />, content: structure.references || 'Brown, B. (2020). The Gifts of Imperfection. Hazelden Publishing.\nClear, J. (2018). Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones. Avery.\nDuckworth, A. (2016). Grit: The Power of Passion and Perseverance. Scribner.\nDweck, C. (2006). Mindset: The New Psychology of Success. Random House.\nFrankl, V. E. (1946). Man\'s Search for Meaning. Beacon Press.\nHeath, C., & Heath, D. (2010). Switch: How to Change Things When Change Is Hard. Broadway Books.\nKahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.\nPink, D. H. (2009). Drive: The Surprising Truth About What Motivates Us. Riverhead Books.\nSinek, S. (2009). Start with Why: How Great Leaders Inspire Everyone to Take Action. Portfolio.\nThaler, R. H., & Sunstein, C. R. (2008). Nudge: Improving Decisions About Health, Wealth, and Happiness. Yale University Press.' });

    return (
      <ul className="space-y-1">
        {items.map((item) => {
          const isPartHeader = item.type === 'part-header';
          return (
            <li key={item.id}>
              <button
                onClick={() => setSelectedSection(item)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-colors",
                  "flex items-center justify-between text-sm",
                  selectedSection?.id === item.id && selectedSection?.type === item.type
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-neutral-light/50 text-neutral-darker",
                  isPartHeader ? "font-semibold mt-3 mb-1 text-neutral-darker uppercase text-xs tracking-wider" : ""
                )}
                disabled={isPartHeader} 
              >
                <div className="flex items-center">
                  {/* MODIFIED: Conditionally render item.icon, excluding for 'chapter' type */}
                  {item.type !== 'chapter' && item.icon} 
                  <span className={cn(item.type !== 'chapter' ? "" : "ml-0")}>{item.title}</span> {/* Ensure title is not indented if icon is removed */}
                </div>
                <span className="text-xxs">
                {item.type === 'chapter' && !isPartHeader && getStatusIcon(item.status)}</span> {/* MODIFIED: Removed item.status check as getStatusIcon handles undefined */}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };
  
  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (!book) return <div className="text-center py-12"><AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" /><p className="text-xl text-neutral-dark mb-4">Book not found</p><button onClick={() => navigate('/new-book')} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">Create New Book</button></div>;

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 bg-white border-r border-neutral-light rounded-b-xl rounded-l-xl shadow-md flex flex-col">
          <div className="p-4 border-b border-neutral-light">
            <button
              onClick={() => navigate('/book-library')}
              className="flex items-center text-sm text-neutral-medium mt-4 hover:text-secondary mb-3"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Library
            </button>
            <h2 className="font-heading text-lg font-semibold text-secondary truncate" title={book.title}>
              {book.title}
            </h2>
            <button
              onClick={() => navigate(`/book/${bookId}/preview`)}
              className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Book
            </button>
          </div>
          
          <div className="flex-1 px-4 py-6 overflow-y-auto min-h-full">
            <h3 className="text-xs font-semibold text-neutral-dark uppercase tracking-wider mb-3">
              Book Structure
            </h3>
            {renderSidebarItems()}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-neutral-lightest overflow-hidden">
          {selectedSection ? (
            <>
              <div className="bg-white border-b border-neutral-light p-4  rounded-r-xl shadow-md">
                <div className="flex flex-col"> {/* MODIFIED: items-center justify-between -> flex-col */}
                  <div className="w-full"> {/* ADDED: w-full to make title/metadata block take full width */}
                    <h1 className="text-xl font-heading font-semibold text-secondary mt-4">
                      {selectedSection.type === 'chapter' && selectedSection.number !== undefined
                        ? `Chapter ${selectedSection.number}: ${selectedSection.title.replace(/^\d+\.\s*/, '')}` // MODIFIED: Remove leading "N. " from title
                        : selectedSection.title}
                    </h1>
                    {selectedSection.type === 'chapter' && (
                      <>
                        <div className="flex items-center mt-1 space-x-3">
                          <span className="text-xs text-neutral-medium">
                            Status: {selectedSection.status || 'draft'}
                          </span>
                          <span className="text-xs text-neutral-medium">
                            Words: {currentContent.split(/\s+/).filter(Boolean).length}
                            {selectedSection.metadata?.estimatedWords && 
                              ` / target ${selectedSection.metadata.estimatedWords}`}
                          </span>
                        </div>
                        {selectedSection.metadata?.description && (
                          <div className="mt-2 w-full"> {/* ADDED: w-full */}
                            <p className="text-md italic text-neutral-medium bg-neutral-light/40 shadow-inner p-2 rounded-lg w-full"> {/* ADDED: w-full */}
                              {selectedSection.metadata.description}
                            </p>
                          </div>
                        )}
                        {selectedSection.metadata?.keyTopics && selectedSection.metadata.keyTopics.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {selectedSection.metadata.keyTopics.map((topic, index) => (
                              <span key={index} className="text-xs bg-primary/70 text-white px-1.5 py-0.5 rounded-md">
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 self-end mt-3"> {/* MODIFIED: Added self-end mt-3 */}
                    {(selectedSection.type === 'chapter' || selectedSection.type === 'appendix' || selectedSection.type === 'references') && !currentContent && (
                      <button
                        onClick={handleGenerateContent}
                        disabled={generating}
                        className="px-3 py-1.5 text-xs rounded-md bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center"
                      >
                        {generating ? <><div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1.5"></div>Generating...</> : <><Sparkles className="w-3 h-3 mr-1.5" />Generate</>}
                      </button>
                    )}
                    
                    {currentContent && (selectedSection.type === 'chapter' || selectedSection.type === 'appendix' || selectedSection.type === 'references') && (
                       <button
                        onClick={() => setShowRevisionModal(true)}
                        disabled={generating}
                        className="px-3 py-1.5 text-xs rounded-md border border-primary text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 flex items-center"
                      >
                        <Edit className="w-3 h-3 mr-1.5" />Revise
                      </button>
                    )}
                    
                    {selectedSection.type !== 'part-header' && (
                       <button
                      onClick={handleSaveChanges}
                      disabled={saving}
                      className="px-3 py-1.5 text-xs rounded-md bg-secondary text-white hover:bg-secondary-hover transition-colors disabled:opacity-50 flex items-center"
                    >
                      {saving ? <><div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1.5"></div>Saving...</> : <><Save className="w-3 h-3 mr-1.5" />Save</>}
                    </button>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border-b border-red-200">
                  <div className="flex items-start"><AlertCircle className="w-4 h-4 text-red-500 mr-1.5 flex-shrink-0 mt-px" /><p className="text-xs text-red-700">{error}</p></div>
                </div>
              )}

              <div className="flex-1 p-4 md:p-6 overflow-y-auto h-auto bg-white ml-6 rounded-2xl border-2 border-neutral-light shadown-md shadow-primary mt-4">
                <MarkdownEditor
                  value={currentContent}
                  onChange={setCurrentContent}
                  placeholder={generating ? "Generating content..." : `Edit ${selectedSection.title}...`}
                  disabled={generating || activeSectionTypeForEditor === 'part-header'}
                  className="w-full h-full flex-grow p-2 border-none focus:ring-0" // Ensure it fills space
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-neutral-medium">Select a section from the sidebar to begin editing.</p>
            </div>
          )}
        </div>
      </div>

      {showRevisionModal && selectedSection && activeSectionTypeForEditor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-lg w-full shadow-xl">
            <h3 className="text-lg font-heading font-semibold text-secondary mb-3">
              Revise {selectedSection.title}
            </h3>
            <p className="text-sm text-neutral-medium mb-3">
              Provide instructions for how AI should revise this section.
            </p>
            <textarea
              value={revisionInstructions}
              onChange={(e) => setRevisionInstructions(e.target.value)}
              placeholder="e.g., Make it more engaging, add more examples, simplify the language..."
              className="w-full p-2.5 text-sm border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none h-28"
            />
            <div className="flex justify-end space-x-2.5 mt-5">
              <button
                onClick={() => { setShowRevisionModal(false); setRevisionInstructions(''); }}
                className="px-3.5 py-1.5 text-xs rounded-md border border-neutral-light text-neutral-medium hover:text-secondary hover:border-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReviseContent}
                disabled={!revisionInstructions.trim() || generating}
                className="px-3.5 py-1.5 text-xs rounded-md bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center"
              >
                {generating && selectedSection.type === 'chapter' ? <><div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1.5"></div>Revising...</> : 'Revise with AI'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookEditorPage;
