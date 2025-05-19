-- Add structure column to books table
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS structure JSONB DEFAULT '{}'::jsonb;