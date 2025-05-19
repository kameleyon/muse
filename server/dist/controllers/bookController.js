"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChapter = exports.updateChapter = exports.createChapters = exports.deleteBook = exports.updateBook = exports.getBook = exports.getUserBooks = exports.createBook = void 0;
const supabase_1 = require("../services/supabase");
const createBook = async (req, res) => {
    try {
        const { topic, userId, resources = [], bookType = 'self_improvement' } = req.body;
        // Create book in database
        const { data: book, error: bookError } = await supabase_1.supabaseClient
            .from('books')
            .insert({
            user_id: userId,
            title: topic,
            topic,
            status: 'draft',
            book_type: bookType
        })
            .select()
            .single();
        if (bookError)
            throw bookError;
        res.json(book);
    }
    catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: error.message || 'Failed to create book' });
    }
};
exports.createBook = createBook;
const getUserBooks = async (req, res) => {
    try {
        const { userId } = req.params;
        const { bookType } = req.query;
        let query = supabase_1.supabaseClient
            .from('books')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });
        if (bookType) {
            query = query.eq('book_type', bookType);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        res.json(data || []);
    }
    catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch books' });
    }
};
exports.getUserBooks = getUserBooks;
const getBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { data: book, error: bookError } = await supabase_1.supabaseClient
            .from('books')
            .select('*')
            .eq('id', bookId)
            .single();
        if (bookError)
            throw bookError;
        const { data: chapters, error: chaptersError } = await supabase_1.supabaseClient
            .from('chapters')
            .select('*')
            .eq('book_id', bookId)
            .order('number');
        if (chaptersError)
            throw chaptersError;
        res.json({ ...book, chapters: chapters || [] });
    }
    catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch book' });
    }
};
exports.getBook = getBook;
const updateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const updates = req.body;
        const { data, error } = await supabase_1.supabaseClient
            .from('books')
            .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
            .eq('id', bookId)
            .select()
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: error.message || 'Failed to update book' });
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        // Delete chapters first
        const { error: chaptersError } = await supabase_1.supabaseClient
            .from('chapters')
            .delete()
            .eq('book_id', bookId);
        if (chaptersError)
            throw chaptersError;
        // Delete uploads
        const { error: uploadsError } = await supabase_1.supabaseClient
            .from('uploads')
            .delete()
            .eq('book_id', bookId);
        if (uploadsError)
            throw uploadsError;
        // Delete the book
        const { error: bookError } = await supabase_1.supabaseClient
            .from('books')
            .delete()
            .eq('id', bookId);
        if (bookError)
            throw bookError;
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: error.message || 'Failed to delete book' });
    }
};
exports.deleteBook = deleteBook;
const createChapters = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { chapters } = req.body;
        const chapterData = chapters.map((chapter) => ({
            book_id: bookId,
            number: chapter.number,
            title: chapter.title,
            content: '',
            status: 'draft'
        }));
        const { error } = await supabase_1.supabaseClient
            .from('chapters')
            .insert(chapterData);
        if (error)
            throw error;
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error creating chapters:', error);
        res.status(500).json({ error: error.message || 'Failed to create chapters' });
    }
};
exports.createChapters = createChapters;
const updateChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const updates = req.body;
        const { data, error } = await supabase_1.supabaseClient
            .from('chapters')
            .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
            .eq('id', chapterId)
            .select()
            .single();
        if (error)
            throw error;
        // Update book's updated_at timestamp
        const { book_id } = data;
        await supabase_1.supabaseClient
            .from('books')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', book_id);
        res.json(data);
    }
    catch (error) {
        console.error('Error updating chapter:', error);
        res.status(500).json({ error: error.message || 'Failed to update chapter' });
    }
};
exports.updateChapter = updateChapter;
const getChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const { data, error } = await supabase_1.supabaseClient
            .from('chapters')
            .select('*')
            .eq('id', chapterId)
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching chapter:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch chapter' });
    }
};
exports.getChapter = getChapter;
