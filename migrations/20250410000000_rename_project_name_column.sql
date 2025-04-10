-- migrations/20250410000000_rename_project_name_column.sql
-- Rename project_name column to name to match frontend expectations

BEGIN;

-- Check if the project_name column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'projects' 
        AND column_name = 'project_name'
    ) THEN
        -- Rename the column from project_name to name
        ALTER TABLE public.projects RENAME COLUMN project_name TO name;
        
        -- Add a comment to the column to help with documentation
        COMMENT ON COLUMN public.projects.name IS 'The name of the project (renamed from project_name)';
    ELSE
        -- If project_name doesn't exist, check if name exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'projects' 
            AND column_name = 'name'
        ) THEN
            -- If neither column exists, add the name column
            ALTER TABLE public.projects ADD COLUMN name TEXT;
            COMMENT ON COLUMN public.projects.name IS 'The name of the project';
        END IF;
    END IF;
END $$;

COMMIT;
