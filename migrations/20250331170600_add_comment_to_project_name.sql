-- migrations/20250331170600_add_comment_to_project_name.sql
-- Add a comment to the name column to potentially refresh Supabase schema cache

BEGIN;

-- Add a comment to the 'project_name' column in the 'projects' table
-- This is a no-op change intended to trigger a schema cache refresh
COMMENT ON COLUMN public.projects.project_name IS 'The name of the project.'; -- Corrected column name

COMMIT;
