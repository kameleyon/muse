-- Fix the project_type not-null constraint
BEGIN;

-- Add the project_type column if it doesn't exist
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS project_type TEXT;

-- Update existing rows to have a default value
UPDATE public.projects 
SET project_type = type
WHERE project_type IS NULL;

-- Update existing rows that still have null type
UPDATE public.projects 
SET project_type = 'pitch_deck'
WHERE project_type IS NULL;

-- Now make it not nullable
ALTER TABLE public.projects 
ALTER COLUMN project_type SET NOT NULL;

COMMIT;