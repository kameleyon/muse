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
const adminNotifications_1 = __importDefault(require("./routes/adminNotifications")); // Import admin notifications routes
const app = (0, express_1.default)();
const PORT = process.env.PORT || 9998; // Use environment PORT for production, 9998 for development
// Middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            ...helmet_1.default.contentSecurityPolicy.getDefaultDirectives(),
            'default-src': ["'self'"],
            'connect-src': [
                "'self'",
                'https://azaiyskdyzdhtomcwrsw.supabase.co',
                'wss://azaiyskdyzdhtomcwrsw.supabase.co',
                // Add any other domains your frontend needs to connect to, e.g., for OpenRouter API
                'https://openrouter.ai',
            ],
            'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // 'unsafe-inline' and 'unsafe-eval' might be needed for some libraries or dev tools, review if they can be removed for stricter security
            'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Allow inline styles and Google Fonts
            'font-src': ["'self'", "https://fonts.gstatic.com"], // Allow fonts from self and Google Fonts
            'img-src': ["'self'", "data:", "https://*", "*.supabase.co"], // Allow images from self, data URIs, and any Supabase domain
            'frame-src': ["'self'", "*.supabase.co"], // Allow framing from Supabase for things like captcha
        },
    },
})); // Set security HTTP headers
app.use(express_1.default.json({ limit: '50mb' })); // Parse JSON request body
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded request body
app.use((0, xss_clean_1.default)()); // Sanitize request data against XSS
app.use((0, cors_1.default)({
    origin: config_1.default.corsOrigins,
    credentials: true,
    exposedHeaders: ['X-Accel-Buffering'], // For SSE support
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
app.use('/api', adminNotifications_1.default); // Mount admin notifications routes
// Serve static files from the frontend build
if (process.env.NODE_ENV === 'production') {
    // Configure proper MIME types for static assets
    const staticOptions = {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
                res.setHeader('Content-Type', 'application/javascript');
            }
            else if (filePath.endsWith('.css')) {
                res.setHeader('Content-Type', 'text/css');
            }
            else if (filePath.endsWith('.json')) {
                res.setHeader('Content-Type', 'application/json');
            }
            else if (filePath.endsWith('.svg')) {
                res.setHeader('Content-Type', 'image/svg+xml');
            }
            else if (filePath.endsWith('.ico')) {
                res.setHeader('Content-Type', 'image/x-icon');
            }
            else if (filePath.endsWith('.png')) {
                res.setHeader('Content-Type', 'image/png');
            }
            else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
                res.setHeader('Content-Type', 'image/jpeg');
            }
            else if (filePath.endsWith('.webp')) {
                res.setHeader('Content-Type', 'image/webp');
            }
            else if (filePath.endsWith('.woff')) {
                res.setHeader('Content-Type', 'font/woff');
            }
            else if (filePath.endsWith('.woff2')) {
                res.setHeader('Content-Type', 'font/woff2');
            }
            else if (filePath.endsWith('.ttf')) {
                res.setHeader('Content-Type', 'font/ttf');
            }
            else if (filePath.endsWith('.otf')) {
                res.setHeader('Content-Type', 'font/otf');
            }
            // Set caching headers for static assets
            if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf)$/)) {
                res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
            }
        }
    };
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../dist'), staticOptions));
    // Handle React Router routes - send all non-API requests to index.html
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../../dist/index.html'));
    });
}
// Error handling middleware
app.use(error_1.notFound);
app.use(error_1.errorHandler);
// Import the Supabase initialization function
const supabase_1 = require("./services/supabase");
const run_migrations_1 = require("./utils/run-migrations");
const seed_notifications_1 = require("./utils/seed-notifications");
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
            // Seed initial notifications after migrations
            logger_1.default.info('Seeding sample notifications...');
            await (0, seed_notifications_1.seedNotifications)();
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
