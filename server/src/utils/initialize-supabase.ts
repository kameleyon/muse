import { supabaseAdmin } from '../services/supabase';
import fs from 'fs';
import path from 'path';
import logger from './logger';

/**
 * This utility script helps initialize the Supabase database with the correct schema
 * It can be run manually when setting up a new environment
 * 
 * Usage: 
 * - Run from the project root with: npx ts-node ./src/utils/initialize-supabase.ts
 */
async function initializeSupabase() {
  try {
    logger.info('Starting Supabase initialization...');

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Break down the SQL into individual statements
    const statements = schemaSql
      .split(';')
      .filter(s => s.trim())
      .map(s => s.trim() + ';');

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      logger.info(`Executing statement ${i + 1} of ${statements.length}`);
      
      const { error } = await supabaseAdmin.rpc('pgmoon.run_sql', { 
        query: statement 
      });
      
      if (error) {
        logger.error(`Error executing statement ${i + 1}: ${error.message}`);
        logger.error(`Statement: ${statement}`);
      }
    }

    // Verify the profiles table exists
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['profiles', 'contents', 'content_versions']);

    if (tablesError) {
      logger.error(`Error checking tables: ${tablesError.message}`);
    } else {
      const tableNames = tables.map(t => t.table_name);
      logger.info(`Tables found: ${tableNames.join(', ')}`);
      
      if (!tableNames.includes('profiles')) {
        logger.warn('The profiles table is not found! User registration may fail.');
      } else {
        logger.info('Profiles table exists. User registration should work correctly.');
      }
    }

    logger.info('Supabase initialization completed successfully');
  } catch (error) {
    logger.error('Failed to initialize Supabase:', error);
  }
}

// Only run this if executed directly (not imported)
if (require.main === module) {
  initializeSupabase()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Initialization error:', error);
      process.exit(1);
    });
}

export default initializeSupabase;