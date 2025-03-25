# Security Fix: Vite Raw Query Parameter Vulnerability

## Issue Description

A security vulnerability was discovered in Vite where the `server.fs.deny` setting could be bypassed when using the `?raw` query parameter. This vulnerability allows an attacker to access files outside of the allowed directories when the Vite dev server is exposed to the network.

## Impact

This vulnerability affects applications that:
- Use Vite as a development server
- Expose the Vite dev server to the network (using `--host` or `server.host` config option)
- Have sensitive files that should not be accessible to users

## Fix Implementation

The following steps were taken to fix this vulnerability:

1. Updated Vite to version 5.4.15 which contains security patches for known vulnerabilities.

2. Enhanced `vite.config.ts` with comprehensive security configurations:
   - Implemented a custom plugin to handle raw query parameter security
   - Added strict fs.deny patterns with wildcards for better protection
   - Used case-insensitive patterns to prevent Windows-specific bypasses
   - Explicitly allowed only necessary directories

3. Added server middleware to validate raw query parameter requests against deny patterns

## Testing

A test script (`test-security.js`) has been added to verify that the security fix is working correctly. 

To test the fix:
1. Start the Vite dev server with `npm run dev`
2. Run `node test-security.js` in a separate terminal
3. Verify that the access to sensitive files with `?raw` parameter is denied with a 403 status code

## Best Practices

To maintain security in the future:

1. Regularly update Vite and other dependencies to get security patches
2. Avoid exposing the dev server to public networks
3. Keep sensitive files outside of the project directory or use strong deny patterns
4. Use the provided middleware approach to handle custom security requirements
5. Implement content security policies for production deployments

## References

- [Vite Server Options Documentation](https://vitejs.dev/config/server-options.html#server-fs-deny)
- [GitHub Advisory: server.fs.deny bypassed when using ?raw??](https://github.com/vitejs/vite/security/advisories/GHSA-x574-m823-4x7w)
