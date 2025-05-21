"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.authenticate = void 0;
const http_status_codes_1 = require("http-status-codes");
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = __importDefault(require("../config"));
const error_1 = require("./error");
const logger_1 = __importDefault(require("../utils/logger"));
// Validate required Supabase config for auth middleware
if (!config_1.default.supabase.url) {
    throw new Error('Missing required environment variable: SUPABASE_URL');
}
if (!config_1.default.supabase.anonKey) {
    throw new Error('Missing required environment variable: SUPABASE_ANON_KEY');
}
// Create a Supabase client
const supabase = (0, supabase_js_1.createClient)(config_1.default.supabase.url, config_1.default.supabase.anonKey);
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger_1.default.warn('No authorization header or invalid format');
            // For development only: Create a mock user to bypass authentication
            if (process.env.NODE_ENV === 'development') {
                logger_1.default.warn('Development mode: Using mock authentication');
                req.user = { id: 'mock-user-id' };
                req.token = 'mock-token';
                return next();
            }
            throw new error_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'No token provided');
        }
        const token = authHeader.split(' ')[1];
        // Verify the token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) {
            logger_1.default.error(`Authentication error: ${error.message}`);
            // For development only: Create a mock user to bypass authentication
            if (process.env.NODE_ENV === 'development') {
                logger_1.default.warn('Development mode: Using mock authentication despite token error');
                req.user = { id: 'mock-user-id' };
                req.token = 'mock-token';
                return next();
            }
            throw new error_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
        }
        if (!user) {
            logger_1.default.error('Token verified but no user found');
            // For development only: Create a mock user to bypass authentication
            if (process.env.NODE_ENV === 'development') {
                logger_1.default.warn('Development mode: Using mock authentication despite no user found');
                req.user = { id: 'mock-user-id' };
                req.token = 'mock-token';
                return next();
            }
            throw new error_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not found');
        }
        logger_1.default.info(`Authenticated user ID: ${user.id}`);
        // Add user and token to the request
        req.user = user;
        req.token = token;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
exports.auth = exports.authenticate;
