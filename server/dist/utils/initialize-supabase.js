"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = require("../services/supabase");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./logger"));
/**
 * This utility script helps initialize the Supabase database with the correct schema
 * It can be run manually when setting up a new environment
 *
 * Usage:
 * - Run from the project root with: npx ts-node ./src/utils/initialize-supabase.ts
 */
async function initializeSupabase() {
    try {
        logger_1.default.info('Starting Supabase initialization...');
        // Read the SQL schema file
        const schemaPath = path_1.default.join(__dirname, 'supabase-schema.sql');
        const schemaSql = fs_1.default.readFileSync(schemaPath, 'utf8');
        // Break down the SQL into individual statements
        const statements = schemaSql
            .split(';')
            .filter(s => s.trim())
            .map(s => s.trim() + ';');
        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            logger_1.default.info(`Executing statement ${i + 1} of ${statements.length}`);
            const { error } = await supabase_1.supabaseAdmin.rpc('pgmoon.run_sql', {
                query: statement
            });
            if (error) {
                logger_1.default.error(`Error executing statement ${i + 1}: ${error.message}`);
                logger_1.default.error(`Statement: ${statement}`);
            }
        }
        // Verify the profiles table exists
        const { data: tables, error: tablesError } = await supabase_1.supabaseAdmin
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['profiles', 'contents', 'content_versions']);
        if (tablesError) {
            logger_1.default.error(`Error checking tables: ${tablesError.message}`);
        }
        else {
            const tableNames = tables.map(t => t.table_name);
            logger_1.default.info(`Tables found: ${tableNames.join(', ')}`);
            if (!tableNames.includes('profiles')) {
                logger_1.default.warn('The profiles table is not found! User registration may fail.');
            }
            else {
                logger_1.default.info('Profiles table exists. User registration should work correctly.');
            }
        }
        logger_1.default.info('Supabase initialization completed successfully');
    }
    catch (error) {
        logger_1.default.error('Failed to initialize Supabase:', error);
    }
}
// Only run this if executed directly (not imported)
if (require.main === module) {
    initializeSupabase()
        .then(() => process.exit(0))
        .catch(error => {
        logger_1.default.error('Initialization error:', error);
        process.exit(1);
    });
}
exports.default = initializeSupabase;
