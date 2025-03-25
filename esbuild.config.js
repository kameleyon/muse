const esbuild = require('esbuild');
const http = require('http');
const path = require('path');

// Helper function to verify origin
const isAllowedOrigin = (origin) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Add any other legitimate origins here
  ];
  
  return !origin || allowedOrigins.includes(origin);
};

// Custom CORS middleware for esbuild server
const secureCorsMiddleware = async (req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if the origin is allowed
  if (!isAllowedOrigin(origin)) {
    res.writeHead(403, {
      'Content-Type': 'text/plain'
    });
    res.end('CORS policy violation: Origin not allowed');
    return;
  }
  
  // Set appropriate CORS headers for allowed origins
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
  
  // Continue with the next middleware
  next();
};

// Configure esbuild
const buildOptions = {
  entryPoints: ['src/index.ts'], // Modify as per your project
  bundle: true,
  outfile: 'dist/bundle.js',
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  target: ['es2020'],
  format: 'esm',
};

// Development server with secure CORS settings
if (process.env.NODE_ENV !== 'production') {
  esbuild.context(buildOptions).then(ctx => {
    ctx.serve({
      servedir: path.resolve(__dirname, 'dist'),
      port: 8000,
      onRequest: (args) => {
        // Create a synthetic response for middleware handling
        const res = {
          writeHead: (status, headers) => {
            args.response.status = status;
            if (headers) {
              Object.entries(headers).forEach(([key, value]) => {
                args.response.headers[key] = value;
              });
            }
          },
          setHeader: (name, value) => {
            args.response.headers[name] = value;
          },
          end: (content) => {
            args.response.body = content;
          },
        };
        
        // Apply CORS middleware
        secureCorsMiddleware(args.request, res, () => {
          console.log(`${args.request.method} ${args.request.path}`);
        });
        
        // If response headers are modified or status is set, return true
        return args.response.status === 403;
      },
    }).then(({ host, port }) => {
      console.log(`esbuild development server running at http://${host}:${port}`);
    }).catch((err) => {
      console.error('Error starting esbuild server:', err);
      process.exit(1);
    });
  });
} else {
  // Production build
  esbuild.build(buildOptions).catch(() => process.exit(1));
}
