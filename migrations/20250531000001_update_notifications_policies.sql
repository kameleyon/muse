-- Update RLS policies for notifications table to support admin functionality

-- Drop existing policies
DROP POLICY IF EXISTS "Allow users to read their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow users to mark their own notifications as read" ON public.notifications;

-- Create new comprehensive policies

-- 1. Allow users to read their own notifications
CREATE POLICY "Allow users to read their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Allow users to update (mark as read) their own notifications
CREATE POLICY "Allow users to update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Allow users to insert notifications for themselves (for admin creating notifications)
CREATE POLICY "Allow users to create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Allow users to delete their own notifications (for admin functionality)
CREATE POLICY "Allow users to delete their own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);

-- Add comment explaining the policies
COMMENT ON TABLE public.notifications IS 'Notifications table with RLS policies allowing users to manage their own notifications';