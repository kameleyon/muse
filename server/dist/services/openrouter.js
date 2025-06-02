"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeOpenRouterRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../utils/logger"));
const executeOpenRouterRequest = async (params) => {
    try {
        // Ensure we have messages to send to the API
        const messages = params.messages || [
            {
                role: 'user',
                content: params.prompt,
            },
        ];
        const requestData = {
            model: params.model,
            messages,
            max_tokens: params.max_tokens || 1000,
            temperature: params.temperature || 0.7,
            top_p: params.top_p || 1,
            frequency_penalty: params.frequency_penalty || 0,
            presence_penalty: params.presence_penalty || 0,
            stop: params.stop || null,
        };
        logger_1.default.info(`Making OpenRouter request to model: ${params.model}`);
        const response = await axios_1.default.post(`${config_1.default.openRouter.baseUrl}/chat/completions`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config_1.default.openRouter.apiKey}`,
                'HTTP-Referer': 'https://magicmuse.io',
                'X-Title': 'MagicMuse.io',
            },
        });
        const responseData = response.data;
        logger_1.default.info(`OpenRouter request successful. Tokens used: ${responseData.usage.total_tokens}`);
        return responseData;
    }
    catch (error) {
        if (error.response) {
            // Enhanced error logging with more details
            logger_1.default.error(`OpenRouter API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            logger_1.default.error(`Request was for model: ${params.model}`);
            // Check for specific error types
            if (error.response.status === 401 || error.response.status === 403) {
                logger_1.default.error('Authentication error - check API key validity and permissions');
                throw new Error(`OpenRouter API authentication error: ${error.response.data.error?.message || 'Invalid API key or insufficient permissions'}`);
            }
            else if (error.response.status === 404) {
                logger_1.default.error(`Model not found: ${params.model}`);
                throw new Error(`OpenRouter API error: Model "${params.model}" not found or not available`);
            }
            else if (error.response.status === 429) {
                logger_1.default.error('Rate limit exceeded');
                throw new Error('OpenRouter API rate limit exceeded. Please try again later.');
            }
            else if (error.response.status === 500) {
                logger_1.default.error('OpenRouter internal server error');
                throw new Error(`OpenRouter API server error: ${error.response.data.error?.message || 'Internal server error'}`);
            }
            else {
                throw new Error(`OpenRouter API error: ${error.response.data.error?.message || 'Unknown error'}`);
            }
        }
        else if (error.request) {
            logger_1.default.error(`OpenRouter API request error: ${error.message}`);
            throw new Error('Could not connect to OpenRouter API. Please check your network connection.');
        }
        else {
            logger_1.default.error(`OpenRouter client error: ${error.message}`);
            throw error;
        }
    }
};
exports.executeOpenRouterRequest = executeOpenRouterRequest;
