-- Add metadata column to chapters table
ALTER TABLE public.chapters 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create an index for better query performance on metadata searches
CREATE INDEX IF NOT EXISTS idx_chapters_metadata ON public.chapters USING GIN (metadata);

-- Update any existing chapters to have an empty metadata object if they don't already have one
UPDATE public.chapters
SET metadata = '{}'::jsonb
WHERE metadata IS NULL;