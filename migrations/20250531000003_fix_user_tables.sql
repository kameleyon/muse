-- Fix user tables schema and policies
-- This migration addresses RLS policy issues and missing user_id fields

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON public.user_settings;

DROP POLICY IF EXISTS "Users can view their own email notification settings" ON public.email_notification_settings;
DROP POLICY IF EXISTS "Users can update their own email notification settings" ON public.email_notification_settings;
DROP POLICY IF EXISTS "Users can insert their own email notification settings" ON public.email_notification_settings;
DROP POLICY IF EXISTS "Users can delete their own email notification settings" ON public.email_notification_settings;

DROP POLICY IF EXISTS "Users can view their own AI assistant settings" ON public.ai_assistant_settings;
DROP POLICY IF EXISTS "Users can update their own AI assistant settings" ON public.ai_assistant_settings;
DROP POLICY IF EXISTS "Users can insert their own AI assistant settings" ON public.ai_assistant_settings;
DROP POLICY IF EXISTS "Users can delete their own AI assistant settings" ON public.ai_assistant_settings;

-- Drop storage policies
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Disable RLS temporarily
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notification_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assistant_settings DISABLE ROW LEVEL SECURITY;

-- Add user_id columns if they don't exist
DO $$ 
BEGIN 
    -- Add user_id to user_profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'user_profiles' 
                   AND column_name = 'user_id') THEN
        ALTER TABLE public.user_profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        -- Copy id to user_id for existing records
        UPDATE public.user_profiles SET user_id = id;
    END IF;
    
    -- Add user_id to user_settings  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'user_settings' 
                   AND column_name = 'user_id') THEN
        ALTER TABLE public.user_settings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        -- Copy id to user_id for existing records
        UPDATE public.user_settings SET user_id = id;
    END IF;
    
    -- Add user_id to email_notification_settings
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'email_notification_settings' 
                   AND column_name = 'user_id') THEN
        ALTER TABLE public.email_notification_settings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        -- Copy id to user_id for existing records
        UPDATE public.email_notification_settings SET user_id = id;
    END IF;
    
    -- Add user_id to ai_assistant_settings
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'ai_assistant_settings' 
                   AND column_name = 'user_id') THEN
        ALTER TABLE public.ai_assistant_settings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        -- Copy id to user_id for existing records
        UPDATE public.ai_assistant_settings SET user_id = id;
    END IF;
END $$;

-- Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assistant_settings ENABLE ROW LEVEL SECURITY;

-- Create new policies using both id and user_id for compatibility
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
ON public.user_profiles
FOR DELETE
USING (auth.uid() = id OR auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view their own settings"
ON public.user_settings
FOR SELECT
USING (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.user_settings
FOR UPDATE
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.user_settings
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own settings"
ON public.user_settings
FOR DELETE
USING (auth.uid() = id OR auth.uid() = user_id);

-- Email notification settings policies
CREATE POLICY "Users can view their own email notification settings"
ON public.email_notification_settings
FOR SELECT
USING (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can update their own email notification settings"
ON public.email_notification_settings
FOR UPDATE
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own email notification settings"
ON public.email_notification_settings
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own email notification settings"
ON public.email_notification_settings
FOR DELETE
USING (auth.uid() = id OR auth.uid() = user_id);

-- AI assistant settings policies
CREATE POLICY "Users can view their own AI assistant settings"
ON public.ai_assistant_settings
FOR SELECT
USING (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can update their own AI assistant settings"
ON public.ai_assistant_settings
FOR UPDATE
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI assistant settings"
ON public.ai_assistant_settings
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own AI assistant settings"
ON public.ai_assistant_settings
FOR DELETE
USING (auth.uid() = id OR auth.uid() = user_id);

-- Create storage policies for user-assets bucket
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'user-assets' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own avatar"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'user-assets' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
USING (
    bucket_id = 'user-assets' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'user-assets' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Create privacy_settings table for privacy and data preferences
CREATE TABLE IF NOT EXISTS public.privacy_settings (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'friends')),
    data_sharing_enabled BOOLEAN DEFAULT false,
    analytics_tracking BOOLEAN DEFAULT true,
    personalized_recommendations BOOLEAN DEFAULT true,
    data_retention_period INTEGER DEFAULT 24,
    content_indexing BOOLEAN DEFAULT true,
    third_party_integrations BOOLEAN DEFAULT false,
    marketing_personalization BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on privacy_settings
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for privacy_settings
CREATE POLICY "Users can view their own privacy settings"
ON public.privacy_settings
FOR SELECT
USING (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can update their own privacy settings"
ON public.privacy_settings
FOR UPDATE
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own privacy settings"
ON public.privacy_settings
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own privacy settings"
ON public.privacy_settings
FOR DELETE
USING (auth.uid() = id OR auth.uid() = user_id);

-- Create in_app_notification_settings table
CREATE TABLE IF NOT EXISTS public.in_app_notification_settings (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    desktop_notifications BOOLEAN DEFAULT true,
    new_comments BOOLEAN DEFAULT true,
    collaboration_updates BOOLEAN DEFAULT true,
    system_announcements BOOLEAN DEFAULT true,
    feature_updates BOOLEAN DEFAULT true,
    book_generation_status BOOLEAN DEFAULT true,
    ai_suggestions BOOLEAN DEFAULT true,
    likes_and_reactions BOOLEAN DEFAULT true,
    mentions BOOLEAN DEFAULT true,
    notification_frequency TEXT DEFAULT 'real_time' CHECK (notification_frequency IN ('real_time', 'hourly', 'daily')),
    quiet_hours_enabled BOOLEAN DEFAULT false,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '08:00',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on in_app_notification_settings
ALTER TABLE public.in_app_notification_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for in_app_notification_settings
CREATE POLICY "Users can view their own in-app notification settings"
ON public.in_app_notification_settings
FOR SELECT
USING (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can update their own in-app notification settings"
ON public.in_app_notification_settings
FOR UPDATE
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own in-app notification settings"
ON public.in_app_notification_settings
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own in-app notification settings"
ON public.in_app_notification_settings
FOR DELETE
USING (auth.uid() = id OR auth.uid() = user_id);

-- Create integration_settings table
CREATE TABLE IF NOT EXISTS public.integration_settings (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    google_drive_enabled BOOLEAN DEFAULT false,
    google_drive_api_key TEXT,
    dropbox_enabled BOOLEAN DEFAULT false,
    dropbox_api_key TEXT,
    github_enabled BOOLEAN DEFAULT false,
    github_api_key TEXT,
    slack_enabled BOOLEAN DEFAULT false,
    slack_webhook_url TEXT,
    notion_enabled BOOLEAN DEFAULT false,
    notion_api_key TEXT,
    auto_sync_enabled BOOLEAN DEFAULT true,
    sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('real_time', 'hourly', 'daily')),
    backup_to_cloud BOOLEAN DEFAULT true,
    export_format TEXT DEFAULT 'markdown' CHECK (export_format IN ('markdown', 'docx', 'pdf', 'html')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on integration_settings
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for integration_settings
CREATE POLICY "Users can view their own integration settings"
ON public.integration_settings
FOR SELECT
USING (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can update their own integration settings"
ON public.integration_settings
FOR UPDATE
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own integration settings"
ON public.integration_settings
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own integration settings"
ON public.integration_settings
FOR DELETE
USING (auth.uid() = id OR auth.uid() = user_id);

-- Create performance_settings table
CREATE TABLE IF NOT EXISTS public.performance_settings (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    auto_save_enabled BOOLEAN DEFAULT true,
    auto_save_interval INTEGER DEFAULT 30,
    cache_enabled BOOLEAN DEFAULT true,
    cache_size_limit INTEGER DEFAULT 100,
    preload_content BOOLEAN DEFAULT true,
    lazy_loading BOOLEAN DEFAULT true,
    image_compression BOOLEAN DEFAULT true,
    compression_quality INTEGER DEFAULT 80 CHECK (compression_quality >= 20 AND compression_quality <= 100),
    background_sync BOOLEAN DEFAULT true,
    offline_mode BOOLEAN DEFAULT false,
    memory_optimization BOOLEAN DEFAULT true,
    animation_reduced BOOLEAN DEFAULT false,
    font_preloading BOOLEAN DEFAULT true,
    concurrent_operations INTEGER DEFAULT 3 CHECK (concurrent_operations >= 1 AND concurrent_operations <= 10),
    request_timeout INTEGER DEFAULT 30 CHECK (request_timeout >= 10 AND request_timeout <= 120),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on performance_settings
ALTER TABLE public.performance_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for performance_settings
CREATE POLICY "Users can view their own performance settings"
ON public.performance_settings
FOR SELECT
USING (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can update their own performance settings"
ON public.performance_settings
FOR UPDATE
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own performance settings"
ON public.performance_settings
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own performance settings"
ON public.performance_settings
FOR DELETE
USING (auth.uid() = id OR auth.uid() = user_id);

-- Create storage bucket for user assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-assets', 'user-assets', true)
ON CONFLICT (id) DO NOTHING;