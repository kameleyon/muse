import React from 'react';
import ApiSection from '../ApiSection';
import CodeBlock from '../CodeBlock';

const ApiTemplatesEndpoints: React.FC = () => {
  return (
    <ApiSection title="Templates" level={3}>
      <ApiSection title="List Templates" level={4}>
        <CodeBlock>GET /templates</CodeBlock>
        <p>Retrieve a list of available templates.</p>
        <p><strong>Query Parameters:</strong></p>
        <ul className="list-disc list-inside my-4 space-y-1">
          <li><code>category</code>: Filter by template category</li>
          <li><code>purpose</code>: Filter by template purpose</li>
          <li><code>sortBy</code>: Field to sort by (default: "popularity")</li>
          <li><code>sortOrder</code>: Sort order (default: "desc")</li>
          <li><code>page</code>: Page number (default: 1)</li>
          <li><code>limit</code>: Number of results per page (default: 20, max: 100)</li>
        </ul>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "templates": [
      {
        "templateId": "template-uuid-1",
        "name": "Investment Pitch Deck",
        "description": "Professional template for seeking investment capital",
        "category": "pitch_deck",
        "purpose": "investment",
        "thumbnailUrl": "https://magicmuse.io/templates/thumbnails/investment-pitch.jpg",
        "popularity": 4.8,
        "usageCount": 12453
      },
      {
        "templateId": "template-uuid-2",
        "name": "Sales Proposal",
        "description": "Persuasive sales proposal template with conversion-focused structure",
        "category": "proposal",
        "purpose": "sales",
        "thumbnailUrl": "https://magicmuse.io/templates/thumbnails/sales-proposal.jpg",
        "popularity": 4.7,
        "usageCount": 10289
      }
      // Additional templates
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 48,
      "totalPages": 3
    }
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T16:30:00Z"
  }
}`}</CodeBlock>
      </ApiSection>

      <ApiSection title="Create Template from Project" level={4}>
        <CodeBlock>POST /templates</CodeBlock>
        <p>Create a new template from an existing project.</p>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "projectId": "project-uuid",
  "versionId": "version-uuid",
  "name": "Enterprise Sales Proposal",
  "description": "Template optimized for enterprise software sales proposals",
  "category": "proposal",
  "purpose": "sales",
  "isPublic": false,
  "tags": ["enterprise", "software", "sales"]
}`}</CodeBlock>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "templateId": "new-template-uuid",
    "name": "Enterprise Sales Proposal",
    "description": "Template optimized for enterprise software sales proposals",
    "category": "proposal",
    "purpose": "sales",
    "isPublic": false,
    "tags": ["enterprise", "software", "sales"],
    "sourceProjectId": "project-uuid",
    "sourceVersionId": "version-uuid",
    "createdAt": "2025-04-03T17:00:00Z",
    "createdBy": "user-uuid",
    "thumbnailUrl": "https://magicmuse.io/templates/thumbnails/new-template-uuid.jpg"
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T17:00:00Z"
  }
}`}</CodeBlock>
      </ApiSection>
    </ApiSection>
  );
};

export default ApiTemplatesEndpoints;
