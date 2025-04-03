import React from 'react';
import ApiSection from './ApiSection';

const ApiOverview: React.FC = () => {
  return (
    <ApiSection title="Overview">
      <p>
        The MagicMuse API provides programmatic access to the AI-powered writing platform, enabling developers to integrate MagicMuse's content generation, enhancement, and management capabilities into their applications. This RESTful API offers endpoints for all core MagicMuse features including content creation, editing, collaboration, and export functionality.
      </p>
    </ApiSection>
  );
};

export default ApiOverview;
