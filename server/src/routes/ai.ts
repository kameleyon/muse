import express from 'express';
import * as aiController from '../controllers/ai';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// AI Content Generation
router.post('/generate', aiController.generateContent);
router.post('/generate/blog', aiController.generateBlogPost);
router.post('/generate/marketing', aiController.generateMarketingCopy);
router.post('/generate/creative', aiController.generateCreativeWriting);
router.post('/generate/academic', aiController.generateAcademicContent);
router.post('/generate/social', aiController.generateSocialMediaPost);

// AI Utilities
router.post('/improve', aiController.improveContent);
router.post('/summarize', aiController.summarizeContent);
router.post('/expand', aiController.expandContent);
router.post('/keywords', aiController.extractKeywords);

// Models & Presets
router.get('/models', aiController.getAvailableModels);
router.get('/presets', aiController.getContentPresets);

export default router;