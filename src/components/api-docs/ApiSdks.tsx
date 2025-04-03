import React from 'react';
import ApiSection from './ApiSection';

const ApiSdks: React.FC = () => {
  return (
    <ApiSection title="SDKs and Client Libraries">
      <p>Official MagicMuse SDKs are available for the following platforms:</p>
      <ul className="list-disc list-inside my-4 space-y-1">
        <li><a href="https://github.com/magicmuse/magicmuse-js" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">JavaScript/TypeScript</a></li>
        <li><a href="https://github.com/magicmuse/magicmuse-python" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Python</a></li>
        <li><a href="https://github.com/magicmuse/magicmuse-ruby" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Ruby</a></li>
        <li><a href="https://github.com/magicmuse/magicmuse-php" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">PHP</a></li>
        <li><a href="https://github.com/magicmuse/magicmuse-java" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Java</a></li>
        <li><a href="https://github.com/magicmuse/magicmuse-go" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Go</a></li>
      </ul>
    </ApiSection>
  );
};

export default ApiSdks;
