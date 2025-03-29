"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentPresets = exports.getAvailableModels = exports.extractKeywords = exports.expandContent = exports.summarizeContent = exports.improveContent = exports.generateSocialMediaPost = exports.generateAcademicContent = exports.generateCreativeWriting = exports.generateMarketingCopy = exports.generateBlogPost = exports.generateContent = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const error_1 = require("../middleware/error");
const openrouter_1 = require("../services/openrouter");
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * @desc    Generate content using OpenRouter API
 * @route   POST /api/ai/generate
 * @access  Private
 */
exports.generateContent = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { prompt, type, parameters } = req.body;
    if (!prompt) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Prompt is required'));
    }
    try {
        const response = await (0, openrouter_1.executeOpenRouterRequest)({
            prompt,
            model: parameters?.model || config_1.default.openRouter.defaultContentModel,
            max_tokens: parameters?.max_tokens || 1000,
            temperature: parameters?.temperature || 0.7,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: {
                content: response.choices[0]?.message?.content || '',
                model: response.model,
                usage: response.usage,
            },
        });
    }
    catch (error) {
        logger_1.default.error(`AI content generation error: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `AI content generation failed: ${error.message}`));
    }
});
/**
 * @desc    Generate blog post
 * @route   POST /api/ai/generate/blog
 * @access  Private
 */
exports.generateBlogPost = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { topic, keywords, tone, length } = req.body;
    if (!topic) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Topic is required'));
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
        const response = await (0, openrouter_1.executeOpenRouterRequest)({
            prompt,
            model: config_1.default.openRouter.defaultContentModel,
            max_tokens: 2000,
            temperature: 0.7,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: {
                content: response.choices[0]?.message?.content || '',
                model: response.model,
                usage: response.usage,
            },
        });
    }
    catch (error) {
        logger_1.default.error(`Blog post generation error: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Blog post generation failed: ${error.message}`));
    }
});
/**
 * @desc    Generate marketing copy
 * @route   POST /api/ai/generate/marketing
 * @access  Private
 */
exports.generateMarketingCopy = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { product, audience, purpose, tone, length } = req.body;
    if (!product || !purpose) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Product and purpose are required'));
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
        const response = await (0, openrouter_1.executeOpenRouterRequest)({
            prompt,
            model: config_1.default.openRouter.defaultContentModel,
            max_tokens: 1000,
            temperature: 0.8,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: {
                content: response.choices[0]?.message?.content || '',
                model: response.model,
                usage: response.usage,
            },
        });
    }
    catch (error) {
        logger_1.default.error(`Marketing copy generation error: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Marketing copy generation failed: ${error.message}`));
    }
});
/**
 * Generate other content types - implementation similar to above methods
 */
exports.generateCreativeWriting = (0, express_async_handler_1.default)(async (req, res) => {
    // Implementation will be similar to other generation methods
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});
exports.generateAcademicContent = (0, express_async_handler_1.default)(async (req, res) => {
    // Implementation will be similar to other generation methods
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});
exports.generateSocialMediaPost = (0, express_async_handler_1.default)(async (req, res) => {
    // Implementation will be similar to other generation methods
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});
/**
 * @desc    Improve existing content
 * @route   POST /api/ai/improve
 * @access  Private
 */
exports.improveContent = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { content, aspects } = req.body;
    if (!content) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Content is required'));
    }
    const prompt = `
    Improve the following content:
    "${content}"
    
    ${aspects ? `Focus on improving these aspects: ${aspects.join(', ')}.` : 'Focus on clarity, engagement, and professionalism.'}
    
    Return only the improved content without explanations.
  `;
    try {
        const response = await (0, openrouter_1.executeOpenRouterRequest)({
            prompt,
            model: config_1.default.openRouter.defaultContentModel,
            max_tokens: 2000,
            temperature: 0.6,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            data: {
                content: response.choices[0]?.message?.content || '',
                model: response.model,
                usage: response.usage,
            },
        });
    }
    catch (error) {
        logger_1.default.error(`Content improvement error: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Content improvement failed: ${error.message}`));
    }
});
/**
 * Other AI utility functions - implementation similar to above methods
 */
exports.summarizeContent = (0, express_async_handler_1.default)(async (req, res) => {
    // Implementation will be similar to other AI utility methods
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});
exports.expandContent = (0, express_async_handler_1.default)(async (req, res) => {
    // Implementation will be similar to other AI utility methods
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});
exports.extractKeywords = (0, express_async_handler_1.default)(async (req, res) => {
    // Implementation will be similar to other AI utility methods
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Not yet implemented' });
});
/**
 * @desc    Get available AI models
 * @route   GET /api/ai/models
 * @access  Private
 */
exports.getAvailableModels = (0, express_async_handler_1.default)(async (req, res) => {
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
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        data: models,
    });
});
/**
 * @desc    Get content generation presets
 * @route   GET /api/ai/presets
 * @access  Private
 */
exports.getContentPresets = (0, express_async_handler_1.default)(async (req, res) => {
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
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        data: presets,
    });
});
