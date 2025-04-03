import React from 'react';
import ApiSection from './ApiSection';
import CodeBlock from './CodeBlock';

const ApiBaseUrl: React.FC = () => {
  return (
    <ApiSection title="Base URL">
      <p>All API requests should be made to:</p>
      <CodeBlock>https://api.magicmuse.io/v1</CodeBlock>
    </ApiSection>
  );
};

export default ApiBaseUrl;
