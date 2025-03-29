import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { ApiError } from '../middleware/error';
import { executeOpenRouterRequest } from '../services/openrouter';
import config from '../config';
import logger from '../utils/logger';

/**
 * @desc    Generate content using OpenRouter API
 * @route   POST /api/ai/generate
 * @access  Private
 */
export const generateContent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { prompt, type, parameters } = req.body;

  if (!prompt) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Prompt is required'));
  }

  try {
    const response = await executeOpenRouterRequest({
      prompt,
      model: parameters?.model || config.openRouter.defaultContentModel,
      max_tokens: parameters?.max_tokens || 1000,
      temperature: parameters?.temperature || 0.7,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        content: response.choices[0]?.message?.content || '',
        model: response.model,
        usage: response.usage,
      },
    });
  } catch (error: any) {
    logger.error(`AI content generation error: ${error.message}`);
    return next(new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `AI content generation failed: ${error.message}`
    ));
  }
});

/**
 * @desc    Generate blog post
 * @route   POST /api/ai/generate/blog
 * @access  Private
 */
export const generateBlogPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { topic, keywords, tone, length } = req.body;

  if (!topic) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Topic is required'));
  }

  const prompt = `
    Write a ${tone || 'professional'} blog post about "${topic}".
    ${keywords ? `Include the following keywords: ${keywords.join(', ')}.` : ''}
    ${length ? `The blog post should be approximately ${length} words long.` : 'The blog post should be comprehensive but concise.'}
    
    Structure the blog post with:
    1. An engaging introduction
    2. Several informative sections with subheadings
    3. A strong conclusion
    
    Format the output as markdown.
  `;

  try {
    const response = await executeOpenRouterRequest({
      prompt,
      model: config.openRouter.defaultContentModel,
      max_tokens: 2000,
      temperature: 0.7,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        content: response.choices[0]?.message?.content || '',
        model: response.model,
        usage: response.usage,
      },
    });
  } catch (error: any) {
    logger.error(`Blog post generation error: ${error.message}`);
    return next(new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Blog post generation failed: ${error.message}`
    ));
  }
});

/**
 * @desc    Generate marketing copy
 * @route   POST /api/ai/generate/marketing
 * @access  Private
 */
export const generateMarketingCopy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { product, audience, purpose, tone, length } = req.body;

  if (!product || !purpose) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Product and purpose are required'));
  }

  const prompt = `
    Write ${purpose} copy for "${product}".
    ${audience ? `The target audience is ${audience}.` : ''}
    ${tone ? `The tone should be ${tone}.` : 'The tone should be persuasive and engaging.'}
    ${length ? `The copy should be approximately ${length} words long.` : 'The copy should be concise and impactful.'}
    
    The copy should:
    - Have an attention-grabbing headline
    - Highlight key benefits
    - Include a strong call to action
    
    Format the output as markdown.
  `;

  try {
    const response = await executeOpenRouterRequest({
      prompt,
      model: config.openRouter.defaultContentModel,
      max_tokens: 1000,
      temperature: 0.8,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        content: response.choices[0]?.message?.content || '',
        model: response.model,
        usage: response.usage,
      },
    });
  } catch (error: any) {
    logger.error(`Marketing copy generation error: ${error.message}`);
    return next(new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Marketing copy generation failed: ${error.message}`
    ));
  }
});

/**
 * Generate other content types - implementation similar to above methods
 */
export const generateCreativeWriting = asyncHandler(async (req: Request, res: Response) => {
  // Implementation will be similar to other generation methods
  res.status(StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});

export const generateAcademicContent = asyncHandler(async (req: Request, res: Response) => {
  // Implementation will be similar to other generation methods
  res.status(StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});

export const generateSocialMediaPost = asyncHandler(async (req: Request, res: Response) => {
  // Implementation will be similar to other generation methods
  res.status(StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});

/**
 * @desc    Improve existing content
 * @route   POST /api/ai/improve
 * @access  Private
 */
export const improveContent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { content, aspects } = req.body;

  if (!content) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, 'Content is required'));
  }

  const prompt = `
    Improve the following content:
    "${content}"
    
    ${aspects ? `Focus on improving these aspects: ${aspects.join(', ')}.` : 'Focus on clarity, engagement, and professionalism.'}
    
    Return only the improved content without explanations.
  `;

  try {
    const response = await executeOpenRouterRequest({
      prompt,
      model: config.openRouter.defaultContentModel,
      max_tokens: 2000,
      temperature: 0.6,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        content: response.choices[0]?.message?.content || '',
        model: response.model,
        usage: response.usage,
      },
    });
  } catch (error: any) {
    logger.error(`Content improvement error: ${error.message}`);
    return next(new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Content improvement failed: ${error.message}`
    ));
  }
});

/**
 * Other AI utility functions - implementation similar to above methods
 */
export const summarizeContent = asyncHandler(async (req: Request, res: Response) => {
  // Implementation will be similar to other AI utility methods
  res.status(StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});

export const expandContent = asyncHandler(async (req: Request, res: Response) => {
  // Implementation will be similar to other AI utility methods
  res.status(StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});

export const extractKeywords = asyncHandler(async (req: Request, res: Response) => {
  // Implementation will be similar to other AI utility methods
  res.status(StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});

/**
 * @desc    Get available AI models
 * @route   GET /api/ai/models
 * @access  Private
 */
export const getAvailableModels = asyncHandler(async (req: Request, res: Response) => {
  // In a real implementation, this would fetch available models from OpenRouter API
  const models = [
    {
      id: 'google/gemini-2.5-pro-exp-03-25:free',
      name: 'Claude 3 Haiku',
      description: 'Fast and cost-effective model for efficient tasks',
      maxTokens: 200000,
      costPer1KTokens: 0.00025,
    },
    {
      id: 'google/gemini-2.5-pro-exp-03-25:free',
      name: 'Claude 3 Sonnet',
      description: 'Balanced model for complex reasoning and content creation',
      maxTokens: 200000,
      costPer1KTokens: 0.003,
    },
    {
      id: 'google/gemini-2.5-pro-exp-03-25:free',
      name: 'Claude 3 Opus',
      description: 'Most powerful model for expert-level analysis and content',
      maxTokens: 200000,
      costPer1KTokens: 0.015,
    },
    {
      id: 'google/gemini-2.5-pro-exp-03-25:free',
      name: 'GPT-4 Turbo',
      description: 'Advanced reasoning and knowledge capabilities',
      maxTokens: 128000,
      costPer1KTokens: 0.01,
    },
  ];

  res.status(StatusCodes.OK).json({
    success: true,
    data: models,
  });
});

/**
 * @desc    Get content generation presets
 * @route   GET /api/ai/presets
 * @access  Private
 */
export const getContentPresets = asyncHandler(async (req: Request, res: Response) => {
  const presets = [
    {
      id: 'blog-professional',
      name: 'Professional Blog Post',
      description: 'Clear, informative content for business blogs',
      type: 'blog',
      parameters: {
        model: 'google/gemini-2.5-pro-exp-03-25:free',
        temperature: 0.7,
        max_tokens: 1500,
      },
    },
    {
      id: 'blog-casual',
      name: 'Casual Blog Post',
      description: 'Conversational, engaging content for personal blogs',
      type: 'blog',
      parameters: {
        model: 'google/gemini-2.5-pro-exp-03-25:free',
        temperature: 0.8,
        max_tokens: 1200,
      },
    },
    {
      id: 'marketing-persuasive',
      name: 'Persuasive Marketing',
      description: 'Compelling copy that drives conversions',
      type: 'marketing',
      parameters: {
        model: 'google/gemini-2.5-pro-exp-03-25:free',
        temperature: 0.75,
        max_tokens: 800,
      },
    },
    {
      id: 'social-engaging',
      name: 'Engaging Social Posts',
      description: 'Attention-grabbing content for social media',
      type: 'social',
      parameters: {
        model: 'google/gemini-2.5-pro-exp-03-25:free',
        temperature: 0.9,
        max_tokens: 400,
      },
    },
    {
      id: 'academic-research',
      name: 'Academic Research',
      description: 'Formal, well-structured content for academic purposes',
      type: 'academic',
      parameters: {
        model: 'google/gemini-2.5-pro-exp-03-25:free',
        temperature: 0.5,
        max_tokens: 2000,
      },
    },
  ];

  res.status(StatusCodes.OK).json({
    success: true,
    data: presets,
  });
});