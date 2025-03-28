"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = exports.ApiError = void 0;
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
const notFound = (req, res, next) => {
    const error = new ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, `Not Found - ${req.originalUrl}`);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';
    // Log the error
    if (statusCode === http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR) {
        logger_1.default.error(`Unhandled Error: ${err.stack}`);
    }
    else {
        logger_1.default.warn(`API Error: ${statusCode} - ${message}`);
    }
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};
exports.errorHandler = errorHandler;
