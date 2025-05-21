-- Add metadata column to chapters table
ALTER TABLE public.chapters 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create an index on the metadata column for better query performance
CREATE INDEX IF NOT EXISTS idx_chapters_metadata ON public.chapters USING GIN (metadata);

-- Update existing chapters with empty metadata if needed
UPDATE public.chapters 
SET metadata = '{}' 
WHERE metadata IS NULL;