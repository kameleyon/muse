import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
    apiKey: (() => {
      const key = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
      if (!key) throw new Error('OPENROUTER_API_KEY is required');
      return key;
    })(),
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultContentModel: process.env.DEFAULT_CONTENT_MODEL ||
      process.env.VITE_DEFAULT_CONTENT_MODEL ||
      'qwen/qwen-plus',
    defaultResearchModel: process.env.DEFAULT_RESEARCH_MODEL ||
      process.env.VITE_DEFAULT_RESEARCH_MODEL ||
      'google/gemini-2.5-flash-lite-preview-06-17',
    bookStructureModel: process.env.BOOK_STRUCTURE_MODEL ||
      process.env.VITE_BOOK_STRUCTURE_MODEL ||
      'anthropic/claude-3.7-sonnet:thinking',
    defaultQualityModel: process.env.DEFAULT_QUALITY_MODEL ||
      process.env.VITE_DEFAULT_QUALITY_MODEL ||
      'google/gemini-2.5-flash',
    defaultChatModel: process.env.DEFAULT_CHAT_MODEL ||
      process.env.VITE_DEFAULT_CHAT_MODEL ||
      'qwen/qwen-plus',
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

export default config;
