-- Create the notifications table
CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    link text NULL, -- Optional link target
    type text NULL, -- Optional notification type (e.g., 'comment', 'invitation', 'system')
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    -- Removed 'timestamp' as 'created_at' serves this purpose
);

-- Add comments to columns for clarity
COMMENT ON COLUMN public.notifications.user_id IS 'User who receives the notification';
COMMENT ON COLUMN public.notifications.title IS 'Short title/header for the notification';
COMMENT ON COLUMN public.notifications.message IS 'Main content/body of the notification';
COMMENT ON COLUMN public.notifications.read IS 'Whether the user has marked the notification as read';
COMMENT ON COLUMN public.notifications.link IS 'Optional URL link associated with the notification';
COMMENT ON COLUMN public.notifications.type IS 'Category/type of the notification';
COMMENT ON COLUMN public.notifications.created_at IS 'When the notification was created';

-- Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow users to select (read) their own notifications
CREATE POLICY "Allow users to read their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy: Allow users to update (mark as read) their own notifications
CREATE POLICY "Allow users to mark their own notifications as read"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Optional: Grant usage permission to the authenticated role if needed (often default)
-- GRANT SELECT, UPDATE ON TABLE public.notifications TO authenticated;

-- Optional: Add an index for faster lookups by user_id
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
