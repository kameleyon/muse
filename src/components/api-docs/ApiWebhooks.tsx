import React from 'react';
import ApiSection from './ApiSection';
import CodeBlock from './CodeBlock';

const ApiWebhooks: React.FC = () => {
  return (
    <ApiSection title="Webhooks">
      <ApiSection title="Setup Webhooks" level={3}>
        <p>Configure webhooks to receive real-time notifications about events in your MagicMuse account.</p>
        <CodeBlock>POST /webhooks</CodeBlock>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "url": "https://your-app.com/magicmuse-webhook",
  "events": [
    "project.created",
    "content.generated",
    "version.created",
    "export.completed"
  ],
  "secret": "your-webhook-secret-for-validation"
}`}</CodeBlock>
        <p>Event types include: <code>project.*</code>, <code>content.*</code>, <code>version.*</code>, <code>export.*</code>, <code>team.*</code>, <code>comment.*</code>.</p>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "webhookId": "webhook-uuid",
    "url": "https://your-app.com/magicmuse-webhook",
    "events": [
      "project.created",
      "content.generated",
      "version.created",
      "export.completed"
    ],
    "createdAt": "2025-04-03T17:30:00Z",
    "status": "active"
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T17:30:00Z"
  }
}`}</CodeBlock>
      </ApiSection>

      <ApiSection title="Webhook Payload" level={3}>
        <p>Webhook payloads are sent as HTTP POST requests with the following format:</p>
        <CodeBlock>{`{
  "event": "content.generated",
  "timestamp": "2025-04-03T18:00:00Z",
  "data": {
    // Event-specific data
  },
  "signature": "sha256-hmac-signature"
}`}</CodeBlock>
        <p>To verify webhook authenticity, compute an HMAC using your webhook secret and the raw request body.</p>
      </ApiSection>
    </ApiSection>
  );
};

export default ApiWebhooks;
