import express from 'express';
import { authenticate } from '../middleware/auth';
import { calculateQualityScore } from '../services/qualityCalculator';
import { supabaseAdmin } from '../services/supabase';

const router = express.Router();

// Analyze chapter quality
router.post('/analyze-chapter', authenticate, async (req, res) => {
  try {
    const { chapterId } = req.body;
    
    if (!chapterId) {
      return res.status(400).json({ error: 'Chapter ID is required' });
    }
    
    // Get chapter details
    const { data: chapter, error: chapterError } = await supabaseAdmin
      .from('chapters')
      .select('*, book_id, title, number, content')
      .eq('id', chapterId)
      .single();
      
    if (chapterError || !chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    if (!chapter.content) {
      return res.status(400).json({ error: 'Chapter has no content to analyze' });
    }
    
    // Get book details
    const { data: book, error: bookError } = await supabaseAdmin
      .from('books')
      .select('*')
      .eq('id', chapter.book_id)
      .single();
      
    if (bookError || !book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Find chapter details in book structure
    let chapterDetails: any = null;
    if (book.structure?.parts) {
      for (const part of book.structure.parts) {
        const found = part.chapters?.find((ch: any) => ch.number === chapter.number);
        if (found) {
          chapterDetails = found;
          break;
        }
      }
    } else if (book.structure?.chapters) {
      chapterDetails = book.structure.chapters.find((ch: any) => ch.number === chapter.number);
    }
    
    // Prepare contexts
    const bookContext = {
      topic: book.topic,
      targetAudience: book.marketResearch?.targetAudience || {},
      marketResearch: book.marketResearch || {},
      tone: book.structure?.tone || 'conversational',
      style: book.structure?.style || 'practical',
      readingLevel: book.marketResearch?.readingLevel || 'Standard (60-69)',
      gradeLevel: book.marketResearch?.gradeLevel || '8th-9th grade'
    };
    
    const chapterContext = {
      title: chapter.title,
      number: chapter.number,
      description: chapterDetails?.description || '',
      keyTopics: chapterDetails?.keyTopics || []
    };
    
    // Calculate quality score
    const qualityMetrics = await calculateQualityScore(
      chapter.content,
      bookContext,
      chapterContext
    );
    
    // Store quality score in chapter metadata
    const updatedMetadata = {
      ...(chapter.metadata || {}),
      qualityScore: qualityMetrics.overallScore,
      lastQualityCheck: qualityMetrics.timestamp
    };
    
    await supabaseAdmin
      .from('chapters')
      .update({ metadata: updatedMetadata })
      .eq('id', chapterId);
    
    res.json({ qualityMetrics });
  } catch (error: any) {
    console.error('Error analyzing chapter quality:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze chapter quality' });
  }
});

// Get quality metrics for a chapter
router.get('/chapter/:chapterId/quality', authenticate, async (req, res) => {
  try {
    const { chapterId } = req.params;
    
    // Get chapter with metadata
    const { data: chapter, error } = await supabaseAdmin
      .from('chapters')
      .select('metadata')
      .eq('id', chapterId)
      .single();
      
    if (error || !chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    const qualityScore = chapter.metadata?.qualityScore;
    const lastCheck = chapter.metadata?.lastQualityCheck;
    
    if (!qualityScore) {
      return res.status(404).json({ error: 'No quality analysis available for this chapter' });
    }
    
    res.json({ 
      qualityScore,
      lastCheck
    });
  } catch (error: any) {
    console.error('Error getting quality metrics:', error);
    res.status(500).json({ error: error.message || 'Failed to get quality metrics' });
  }
});

export default router;