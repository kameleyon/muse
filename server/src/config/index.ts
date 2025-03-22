import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  
  // Database (Supabase)
  supabase: {
    url: process.env.SUPABASE_URL || 'https://gzwcntyautnkwltepkys.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6d2NudHlhdXRua3dsdGVwa3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMDg5OTIsImV4cCI6MjA1NzU4NDk5Mn0.lI68rRljIVdsUIcvn5xzwA_OOiaPXtsrSW0PQ-nFRcs',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6d2NudHlhdXRua3dsdGVwa3lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjAwODk5MiwiZXhwIjoyMDU3NTg0OTkyfQ.i1WM9roHWB7TE8Hbg5Y_xHG5ACxy7FYWakNXJTqnmqA',
  },
  
  // OpenRouter API
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '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',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultContentModel: process.env.DEFAULT_CONTENT_MODEL || 'anthropic/claude-3.7-sonnet',
    defaultResearchModel: process.env.DEFAULT_RESEARCH_MODEL || 'openai/gpt-4o-search-preview',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d', // Token expiration time
  },
  
  // CORS
  corsOrigins: process.env.CORS_ORIGINS ? 
    process.env.CORS_ORIGINS.split(',') : 
    ['http://localhost:3000', 'http://localhost:3001'],
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;