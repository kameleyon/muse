# Storage Bucket Setup for MagicMuse

## Quick Setup Guide

The application needs a storage bucket named "uploads" to store book reference files (PDFs, images, etc.).

### Step 1: Create the Storage Bucket

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project (azaiyskdyzdhtomcwrsw)
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Configure the bucket:
   - **Name**: `uploads`
   - **Public bucket**: Leave unchecked (keep it private)
   - Click **"Create bucket"**

### Step 2: Set Up Storage Policies

After creating the bucket, you need to set up policies to control access:

1. Stay in the Storage section
2. Click on the **"uploads"** bucket you just created
3. Go to the **"Policies"** tab
4. Click **"New policy"** and create these four policies:

#### Policy 1: Allow Authenticated Uploads
- **Policy name**: `Allow authenticated uploads`
- **Operations**: Select **INSERT**
- **Target roles**: Select **authenticated**
- **Policy definition**: 
  ```sql
  (auth.uid() IS NOT NULL)
  ```
- Click **"Review"** then **"Save policy"**

#### Policy 2: Allow Users to View Their Files
- **Policy name**: `Allow users to view own files`
- **Operations**: Select **SELECT**
- **Target roles**: Select **authenticated**
- **Policy definition**:
  ```sql
  (auth.uid() = (storage.foldername(name))[1]::uuid)
  ```
- Click **"Review"** then **"Save policy"**

#### Policy 3: Allow Users to Update Their Files
- **Policy name**: `Allow users to update own files`
- **Operations**: Select **UPDATE**
- **Target roles**: Select **authenticated**
- **Policy definition**:
  ```sql
  (auth.uid() = (storage.foldername(name))[1]::uuid)
  ```
- Click **"Review"** then **"Save policy"**

#### Policy 4: Allow Users to Delete Their Files
- **Policy name**: `Allow users to delete own files`
- **Operations**: Select **DELETE**
- **Target roles**: Select **authenticated**
- **Policy definition**:
  ```sql
  (auth.uid() = (storage.foldername(name))[1]::uuid)
  ```
- Click **"Review"** then **"Save policy"**

### Step 3: Verify Setup

1. Go back to your application
2. Try uploading a PDF file when creating a new book
3. The file should upload successfully without errors

## Troubleshooting

### "Bucket not found" Error
- Make sure the bucket is named exactly `uploads` (lowercase, no spaces)
- Ensure you're in the correct Supabase project

### "Permission denied" Error
- Check that all four policies are created correctly
- Make sure you're logged in when trying to upload
- Verify the policy definitions match exactly as shown above

### File Size Issues
If you need to upload larger files:
1. Go to Storage > Configuration
2. Increase the "Max file size" limit (default is usually 50MB)

## File Organization

Files are automatically organized in this structure:
```
uploads/
  └── {user_id}/
      └── {book_id}/
          └── {timestamp}.{extension}
```

This ensures users can only access their own uploaded files.