-- migrations/20250326225500_add_setup_details_to_projects.sql

-- Add the setup_details column to the projects table
ALTER TABLE public.projects
ADD COLUMN setup_details JSONB NULL;

-- Optional: Add a comment describing the column
COMMENT ON COLUMN public.projects.setup_details IS 'Stores JSON data captured from the project setup form (audience, industry, objective, etc.)';