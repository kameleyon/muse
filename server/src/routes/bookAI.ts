import express from 'express';
import { auth } from '../middleware/auth';
import {
  generateMarketResearch,
  generateBookStructure,
  generateChapter,
  reviseChapter
} from '../controllers/bookAI';

const router = express.Router();

// Book AI endpoints
router.post('/book-ai/market-research', auth, generateMarketResearch);
router.post('/book-ai/generate-structure', auth, generateBookStructure);
router.post('/book-ai/generate-chapter', auth, generateChapter);
router.post('/book-ai/revise-chapter', auth, reviseChapter);

export default router;