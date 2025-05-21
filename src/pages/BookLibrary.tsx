import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { 
  Book, Plus, Eye, Edit2, Trash2, Calendar, Clock, Heart, BookOpen, File, 
  Search, Filter, ChevronUp, ChevronDown, X, Check, RefreshCw
} from 'lucide-react'
import { cn } from '../lib/utils'
import { bookService } from '../lib/books'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import type { Book as BookType } from '../types/books'
import '@/styles/ProjectArea.css';
import '@/styles/ProjectSetup.css';
import '@/styles/blog.css';

type SortField = 'title' | 'created_at' | 'updated_at' | 'favorite' | 'status'
type SortDirection = 'asc' | 'desc'

const BookLibraryPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('updated_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadBooks()
      // Load favorites from localStorage
      const savedFavorites = localStorage.getItem('bookFavorites')
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites))
        } catch (e) {
          console.error("Failed to parse favorites", e)
        }
      }
    }
  }, [user])

  const loadBooks = async () => {
    try {
      setLoading(true)
      const userBooks = await bookService.getUserBooks(user!.id, 'self_improvement')
      setBooks(userBooks)
    } catch (err: any) {
      setError(err.message || 'Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return
    }

    try {
      await bookService.deleteBook(bookId)
      await loadBooks()
    } catch (err: any) {
      setError(err.message || 'Failed to delete book')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const toggleFavorite = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click
    const newFavorites = { ...favorites }
    newFavorites[bookId] = !newFavorites[bookId]
    setFavorites(newFavorites)
    localStorage.setItem('bookFavorites', JSON.stringify(newFavorites))
  }

  const getContentPreview = (book: BookType) => {
    if (!book.chapters || book.chapters.length === 0) {
      return "No content yet"
    }
    
    // Get the first chapter with content
    const chapterWithContent = book.chapters.find(ch => ch.content)
    if (!chapterWithContent || !chapterWithContent.content) {
      return "No content yet"
    }
    
    // Return first 100 characters of the content
    return chapterWithContent.content.substring(0, 100) + "..."
  }

  const getProgressPercent = (book: BookType) => {
    if (!book.chapters || book.chapters.length === 0) return 0
    const completedChapters = book.chapters.filter(ch => ch.status === 'complete').length
    return Math.round((completedChapters / book.chapters.length) * 100)
  }

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field with default direction
      setSortField(field)
      // Title sorts A-Z by default, dates newest first by default
      if (field === 'title') {
        setSortDirection('asc')
      } else {
        setSortDirection('desc')
      }
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter(null)
    setSortField('updated_at')
    setSortDirection('desc')
    setFilterMenuOpen(false)
  }

  // Apply search, sort and filter
  const filteredBooks = useMemo(() => {
    let result = [...books]
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(book => 
        (book.title?.toLowerCase().includes(search) || false) || 
        (book.topic?.toLowerCase().includes(search) || false)
      )
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(book => book.status === statusFilter)
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA: any
      let valueB: any
      
      if (sortField === 'favorite') {
        valueA = favorites[a.id] ? 1 : 0
        valueB = favorites[b.id] ? 1 : 0
      } else if (sortField === 'title') {
        valueA = a.title || a.topic || ''
        valueB = b.title || b.topic || ''
      } else {
        valueA = new Date(a[sortField]).getTime()
        valueB = new Date(b[sortField]).getTime()
      }

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })
    
    return result
  }, [books, searchTerm, sortField, sortDirection, favorites, statusFilter])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 "></div>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">My Creations</h1>
        <p className="text-neutral-medium max-w-3xl">
            Everything you created books, projects and so much more
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search books by title or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 bg-neutral-white border border-white rounded-xl focus:ring-primary focus:border-primary"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className={cn(
              "px-4 py-3 rounded-xl border flex items-center gap-2",
              filterMenuOpen || statusFilter 
                ? "border-white bg-primary/50 text-neutral-white" 
                : "border-white bg-neutral-white text-secondary/60",
            )}
          >
            <Filter className="h-5 w-5" />
            <span>Filter & Sort</span>
            {(filterMenuOpen || statusFilter) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {filterMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-neutral-white rounded-xl shadow-lg border border-neutral-white z-10 p-4">
              <div className="mb-4">
                <span className="font-medium text-neutral-medium/70 text-lg mb-6"> </span>
                <div className="grid grid-cols-1 gap-2 mt-6">
                  {[
                    { field: 'updated_at', label: 'Last Edited' },
                    { field: 'created_at', label: 'Creation Date' },
                    { field: 'title', label: 'Title' },
                    { field: 'favorite', label: 'Favorites First' },
                  ].map((option) => (
                    <button
                      key={option.field}
                      onClick={() => handleSortChange(option.field as SortField)}
                      className={cn(
                        "flex items-center justify-between px-3 py-1 rounded-md text-left",
                        sortField === option.field
                          ? " text-primary font-medium"
                          : "hover:bg-neutral-light"
                      )}
                    >
                      <span>{option.label}</span>
                      {sortField === option.field && (
                        sortDirection === 'asc' 
                          ? <ChevronUp className="h-4 w-4" />
                          : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4 border-t pt-3 mt-1">
                <span className="font-medium text-neutral-medium/70 text-lg mb-6 "></span>
                <div className="grid grid-cols-1 gap-2">
                  {['draft', 'in_progress', 'complete', 'all'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status === 'all' ? null : status)}
                      className={cn(
                        "flex items-center justify-between px-3 py-1 rounded-md text-left",
                        (statusFilter === status || (status === 'all' && !statusFilter))
                          ?  "text-primary font-medium"
                          : "hover:bg-neutral-light"
                      )}
                    >
                      <span className="capitalize">{status === 'all' ? 'All Statuses' : status.replace('_', ' ')}</span>
                      {(statusFilter === status || (status === 'all' && !statusFilter)) && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end border-t pt-3 mt-1">
                <button
                  onClick={clearFilters}
                  className="flex items-center px-3 py-1.5 text-secondary/70 hover:text-primary transition-colors rounded-md text-sm font-medium"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {(statusFilter || searchTerm || sortField !== 'updated_at' || sortDirection !== 'desc') && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-gray-500">Active filters:</span>
          
          {statusFilter && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Status: {statusFilter.replace('_', ' ')}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setStatusFilter(null)} />
            </span>
          )}
          
          {searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Search: {searchTerm}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
            </span>
          )}
          
          {(sortField !== 'updated_at' || sortDirection !== 'desc') && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Sort: {sortField.replace('_', ' ')} ({sortDirection === 'asc' ? 'A-Z' : 'Z-A'})
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSortField('updated_at')
                  setSortDirection('desc')
                }} 
              />
            </span>
          )}
          
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {books.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Book className="w-16 h-16 text-neutral-medium mx-auto mb-4" />
          <p className="text-xl text-neutral-dark mb-2">No books yet</p>
          <p className="text-neutral-medium mb-6">
            Start creating your first self-improvement book
          </p>
          <button
            onClick={() => navigate('/new-book')}
            className={cn(
              "px-6 py-3 rounded-lg bg-primary text-white",
              "hover:bg-primary-hover transition-colors"
            )}
          >
            Create Your First Book
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Search className="w-16 h-16 text-neutral-medium mx-auto mb-4" />
          <p className="text-xl text-neutral-dark mb-2">No matching books found</p>
          <p className="text-neutral-medium mb-6">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <div 
              key={book.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="grid grid-cols-12 gap-4">
                {/* Left section with book details */}
                <div 
                  className="col-span-9 p-6 cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}/edit`)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-gray-100 h-24 w-20 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-secondary truncate">
                          {book.title || book.topic}
                        </h3>
                        <span className={cn(
                          "ml-2 px-3 py-1 text-xs rounded-full border inline-flex items-center whitespace-nowrap",
                          getStatusColor(book.status)
                        )}>
                          {book.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{book.topic}</p>
                      
                      <div className="mt-3 bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 mb-1">Content Preview:</p>
                        <p className="text-sm text-gray-700 italic line-clamp-2">{getContentPreview(book)}</p>
                      </div>
                      
                      <div className="mt-3 flex items-center text-xs text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          Created: {formatDate(book.created_at)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          Last edit: {formatDateTime(book.updated_at)}
                        </div>
                        <div className="flex items-center">
                          <File className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {book.chapters ? `${book.chapters.length} chapters` : 'No chapters'}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-gray-700 font-medium">{getProgressPercent(book)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary rounded-full h-1.5 transition-all duration-300"
                            style={{ width: `${getProgressPercent(book)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right section with actions */}
                <div className="col-span-3 bg-gray-50 flex flex-col justify-center items-center border-l border-gray-100">
                  <div className="p-4 flex flex-col items-center space-y-4">
                    <button
                      onClick={(e) => toggleFavorite(book.id, e)}
                      title={favorites[book.id] ? "Remove from favorites" : "Add to favorites"}
                      className={cn(
                        "p-2.5 rounded-full transition-colors",
                        favorites[book.id] 
                          ? "text-primary bg-neutral-light hover:bg-primary/70" 
                          : "text-neutral-light bg-secondary/30 hover:bg-primary/70"
                      )}
                    >
                      <Heart className="w-5 h-5" fill={favorites[book.id] ? "currentColor" : "none"} />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/book/${book.id}/edit`);
                      }}
                      title="Edit book"
                      className="p-2.5 rounded-full text-neutral-light bg-secondary/30 hover:bg-primary/70 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/book/${book.id}/preview`);
                      }}
                      title="Preview book"
                      className="p-2.5 rounded-full text-neutral-light bg-secondary/30 hover:bg-primary/70 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={(e) => handleDelete(book.id, e)}
                      title="Delete book"
                      className="p-2.5 rounded-full text-neutral-light bg-secondary/30 hover:bg-primary/70 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookLibraryPage