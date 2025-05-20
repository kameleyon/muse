import { supabase } from '../services/supabase'
import axios from 'axios'
import type { Book, Chapter, Upload } from '../types/books'
import { openRouter } from './openrouter'

export const bookService = {
  baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9998', // Temporarily changed from 9999

  // Create a new book with market research and structure
  async createBook(
    topic: string, 
    userId: string, 
    resources: string[] = [],
    bookType: string = 'self_improvement'
  ): Promise<{ book: Book, marketResearch: any, structure: any }> {
    try {
      // Generate market research using backend
      console.log('Generating market research for topic:', topic);
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
      console.log('Market research generated');

      // Generate book structure using backend
      console.log('Generating book structure...');
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
      console.log('Book structure generated');
      
      // Validate structure for debugging
      if (structure.parts) {
        console.log(`Found ${structure.parts.length} parts in the book structure`);
        if (!Array.isArray(structure.parts)) {
          console.error('structure.parts is not an array!');
        } else {
          structure.parts.forEach((part: any, i: number) => {
            console.log(`Part ${i+1}: ${part.partTitle || 'Unnamed'}, Chapters: ${part.chapters?.length || 0}`);
            if (!part.chapters || !Array.isArray(part.chapters)) {
              console.error(`Part ${i+1} has invalid chapters property:`, part.chapters);
            }
          });
        }
      } else {
        console.log('No parts structure found, using flat chapters list');
      }

      // Create book in database
      console.log('Creating book in database...');
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
      console.log('Book created in database with ID:', book.id);

      // Prepare chapters list based on structure format
      let chaptersList = [];
      
      // Add prologue or introduction if present
      if (structure.prologue || structure.introduction) {
        console.log('Adding prologue/introduction chapter');
        chaptersList.push({
          number: 0,
          title: structure.prologue ? 'Prologue' : 'Introduction',
          description: structure.prologue || structure.introduction || '',
          estimatedWords: 2000
        });
      }
      
      // Process chapters either from parts or flat structure
      if (structure.parts && Array.isArray(structure.parts) && structure.parts.length > 0) {
        // Use sequential numbering for chapters
        let chapterNumber = 1;
        
        // Process each part
        for (const part of structure.parts) {
          if (!part || !part.partTitle) {
            console.warn('Found invalid part in structure:', part);
            continue;
          }
          
          console.log(`Processing part: ${part.partTitle}`);
          
          // Handle case where chapters might be missing or invalid
          if (!part.chapters || !Array.isArray(part.chapters)) {
            console.warn(`Part "${part.partTitle}" has no valid chapters array`);
            continue;
          }
          
          // Process each chapter in this part
          for (const chapter of part.chapters) {
            if (!chapter || !chapter.title) {
              console.warn('Found invalid chapter in part:', chapter);
              continue;
            }
            
            // Use chapter's number if available, otherwise assign sequential number
            const num = typeof chapter.number === 'number' ? chapter.number : chapterNumber++;
            
            chaptersList.push({
              number: num,
              title: chapter.title,
              description: chapter.description || '',
              estimatedWords: chapter.estimatedWords || 3000,
              keyTopics: chapter.keyTopics || []
            });
          }
        }
      } 
      // Fallback to flat chapters list if no parts are available
      else if (structure.chapters && Array.isArray(structure.chapters) && structure.chapters.length > 0) {
        console.log(`Using flat chapters structure with ${structure.chapters.length} chapters`);
        let chapterNumber = 1;
        
        for (const chapter of structure.chapters) {
          if (!chapter || !chapter.title) {
            console.warn('Found invalid chapter:', chapter);
            continue;
          }
          
          // Use chapter's number if available, otherwise assign sequential number
          const num = typeof chapter.number === 'number' ? chapter.number : chapterNumber++;
          
          chaptersList.push({
            number: num,
            title: chapter.title,
            description: chapter.description || '',
            estimatedWords: chapter.estimatedWords || 3000,
            keyTopics: chapter.keyTopics || []
          });
        }
      }
      
      // Add conclusion if present
      if (structure.conclusion) {
        console.log('Adding conclusion chapter');
        const maxChapterNum = chaptersList.length > 0 ? 
          Math.max(...chaptersList.map((c: any) => c.number || 0)) : 0;
        
        chaptersList.push({
          number: maxChapterNum + 1,
          title: 'Conclusion',
          description: structure.conclusion,
          estimatedWords: 2000
        });
      }
      
      console.log(`Prepared ${chaptersList.length} chapters for creation`);
      
      // Create chapters if we have any
      if (chaptersList.length > 0) {
        console.log(`Creating ${chaptersList.length} chapters in database...`);
        await this.createChapters(book.id, chaptersList);
      } else {
        console.warn('No chapters were prepared for creation!');
      }
      
      return { book, marketResearch, structure };
    } catch (error) {
      console.error('Error in createBook:', error);
      throw error;
    }
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
      status: 'draft',
      metadata: {
        description: chapter.description,
        estimatedWords: chapter.estimatedWords,
        keyTopics: chapter.keyTopics || []
      }
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
