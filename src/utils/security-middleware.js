/**
 * Security middleware to protect against CORS vulnerabilities in the development server
 * Specifically designed to address the esbuild CORS security issue (CVE-2024-23331)
 */

// List of allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Add any other legitimate origins here (e.g., preview environments)
];

/**
 * Middleware function to handle CORS security
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export function corsSecurityMiddleware(req, res, next) {
  const origin = req.headers?.origin;
  
  // If there's no origin header or it's in the allowed list, proceed
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    // Set proper CORS headers for allowed origins
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }
    
    next();
  } else {
    // Block non-allowed origins
    res.writeHead(403, {
      'Content-Type': 'text/plain'
    });
    res.end('CORS policy violation: Origin not allowed');
  }
}

/**
 * Middleware specifically for Event Source connections (SSE)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export function sseSecurityMiddleware(req, res, next) {
  const origin = req.headers?.origin;
  
  // Block SSE connections from non-allowed origins
  if (req.url?.includes('/esbuild') || req.headers?.accept?.includes('text/event-stream')) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      next();
    } else {
      res.writeHead(403, {
        'Content-Type': 'text/plain'
      });
      res.end('SSE connections are not permitted from this origin');
    }
  } else {
    next();
  }
}
