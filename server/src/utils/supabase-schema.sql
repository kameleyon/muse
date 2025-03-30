-- This SQL file defines the database schema for MagicMuse.io
-- It can be executed in the Supabase SQL Editor to set up the database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (required for user registration to work properly)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  -- Onboarding data
  primary_content_purpose TEXT,
  main_goals TEXT[],
  content_frequency TEXT,
  industry TEXT,
  custom_industry TEXT,
  writing_style JSONB,
  ai_assistance_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS (Row Level Security) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a profile for each new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Contents table
CREATE TABLE IF NOT EXISTS public.contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_archived BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1
);

-- RLS for contents
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

-- Policies for contents
CREATE POLICY "Users can view their own content"
  ON public.contents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content"
  ON public.contents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content"
  ON public.contents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content"
  ON public.contents
  FOR DELETE USING (auth.uid() = user_id);

-- Content versions table for version history
CREATE TABLE IF NOT EXISTS public.content_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES public.contents(id) ON DELETE CASCADE NOT NULL,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS for content versions
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

-- Policies for content versions
CREATE POLICY "Users can view their own content versions"
  ON public.content_versions
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.contents WHERE id = content_id)
  );

-- Function to save version history when content is updated
CREATE OR REPLACE FUNCTION public.save_content_version()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.content <> NEW.content OR OLD.title <> NEW.title) THEN
    -- Increment version
    NEW.version := OLD.version + 1;
    NEW.updated_at := now();

    -- Save old version
    INSERT INTO public.content_versions (
      content_id, version, content, metadata
    ) VALUES (
      OLD.id, OLD.version, OLD.content, OLD.metadata
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to save version history
DROP TRIGGER IF EXISTS on_content_update ON public.contents;
CREATE TRIGGER on_content_update
  BEFORE UPDATE ON public.contents
  FOR EACH ROW EXECUTE PROCEDURE public.save_content_version();

-- Projects table (NEW)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  privacy TEXT DEFAULT 'private' NOT NULL, -- 'private', 'team', 'public'
  tags TEXT[], -- Array of text for tags
  team_members TEXT[], -- Array of emails for team members (NEW)
  pitch_deck_type_id TEXT, -- Identifier for the selected pitch deck type (NEW)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS for projects (NEW)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies for projects (NEW)
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

-- Add indexes for performance (Optional but recommended)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_contents_user_id ON public.contents(user_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON public.content_versions(content_id);
