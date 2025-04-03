import React from 'react';
import ApiSection from '../ApiSection';
import CodeBlock from '../CodeBlock';

const ApiContentModulesEndpoints: React.FC = () => {
  return (
    <ApiSection title="Content Modules" level={3}>
      <ApiSection title="Add Content Module" level={4}>
        <CodeBlock>POST /projects/{'{projectId}'}/versions/{'{versionId}'}/modules</CodeBlock>
        <p>Add a new content module to a project version.</p>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "moduleType": "section",
  "sequence": 3,
  "title": "Competitive Analysis",
  "content": "Detailed competitive analysis content...",
  "metadata": {
    "customField1": "value1",
    "customField2": "value2"
  }
}`}</CodeBlock>
        <p>Module types include: <code>section</code>, <code>slide</code>, <code>chart</code>, <code>table</code>, etc.</p>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "moduleId": "new-module-uuid",
    "projectId": "project-uuid",
    "versionId": "version-uuid",
    "moduleType": "section",
    "sequence": 3,
    "title": "Competitive Analysis",
    "content": "Detailed competitive analysis content...",
    "metadata": {
      "customField1": "value1",
      "customField2": "value2"
    },
    "createdAt": "2025-04-03T15:00:00Z"
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T15:00:00Z"
  }
}`}</CodeBlock>
      </ApiSection>

      <ApiSection title="Update Content Module" level={4}>
        <CodeBlock>PUT /projects/{'{projectId}'}/versions/{'{versionId}'}/modules/{'{moduleId}'}</CodeBlock>
        <p>Update an existing content module.</p>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "title": "Updated Competitive Analysis",
  "content": "Updated competitive analysis content...",
  "sequence": 4,
  "metadata": {
    "customField1": "updated-value",
    "customField2": "value2"
  }
}`}</CodeBlock>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "moduleId": "module-uuid",
    "projectId": "project-uuid",
    "versionId": "version-uuid",
    "moduleType": "section",
    "sequence": 4,
    "title": "Updated Competitive Analysis",
    "content": "Updated competitive analysis content...",
    "metadata": {
      "customField1": "updated-value",
      "customField2": "value2"
    },
    "updatedAt": "2025-04-03T15:15:00Z"
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T15:15:00Z"
  }
}`}</CodeBlock>
      </ApiSection>
    </ApiSection>
  );
};

export default ApiContentModulesEndpoints;
