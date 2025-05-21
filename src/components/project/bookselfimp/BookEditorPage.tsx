import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layout/DashboardLayout'
import { 
  ChevronLeft, 
  Save, 
  Sparkles, 
  Check, 
  Clock, 
  FileText,
  Edit,
  AlertCircle,
  Eye
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { bookService } from '../../../lib/books'
import MarkdownEditor from '../../MarkdownEditor'
import type { Book, Chapter } from '../../../types/books'

const BookEditorPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [content, setContent] = useState('')
  const [revisionInstructions, setRevisionInstructions] = useState('')
  const [showRevisionModal, setShowRevisionModal] = useState(false)

  useEffect(() => {
    if (bookId) {
      loadBook()
    }
  }, [bookId])

  useEffect(() => {
    if (selectedChapter) {
      setContent(selectedChapter.content || '')
    }
  }, [selectedChapter])

  const loadBook = async () => {
    try {
      setLoading(true)
      const bookData = await bookService.getBook(bookId!)
      setBook(bookData)
      setChapters(bookData.chapters)
      
      // Select first chapter by default
      if (bookData.chapters.length > 0) {
        setSelectedChapter(bookData.chapters[0])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load book')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateChapter = async () => {
    if (!selectedChapter) return
    
    setGenerating(true)
    setError('')
    
    try {
      const updatedChapter = await bookService.generateChapter(selectedChapter.id)
      setContent(updatedChapter.content)
      
      // Update chapter in state
      setChapters(chapters.map(ch => 
        ch.id === updatedChapter.id ? updatedChapter : ch
      ))
      setSelectedChapter(updatedChapter)
    } catch (err: any) {
      setError(err.message || 'Failed to generate chapter')
    } finally {
      setGenerating(false)
    }
  }

  const handleSaveChapter = async () => {
    if (!selectedChapter) return
    
    setSaving(true)
    setError('')
    
    try {
      const updatedChapter = await bookService.updateChapter(selectedChapter.id, {
        content,
        status: content ? 'in_progress' : 'draft'
      })
      
      // Update chapter in state
      setChapters(chapters.map(ch => 
        ch.id === updatedChapter.id ? updatedChapter : ch
      ))
      setSelectedChapter(updatedChapter)
    } catch (err: any) {
      setError(err.message || 'Failed to save chapter')
    } finally {
      setSaving(false)
    }
  }

  const handleReviseChapter = async () => {
    if (!selectedChapter || !revisionInstructions.trim()) return
    
    setGenerating(true)
    setError('')
    setShowRevisionModal(false)
    
    try {
      const updatedChapter = await bookService.reviseChapter(
        selectedChapter.id,
        revisionInstructions
      )
      setContent(updatedChapter.content)
      setRevisionInstructions('')
      
      // Update chapter in state
      setChapters(chapters.map(ch => 
        ch.id === updatedChapter.id ? updatedChapter : ch
      ))
      setSelectedChapter(updatedChapter)
    } catch (err: any) {
      setError(err.message || 'Failed to revise chapter')
    } finally {
      setGenerating(false)
    }
  }

  const getStatusIcon = (status: Chapter['status']) => {
    switch (status) {
      case 'complete':
        return <Check className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
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
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-neutral-dark">Book not found</p>
        </div>
      
    )
  }

  return (
    
      <div className="flex h-[calc(100vh-6rem)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-neutral-light overflow-y-auto">
          <div className="p-4 border-b border-neutral-light">
            <button
              onClick={() => navigate('/book-library')}
              className="flex items-center text-neutral-medium hover:text-secondary mb-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Library
            </button>
            <h2 className="font-heading text-lg font-semibold text-secondary">
              {book.title}
            </h2>
            
            <button
              onClick={() => navigate(`/book/${bookId}/preview`)}
              className="mt-3 w-full px-3 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Book
            </button>
          </div>
          
          <div className="p-4">
            <h3 className="text-sm font-medium text-neutral-dark mb-3">
              Table of Contents
            </h3>
            <ul className="space-y-2">
              {/* Group chapters by type/part */}
              {(() => {
                // Setup part tracking
                const parts: Record<string, any> = {};
                let specialChapters: Chapter[] = [];
                let regularChapters: Chapter[] = [];
                
                // Find if we have introduction/prologue (number 0)
                const introChapter = chapters.find(ch => ch.number === 0);
                if (introChapter) {
                  specialChapters.push(introChapter);
                }
                
                // Find if we have conclusion (highest number)
                if (chapters.length > 0) {
                  const maxNumberChapter = chapters.reduce((max, ch) => 
                    ch.number > max.number ? ch : max, chapters[0]);
                  
                  if (maxNumberChapter.title.toLowerCase() === 'conclusion' && maxNumberChapter.number > 0) {
                    const conclusionChapter = chapters.find(ch => ch.id === maxNumberChapter.id);
                    if (conclusionChapter && conclusionChapter !== introChapter) {
                      specialChapters.push(conclusionChapter);
                    }
                  }
                }
                
                // Group remaining chapters by part if available
                if (book?.structure?.parts) {
                  for (const part of book.structure.parts) {
                    parts[part.partTitle] = chapters.filter(ch => {
                      const chapterNumbers = part.chapters.map(c => c.number);
                      return chapterNumbers.includes(ch.number) && 
                             ch.number !== 0 && 
                             !specialChapters.some(sc => sc.id === ch.id);
                    });
                  }
                } else {
                  // If no parts, collect all regular chapters
                  regularChapters = chapters.filter(ch => 
                    ch.number !== 0 && 
                    !specialChapters.some(sc => sc.id === ch.id)
                  );
                }
                
                return (
                  <>
                    {/* Render special chapters first */}
                    {specialChapters.map((chapter) => (
                      <li key={chapter.id}>
                        <button
                          onClick={() => setSelectedChapter(chapter)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg transition-colors",
                            "flex items-center justify-between font-medium",
                            selectedChapter?.id === chapter.id
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-neutral-light/50 text-secondary"
                          )}
                        >
                          <span className="text-sm">
                            {chapter.title}
                          </span>
                          {getStatusIcon(chapter.status)}
                        </button>
                      </li>
                    ))}
                    
                    {/* Render chapters by part */}
                    {book?.structure?.parts ? (
                      Object.entries(parts).map(([partTitle, partChapters]: [string, Chapter[]]) => (
                        <li key={partTitle} className="mt-4">
                          <h4 className="text-xs font-medium text-neutral-medium uppercase mb-2 px-2">
                            {partTitle}
                          </h4>
                          <ul className="space-y-1">
                            {(partChapters as Chapter[]).map((chapter) => (
                              <li key={chapter.id}>
                                <button
                                  onClick={() => setSelectedChapter(chapter)}
                                  className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg transition-colors",
                                    "flex items-center justify-between",
                                    selectedChapter?.id === chapter.id
                                      ? "bg-primary/10 text-primary"
                                      : "hover:bg-neutral-light/50"
                                  )}
                                >
                                  <span className="text-sm">
                                    {chapter.number}. {chapter.title}
                                  </span>
                                  {getStatusIcon(chapter.status)}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))
                    ) : (
                      // Render regular chapters if no parts
                      regularChapters.map((chapter) => (
                        <li key={chapter.id}>
                          <button
                            onClick={() => setSelectedChapter(chapter)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg transition-colors",
                              "flex items-center justify-between",
                              selectedChapter?.id === chapter.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-neutral-light/50"
                            )}
                          >
                            <span className="text-sm">
                              {chapter.number}. {chapter.title}
                            </span>
                            {getStatusIcon(chapter.status)}
                          </button>
                        </li>
                      ))
                    )}
                  </>
                );
              })()}
            </ul>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {selectedChapter ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-neutral-light p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-heading font-semibold text-secondary">
                      {selectedChapter.number === 0 
                        ? selectedChapter.title 
                        : `Chapter ${selectedChapter.number}: ${selectedChapter.title}`}
                    </h1>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-sm text-neutral-medium">
                        Status: {selectedChapter.status}
                      </span>
                      <span className="text-sm text-neutral-medium">
                        Words: {content.split(' ').filter(w => w).length}
                        {selectedChapter.metadata?.estimatedWords && 
                          ` / target ${selectedChapter.metadata.estimatedWords}`}
                      </span>
                    </div>
                    {selectedChapter.metadata?.description && (
                      <div className="mt-2">
                        <p className="text-sm italic text-neutral-medium bg-neutral-light/30 p-2 rounded">
                          {selectedChapter.metadata.description}
                        </p>
                      </div>
                    )}
                    {selectedChapter.metadata?.keyTopics && selectedChapter.metadata.keyTopics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {selectedChapter.metadata.keyTopics.map((topic, index) => (
                          <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {!content && (
                      <button
                        onClick={handleGenerateChapter}
                        disabled={generating}
                        className={cn(
                          "px-4 py-2 rounded-lg bg-primary text-white",
                          "hover:bg-primary-hover transition-colors",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "flex items-center"
                        )}
                      >
                        {generating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Chapter
                          </>
                        )}
                      </button>
                    )}
                    
                    {content && (
                      <button
                        onClick={() => setShowRevisionModal(true)}
                        disabled={generating}
                        className={cn(
                          "px-4 py-2 rounded-lg border border-primary text-primary",
                          "hover:bg-primary/10 transition-colors",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "flex items-center"
                        )}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Revise
                      </button>
                    )}
                    
                    <button
                      onClick={handleSaveChapter}
                      disabled={saving || !content}
                      className={cn(
                        "px-4 py-2 rounded-lg bg-secondary text-white",
                        "hover:bg-secondary-hover transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "flex items-center"
                      )}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Chapter
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border-b border-red-200">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Editor */}
              <div className="flex-1 p-6">
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder={generating ? "Generating content..." : "Start writing your chapter or click 'Generate Chapter' to use AI..."}
                  disabled={generating}
                  className="h-full"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-neutral-medium">
                Select a chapter to start editing
              </p>
            </div>
          )}
        </div>
      </div>
  )
      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-heading font-semibold text-secondary mb-4">
              Revise Chapter
            </h3>
            <p className="text-neutral-medium mb-4">
              Provide instructions for how you'd like to revise this chapter.
            </p>
            <textarea
              value={revisionInstructions}
              onChange={(e) => setRevisionInstructions(e.target.value)}
              placeholder="e.g., Make it more engaging, add more examples, simplify the language..."
              className={cn(
                "w-full p-3 border border-neutral-light rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                "resize-none h-32"
              )}
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRevisionModal(false)
                  setRevisionInstructions('')
                }}
                className={cn(
                  "px-4 py-2 rounded-lg border border-neutral-light",
                  "text-neutral-medium hover:text-secondary hover:border-secondary",
                  "transition-colors"
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleReviseChapter}
                disabled={!revisionInstructions.trim()}
                className={cn(
                  "px-4 py-2 rounded-lg bg-primary text-white",
                  "hover:bg-primary-hover transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Revise Chapter
              </button>
            </div>
          </div>
        </div>
      )}
    
  
}

export default BookEditorPage