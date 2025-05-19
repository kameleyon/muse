-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'draft' NOT NULL, -- 'draft', 'in_progress', 'complete'
  audience TEXT,
  style TEXT,
  market_research JSONB DEFAULT '{}'::jsonb,
  toc JSONB DEFAULT '[]'::jsonb,
  pricing_info JSONB DEFAULT '{}'::jsonb,
  color_scheme JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'generating', 'generated', 'approved'
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create uploads table for reference materials
CREATE TABLE IF NOT EXISTS public.uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- Policies for books
CREATE POLICY "Users can view their own books"
  ON public.books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own books"
  ON public.books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
  ON public.books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
  ON public.books
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for chapters
CREATE POLICY "Users can view chapters of their books"
  ON public.chapters
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.books WHERE id = book_id)
  );

CREATE POLICY "Users can create chapters for their books"
  ON public.chapters
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.books WHERE id = book_id)
  );

CREATE POLICY "Users can update chapters of their books"
  ON public.chapters
  FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM public.books WHERE id = book_id)
  );

CREATE POLICY "Users can delete chapters of their books"
  ON public.chapters
  FOR DELETE USING (
    auth.uid() = (SELECT user_id FROM public.books WHERE id = book_id)
  );

-- Policies for uploads
CREATE POLICY "Users can view their own uploads"
  ON public.uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploads"
  ON public.uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads"
  ON public.uploads
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_user_id ON public.books(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON public.chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_uploads_book_id ON public.uploads(book_id);
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON public.uploads(user_id);

-- Function to update book timestamp when chapters are modified
CREATE OR REPLACE FUNCTION public.update_book_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.books
  SET updated_at = now()
  WHERE id = NEW.book_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to update book timestamp
CREATE TRIGGER on_chapter_insert
  AFTER INSERT ON public.chapters
  FOR EACH ROW EXECUTE PROCEDURE public.update_book_timestamp();

CREATE TRIGGER on_chapter_update
  AFTER UPDATE ON public.chapters
  FOR EACH ROW EXECUTE PROCEDURE public.update_book_timestamp();