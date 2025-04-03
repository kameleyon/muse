import React from 'react';
import ApiSection from './ApiSection';
import ApiContentGenerationEndpoints from './endpoints/ApiContentGenerationEndpoints';
import ApiProjectsEndpoints from './endpoints/ApiProjectsEndpoints';
import ApiVersionControlEndpoints from './endpoints/ApiVersionControlEndpoints';
import ApiContentModulesEndpoints from './endpoints/ApiContentModulesEndpoints';
import ApiCollaborationEndpoints from './endpoints/ApiCollaborationEndpoints';
import ApiExportDeliveryEndpoints from './endpoints/ApiExportDeliveryEndpoints';
import ApiTemplatesEndpoints from './endpoints/ApiTemplatesEndpoints';

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
