import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createClient } from '@supabase/supabase-js';
import config from '../config';
import { ApiError } from './error';
import logger from '../utils/logger';

// Validate required Supabase config for auth middleware
if (!config.supabase.url) {
  throw new Error('Missing required environment variable: SUPABASE_URL');
}
if (!config.supabase.anonKey) {
  throw new Error('Missing required environment variable: SUPABASE_ANON_KEY');
}

// Create a Supabase client
const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Extend the Express Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No authorization header or invalid format');
      
      // For development only: Create a mock user to bypass authentication
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Development mode: Using mock authentication');
        req.user = { id: 'mock-user-id' };
        req.token = 'mock-token';
        return next();
      }
      
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      logger.error(`Authentication error: ${error.message}`);
      
      // For development only: Create a mock user to bypass authentication
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Development mode: Using mock authentication despite token error');
        req.user = { id: 'mock-user-id' };
        req.token = 'mock-token';
        return next();
      }
      
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
    }
    
    if (!user) {
      logger.error('Token verified but no user found');
      
      // For development only: Create a mock user to bypass authentication
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Development mode: Using mock authentication despite no user found');
        req.user = { id: 'mock-user-id' };
        req.token = 'mock-token';
        return next();
      }
      
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not found');
    }
    
    logger.info(`Authenticated user ID: ${user.id}`);

    // Add user and token to the request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    next(error);
  }
};

// Export the auth middleware
export { authenticate as auth };
