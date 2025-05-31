-- Create user_profiles table for extended profile information
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    professional_title TEXT,
    bio TEXT,
    avatar_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    expertise_areas TEXT,
    credentials TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_settings table for user preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    default_landing_page TEXT DEFAULT 'dashboard',
    stay_logged_in BOOLEAN DEFAULT true,
    receive_account_emails BOOLEAN DEFAULT true,
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns to user_settings if they don't exist (for existing tables)
DO $$ 
BEGIN 
    -- Add username column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'user_settings' 
                   AND column_name = 'username') THEN
        ALTER TABLE public.user_settings ADD COLUMN username TEXT UNIQUE;
    END IF;
    
    -- Add default_landing_page column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'user_settings' 
                   AND column_name = 'default_landing_page') THEN
        ALTER TABLE public.user_settings ADD COLUMN default_landing_page TEXT DEFAULT 'dashboard';
    END IF;
    
    -- Add stay_logged_in column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'user_settings' 
                   AND column_name = 'stay_logged_in') THEN
        ALTER TABLE public.user_settings ADD COLUMN stay_logged_in BOOLEAN DEFAULT true;
    END IF;
    
    -- Add receive_account_emails column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'user_settings' 
                   AND column_name = 'receive_account_emails') THEN
        ALTER TABLE public.user_settings ADD COLUMN receive_account_emails BOOLEAN DEFAULT true;
    END IF;
    
    -- Add two_factor_enabled column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'user_settings' 
                   AND column_name = 'two_factor_enabled') THEN
        ALTER TABLE public.user_settings ADD COLUMN two_factor_enabled BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create email_notification_settings table for email preferences
CREATE TABLE IF NOT EXISTS public.email_notification_settings (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications_enabled BOOLEAN DEFAULT true,
    book_generation_complete BOOLEAN DEFAULT true,
    collaboration_invites BOOLEAN DEFAULT true,
    system_updates BOOLEAN DEFAULT true,
    security_alerts BOOLEAN DEFAULT true,
    newsletter_subscribed BOOLEAN DEFAULT false,
    weekly_digest BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_assistant_settings table for AI behavior preferences
CREATE TABLE IF NOT EXISTS public.ai_assistant_settings (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    suggestion_frequency INTEGER DEFAULT 3 CHECK (suggestion_frequency >= 1 AND suggestion_frequency <= 5),
    default_tone TEXT DEFAULT 'professional',
    content_complexity TEXT DEFAULT 'standard',
    factual_accuracy_priority INTEGER DEFAULT 4 CHECK (factual_accuracy_priority >= 1 AND factual_accuracy_priority <= 5),
    creativity_level INTEGER DEFAULT 3 CHECK (creativity_level >= 1 AND creativity_level <= 5),
    contextual_awareness_enabled BOOLEAN DEFAULT true,
    context_window_size TEXT DEFAULT 'medium',
    specialized_domains TEXT[] DEFAULT ARRAY['fiction_writing', 'business'],
    custom_knowledge_area TEXT DEFAULT '',
    citation_style TEXT DEFAULT 'apa',
    source_quality_priority TEXT DEFAULT 'high_quality',
    suggestion_timing TEXT DEFAULT 'real_time',
    pause_threshold TEXT DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for user assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-assets', 'user-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;

CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
ON public.user_profiles
FOR DELETE
USING (auth.uid() = id);

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON public.user_settings;

CREATE POLICY "Users can view their own settings"
ON public.user_settings
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own settings"
ON public.user_settings
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own settings"
ON public.user_settings
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own settings"
ON public.user_settings
FOR DELETE
USING (auth.uid() = id);

-- Enable RLS on email_notification_settings
ALTER TABLE public.email_notification_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for email_notification_settings (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own email notification settings" ON public.email_notification_settings;
DROP POLICY IF EXISTS "Users can update their own email notification settings" ON public.email_notification_settings;
DROP POLICY IF EXISTS "Users can insert their own email notification settings" ON public.email_notification_settings;
DROP POLICY IF EXISTS "Users can delete their own email notification settings" ON public.email_notification_settings;

CREATE POLICY "Users can view their own email notification settings"
ON public.email_notification_settings
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own email notification settings"
ON public.email_notification_settings
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own email notification settings"
ON public.email_notification_settings
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own email notification settings"
ON public.email_notification_settings
FOR DELETE
USING (auth.uid() = id);

-- Enable RLS on ai_assistant_settings
ALTER TABLE public.ai_assistant_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_assistant_settings (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own AI assistant settings" ON public.ai_assistant_settings;
DROP POLICY IF EXISTS "Users can update their own AI assistant settings" ON public.ai_assistant_settings;
DROP POLICY IF EXISTS "Users can insert their own AI assistant settings" ON public.ai_assistant_settings;
DROP POLICY IF EXISTS "Users can delete their own AI assistant settings" ON public.ai_assistant_settings;

CREATE POLICY "Users can view their own AI assistant settings"
ON public.ai_assistant_settings
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own AI assistant settings"
ON public.ai_assistant_settings
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own AI assistant settings"
ON public.ai_assistant_settings
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own AI assistant settings"
ON public.ai_assistant_settings
FOR DELETE
USING (auth.uid() = id);

-- Create storage policies for user-assets bucket (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

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

-- Create indexes for better performance (only if columns exist)
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON public.user_profiles(display_name);

-- Create username index only if the column exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'user_settings' 
               AND column_name = 'username') THEN
        CREATE INDEX IF NOT EXISTS idx_user_settings_username ON public.user_settings(username);
    END IF;
END $$;

-- Add comment explaining the tables
COMMENT ON TABLE public.user_profiles IS 'Extended user profile information including social links and professional details';
COMMENT ON TABLE public.user_settings IS 'User preferences and account settings';