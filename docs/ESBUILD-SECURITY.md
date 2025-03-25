# esbuild CORS Security Vulnerability Fix

## Vulnerability Overview

A security vulnerability was discovered in esbuild (versions ≤ 0.24.2) where the development server allows any website to send requests to it and read the responses due to overly permissive CORS settings.

### What is the vulnerability?

esbuild sets `Access-Control-Allow-Origin: *` header on all requests, including Server-Sent Events (SSE) connections. This allows any website to:

1. Send requests to your local development server
2. Read source code and bundled files
3. Connect to the SSE endpoint and monitor file changes
4. Potentially access sensitive information in your project

### Attack scenario

1. A user visits a malicious website while running an esbuild development server locally
2. The malicious website executes JavaScript that sends requests to `http://localhost:8000/` or other local ports
3. Due to the permissive CORS headers, the browser allows these requests
4. The attacker can read source code, configuration files, and other sensitive information

## Solution Implemented

We've implemented a comprehensive security fix with multiple layers of protection:

### 1. Dependency Updates

- Updated esbuild to version 0.25.0 which includes the security fix
- Updated Vite to ensure it uses the secure esbuild version

### 2. CORS Security Middleware

Created a custom security middleware that:
- Explicitly defines allowed origins (`localhost`, `127.0.0.1`)
- Properly validates origin headers
- Blocks requests from unauthorized origins
- Specifically secures SSE connections

### 3. Configuration Enhancements

- Modified Vite configuration to use secure CORS settings
- Created a standalone esbuild configuration with security controls
- Added security patch script to ensure CORS protection

### 4. Additional Protection Measures

- Added `.npmrc` configuration to enforce usage of the secure esbuild version
- Implemented specific protection for SSE (Server-Sent Events) connections
- Created documentation and awareness materials

## How to Verify the Fix

To verify that the security fix is working correctly:

1. Start your development server with `npm run dev`
2. Open a browser console on a different website (or a different port)
3. Execute this test: `fetch('http://localhost:3000/src/main.js').then(r => r.text()).catch(e => console.error(e))`
4. The request should be blocked with a CORS error

## Best Practices for Development Server Security

1. Never expose development servers to public networks
2. Use specific CORS configurations that limit access to trusted origins
3. Regularly update dependencies to get security patches
4. Run development servers on non-standard ports
5. Use network isolation when possible (Docker, VM, etc.)
6. Implement proper authentication even for development environments

## References

- [esbuild security advisory](https://github.com/evanw/esbuild/security/advisories)
- [CVE-2024-23331](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-23331)
- [GitHub Dependabot alert](https://github.com/dependabot)
