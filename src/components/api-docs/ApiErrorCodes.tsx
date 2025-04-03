import React from 'react';
import ApiSection from './ApiSection';

const ApiErrorCodes: React.FC = () => {
  return (
    <ApiSection title="Error Codes">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-light border border-neutral-light rounded-md shadow-sm">
          <thead className="bg-neutral-lightest">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Code</th>
              {/* Adjusted padding */}
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-neutral-white divide-y divide-neutral-light/50">
            {/* Adjusted padding and added responsive text size */}
            <tr><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-darker"><code>authentication_error</code></td><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-dark">Authentication failed or API key is invalid</td></tr>
            <tr><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-darker"><code>authorization_error</code></td><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-dark">User is not authorized to perform the requested action</td></tr>
            <tr><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-darker"><code>rate_limit_exceeded</code></td><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-dark">Rate limit has been exceeded</td></tr>
            <tr><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-darker"><code>invalid_request</code></td><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-dark">Request is malformed or contains invalid parameters</td></tr>
            <tr><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-darker"><code>resource_not_found</code></td><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-dark">The requested resource does not exist</td></tr>
            <tr><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-darker"><code>resource_conflict</code></td><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-dark">Resource already exists or conflicts with an existing resource</td></tr>
            <tr><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-darker"><code>validation_error</code></td><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-dark">Request validation failed</td></tr>
            <tr><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-darker"><code>server_error</code></td><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-dark">An unexpected server error occurred</td></tr>
            <tr><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-darker"><code>service_unavailable</code></td><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-dark">The service is temporarily unavailable</td></tr>
            <tr><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-darker"><code>feature_not_available</code></td><td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-dark">The requested feature is not available in your plan</td></tr>
          </tbody>
        </table>
      </div>
    </ApiSection>
  );
};

export default ApiErrorCodes;
