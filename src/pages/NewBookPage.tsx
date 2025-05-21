import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/maingen.css'
import { Upload, FileText, AlertCircle, Sparkles, Book, Clock, CheckCircle } from 'lucide-react'
import { cn } from '../lib/utils'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { bookService } from '../lib/books'
import type { Book as BookType } from '../types/books'
import '@/styles/ProjectArea.css';
import '@/styles/ProjectSetup.css';
import '@/styles/blog.css';

const NewBookPage: React.FC = () => {
  console.log('NewBookPage component rendered')
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const [topic, setTopic] = useState('')
  const [uploads, setUploads] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentBooks, setRecentBooks] = useState<BookType[]>([])
  const [loadingRecentBooks, setLoadingRecentBooks] = useState(true)

  // Load recent books on component mount
  useEffect(() => {
    if (user) {
      loadRecentBooks()
    }
  }, [user])

  const loadRecentBooks = async () => {
    try {
      setLoadingRecentBooks(true)
      const books = await bookService.getUserBooks(user!.id, 'self_improvement')
      setRecentBooks(books.slice(0, 5)) // Get the 5 most recent books
    } catch (err) {
      console.error('Failed to load recent books:', err)
    } finally {
      setLoadingRecentBooks(false)
    }
  }

  const getBookStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Book className="w-4 h-4 text-gray-400" />
    }
  }

  const getBookProgress = (book: BookType) => {
    if (!book.chapters || book.chapters.length === 0) return 0
    const completedChapters = book.chapters.filter(ch => ch.status === 'complete').length
    return Math.round((completedChapters / book.chapters.length) * 100)
  }

  const handleContinueBook = (book: BookType) => {
    // Navigate to the appropriate page based on book status
    if (book.status === 'draft' && !book.structure) {
      navigate(`/book/${book.id}/review`)
    } else {
      navigate(`/book/${book.id}/edit`)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploads(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError('Please enter a book topic')
      return
    }

    if (!user) {
      setError('You must be logged in to create a book')
      return
    }

    setError('')
    setLoading(true)

    try {
      // Process reference files to extract filenames
      const resourceNames = uploads.map(file => file.name)
      
      // Create the book with market research
      const { book, marketResearch, structure } = await bookService.createBook(topic, user.id, resourceNames, 'self_improvement')
      
      // Upload reference files if any (skip if upload fails)
      if (uploads.length > 0) {
        for (const file of uploads) {
          try {
            await bookService.uploadReference(book.id, user.id, file)
          } catch (uploadErr: any) {
            console.error('Failed to upload file:', file.name, uploadErr)
            // Continue with other uploads
          }
        }
      }
      
      // Navigate to market research review page or book editor
      navigate(`/book/${book.id}/review`, { 
        state: { marketResearch, structure } 
      })
    } catch (err: any) {
      setError(err.message || 'Failed to generate book')
    } finally {
      setLoading(false)
    }
  }

  const samplePrompts = [
    "How to Build Mental Resilience",
    "Emotional Intelligence for Success",
    "The Art of Effective Communication",
    "Breaking Bad Habits and Building Good Ones",
    "Mastering Productivity and Time Management"
  ]

  return (
    <div className="flex gap-8">
      

      {/* Main Content */}
      <div className="flex-1 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Self Improvement Book</h1>
        <p className="text-neutral-medium max-w-3xl">
            Create a Self-Improvement Book.
        </p>
      </div>
        

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Topic Input */}
        <div className="bg-white rounded-2xl px-8 pb-8 shadow-sm mb-8">
        <h1 className=" card-header text-2xl font-heading font-semibold text-stone mb-8">
          More about your book
        </h1>
          <label className="block text-lg font-medium text-secondary mb-4">
            What's your book about?
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your self-improvement book topic or idea..."
            className={cn(
              "w-full p-4 border border-neutral-light rounded-xl",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "min-h-[150px] resize-y"
            )}
          />
          
          {/* Sample Prompts */}
          <div className="mt-4">
            <p className="text-sm text-neutral-medium mb-2">Need inspiration? Try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setTopic(prompt)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full ",
                    "bg-secondary/50 text-secondary",
                    "hover:bg-primary hover:text-primary transition-colors"
                  )}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
          <label className="block text-lg font-medium text-secondary mb-4">
            Reference Materials (Optional)
          </label>
          <p className="text-neutral-medium mb-4">
            Upload any documents, PDFs, or images that should be referenced when writing your book.
          </p>
          
          <div className="border-2 border-dashed border-neutral-light rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-neutral-medium mx-auto mb-4" />
            <p className="text-neutral-medium mb-4">
              Drag and drop files here, or click to browse
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={cn(
                "inline-block px-6 py-2 rounded-lg",
                "bg-primary text-white hover:bg-primary-hover",
                "cursor-pointer transition-colors"
              )}
            >
              Choose Files
            </label>
          </div>

          {/* Uploaded Files */}
          {uploads.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploads.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-neutral-light rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-neutral-medium mr-3" />
                    <span className="text-sm text-neutral-dark">{file.name}</span>
                    <span className="text-xs text-neutral-medium ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className={cn(
              "px-6 py-3 rounded-lg border border-neutral-light",
              "text-neutral-medium hover:text-secondary hover:border-secondary",
              "transition-colors"
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !topic.trim()}
            className={cn(
              "px-6 py-3 rounded-lg bg-primary text-white",
              "hover:bg-primary-hover transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center"
            )}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Book
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent Books Panel */}
      <div className="w-96">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-heading font-semibold text-secondary mb-6 flex items-center">
            <Book className="w-5 h-5 mr-2 text-primary" />
            Recent Books
          </h2>
          
          {loadingRecentBooks ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : recentBooks.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No books created yet</p>
              <p className="text-gray-400 text-xs mt-2">Start by creating your first book!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBooks.map((book) => {
                const progress = getBookProgress(book)
                return (
                  <div
                    key={book.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleContinueBook(book)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-stone text-xl line-clamp-1">{book.title}</p>
                        <p className="text-sm text-stone mt-1 line-clamp-2">{book.topic}</p>
                      </div>
                      {getBookStatusIcon(book.status)}
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Status and last updated */}
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span className="capitalize">{book.status.replace('_', ' ')}</span>
                      <span>
                        {new Date(book.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewBookPage