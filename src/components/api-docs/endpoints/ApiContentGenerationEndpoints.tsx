import React from 'react';
import ApiSection from '../ApiSection';
import CodeBlock from '../CodeBlock';

const ApiContentGenerationEndpoints: React.FC = () => {
  return (
    <ApiSection title="Content Generation" level={3}>
      <ApiSection title="Create Content" level={4}>
        <CodeBlock>POST /content/generate</CodeBlock>
        <p>Generate content based on specific parameters and content type.</p>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "projectId": "optional-existing-project-id",
  "contentType": "proposal",
  "parameters": {
    "audience": "investors",
    "industry": "technology",
    "tone": "professional",
    "length": "medium",
    "includeVisuals": true
  },
  "customInstructions": "Optional additional instructions or context",
  "templateId": "optional-template-id"
}`}</CodeBlock>
        <p>Content types include: <code>proposal</code>, <code>pitch_deck</code>, <code>email</code>, <code>blog_post</code>, <code>social_media</code>, <code>product_description</code>, etc.</p>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "contentId": "generated-content-uuid",
    "projectId": "associated-project-id",
    "content": {
      "sections": [
        {
          "id": "section-1",
          "title": "Executive Summary",
          "content": "Content of the executive summary section...",
          "type": "text"
        },
        {
          "id": "section-2",
          "title": "Problem Statement",
          "content": "Description of the problem being addressed...",
          "type": "text"
        }
        // Additional sections
      ],
      "metadata": {
        "wordCount": 1250,
        "readingTime": "5 minutes",
        "qualityScore": 85
      }
    },
    "createdAt": "2025-04-03T12:30:45Z"
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T12:30:45Z"
  }
}`}</CodeBlock>
      </ApiSection>

      <ApiSection title="Enhance Content" level={4}>
        <CodeBlock>POST /content/{'{contentId}'}/enhance</CodeBlock>
        <p>Enhance existing content with AI suggestions and improvements.</p>
        <p><strong>Request Body:</strong></p>
        <CodeBlock>{`{
  "enhancementType": "style",
  "parameters": {
    "audience": "technical",
    "tone": "persuasive",
    "focus": "clarity"
  },
  "sections": ["section-1", "section-3"],
  "keepOriginal": true
}`}</CodeBlock>
        <p>Enhancement types include: <code>style</code>, <code>grammar</code>, <code>readability</code>, <code>persuasiveness</code>, <code>seo</code>, etc.</p>
        <p><strong>Response:</strong></p>
        <CodeBlock>{`{
  "success": true,
  "data": {
    "enhancedContentId": "enhanced-content-uuid",
    "originalContentId": "original-content-id",
    "enhancedSections": [
      {
        "id": "section-1",
        "original": "Original content of section 1...",
        "enhanced": "Enhanced content with improved style...",
        "changes": [
          {
            "type": "replacement",
            "original": "suboptimal phrase",
            "replacement": "improved phrasing",
            "reason": "More persuasive tone"
          }
          // Additional changes
        ]
      }
      // Additional enhanced sections
    ],
    "metadata": {
      "enhancementScore": 18,
      "readabilityImprovement": "+12%"
    }
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

export default ApiContentGenerationEndpoints;
