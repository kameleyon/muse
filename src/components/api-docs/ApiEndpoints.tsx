import React from 'react';
import ApiSection from './ApiSection';
import ApiContentGenerationEndpoints from './endpoints/ApiContentGenerationEndpoints.tsx';
import ApiProjectsEndpoints from './endpoints/ApiProjectsEndpoints.tsx';
import ApiVersionControlEndpoints from './endpoints/ApiVersionControlEndpoints.tsx';
import ApiContentModulesEndpoints from './endpoints/ApiContentModulesEndpoints.tsx';
import ApiCollaborationEndpoints from './endpoints/ApiCollaborationEndpoints.tsx';
import ApiExportDeliveryEndpoints from './endpoints/ApiExportDeliveryEndpoints.tsx';
import ApiTemplatesEndpoints from './endpoints/ApiTemplatesEndpoints.tsx';

const ApiEndpoints: React.FC = () => {
  return (
    <ApiSection title="API Endpoints">
      <ApiContentGenerationEndpoints />
      <ApiProjectsEndpoints />
      <ApiVersionControlEndpoints />
      <ApiContentModulesEndpoints />
      <ApiCollaborationEndpoints />
      <ApiExportDeliveryEndpoints />
      <ApiTemplatesEndpoints />
    </ApiSection>
  );
};

export default ApiEndpoints;
