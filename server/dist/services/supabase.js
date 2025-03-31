"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = exports.initializeDatabase = exports.supabaseAdmin = exports.supabaseClient = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../utils/logger"));
// Validate required Supabase config
if (!config_1.default.supabase.url) {
    throw new Error('Missing required environment variable: SUPABASE_URL');
}
if (!config_1.default.supabase.anonKey) {
    throw new Error('Missing required environment variable: SUPABASE_ANON_KEY');
}
if (!config_1.default.supabase.serviceKey) {
    throw new Error('Missing required environment variable: SUPABASE_SERVICE_KEY');
}
// Create an anonymous client (for auth operations)
exports.supabaseClient = (0, supabase_js_1.createClient)(config_1.default.supabase.url, config_1.default.supabase.anonKey, {
    db: { schema: 'public' }, // Explicitly set schema
});
// Create a service role client (for admin operations)
exports.supabaseAdmin = (0, supabase_js_1.createClient)(config_1.default.supabase.url, config_1.default.supabase.serviceKey, {
    db: { schema: 'public' }, // Explicitly set schema
});
// Initialize database tables
const initializeDatabase = async () => {
    try {
        // Check connection
        const { data, error } = await exports.supabaseAdmin.from('users').select('count').limit(1);
        if (error) {
            logger_1.default.error(`Database connection error: ${error.message}`);
            return false;
        }
        logger_1.default.info('Database connection established successfully');
        return true;
    }
    catch (error) {
        logger_1.default.error(`Failed to initialize database: ${error.message}`);
        return false;
    }
};
exports.initializeDatabase = initializeDatabase;
// Generic DB query wrapper with logging
const executeQuery = async (queryName, queryFn) => {
    try {
        const startTime = Date.now();
        const result = await queryFn();
        const duration = Date.now() - startTime;
        if (result.error) {
            logger_1.default.error(`Query '${queryName}' failed: ${result.error.message}`);
            return { ...result, success: false };
        }
        logger_1.default.debug(`Query '${queryName}' executed in ${duration}ms`);
        return { ...result, success: true };
    }
    catch (error) {
        logger_1.default.error(`Query '${queryName}' exception: ${error.message}`);
        return { data: null, error, success: false };
    }
};
exports.executeQuery = executeQuery;
