-- Create storage buckets for uploads
-- Note: This SQL cannot directly create storage buckets in Supabase
-- You need to manually create the bucket in the Supabase dashboard
-- This file documents the required setup

-- Instructions for creating the storage bucket:
-- 1. Go to your Supabase dashboard (https://app.supabase.com)
-- 2. Navigate to Storage > Buckets
-- 3. Create a new bucket with the following settings:
--    - Name: uploads
--    - Public: false (keep it private)
--    - Allowed MIME types: application/pdf,image/*,text/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
--    - Max file size: 50MB (or your preferred limit)

-- After creating the bucket, you need to set up RLS policies
-- In the Supabase dashboard, go to Storage > Policies and add these policies:

-- Policy 1: Allow authenticated users to upload files
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition:
-- (auth.uid() IS NOT NULL)

-- Policy 2: Allow users to view their own uploads
-- Operation: SELECT
-- Target roles: authenticated
-- Policy definition:
-- (auth.uid() = (storage.foldername(name))[1]::uuid)

-- Policy 3: Allow users to update their own uploads
-- Operation: UPDATE
-- Target roles: authenticated
-- Policy definition:
-- (auth.uid() = (storage.foldername(name))[1]::uuid)

-- Policy 4: Allow users to delete their own uploads
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition:
-- (auth.uid() = (storage.foldername(name))[1]::uuid)

-- Note: The folder structure for uploads is: {user_id}/{book_id}/{timestamp}.{extension}
-- The policies above check if the user_id in the path matches the authenticated user