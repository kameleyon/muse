# Supabase Setup Instructions

Due to limitations with the Supabase JavaScript client, we cannot run SQL migrations directly through the API. Follow these steps to set up your Supabase database tables:

## Option 1: Using the Supabase Dashboard (Recommended)

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project (with URL: https://azaiyskdyzdhtomcwrsw.supabase.co)
3. Go to the "SQL Editor" section
4. Copy the contents of the `server/create_projects_table.sql` file
5. Paste it into the SQL Editor
6. Click "Run" to execute the SQL commands

This will create:
- The `projects` table with all required columns
- Row Level Security (RLS) policies for the table
- A `migrations` table to track applied migrations

## Option 2: Manually Create the Tables

If you prefer to create the tables step by step, follow these instructions:

1. Create the projects table:

```sql
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
```

2. Set up Row Level Security (RLS):

```sql
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
```

3. Create a storage bucket for project files:

In the Supabase dashboard, go to Storage > Buckets and create a new bucket named `project-uploads`. Set the following policies:

- Allow authenticated users to upload files
- Allow users to download their own files or files shared with them

## Verifying Setup

After setting up the tables, you can test that everything is working by:

1. Restart your server with `npm run dev`
2. Try creating a new project in the application
3. Check the Supabase dashboard to verify that the project data is being saved in the `projects` table

If you encounter any issues, check the server logs for specific error messages.