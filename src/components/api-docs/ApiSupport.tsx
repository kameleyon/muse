import React from 'react';
import ApiSection from './ApiSection';

const ApiSupport: React.FC = () => {
  return (
    <ApiSection title="Support">
      <p>
        If you encounter any issues or have questions about the MagicMuse API, please contact our developer support team at <a href="mailto:api-support@magicmuse.io" className="text-accent hover:underline">api-support@magicmuse.io</a> or visit our <a href="https://developers.magicmuse.io/forum" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Developer Forum</a>.
      </p>
      <p>
        For detailed tutorials and examples, visit our <a href="https://developers.magicmuse.io/docs" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Developer Documentation</a>.
      </p>
    </ApiSection>
  );
};

export default ApiSupport;
