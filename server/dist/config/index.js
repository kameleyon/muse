"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 9998,
    // Database (Supabase)
    supabase: {
        url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    // OpenRouter API
    openRouter: {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseUrl: 'https://openrouter.ai/api/v1',
        defaultContentModel: process.env.DEFAULT_CONTENT_MODEL || 'google/gemini-2.5-pro-exp-03-25:free',
        defaultResearchModel: process.env.DEFAULT_RESEARCH_MODEL || 'openai/gpt-4o-search-preview',
    },
    // JWT
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d', // Token expiration time
    },
    // CORS
    corsOrigins: process.env.CORS_ORIGINS ?
        process.env.CORS_ORIGINS.split(',') :
        ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:9999'],
    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
};
exports.default = config;
