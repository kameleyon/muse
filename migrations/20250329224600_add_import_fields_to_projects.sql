-- migrations/20250329224600_add_import_fields_to_projects.sql

-- Add the imported_file_url and imported_file_metadata columns to the projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS imported_file_url TEXT NULL,
ADD COLUMN IF NOT EXISTS imported_file_metadata JSONB NULL;

-- Optional: Add comments describing the columns
COMMENT ON COLUMN public.projects.imported_file_url IS 'Stores the URL for the file imported from cloud storage or uploaded directly';
COMMENT ON COLUMN public.projects.imported_file_metadata IS 'Stores JSON metadata about the imported file (name, type, size, etc.)';