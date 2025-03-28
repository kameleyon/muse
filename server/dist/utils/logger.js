"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const config_1 = __importDefault(require("../config"));
const { combine, timestamp, printf, colorize } = winston_1.default.format;
// Custom format function
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
const logger = winston_1.default.createLogger({
    level: config_1.default.logLevel,
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        // Write all logs with level 'error' and below to 'error.log'
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Write all logs to 'combined.log'
        new winston_1.default.transports.File({ filename: 'logs/combined.log' }),
    ],
});
// If we're not in production, also log to the console with color
if (config_1.default.nodeEnv !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    }));
}
exports.default = logger;
