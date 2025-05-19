import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import { Book, Plus, Eye, Edit2, Trash2, Calendar, Clock } from 'lucide-react'
import { cn } from '../lib/utils'
import { bookService } from '../lib/books'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import type { Book as BookType } from '../types/books'

const BookLibraryPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadBooks()
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

  const handleDelete = async (bookId: string) => {
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-semibold text-secondary">
            My Self-Improvement Books
          </h1>
          <button
            onClick={() => navigate('/new-book')}
            className={cn(
              "px-6 py-3 rounded-lg bg-primary text-white",
              "hover:bg-primary-hover transition-colors",
              "flex items-center"
            )}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Book
          </button>
        </div>

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-heading text-lg font-semibold text-secondary">
                      {book.title || book.topic}
                    </h3>
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full border",
                      getStatusColor(book.status)
                    )}>
                      {book.status}
                    </span>
                  </div>
                  
                  <p className="text-neutral-medium mb-4 line-clamp-2">
                    {book.topic}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-neutral-medium">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created: {formatDate(book.created_at)}
                    </div>
                    <div className="flex items-center text-sm text-neutral-medium">
                      <Clock className="w-4 h-4 mr-2" />
                      Updated: {formatDate(book.updated_at)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/book/${book.id}/edit`)}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-lg border border-primary text-primary",
                        "hover:bg-primary/10 transition-colors",
                        "flex items-center justify-center"
                      )}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/book/${book.id}/preview`)}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-lg bg-primary text-white",
                        "hover:bg-primary-hover transition-colors",
                        "flex items-center justify-center"
                      )}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className={cn(
                        "px-4 py-2 rounded-lg border border-red-500 text-red-500",
                        "hover:bg-red-50 transition-colors"
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default BookLibraryPage