"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.refreshToken = exports.logout = exports.getMe = exports.sendMagicLink = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const supabase_1 = require("../services/supabase");
const error_1 = require("../middleware/error");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email and password are required'));
    }
    const { data, error } = await supabase_1.supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName || '',
            },
        },
    });
    if (error) {
        logger_1.default.error(`Registration error: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, error.message));
    }
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        success: true,
        message: 'Registration successful',
        data: {
            user: data.user,
            session: data.session,
        },
    });
});
/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email and password are required'));
    }
    const { data, error } = await supabase_1.supabaseClient.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        logger_1.default.warn(`Login failed for ${email}: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials'));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: 'Login successful',
        data: {
            user: data.user,
            session: data.session,
        },
    });
});
/**
 * @desc    Send magic link
 * @route   POST /api/auth/magic-link
 * @access  Public
 */
exports.sendMagicLink = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email is required'));
    }
    const { error } = await supabase_1.supabaseClient.auth.signInWithOtp({
        email,
    });
    if (error) {
        logger_1.default.error(`Magic link error for ${email}: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, error.message));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: 'Magic link sent to your email',
    });
});
/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = (0, express_async_handler_1.default)(async (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        data: req.user,
    });
});
/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { error } = await supabase_1.supabaseClient.auth.signOut();
    if (error) {
        logger_1.default.error(`Logout error: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: 'Logged out successfully',
    });
});
/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
exports.refreshToken = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Refresh token is required'));
    }
    const { data, error } = await supabase_1.supabaseClient.auth.refreshSession({
        refresh_token,
    });
    if (error) {
        logger_1.default.error(`Token refresh error: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, error.message));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        data: {
            user: data.user,
            session: data.session,
        },
    });
});
/**
 * @desc    Request password reset
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.requestPasswordReset = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email is required'));
    }
    const { error } = await supabase_1.supabaseClient.auth.resetPasswordForEmail(email);
    if (error) {
        logger_1.default.error(`Password reset request error for ${email}: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, error.message));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: 'Password reset email sent',
    });
});
/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { password } = req.body;
    const { token } = req.params;
    if (!password) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is required'));
    }
    if (!token) {
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Reset token is required'));
    }
    const { error } = await supabase_1.supabaseClient.auth.updateUser({
        password,
    });
    if (error) {
        logger_1.default.error(`Password reset error: ${error.message}`);
        return next(new error_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, error.message));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: 'Password reset successful',
    });
});
