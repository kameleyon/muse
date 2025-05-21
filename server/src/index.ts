// Load environment variables first, before any other imports
import dotenv from 'dotenv';
import path from 'path';

// Configure dotenv to load from both project root and server .env files
// Server .env takes precedence
dotenv.config({ path: path.resolve(process.cwd(), './.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import xss from 'xss-clean';
import { StatusCodes } from 'http-status-codes';

import logger from './utils/logger';
import config from './config';
import { errorHandler, notFound } from './middleware/error';

// Routes
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import userRoutes from './routes/user';
import aiRoutes from './routes/ai';
import projectRoutes from './routes/projectRoutes'; // Import project routes
import bookRoutes from './routes/book'; // Import book routes
import bookAIRoutes from './routes/bookAI'; // Import book AI routes

const app = express();
const PORT = 9998; // Fixed port to avoid conflicts

// Middleware
app.use(helmet()); // Set security HTTP headers
app.use(express.json({ limit: '50mb' })); // Parse JSON request body
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded request body
app.use(xss()); // Sanitize request data against XSS
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));
app.use(morgan('dev')); // HTTP request logger

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectRoutes); // Mount project routes
app.use('/api', bookRoutes); // Mount book routes
app.use('/api', bookAIRoutes); // Mount book AI routes

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Import the Supabase initialization function
import { initializeDatabase, supabaseAdmin } from './services/supabase';
import { runMigrations } from './utils/run-migrations';

// Check Supabase connection before starting server
const startServer = async () => {
  // Verify Supabase connection
  logger.info('Checking Supabase connection...');
  logger.info(`Using Supabase URL: ${config.supabase.url}`);
  
  try {
    // Test the connection
    const { data, error } = await supabaseAdmin.from('projects').select('count').limit(1);
    
    if (error) {
      logger.error(`Supabase connection error: ${error.message}`);
      logger.error('Attempting to run migrations to create required tables...');
      
      // Try to run migrations
      const migrationsSuccess = await runMigrations();
      if (migrationsSuccess) {
        logger.info('Migrations completed successfully. The projects table should now exist.');
      } else {
        logger.error('Migrations failed. Database operations may fail.');
      }
    } else {
      logger.info('Supabase connection successful. Projects table exists.');
      
      // Still run migrations to ensure all schema changes are applied
      logger.info('Running migrations to ensure schema is up to date...');
      await runMigrations();
    }
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    });
  } catch (err) {
    logger.error(`Failed to connect to Supabase: ${err}`);
    logger.error('Server will start but database operations may fail');
    
    // Start server anyway
    app.listen(PORT, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    });
  }
};

startServer();

export default app;
