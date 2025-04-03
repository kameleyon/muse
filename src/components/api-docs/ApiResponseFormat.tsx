import React from 'react';
import ApiSection from './ApiSection';
import CodeBlock from './CodeBlock';

const ApiResponseFormat: React.FC = () => {
  return (
    <ApiSection title="Response Format">
      <p>All successful responses include a standard structure:</p>
      <CodeBlock>{`{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T12:30:45Z"
  }
}`}</CodeBlock>
      <p>Error responses follow this structure:</p>
      <CodeBlock>{`{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": { /* Additional context about the error */ }
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T12:30:45Z"
  }
}`}</CodeBlock>
    </ApiSection>
  );
};

export default ApiResponseFormat;
