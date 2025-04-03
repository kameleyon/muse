import React from 'react';
import ApiSection from '../ApiSection';
import CodeBlock from '../CodeBlock';

const ApiProjectsEndpoints: React.FC = () => {
  return (
    <ApiSection title="Projects" level={3}>
      <ApiSection title="Create Project" level={4}>
        <CodeBlock>POST /projects</CodeBlock>
        <p>Create a new project for organizing related content.</p>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "name": "Q2 Investor Pitch",
  "description": "Pitch deck for Series B funding round",
  "type": "pitch_deck",
  "tags": ["funding", "investors", "series-b"],
  "teamMembers": [
    {
      "userId": "user-uuid-1",
      "role": "editor"
    },
    {
      "userId": "user-uuid-2",
      "role": "viewer"
    }
  ]
}`}</CodeBlock>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "projectId": "new-project-uuid",
    "name": "Q2 Investor Pitch",
    "description": "Pitch deck for Series B funding round",
    "type": "pitch_deck",
    "tags": ["funding", "investors", "series-b"],
    "teamMembers": [
      {
        "userId": "user-uuid-1",
        "role": "editor"
      },
      {
        "userId": "user-uuid-2",
        "role": "viewer"
      }
    ],
    "createdAt": "2025-04-03T12:30:45Z",
    "createdBy": "owner-user-uuid",
    "currentVersionId": "version-uuid",
    "versions": [
      {
        "versionId": "version-uuid",
        "versionNumber": "v1.0",
        "createdAt": "2025-04-03T12:30:45Z",
        "createdBy": "owner-user-uuid",
        "status": "draft"
      }
    ]
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T12:30:45Z"
  }
}`}</CodeBlock>
      </ApiSection>

      <ApiSection title="List Projects" level={4}>
        <CodeBlock>GET /projects</CodeBlock>
        <p>Retrieve a list of projects the authenticated user has access to.</p>
        <p><strong>Query Parameters:</strong></p>
        <ul className="list-disc list-inside my-4 space-y-1">
          <li><code>page</code>: Page number (default: 1)</li>
          <li><code>limit</code>: Number of results per page (default: 20, max: 100)</li>
          <li><code>type</code>: Filter by project type</li>
          <li><code>status</code>: Filter by project status</li>
          <li><code>sortBy</code>: Field to sort by (default: "updatedAt")</li>
          <li><code>sortOrder</code>: Sort order (default: "desc")</li>
          <li><code>q</code>: Search query for project name or description</li>
        </ul>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "projects": [
      {
        "projectId": "project-uuid-1",
        "name": "Q2 Investor Pitch",
        "description": "Pitch deck for Series B funding round",
        "type": "pitch_deck",
        "tags": ["funding", "investors"],
        "status": "draft",
        "createdAt": "2025-04-03T12:30:45Z",
        "updatedAt": "2025-04-03T12:45:30Z"
      }
      // Additional projects
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 54,
      "totalPages": 3
    }
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T12:30:45Z"
  }
}`}</CodeBlock>
      </ApiSection>

      <ApiSection title="Get Project" level={4}>
        <CodeBlock>GET /projects/{'{projectId}'}</CodeBlock>
        <p>Retrieve details of a specific project.</p>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "projectId": "project-uuid-1",
    "name": "Q2 Investor Pitch",
    "description": "Pitch deck for Series B funding round",
    "type": "pitch_deck",
    "tags": ["funding", "investors", "series-b"],
    "status": "draft",
    "teamMembers": [
      {
        "userId": "user-uuid-1",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "editor",
        "joinedAt": "2025-04-03T12:30:45Z"
      }
      // Additional team members
    ],
    "versions": [
      {
        "versionId": "version-uuid-1",
        "versionNumber": "v1.0",
        "createdAt": "2025-04-03T12:30:45Z",
        "createdBy": "user-uuid-1",
        "status": "draft"
      },
      {
        "versionId": "version-uuid-2",
        "versionNumber": "v1.1",
        "parentVersionId": "version-uuid-1",
        "createdAt": "2025-04-03T13:45:00Z",
        "createdBy": "user-uuid-1",
        "status": "review"
      }
      // Additional versions
    ],
    "currentVersionId": "version-uuid-2",
    "createdAt": "2025-04-03T12:30:45Z",
    "updatedAt": "2025-04-03T13:45:00Z"
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T12:30:45Z"
  }
}`}</CodeBlock>
      </ApiSection>
    </ApiSection>
  );
};

export default ApiProjectsEndpoints;
