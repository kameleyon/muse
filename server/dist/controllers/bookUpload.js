"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDownloadUrl = exports.deleteUpload = exports.getBookUploads = exports.uploadBookReference = exports.uploadMiddleware = void 0;
const supabase_1 = require("../services/supabase");
const multer_1 = __importDefault(require("multer"));
// Configure multer for file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
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
        }
        else {
            cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, PNG, JPG, and JPEG files are allowed.'));
        }
    }
});
exports.uploadMiddleware = upload.single('file');
const uploadBookReference = async (req, res) => {
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
        const { data: uploadData, error: uploadError } = await supabase_1.supabaseClient.storage
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
        const { data, error } = await supabase_1.supabaseClient
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
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: error.message || 'Failed to upload file' });
    }
};
exports.uploadBookReference = uploadBookReference;
const getBookUploads = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { data, error } = await supabase_1.supabaseClient
            .from('uploads')
            .select('*')
            .eq('book_id', bookId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json(data || []);
    }
    catch (error) {
        console.error('Error fetching uploads:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch uploads' });
    }
};
exports.getBookUploads = getBookUploads;
const deleteUpload = async (req, res) => {
    try {
        const { uploadId } = req.params;
        // Get upload details first
        const { data: upload, error: fetchError } = await supabase_1.supabaseClient
            .from('uploads')
            .select('file_path')
            .eq('id', uploadId)
            .single();
        if (fetchError)
            throw fetchError;
        if (upload && upload.file_path) {
            // Delete from storage
            const { error: storageError } = await supabase_1.supabaseClient.storage
                .from('uploads')
                .remove([upload.file_path]);
            if (storageError) {
                console.error('Storage deletion error:', storageError);
            }
        }
        // Delete from database
        const { error: dbError } = await supabase_1.supabaseClient
            .from('uploads')
            .delete()
            .eq('id', uploadId);
        if (dbError)
            throw dbError;
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting upload:', error);
        res.status(500).json({ error: error.message || 'Failed to delete upload' });
    }
};
exports.deleteUpload = deleteUpload;
const getDownloadUrl = async (req, res) => {
    try {
        const { uploadId } = req.params;
        // Get upload details
        const { data: upload, error: fetchError } = await supabase_1.supabaseClient
            .from('uploads')
            .select('file_path')
            .eq('id', uploadId)
            .single();
        if (fetchError)
            throw fetchError;
        if (!upload || !upload.file_path) {
            return res.status(404).json({ error: 'Upload not found' });
        }
        // Generate signed URL
        const { data, error } = await supabase_1.supabaseClient.storage
            .from('uploads')
            .createSignedUrl(upload.file_path, 3600); // 1 hour expiry
        if (error)
            throw error;
        res.json({ url: data.signedUrl });
    }
    catch (error) {
        console.error('Error generating download URL:', error);
        res.status(500).json({ error: error.message || 'Failed to generate download URL' });
    }
};
exports.getDownloadUrl = getDownloadUrl;
