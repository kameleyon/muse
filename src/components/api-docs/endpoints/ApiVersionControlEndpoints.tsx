import React from 'react';
import ApiSection from '../ApiSection';
import CodeBlock from '../CodeBlock';

const ApiVersionControlEndpoints: React.FC = () => {
  return (
    <ApiSection title="Version Control" level={3}>
      <ApiSection title="Create Version" level={4}>
        <CodeBlock>POST /projects/{'{projectId}'}/versions</CodeBlock>
        <p>Create a new version of a project.</p>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "parentVersionId": "version-uuid-1",
  "name": "Alternative Approach",
  "notes": "Created alternative messaging approach",
  "versionType": "branch"
}`}</CodeBlock>
        <p>Version types include: <code>increment</code> (e.g., v1.0 → v1.1), <code>major</code> (e.g., v1.0 → v2.0), <code>branch</code> (e.g., v1.0 → v1.0-alt).</p>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "versionId": "new-version-uuid",
    "projectId": "project-uuid",
    "versionNumber": "v1.0-alt",
    "parentVersionId": "version-uuid-1",
    "name": "Alternative Approach",
    "notes": "Created alternative messaging approach",
    "status": "draft",
    "createdAt": "2025-04-03T14:30:00Z",
    "createdBy": "user-uuid",
    "contentModules": [
      {
        "moduleId": "module-uuid-1",
        "moduleType": "section",
        "sequence": 1,
        "title": "Executive Summary",
        "content": "Content of the section..."
      }
      // Additional content modules
    ]
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T14:30:00Z"
  }
}`}</CodeBlock>
      </ApiSection>

      <ApiSection title="Compare Versions" level={4}>
        <CodeBlock>GET /projects/{'{projectId}'}/versions/compare</CodeBlock>
        <p>Compare two versions of a project.</p>
        <p><strong>Query Parameters:</strong></p>
        <ul className="list-disc list-inside my-4 space-y-1">
          <li><code>baseVersionId</code>: UUID of the base version for comparison</li>
          <li><code>compareVersionId</code>: UUID of the version to compare against the base</li>
        </ul>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "baseVersion": {
      "versionId": "version-uuid-1",
      "versionNumber": "v1.0",
      "createdAt": "2025-04-03T12:30:45Z"
    },
    "compareVersion": {
      "versionId": "version-uuid-2",
      "versionNumber": "v1.1",
      "createdAt": "2025-04-03T13:45:00Z"
    },
    "differences": [
      {
        "moduleId": "module-uuid-1",
        "moduleType": "section",
        "title": "Executive Summary",
        "changeType": "modified",
        "baseContent": "Original content...",
        "compareContent": "Modified content...",
        "diffDetails": [
          {
            "type": "deletion",
            "content": "removed text",
            "position": 25
          },
          {
            "type": "addition",
            "content": "added text",
            "position": 42
          }
        ]
      },
      {
        "moduleId": "module-uuid-2",
        "moduleType": "section",
        "title": "Market Analysis",
        "changeType": "added",
        "compareContent": "New section content..."
      }
      // Additional differences
    ],
    "summary": {
      "sectionsAdded": 1,
      "sectionsModified": 2,
      "sectionsRemoved": 0,
      "wordsAdded": 156,
      "wordsRemoved": 42
    }
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T14:45:00Z"
  }
}`}</CodeBlock>
      </ApiSection>
    </ApiSection>
  );
};

export default ApiVersionControlEndpoints;
