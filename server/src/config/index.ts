import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 9999,
  
  // Database (Supabase)
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  // OpenRouter API
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultContentModel: process.env.DEFAULT_CONTENT_MODEL || 'anthropic/claude-3.7-sonnet',
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

export default config;