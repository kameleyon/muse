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
    console.log(`Loading book with ID: ${bookId}`);
    
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single()

    if (bookError) {
      console.error(`Error loading book: ${bookError.message}`);
      throw bookError;
    }
    
    console.log(`Found book: ${book.title}`);

    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', bookId)
      .order('number')

    if (chaptersError) {
      console.error(`Error loading chapters: ${chaptersError.message}`);
      throw chaptersError;
    }
    
    console.log(`Found ${chapters?.length || 0} chapters for this book`);
    
    // If no chapters were found, there might be a problem with the book creation
    // Let's check if we have a structure but no chapters and fix it
    if (!chapters || chapters.length === 0) {
      console.warn('No chapters found for this book. Checking if we need to create them...');
      
      if (book.structure) {
        console.log('Book has structure but no chapters. Attempting to create chapters from structure...');
        try {
          // Generate chapter list from structure
          await this._recreateChaptersFromStructure(bookId, book.structure);
          
          // Re-fetch chapters
          const { data: freshChapters } = await supabase
            .from('chapters')
            .select('*')
            .eq('book_id', bookId)
            .order('number');
            
          console.log(`Created and loaded ${freshChapters?.length || 0} chapters`);
          
          return { ...book, chapters: freshChapters || [] };
        } catch (recreateError) {
          console.error('Failed to recreate chapters:', recreateError);
        }
      } else {
        console.warn('Book has no structure and no chapters. Please recreate the book.');
      }
    }

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
    console.log(`Creating ${chapters.length} chapters for book ${bookId}`);
    
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
    }));

    try {
      const { data, error } = await supabase
        .from('chapters')
        .insert(chapterData)
        .select();

      if (error) {
        console.error('Error creating chapters:', error);
        if (error.message.includes('violates not-null constraint')) {
          console.error('This may be related to the metadata column missing in the database');
        }
        throw error;
      }

      console.log(`Successfully created ${data?.length || 0} chapters`);
      
      // Log IDs of created chapters to assist in debugging
      if (data && data.length > 0) {
        const chapterIds = data.map((ch: any) => ch.id).join(', ');
        console.log(`Created chapter IDs: ${chapterIds}`);
      }
    } catch (err) {
      console.error('Failed to create chapters:', err);
      throw err;
    }
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
    console.log(`Generating content for chapter ID: ${chapterId}`);
    
    // First, verify the chapter exists
    try {
      const { data: chapterCheck, error: checkError } = await supabase
        .from('chapters')
        .select('id, title, book_id')
        .eq('id', chapterId);
        
      if (checkError) {
        console.error(`Error checking chapter existence: ${checkError.message}`);
      } else if (!chapterCheck || chapterCheck.length === 0) {
        console.error(`Chapter ID ${chapterId} does not exist in database. This will cause the API call to fail.`);
        
        // Check if any chapters exist for debugging
        const { data: allChapters } = await supabase
          .from('chapters')
          .select('id, title, book_id')
          .limit(20);
          
        if (allChapters && allChapters.length > 0) {
          console.log(`Available chapter IDs: ${JSON.stringify(allChapters.map(ch => ({ id: ch.id, title: ch.title })))}`);
          
          // If this book has chapters, suggest using one of them
          console.log(`Try using one of these IDs instead.`);
          
          // Get the book details if available to suggest creating a book first
          try {
            const bookId = chapterCheck?.[0]?.book_id;
            if (bookId) {
              const { data: bookData } = await supabase
                .from('books')
                .select('id, title')
                .eq('id', bookId)
                .single();
                
              if (bookData) {
                console.log(`Book exists: ${bookData.title} (${bookData.id})`);
              }
            }
          } catch (e) {
            console.error('Error checking book:', e);
          }
        } else {
          console.log('No chapters found in the database. You need to create a book first.');
        }
        
        throw new Error(`Chapter not found with ID: ${chapterId}. This likely means the chapter wasn't created properly when the book was set up.`);
      } else {
        console.log(`Chapter exists: ${chapterCheck[0].title}`);
      }
    } catch (verifyError: any) {
      console.error('Error verifying chapter existence:', verifyError);
      if (verifyError.message.includes('Chapter not found')) {
        throw verifyError; // Re-throw the descriptive error
      }
    }
    
    // Proceed with generation
    try {
      console.log(`Making API request to generate chapter content...`);
      const response = await axios.post(
        `${this.baseUrl}/api/book-ai/generate-chapter`,
        { chapterId },
        {
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          }
        }
      );
      
      if (!response.data || !response.data.chapter) {
        console.error('API response did not include chapter data');
        throw new Error('No chapter data returned from generation');
      }
      
      console.log(`Successfully generated content for chapter: ${response.data.chapter.title}`);
      return response.data.chapter;
    } catch (error: any) {
      console.error('Error generating chapter:', error);
      // Extract the most useful error message
      let errorMessage = 'Failed to generate chapter';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  },

  // Revise chapter content
  async reviseChapter(chapterId: string, instructions: string): Promise<Chapter> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/book-ai/revise-chapter`,
        { chapterId, revisionInstructions: instructions },
        {
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          }
        }
      );
      
      if (!response.data || !response.data.chapter) {
        throw new Error('No chapter data returned from revision');
      }
      
      return response.data.chapter;
    } catch (error: any) {
      console.error('Error revising chapter:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to revise chapter';
      throw new Error(errorMessage);
    }
  },

  // Upload reference file
  // Internal helper method to recreate chapters from book structure
  async _recreateChaptersFromStructure(bookId: string, structure: any): Promise<void> {
    console.log('Recreating chapters for book from structure...');
    
    // First, delete any existing chapters for this book as a cleanup
    try {
      const { error: deleteError } = await supabase
        .from('chapters')
        .delete()
        .eq('book_id', bookId);
        
      if (deleteError) {
        console.warn(`Error cleaning up existing chapters: ${deleteError.message}`);
      }
    } catch (e) {
      console.warn('Error during chapter cleanup:', e);
    }
    
    // Prepare chapters list based on structure format (similar to createBook)
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
          console.warn('Found invalid part in structure');
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
            console.warn('Found invalid chapter in part');
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
          console.warn('Found invalid chapter');
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
    } else {
      // Create a minimal set of chapters if structure doesn't have proper chapter data
      console.warn('Book structure does not have proper chapter data. Creating minimal structure...');
      
      for (let i = 1; i <= 10; i++) {
        chaptersList.push({
          number: i,
          title: `Chapter ${i}`,
          description: 'Auto-generated chapter',
          estimatedWords: 3000
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
    
    console.log(`Prepared ${chaptersList.length} chapters for re-creation`);
    
    // Create chapters
    if (chaptersList.length > 0) {
      return this.createChapters(bookId, chaptersList);
    } else {
      throw new Error('No chapters could be created from book structure');
    }
  },
  
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
