import express from 'express';
import dotenv from 'dotenv';
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

// Load environment variables
dotenv.config();

const app = express();
const PORT = config.port || 5000;

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

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

export default app;