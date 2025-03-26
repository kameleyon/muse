import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createClient } from '@supabase/supabase-js';
import config from '../config';
import { ApiError } from './error';

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
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
    }

    // Add user and token to the request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    next(error);
  }
};
