"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables first, before any other imports
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Configure dotenv to load from both project root and server .env files
// Server .env takes precedence
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), './.env') });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '../.env') });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = require("express-rate-limit");
const xss_clean_1 = __importDefault(require("xss-clean"));
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("./utils/logger"));
const config_1 = __importDefault(require("./config"));
const error_1 = require("./middleware/error");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const content_1 = __importDefault(require("./routes/content"));
const user_1 = __importDefault(require("./routes/user"));
const ai_1 = __importDefault(require("./routes/ai"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes")); // Import project routes
const book_1 = __importDefault(require("./routes/book")); // Import book routes
const bookAI_1 = __importDefault(require("./routes/bookAI")); // Import book AI routes
const app = (0, express_1.default)();
const PORT = 9998; // Fixed port to avoid conflicts
// Middleware
app.use((0, helmet_1.default)()); // Set security HTTP headers
app.use(express_1.default.json({ limit: '50mb' })); // Parse JSON request body
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded request body
app.use((0, xss_clean_1.default)()); // Sanitize request data against XSS
app.use((0, cors_1.default)({
    origin: config_1.default.corsOrigins,
    credentials: true,
}));
app.use((0, morgan_1.default)('dev')); // HTTP request logger
// Rate limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/content', content_1.default);
app.use('/api/user', user_1.default);
app.use('/api/ai', ai_1.default);
app.use('/api/projects', projectRoutes_1.default); // Mount project routes
app.use('/api', book_1.default); // Mount book routes
app.use('/api', bookAI_1.default); // Mount book AI routes
// Error handling middleware
app.use(error_1.notFound);
app.use(error_1.errorHandler);
// Import the Supabase initialization function
const supabase_1 = require("./services/supabase");
const run_migrations_1 = require("./utils/run-migrations");
// Check Supabase connection before starting server
const startServer = async () => {
    // Verify Supabase connection
    logger_1.default.info('Checking Supabase connection...');
    logger_1.default.info(`Using Supabase URL: ${config_1.default.supabase.url}`);
    try {
        // Test the connection
        const { data, error } = await supabase_1.supabaseAdmin.from('projects').select('count').limit(1);
        if (error) {
            logger_1.default.error(`Supabase connection error: ${error.message}`);
            logger_1.default.error('Attempting to run migrations to create required tables...');
            // Try to run migrations
            const migrationsSuccess = await (0, run_migrations_1.runMigrations)();
            if (migrationsSuccess) {
                logger_1.default.info('Migrations completed successfully. The projects table should now exist.');
            }
            else {
                logger_1.default.error('Migrations failed. Database operations may fail.');
            }
        }
        else {
            logger_1.default.info('Supabase connection successful. Projects table exists.');
            // Still run migrations to ensure all schema changes are applied
            logger_1.default.info('Running migrations to ensure schema is up to date...');
            await (0, run_migrations_1.runMigrations)();
        }
        // Start server
        app.listen(PORT, () => {
            logger_1.default.info(`Server running in ${config_1.default.nodeEnv} mode on port ${PORT}`);
        });
    }
    catch (err) {
        logger_1.default.error(`Failed to connect to Supabase: ${err}`);
        logger_1.default.error('Server will start but database operations may fail');
        // Start server anyway
        app.listen(PORT, () => {
            logger_1.default.info(`Server running in ${config_1.default.nodeEnv} mode on port ${PORT}`);
        });
    }
};
startServer();
exports.default = app;
