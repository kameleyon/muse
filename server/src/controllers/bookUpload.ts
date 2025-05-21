import { Request, Response, NextFunction } from 'express';
import { supabaseClient } from '../services/supabase';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, PNG, JPG, and JPEG files are allowed.'));
    }
  }
});

export const uploadMiddleware = upload.single('file');

export const uploadBookReference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Upload file to Supabase Storage
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}/${bookId}/${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('uploads')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      if (uploadError.message.includes('not found')) {
        throw new Error('Storage bucket not found. Please create a bucket named "uploads" in your Supabase dashboard.');
      }
      if (uploadError.message.includes('row-level security') || 
          uploadError.message.includes('policy violation') || 
          uploadError.message.includes('permission denied')) {
        throw new Error('Storage permission denied. Please check your RLS policies.');
      }
      throw uploadError;
    }

    // Create upload record in database
    const { data, error } = await supabaseClient
      .from('uploads')
      .insert({
        book_id: bookId,
        user_id: userId,
        filename: file.originalname,
        file_type: file.mimetype,
        file_path: fileName,
        file_size: file.size
      })
      .select()
      .single();

    if (error) throw error;
    
    res.json(data);
  } catch (error: any) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
};

export const getBookUploads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;

    const { data, error } = await supabaseClient
      .from('uploads')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    res.json(data || []);
  } catch (error: any) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch uploads' });
  }
};

export const deleteUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uploadId } = req.params;

    // Get upload details first
    const { data: upload, error: fetchError } = await supabaseClient
      .from('uploads')
      .select('file_path')
      .eq('id', uploadId)
      .single();

    if (fetchError) throw fetchError;

    if (upload && upload.file_path) {
      // Delete from storage
      const { error: storageError } = await supabaseClient.storage
        .from('uploads')
        .remove([upload.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }
    }

    // Delete from database
    const { error: dbError } = await supabaseClient
      .from('uploads')
      .delete()
      .eq('id', uploadId);

    if (dbError) throw dbError;

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting upload:', error);
    res.status(500).json({ error: error.message || 'Failed to delete upload' });
  }
};

export const getDownloadUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uploadId } = req.params;

    // Get upload details
    const { data: upload, error: fetchError } = await supabaseClient
      .from('uploads')
      .select('file_path')
      .eq('id', uploadId)
      .single();

    if (fetchError) throw fetchError;

    if (!upload || !upload.file_path) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    // Generate signed URL
    const { data, error } = await supabaseClient.storage
      .from('uploads')
      .createSignedUrl(upload.file_path, 3600); // 1 hour expiry

    if (error) throw error;
    
    res.json({ url: data.signedUrl });
  } catch (error: any) {
    console.error('Error generating download URL:', error);
    res.status(500).json({ error: error.message || 'Failed to generate download URL' });
  }
};