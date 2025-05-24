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
            logger_1.default.error(`OpenRouter API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            throw new Error(`OpenRouter API error: ${error.response.data.error?.message || 'Unknown error'}`);
        }
        else if (error.request) {
            logger_1.default.error(`OpenRouter API request error: ${error.message}`);
            throw new Error('Could not connect to OpenRouter API');
        }
        else {
            logger_1.default.error(`OpenRouter client error: ${error.message}`);
            throw error;
        }
    }
};
exports.executeOpenRouterRequest = executeOpenRouterRequest;
