import { createClient } from '@supabase/supabase-js';
import config from '../config';
import logger from '../utils/logger';

// Validate required Supabase config
if (!config.supabase.url) {
  throw new Error('Missing required environment variable: SUPABASE_URL');
}
if (!config.supabase.anonKey) {
  throw new Error('Missing required environment variable: SUPABASE_ANON_KEY');
}
if (!config.supabase.serviceKey) {
  throw new Error('Missing required environment variable: SUPABASE_SERVICE_KEY');
}

// Create an anonymous client (for auth operations)
export const supabaseClient = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Create a service role client (for admin operations)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceKey
);

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Check connection
    const { data, error } = await supabaseAdmin.from('users').select('count').limit(1);
    
    if (error) {
      logger.error(`Database connection error: ${error.message}`);
      return false;
    }
    
    logger.info('Database connection established successfully');
    return true;
  } catch (error: any) {
    logger.error(`Failed to initialize database: ${error.message}`);
    return false;
  }
};

// Generic DB query wrapper with logging
export const executeQuery = async (
  queryName: string, 
  queryFn: () => Promise<any>
) => {
  try {
    const startTime = Date.now();
    const result = await queryFn();
    const duration = Date.now() - startTime;
    
    if (result.error) {
      logger.error(`Query '${queryName}' failed: ${result.error.message}`);
      return { ...result, success: false };
    }
    
    logger.debug(`Query '${queryName}' executed in ${duration}ms`);
    return { ...result, success: true };
  } catch (error: any) {
    logger.error(`Query '${queryName}' exception: ${error.message}`);
    return { data: null, error, success: false };
  }
};
