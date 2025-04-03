import React from 'react';
import ApiSection from '../ApiSection';
import CodeBlock from '../CodeBlock';

const ApiExportDeliveryEndpoints: React.FC = () => {
  return (
    <ApiSection title="Export & Delivery" level={3}>
      <ApiSection title="Generate Export" level={4}>
        <CodeBlock>POST /projects/{'{projectId}'}/exports</CodeBlock>
        <p>Create an export of a project in a specified format.</p>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "versionId": "version-uuid",
  "format": "pptx",
  "options": {
    "includeSpeakerNotes": true,
    "includeAppendix": true,
    "branding": {
      "logoUrl": "https://example.com/logo.png",
      "primaryColor": "#123456",
      "secondaryColor": "#654321",
      "fontFamily": "Montserrat"
    },
    "sections": ["section-uuid-1", "section-uuid-2"]
  }
}`}</CodeBlock>
        <p>Format options: <code>pptx</code>, <code>pdf</code>, <code>docx</code>, <code>html</code>, <code>google_slides</code>, <code>json</code>.</p>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "exportId": "export-uuid",
    "projectId": "project-uuid",
    "versionId": "version-uuid",
    "format": "pptx",
    "status": "processing",
    "progress": 0,
    "options": {
      "includeSpeakerNotes": true,
      "includeAppendix": true,
      "branding": {
        "logoUrl": "https://example.com/logo.png",
        "primaryColor": "#123456",
        "secondaryColor": "#654321",
        "fontFamily": "Montserrat"
      },
      "sections": ["section-uuid-1", "section-uuid-2"]
    },
    "createdAt": "2025-04-03T16:00:00Z"
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T16:00:00Z"
  }
}`}</CodeBlock>
      </ApiSection>

      <ApiSection title="Get Export Status" level={4}>
        <CodeBlock>GET /projects/{'{projectId}'}/exports/{'{exportId}'}</CodeBlock>
        <p>Check the status of an export.</p>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "exportId": "export-uuid",
    "projectId": "project-uuid",
    "versionId": "version-uuid",
    "format": "pptx",
    "status": "completed",
    "progress": 100,
    "fileUrl": "https://magicmuse.io/exports/export-uuid.pptx",
    "fileSize": 2456789,
    "expiresAt": "2025-04-10T16:00:00Z",
    "createdAt": "2025-04-03T16:00:00Z",
    "completedAt": "2025-04-03T16:02:30Z"
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T16:10:00Z"
  }
}`}</CodeBlock>
      </ApiSection>
    </ApiSection>
  );
};

export default ApiExportDeliveryEndpoints;
