-- Run this SQL script directly in the Supabase SQL Editor
-- to create the projects table if migrations aren't working

BEGIN;

-- Check if projects table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'projects') THEN
        CREATE TABLE public.projects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            privacy TEXT DEFAULT 'private' NOT NULL,
            tags TEXT[],
            team_members TEXT[],
            pitch_deck_type_id TEXT,
            type TEXT,
            setup_details JSONB,
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
            
        -- Create a migrations table to track applied migrations
        CREATE TABLE IF NOT EXISTS public.migrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Insert all migration files as applied
        INSERT INTO public.migrations (name, applied_at) VALUES
        ('20250326225500_add_setup_details_to_projects.sql', now()),
        ('20250327001000_create_pitch_deck_tables.sql', now()),
        ('20250329224600_add_import_fields_to_projects.sql', now()),
        ('20250329231100_fix_projects_table_schema.sql', now()),
        ('20250331170600_add_comment_to_project_name.sql', now()),
        ('20250409190500_add_type_column_to_projects.sql', now()),
        ('20250410000000_rename_project_name_column.sql', now());
        
    END IF;
END $$;

COMMIT;