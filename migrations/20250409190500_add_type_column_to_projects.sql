-- migrations/20250409190500_add_type_column_to_projects.sql
-- Add the type column to the projects table

BEGIN;

-- Add the 'type' column to the 'projects' table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS type TEXT;

-- Add a comment to the column to help with documentation and schema cache refresh
COMMENT ON COLUMN public.projects.type IS 'The type of project (e.g., pitch_deck, blog, etc.)';

COMMIT;
