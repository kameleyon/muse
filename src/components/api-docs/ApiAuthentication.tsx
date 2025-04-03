import React from 'react';
import ApiSection from './ApiSection';
import CodeBlock from './CodeBlock';

const ApiAuthentication: React.FC = () => {
  return (
    <ApiSection title="Authentication">
      <ApiSection title="API Keys" level={3}>
        <p>
          All requests to the MagicMuse API must include an API key for authentication. API keys can be generated and managed in your MagicMuse account dashboard under Developer Settings. Include the key in the Authorization header:
        </p>
        <CodeBlock>Authorization: Bearer YOUR_API_KEY</CodeBlock>
      </ApiSection>

      <ApiSection title="Rate Limits" level={3}>
        <p>API usage is subject to rate limits based on your subscription tier:</p>
        <ul className="list-disc list-inside my-4 space-y-1">
          <li><strong>Free tier</strong>: 100 requests per day, max 10 requests per minute</li>
          <li><strong>Standard tier</strong>: 1,000 requests per day, max 60 requests per minute</li>
          <li><strong>Premium tier</strong>: 10,000 requests per day, max 300 requests per minute</li>
          <li><strong>Enterprise tier</strong>: Custom limits based on your service agreement</li>
        </ul>
        <p>Rate limit headers are included in all API responses:</p>
        <ul className="list-disc list-inside my-4 space-y-1">
          <li><code>X-RateLimit-Limit</code>: Maximum requests per time window</li>
          <li><code>X-RateLimit-Remaining</code>: Remaining requests in current window</li>
          <li><code>X-RateLimit-Reset</code>: Time when the rate limit window resets (Unix timestamp)</li>
        </ul>
      </ApiSection>
    </ApiSection>
  );
};

export default ApiAuthentication;
