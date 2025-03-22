import express from 'express';
import * as contentController from '../controllers/content';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Content routes
router.get('/', contentController.getAllContent);
router.post('/', contentController.createContent);
router.get('/:id', contentController.getContentById);
router.put('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

// Version history
router.get('/:id/versions', contentController.getContentVersions);
router.get('/:id/versions/:versionId', contentController.getContentVersion);
router.post('/:id/versions/:versionId/restore', contentController.restoreContentVersion);

// Export routes
router.post('/:id/export/pdf', contentController.exportContentToPdf);
router.post('/:id/export/docx', contentController.exportContentToDocx);
router.post('/:id/export/html', contentController.exportContentToHtml);

export default router;