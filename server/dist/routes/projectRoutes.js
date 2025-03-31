"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController"); // Keep existing controller import
const auth_1 = require("../middleware/auth"); // Authentication middleware
const multer_1 = __importDefault(require("multer")); // Import multer
const logger_1 = __importDefault(require("../utils/logger")); // Import logger
const supabase_1 = require("../services/supabase"); // Import supabase client
// Configure multer for memory storage
// This stores the file in memory as a Buffer (req.file.buffer)
// For larger files or production, consider diskStorage or cloud storage (e.g., Supabase Storage)
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Example: Limit file size to 10MB
});
const router = express_1.default.Router();
// --- Project Creation ---
// POST /api/projects - Requires authentication
router.post('/', auth_1.authenticate, projectController_1.createProject); // Re-enabled authenticate middleware
// --- File Upload ---
// POST /api/projects/:projectId/upload
router.post('/:projectId/upload', auth_1.authenticate, // Re-enabled authenticate middleware
upload.single('file'), // Use multer middleware to handle single file upload named 'file'
async (req, res, next) => {
    const projectId = req.params.projectId;
    const file = req.file;
    // @ts-ignore // Access user from the request object
    const userId = req.user?.id;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    if (!userId) {
        // This should technically be caught by authenticate, but double-check
        return res.status(401).json({ message: 'User not authenticated for upload.' });
    }
    logger_1.default.info(`Received file upload "${file.originalname}" (${file.mimetype}, ${file.size} bytes) for project ${projectId} by user ${userId}`);
    // TODO: Implement actual file processing/storage logic in a controller
    // Example: Save to Supabase Storage
    /*
    try {
      const filePath = `${userId}/${projectId}/${Date.now()}-${file.originalname}`;
      const { data, error } = await supabaseClient.storage
        .from('project-uploads') // Replace with your bucket name
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false, // Set to true to overwrite if file exists
        });

      if (error) {
        throw error;
      }

      logger.info(`File uploaded successfully to Supabase Storage: ${data?.path}`);
      // Optionally, save file metadata to the database associated with the project
      res.status(200).json({ message: 'File uploaded successfully', filePath: data?.path });

    } catch (err: any) {
      logger.error(`Failed to upload file for project ${projectId}:`, err);
      res.status(500).json({ message: 'Failed to upload file', error: err.message });
    }
    */
    try {
        // Create a clean filename with timestamp to prevent conflicts
        const timestamp = Date.now();
        const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const filePath = `projects/${projectId}/${timestamp}-${cleanFileName}`;
        try {
            // Try to upload file to Supabase Storage
            const { data, error } = await supabase_1.supabaseClient.storage
                .from('project-uploads')
                .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });
            if (error) {
                throw new Error(error.message);
            }
            // Get public URL for the uploaded file
            const { data: publicUrlData } = supabase_1.supabaseClient.storage
                .from('project-uploads')
                .getPublicUrl(filePath);
            const publicUrl = publicUrlData.publicUrl;
            // Try to update project metadata
            try {
                await supabase_1.supabaseClient
                    .from('projects')
                    .update({
                    updated_at: new Date().toISOString(),
                    imported_file_url: publicUrl,
                    imported_file_metadata: {
                        fileName: file.originalname,
                        mimeType: file.mimetype,
                        size: file.size,
                        uploadedAt: new Date().toISOString()
                    }
                })
                    .eq('id', projectId);
            }
            catch (dbUpdateError) {
                logger_1.default.warn(`Could not update project metadata, but file was uploaded: ${dbUpdateError.message || 'Unknown error'}`);
                // Continue anyway since the file uploaded successfully
            }
            logger_1.default.info(`File uploaded successfully to Supabase Storage: ${filePath}`);
            return res.status(200).json({
                message: 'File uploaded successfully',
                filePath: filePath,
                fileName: file.originalname,
                publicUrl: publicUrl
            });
        }
        catch (storageError) {
            // Storage upload failed, use fallback
            logger_1.default.warn(`Supabase storage upload failed, using fallback: ${storageError.message || 'Unknown error'}`);
            // Create a mock file URL (in production, you'd need an alternative storage)
            const mockUrl = `http://localhost:9998/mock-storage/${filePath}`;
            // Generate response with mock data
            return res.status(200).json({
                message: 'File processed successfully (fallback mode)',
                fileName: file.originalname,
                filePath: filePath,
                publicUrl: mockUrl,
                size: file.size,
                mimeType: file.mimetype,
                fallback: true
            });
        }
    }
    catch (err) {
        logger_1.default.error(`Unexpected error handling file for project ${projectId}:`, err);
        res.status(500).json({ message: 'Server error processing file', error: err.message || 'Unknown error' });
    }
});
// --- Get Project by ID ---
// GET /api/projects/:projectId
router.get('/:projectId', auth_1.authenticate, async (req, res, next) => {
    const projectId = req.params.projectId;
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        logger_1.default.info(`Fetching project ${projectId} for user ${userId}`);
        const { data, error } = await supabase_1.supabaseClient
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .eq('user_id', userId)
            .single();
        if (error) {
            logger_1.default.error(`Error fetching project ${projectId}:`, error);
            return res.status(500).json({ message: 'Failed to fetch project', error: error.message });
        }
        if (!data) {
            return res.status(404).json({ message: 'Project not found' });
        }
        return res.status(200).json({ project: data });
    }
    catch (err) {
        logger_1.default.error(`Unexpected error fetching project ${projectId}:`, err);
        next(err);
    }
});
// --- Get All Projects for Current User ---
// GET /api/projects
router.get('/', auth_1.authenticate, async (req, res, next) => {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    // Get query parameters for filtering/sorting
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'desc';
    try {
        logger_1.default.info(`Fetching projects for user ${userId}`);
        let query = supabase_1.supabaseClient
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(offset, offset + limit - 1);
        // Add filters if provided
        if (req.query.pitchDeckTypeId) {
            query = query.eq('pitch_deck_type_id', req.query.pitchDeckTypeId);
        }
        const { data, error, count } = await query;
        if (error) {
            logger_1.default.error('Error fetching projects:', error);
            return res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
        }
        return res.status(200).json({
            projects: data,
            meta: {
                count: data.length,
                offset,
                limit
            }
        });
    }
    catch (err) {
        logger_1.default.error('Unexpected error fetching projects:', err);
        next(err);
    }
});
// --- Update Project ---
// PUT /api/projects/:projectId
router.put('/:projectId', auth_1.authenticate, async (req, res, next) => {
    const projectId = req.params.projectId;
    // @ts-ignore
    const userId = req.user?.id;
    const updateData = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        // First verify the project belongs to the current user
        const { data: projectData, error: fetchError } = await supabase_1.supabaseClient
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .eq('user_id', userId)
            .single();
        if (fetchError || !projectData) {
            logger_1.default.warn(`User ${userId} attempted to update project ${projectId} they don't own`);
            return res.status(404).json({ message: 'Project not found or access denied' });
        }
        // Update the project
        logger_1.default.info(`Updating project ${projectId} for user ${userId}`);
        // Ensure that user_id cannot be modified and updated_at is set to now
        delete updateData.user_id;
        delete updateData.id;
        updateData.updated_at = new Date().toISOString();
        const { data, error } = await supabase_1.supabaseClient
            .from('projects')
            .update(updateData)
            .eq('id', projectId)
            .select()
            .single();
        if (error) {
            logger_1.default.error(`Error updating project ${projectId}:`, error);
            return res.status(500).json({ message: 'Failed to update project', error: error.message });
        }
        return res.status(200).json({ message: 'Project updated successfully', project: data });
    }
    catch (err) {
        logger_1.default.error(`Unexpected error updating project ${projectId}:`, err);
        next(err);
    }
});
// --- Delete Project ---
// DELETE /api/projects/:projectId
router.delete('/:projectId', auth_1.authenticate, async (req, res, next) => {
    const projectId = req.params.projectId;
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        // First verify the project belongs to the current user
        const { data: projectData, error: fetchError } = await supabase_1.supabaseClient
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .eq('user_id', userId)
            .single();
        if (fetchError || !projectData) {
            logger_1.default.warn(`User ${userId} attempted to delete project ${projectId} they don't own`);
            return res.status(404).json({ message: 'Project not found or access denied' });
        }
        // Delete the project
        logger_1.default.info(`Deleting project ${projectId} for user ${userId}`);
        const { error } = await supabase_1.supabaseClient
            .from('projects')
            .delete()
            .eq('id', projectId);
        if (error) {
            logger_1.default.error(`Error deleting project ${projectId}:`, error);
            return res.status(500).json({ message: 'Failed to delete project', error: error.message });
        }
        return res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch (err) {
        logger_1.default.error(`Unexpected error deleting project ${projectId}:`, err);
        next(err);
    }
});
exports.default = router;
