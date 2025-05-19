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
    
    // Add table of contents
    markdown += '## Table of Contents\n\n'
    chapters.forEach((chapter) => {
      markdown += `${chapter.number}. [${chapter.title}](#chapter-${chapter.number})\n`
    })
    
    markdown += '\n---\n\n'
    
    // Add chapters
    chapters.forEach((chapter) => {
      markdown += `<a name="chapter-${chapter.number}"></a>\n\n`
      if (chapter.content) {
        markdown += chapter.content
      } else {
        markdown += `## Chapter ${chapter.number}: ${chapter.title}\n\n`
        markdown += '*This chapter has not been written yet.*\n'
      }
      markdown += '\n\n---\n\n'
    })

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
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!book) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-xl text-neutral-dark">Book not found</p>
        </div>
      </DashboardLayout>
    )
  }

  const completeBook = chapters.map(chapter => chapter.content || '').join('\n\n---\n\n')

  return (
    <DashboardLayout>
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
            <div className="mt-6">
              <p className="text-sm font-medium text-neutral-dark mb-1">Market Position</p>
              <p className="text-neutral-medium">{book.structure.marketPosition}</p>
            </div>
          )}
        </div>

        {/* Chapter navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-heading font-semibold text-secondary mb-4">
            Chapters
          </h2>
          <div className="space-y-2">
            {chapters.map((chapter) => (
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
    </DashboardLayout>
  )
}

export default BookPreviewPage