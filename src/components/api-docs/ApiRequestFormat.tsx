import React from 'react';
import ApiSection from './ApiSection';
import CodeBlock from './CodeBlock';

const ApiRequestFormat: React.FC = () => {
  return (
    <ApiSection title="Request Format">
      <p>The API accepts JSON-formatted request bodies and returns JSON-formatted responses. Set the following headers for all requests:</p>
      <CodeBlock>{`Content-Type: application/json
Accept: application/json
Authorization: Bearer YOUR_API_KEY`}</CodeBlock>
    </ApiSection>
  );
};

export default ApiRequestFormat;
