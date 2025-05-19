-- Add book_type column to books table to differentiate between different book types
ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS book_type TEXT DEFAULT 'general' NOT NULL;

-- Common book types will include:
-- 'self_improvement' - For self-improvement books
-- 'technical' - For technical/programming books
-- 'fiction' - For fiction books
-- 'non_fiction' - For general non-fiction books
-- 'general' - Default type for uncategorized books

-- Create an index on book_type for better query performance
CREATE INDEX IF NOT EXISTS idx_books_book_type ON public.books(book_type);