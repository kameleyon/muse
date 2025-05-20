import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ChevronLeft, Download, Share2, Edit2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { bookService } from '../../lib/books'
import MarkdownEditor from '../../components/MarkdownEditor'
import type { Book, Chapter } from '../../types/books'

const BookPreviewPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (bookId) {
      loadBook()
    }
  }, [bookId])
  
  // Debug function to log structure details
  useEffect(() => {
    if (book && book.structure) {
      console.log('Book Structure:', book.structure)
      if (book.structure.parts) {
        console.log('Parts found:', book.structure.parts.length)
        book.structure.parts.forEach((part, i) => {
          console.log(`Part ${i+1}: ${part.partTitle}, Chapters: ${part.chapters.length}`)
        })
      } else {
        console.log('No parts structure found')
      }
    }
  }, [book])

  const loadBook = async () => {
    try {
      setLoading(true)
      const bookData = await bookService.getBook(bookId!)
      setBook(bookData)
      setChapters(bookData.chapters)
    } catch (err: any) {
      setError(err.message || 'Failed to load book')
    } finally {
      setLoading(false)
    }
  }

  const downloadMarkdown = () => {
    if (!book || !chapters) return

    // Combine all chapters into a single markdown document
    let markdown = `# ${book.title}\n\n`
    if (book.structure?.subtitle) {
      markdown += `## ${book.structure.subtitle}\n\n`
    }
    
    markdown += '---\n\n'
    
    // Add market position and unique value if available
    if (book.structure?.marketPosition) {
      markdown += `### Market Position\n${book.structure.marketPosition}\n\n`
    }
    
    if (book.structure?.uniqueValue) {
      markdown += `### Unique Value\n${book.structure.uniqueValue}\n\n`
    }
    
    if (book.structure?.acknowledgement) {
      markdown += `### Acknowledgement\n${book.structure.acknowledgement}\n\n`
    }
    
    markdown += '---\n\n'
    
    // Add table of contents
    markdown += '## Table of Contents\n\n'
    
    // Handle prologue and introduction
    if (chapters.find(ch => ch.number === 0)) {
      const specialChapter = chapters.find(ch => ch.number === 0)
      markdown += `- [${specialChapter?.title}](#chapter-0)\n`
    }
    
    // Handle parts and chapters
    if (book.structure?.parts) {
      book.structure.parts.forEach((part) => {
        markdown += `\n**${part.partTitle}**\n\n`
        part.chapters.forEach((chapterStruct) => {
          const chapterExists = chapters.find(ch => ch.number === chapterStruct.number)
          if (chapterExists) {
            markdown += `${chapterStruct.number}. [${chapterStruct.title}](#chapter-${chapterStruct.number})\n`
          }
        })
      })
    } else {
      // Fallback to simple chapter list
      chapters.filter(ch => ch.number > 0).forEach((chapter) => {
        markdown += `${chapter.number}. [${chapter.title}](#chapter-${chapter.number})\n`
      })
    }
    
    // Handle conclusion
    const maxChapterNum = Math.max(...chapters.map(ch => ch.number))
    if (chapters.find(ch => ch.number === maxChapterNum && ch.title.toLowerCase() === 'conclusion')) {
      const conclusion = chapters.find(ch => ch.number === maxChapterNum && ch.title.toLowerCase() === 'conclusion')
      markdown += `\n- [${conclusion?.title}](#chapter-${conclusion?.number})\n`
    }
    
    markdown += '\n---\n\n'
    
    // Add prologue or introduction first if exists
    const specialChapter = chapters.find(ch => ch.number === 0)
    if (specialChapter) {
      markdown += `<a name="chapter-0"></a>\n\n`
      if (specialChapter.content) {
        markdown += specialChapter.content
      } else {
        markdown += `## ${specialChapter.title}\n\n`
        markdown += '*This section has not been written yet.*\n'
      }
      markdown += '\n\n---\n\n'
    }
    
    // Add parts and chapters
    if (book.structure?.parts) {
      book.structure.parts.forEach((part) => {
        markdown += `# ${part.partTitle}\n\n`
        
        part.chapters.forEach((chapterStruct) => {
          const chapter = chapters.find(ch => ch.number === chapterStruct.number)
          if (chapter) {
            markdown += `<a name="chapter-${chapter.number}"></a>\n\n`
            if (chapter.content) {
              markdown += chapter.content
            } else {
              markdown += `## Chapter ${chapter.number}: ${chapter.title}\n\n`
              markdown += `*${chapterStruct.description || 'This chapter has not been written yet.'}*\n`
            }
            markdown += '\n\n---\n\n'
          }
        })
      })
    } else {
      // Fallback to simple chapter list
      chapters.filter(ch => ch.number > 0 && ch.title.toLowerCase() !== 'conclusion').forEach((chapter) => {
        markdown += `<a name="chapter-${chapter.number}"></a>\n\n`
        if (chapter.content) {
          markdown += chapter.content
        } else {
          markdown += `## Chapter ${chapter.number}: ${chapter.title}\n\n`
          markdown += '*This chapter has not been written yet.*\n'
        }
        markdown += '\n\n---\n\n'
      })
    }
    
    // Add conclusion at the end if exists
    const conclusion = chapters.find(ch => ch.number === maxChapterNum && ch.title.toLowerCase() === 'conclusion')
    if (conclusion) {
      markdown += `<a name="chapter-${conclusion.number}"></a>\n\n`
      if (conclusion.content) {
        markdown += conclusion.content
      } else {
        markdown += `## ${conclusion.title}\n\n`
        markdown += '*This section has not been written yet.*\n'
      }
      markdown += '\n\n---\n\n'
    }

    // Create blob and download
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      
    )
  }

  if (!book) {
    return (
      
        <div className="text-center py-12">
          <p className="text-xl text-neutral-dark">Book not found</p>
        </div>
      
    )
  }

  const completeBook = chapters.map(chapter => chapter.content || '').join('\n\n---\n\n')

  return (
    
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/book-library')}
            className="flex items-center text-neutral-medium hover:text-secondary mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Library
          </button>
          
          <div className="flex justify-between items-start">
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
                className={cn(
                  "px-4 py-2 rounded-lg border border-primary text-primary",
                  "hover:bg-primary/10 transition-colors",
                  "flex items-center"
                )}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Book
              </button>
              <button
                onClick={downloadMarkdown}
                className={cn(
                  "px-4 py-2 rounded-lg bg-primary text-white",
                  "hover:bg-primary-hover transition-colors",
                  "flex items-center"
                )}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Book info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-neutral-dark mb-1">Target Audience</p>
              <p className="text-neutral-medium">
                {book.structure?.audience || 'General readers'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-dark mb-1">Writing Style</p>
              <p className="text-neutral-medium">
                {book.structure?.style || 'Clear and engaging'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-dark mb-1">Tone</p>
              <p className="text-neutral-medium">
                {book.structure?.tone || 'Conversational'}
              </p>
            </div>
          </div>
          
          {book.structure?.marketPosition && (
            <div className="mt-4">
              <p className="text-sm font-medium text-neutral-dark mb-1">Market Position</p>
              <p className="text-neutral-medium">{book.structure.marketPosition}</p>
            </div>
          )}
          
          {book.structure?.uniqueValue && (
            <div className="mt-4">
              <p className="text-sm font-medium text-neutral-dark mb-1">Unique Value</p>
              <p className="text-neutral-medium">{book.structure.uniqueValue}</p>
            </div>
          )}
          
          {book.structure?.colorScheme && (
            <div className="mt-6 border-t border-neutral-light pt-4">
              <p className="text-sm font-medium text-neutral-dark mb-2">Color Scheme</p>
              <div className="flex items-center space-x-4">
                {book.structure.colorScheme.primary && (
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-8 h-8 rounded-full mb-1" 
                      style={{ backgroundColor: book.structure.colorScheme.primary }}
                    ></div>
                    <span className="text-xs text-neutral-medium">Primary</span>
                  </div>
                )}
                {book.structure.colorScheme.secondary && (
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-8 h-8 rounded-full mb-1" 
                      style={{ backgroundColor: book.structure.colorScheme.secondary }}
                    ></div>
                    <span className="text-xs text-neutral-medium">Secondary</span>
                  </div>
                )}
                {book.structure.colorScheme.accent && (
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-8 h-8 rounded-full mb-1" 
                      style={{ backgroundColor: book.structure.colorScheme.accent }}
                    ></div>
                    <span className="text-xs text-neutral-medium">Accent</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {book.structure?.totalWords && (
            <div className="mt-6 border-t border-neutral-light pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-dark">Estimated Total Length</p>
                <p className="text-neutral-medium">{book.structure.totalWords.toLocaleString()} words</p>
              </div>
            </div>
          )}
        </div>

        {/* Chapter navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-heading font-semibold text-secondary mb-4">
            Table of Contents
          </h2>
          <div className="space-y-4">
            {/* Prologue/Introduction */}
            {chapters.find(ch => ch.number === 0) && (
              <a
                key={chapters.find(ch => ch.number === 0)?.id}
                href={`#chapter-0`}
                className={cn(
                  "block p-3 rounded-lg hover:bg-neutral-light/50 transition-colors",
                  "flex items-center justify-between font-medium text-primary"
                )}
              >
                <span>
                  {chapters.find(ch => ch.number === 0)?.title}
                </span>
                <span className="text-sm text-neutral-medium">
                  {chapters.find(ch => ch.number === 0)?.status === 'complete' && '✓'}
                  {chapters.find(ch => ch.number === 0)?.status === 'in_progress' && '...'}
                  {chapters.find(ch => ch.number === 0)?.status === 'draft' && '○'}
                </span>
              </a>
            )}

            {/* Parts and chapters */}
            {book.structure?.parts && Array.isArray(book.structure.parts) && book.structure.parts.length > 0 ? (
              book.structure.parts.map((part, partIndex) => {
                // Check if part is valid and has chapters
                if (!part || !part.partTitle || !part.chapters || !Array.isArray(part.chapters)) {
                  console.warn(`Invalid part structure at index ${partIndex}:`, part);
                  return null;
                }
                
                return (
                  <div key={partIndex} className="mt-4">
                    <h3 className="font-heading font-semibold text-secondary mb-2 p-2 bg-primary/10 rounded">
                      {part.partTitle}
                    </h3>
                    <div className="space-y-1 pl-2">
                      {part.chapters.map((chapterStruct) => {
                        // Find the corresponding chapter in the chapters array
                        const chapter = chapters.find(ch => ch.number === chapterStruct.number);
                        return chapter ? (
                          <a
                            key={chapter.id}
                            href={`#chapter-${chapter.number}`}
                            className={cn(
                              "block p-2 rounded-lg hover:bg-neutral-light/50 transition-colors",
                              "flex items-center justify-between"
                            )}
                          >
                            <span className="text-neutral-dark">
                              {chapter.number}. {chapter.title}
                            </span>
                            <span className="text-sm text-neutral-medium">
                              {chapter.status === 'complete' && '✓'}
                              {chapter.status === 'in_progress' && '...'}
                              {chapter.status === 'draft' && '○'}
                            </span>
                          </a>
                        ) : null;
                      })}
                    </div>
                  </div>
                );
              }).filter(Boolean) // Filter out null values
            ) : (
              // Fallback to simple chapter list
              <div className="space-y-2">
                {chapters.filter(ch => ch.number > 0 && ch.title.toLowerCase() !== 'conclusion').map((chapter) => (
                  <a
                    key={chapter.id}
                    href={`#chapter-${chapter.number}`}
                    className={cn(
                      "block p-3 rounded-lg hover:bg-neutral-light/50 transition-colors",
                      "flex items-center justify-between"
                    )}
                  >
                    <span className="text-neutral-dark">
                      {chapter.number}. {chapter.title}
                    </span>
                    <span className="text-sm text-neutral-medium">
                      {chapter.status === 'complete' && '✓'}
                      {chapter.status === 'in_progress' && '...'}
                      {chapter.status === 'draft' && '○'}
                    </span>
                  </a>
                ))}
              </div>
            )}

            {/* Conclusion */}
            {(() => {
              const maxChapterNum = Math.max(...chapters.map(ch => ch.number));
              const conclusion = chapters.find(ch => ch.number === maxChapterNum && ch.title.toLowerCase() === 'conclusion');
              
              return conclusion ? (
                <a
                  key={conclusion.id}
                  href={`#chapter-${conclusion.number}`}
                  className={cn(
                    "block p-3 rounded-lg hover:bg-neutral-light/50 transition-colors mt-4",
                    "flex items-center justify-between font-medium text-primary"
                  )}
                >
                  <span>
                    {conclusion.title}
                  </span>
                  <span className="text-sm text-neutral-medium">
                    {conclusion.status === 'complete' && '✓'}
                    {conclusion.status === 'in_progress' && '...'}
                    {conclusion.status === 'draft' && '○'}
                  </span>
                </a>
              ) : null;
            })()}
          </div>
        </div>

        {/* Full book content */}
        <div className="bg-white rounded-lg shadow-sm">
          <MarkdownEditor
            value={completeBook}
            onChange={() => {}} // Read-only
            readOnly={true}
            className="min-h-[600px]"
          />
        </div>
      </div>
    
  )
}

export default BookPreviewPage