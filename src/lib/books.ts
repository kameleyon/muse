import { supabase } from '../services/supabase'
import axios from 'axios'
import type { Book, Chapter, Upload } from '../types/books'
import { openRouter } from './openrouter'

export const bookService = {
  baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9999',

  // Create a new book with market research and structure
  async createBook(
    topic: string, 
    userId: string, 
    resources: string[] = [],
    bookType: string = 'self_improvement'
  ): Promise<{ book: Book, marketResearch: any, structure: any }> {
    // Generate market research using backend
    const marketResearchResponse = await axios.post(
      `${this.baseUrl}/api/book-ai/market-research`,
      { topic, references: resources },
      {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      }
    )
    const { marketResearch } = marketResearchResponse.data
    console.log('Market research generated:', marketResearch)

    // Generate book structure using backend
    const structureResponse = await axios.post(
      `${this.baseUrl}/api/book-ai/generate-structure`,
      { topic, marketResearch, references: resources },
      {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      }
    )
    const { structure } = structureResponse.data
    console.log('Book structure generated:', structure)

    // Create book in database
    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert({
        user_id: userId,
        title: structure.title || topic,
        topic,
        status: 'draft',
        book_type: bookType,
        market_research: marketResearch,
        structure
      })
      .select()
      .single()

    if (bookError) throw bookError

    // Create chapters
    if (structure.chapters?.length > 0) {
      await this.createChapters(book.id, structure.chapters)
    }

    return { book, marketResearch, structure }
  },

  // Get all books for a user
  async getUserBooks(userId: string, bookType?: string): Promise<Book[]> {
    let query = supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    if (bookType) {
      query = query.eq('book_type', bookType)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  // Get a single book with chapters
  async getBook(bookId: string): Promise<Book & { chapters: Chapter[] }> {
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single()

    if (bookError) throw bookError

    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', bookId)
      .order('number')

    if (chaptersError) throw chaptersError

    return { ...book, chapters: chapters || [] }
  },

  // Update book details
  async updateBook(bookId: string, updates: Partial<Book>): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a book and its chapters
  async deleteBook(bookId: string): Promise<void> {
    // Delete chapters first (due to foreign key constraint)
    const { error: chaptersError } = await supabase
      .from('chapters')
      .delete()
      .eq('book_id', bookId)

    if (chaptersError) throw chaptersError

    // Delete uploads
    const { error: uploadsError } = await supabase
      .from('uploads')
      .delete()
      .eq('book_id', bookId)

    if (uploadsError) throw uploadsError

    // Delete the book
    const { error: bookError } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)

    if (bookError) throw bookError
  },

  // Create chapters for a book
  async createChapters(bookId: string, chapters: any[]): Promise<void> {
    const chapterData = chapters.map((chapter: any) => ({
      book_id: bookId,
      number: chapter.number,
      title: chapter.title,
      content: '',
      status: 'draft'
    }))

    const { error } = await supabase
      .from('chapters')
      .insert(chapterData)

    if (error) throw error
  },

  // Get a single chapter
  async getChapter(chapterId: string): Promise<Chapter> {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single()

    if (error) throw error
    return data
  },

  // Update chapter
  async updateChapter(chapterId: string, updates: Partial<Chapter>): Promise<Chapter> {
    const { data, error } = await supabase
      .from('chapters')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', chapterId)
      .select()
      .single()

    if (error) throw error

    // Update book's updated_at timestamp
    const { book_id } = data
    await supabase
      .from('books')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', book_id)

    return data
  },

  // Generate chapter content
  async generateChapter(chapterId: string): Promise<Chapter> {
    const response = await axios.post(
      `${this.baseUrl}/api/book-ai/generate-chapter`,
      { chapterId },
      {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      }
    )

    return response.data.chapter
  },

  // Revise chapter content
  async reviseChapter(chapterId: string, instructions: string): Promise<Chapter> {
    const response = await axios.post(
      `${this.baseUrl}/api/book-ai/revise-chapter`,
      { chapterId, revisionInstructions: instructions },
      {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      }
    )

    return response.data.chapter
  },

  // Upload reference file
  async uploadReference(
    bookId: string,
    userId: string,
    file: File
  ): Promise<Upload> {
    const bucketName = 'uploads' // Use 'uploads' as the bucket name
    
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${bookId}/${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      // If bucket doesn't exist, provide instructions
      if (uploadError.message.includes('not found')) {
        throw new Error('Storage bucket not found. Please create a bucket named "uploads" in your Supabase dashboard.')
      }
      // If permission denied, provide instructions
      if (uploadError.message.includes('row-level security') || 
          uploadError.message.includes('policy violation') || 
          uploadError.message.includes('permission denied')) {
        throw new Error('Storage permission denied. Please run the fix-uploads-rls.sql script in your Supabase dashboard.')
      }
      throw uploadError
    }

    // Create upload record in database
    const { data, error } = await supabase
      .from('uploads')
      .insert({
        book_id: bookId,
        user_id: userId,
        filename: file.name,
        file_type: file.type,
        file_path: fileName,
        file_size: file.size
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get book uploads
  async getBookUploads(bookId: string): Promise<Upload[]> {
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Delete upload
  async deleteUpload(uploadId: string, filePath: string): Promise<void> {
    const bucketName = 'uploads'
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('uploads')
      .delete()
      .eq('id', uploadId)

    if (dbError) throw dbError
  },

  // Get download URL for an upload
  async getDownloadUrl(filePath: string): Promise<string> {
    const bucketName = 'uploads'
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) throw error
    return data.signedUrl
  }
}