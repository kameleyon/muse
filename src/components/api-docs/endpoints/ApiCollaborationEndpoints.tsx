import React from 'react';
import ApiSection from '../ApiSection';
import CodeBlock from '../CodeBlock';

const ApiCollaborationEndpoints: React.FC = () => {
  return (
    <ApiSection title="Collaboration" level={3}>
      <ApiSection title="Add Team Member" level={4}>
        <CodeBlock>POST /projects/{'{projectId}'}/team</CodeBlock>
        <p>Add a team member to a project.</p>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "userId": "user-uuid",
  "email": "team@example.com",
  "role": "editor",
  "sections": ["section-uuid-1", "section-uuid-3"]
}`}</CodeBlock>
        <p>Roles include: <code>owner</code>, <code>admin</code>, <code>editor</code>, <code>reviewer</code>, <code>viewer</code>.</p>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "teamMember": {
      "userId": "user-uuid",
      "email": "team@example.com",
      "name": "Team Member",
      "role": "editor",
      "sections": ["section-uuid-1", "section-uuid-3"],
      "addedAt": "2025-04-03T15:30:00Z",
      "addedBy": "owner-user-uuid"
    }
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T15:30:00Z"
  }
}`}</CodeBlock>
      </ApiSection>

      <ApiSection title="Add Comment" level={4}>
        <CodeBlock>POST /projects/{'{projectId}'}/comments</CodeBlock>
        <p>Add a comment to a project, version, or content module.</p>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "versionId": "version-uuid",
  "moduleId": "module-uuid",
  "content": "This section needs more data to support the claims.",
  "position": {
    "startOffset": 120,
    "endOffset": 145
  },
  "visibility": "team"
}`}</CodeBlock>
        <p>Visibility options: <code>private</code>, <code>team</code>, <code>everyone</code>.</p>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "commentId": "comment-uuid",
    "projectId": "project-uuid",
    "versionId": "version-uuid",
    "moduleId": "module-uuid",
    "content": "This section needs more data to support the claims.",
    "position": {
      "startOffset": 120,
      "endOffset": 145
    },
    "visibility": "team",
    "createdAt": "2025-04-03T15:45:00Z",
    "createdBy": {
      "userId": "user-uuid",
      "name": "Comment Author",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T15:45:00Z"
  }
}`}</CodeBlock>
      </ApiSection>
    </ApiSection>
  );
};

export default ApiCollaborationEndpoints;
