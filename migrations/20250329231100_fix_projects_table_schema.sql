-- migrations/20250329231100_fix_projects_table_schema.sql
-- Fix the projects table schema to match the application

BEGIN;

-- Check if projects table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'projects') THEN
        CREATE TABLE public.projects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            project_name TEXT NOT NULL, -- Corrected column name
            description TEXT,
            privacy TEXT DEFAULT 'private' NOT NULL,
            tags TEXT[],
            team_members TEXT[],
            pitch_deck_type_id TEXT,
            imported_file_url TEXT,
            imported_file_metadata JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add RLS policies
        ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own projects"
            ON public.projects
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can create their own projects"
            ON public.projects
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own projects"
            ON public.projects
            FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own projects"
            ON public.projects
            FOR DELETE USING (auth.uid() = user_id);
    ELSE
        -- Add columns if they don't exist
        -- Ensure the 'project_name' column exists
        BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_name TEXT NOT NULL; -- Corrected column name
        EXCEPTION WHEN OTHERS THEN
             RAISE NOTICE 'Error adding project_name column: %', SQLERRM;
        END;
        
        -- Ensure the 'privacy' column exists
        BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS privacy TEXT DEFAULT 'private' NOT NULL;
        EXCEPTION WHEN OTHERS THEN
             RAISE NOTICE 'Error adding privacy column: %', SQLERRM;
        END;

        BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description TEXT;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding description column: %', SQLERRM;
        END;
        
        BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags TEXT[];
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding tags column: %', SQLERRM;
        END;
        
        BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS team_members TEXT[];
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding team_members column: %', SQLERRM;
        END;
        
        BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS pitch_deck_type_id TEXT;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding pitch_deck_type_id column: %', SQLERRM;
        END;
        
        BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS imported_file_url TEXT;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding imported_file_url column: %', SQLERRM;
        END;
        
        BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS imported_file_metadata JSONB;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding imported_file_metadata column: %', SQLERRM;
        END;
    END IF;
END $$;

-- Note: Storage buckets need to be created manually in the Supabase dashboard
-- Please create a bucket named 'project-uploads' in the Storage section of your Supabase dashboard
-- The bucket should have the following settings:
-- - Name: project-uploads
-- - Public access: Determined by policies
-- - Add a policy to allow authenticated users to upload files
-- - Add a policy to allow public access to read files

COMMIT;
