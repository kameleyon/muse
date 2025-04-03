import React from 'react';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import '@/styles/api-docs.css'; // Import CSS for API docs styling

const ApiDocs: React.FC = () => {
  return (
    <div className="bg-neutral-white min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-grow pt-28 pb-20"> {/* Adjust pt based on header height */}
        <div className="container mx-auto px-4 lg:px-8 api-docs-content"> {/* Added api-docs-content class */}
          <h1 className="text-4xl font-heading text-primary mb-8 border-b border-neutral-light pb-4">MagicMuse API Documentation</h1>

          {/* Overview */}
          <h2>Overview</h2>
          <p>
            The MagicMuse API provides programmatic access to the AI-powered writing platform, enabling developers to integrate MagicMuse's content generation, enhancement, and management capabilities into their applications. This RESTful API offers endpoints for all core MagicMuse features including content creation, editing, collaboration, and export functionality.
          </p>

          {/* Authentication */}
          <h2>Authentication</h2>
          <h3>API Keys</h3>
          <p>
            All requests to the MagicMuse API must include an API key for authentication. API keys can be generated and managed in your MagicMuse account dashboard under Developer Settings. Include the key in the Authorization header:
          </p>
          <pre><code>Authorization: Bearer YOUR_API_KEY</code></pre>

          <h3>Rate Limits</h3>
          <p>API usage is subject to rate limits based on your subscription tier:</p>
          <ul>
            <li><strong>Free tier</strong>: 100 requests per day, max 10 requests per minute</li>
            <li><strong>Standard tier</strong>: 1,000 requests per day, max 60 requests per minute</li>
            <li><strong>Premium tier</strong>: 10,000 requests per day, max 300 requests per minute</li>
            <li><strong>Enterprise tier</strong>: Custom limits based on your service agreement</li>
          </ul>
          <p>Rate limit headers are included in all API responses:</p>
          <ul>
            <li><code>X-RateLimit-Limit</code>: Maximum requests per time window</li>
            <li><code>X-RateLimit-Remaining</code>: Remaining requests in current window</li>
            <li><code>X-RateLimit-Reset</code>: Time when the rate limit window resets (Unix timestamp)</li>
          </ul>

          {/* Base URL */}
          <h2>Base URL</h2>
          <p>All API requests should be made to:</p>
          <pre><code>https://api.magicmuse.io/v1</code></pre>

          {/* Request Format */}
          <h2>Request Format</h2>
          <p>The API accepts JSON-formatted request bodies and returns JSON-formatted responses. Set the following headers for all requests:</p>
          <pre><code>Content-Type: application/json
Accept: application/json
Authorization: Bearer YOUR_API_KEY</code></pre>

          {/* Response Format */}
          <h2>Response Format</h2>
          <p>All successful responses include a standard structure:</p>
          <pre><code>{`{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T12:30:45Z"
  }
}`}</code></pre>
          <p>Error responses follow this structure:</p>
          <pre><code>{`{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": { /* Additional context about the error */ }
  },
  "meta": {
    "requestId": "uuid-request-identifier",
    "timestamp": "2025-04-03T12:30:45Z"
  }
}`}</code></pre>

          {/* API Endpoints */}
          <h2>API Endpoints</h2>

          {/* Content Generation */}
          <h3>Content Generation</h3>
          <h4>Create Content</h4>
          <pre><code>POST /content/generate</code></pre>
          <p>Generate content based on specific parameters and content type.</p>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>
          <p>Content types include: <code>proposal</code>, <code>pitch_deck</code>, <code>email</code>, <code>blog_post</code>, <code>social_media</code>, <code>product_description</code>, etc.</p>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          <h4>Enhance Content</h4>
          <pre><code>POST /content/{'{contentId}'}/enhance</code></pre>
          <p>Enhance existing content with AI suggestions and improvements.</p>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
  "enhancementType": "style",
  "parameters": {
    "audience": "technical",
    "tone": "persuasive",
    "focus": "clarity"
  },
  "sections": ["section-1", "section-3"],
  "keepOriginal": true
}`}</code></pre>
          <p>Enhancement types include: <code>style</code>, <code>grammar</code>, <code>readability</code>, <code>persuasiveness</code>, <code>seo</code>, etc.</p>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          {/* Projects */}
          <h3>Projects</h3>
          <h4>Create Project</h4>
          <pre><code>POST /projects</code></pre>
          <p>Create a new project for organizing related content.</p>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          <h4>List Projects</h4>
          <pre><code>GET /projects</code></pre>
          <p>Retrieve a list of projects the authenticated user has access to.</p>
          <p><strong>Query Parameters:</strong></p>
          <ul>
            <li><code>page</code>: Page number (default: 1)</li>
            <li><code>limit</code>: Number of results per page (default: 20, max: 100)</li>
            <li><code>type</code>: Filter by project type</li>
            <li><code>status</code>: Filter by project status</li>
            <li><code>sortBy</code>: Field to sort by (default: "updatedAt")</li>
            <li><code>sortOrder</code>: Sort order (default: "desc")</li>
            <li><code>q</code>: Search query for project name or description</li>
          </ul>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          <h4>Get Project</h4>
          <pre><code>GET /projects/{'{projectId}'}</code></pre>
          <p>Retrieve details of a specific project.</p>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          {/* Version Control */}
          <h3>Version Control</h3>
          <h4>Create Version</h4>
          <pre><code>POST /projects/{'{projectId}'}/versions</code></pre>
          <p>Create a new version of a project.</p>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
  "parentVersionId": "version-uuid-1",
  "name": "Alternative Approach",
  "notes": "Created alternative messaging approach",
  "versionType": "branch"
}`}</code></pre>
          <p>Version types include: <code>increment</code> (e.g., v1.0 → v1.1), <code>major</code> (e.g., v1.0 → v2.0), <code>branch</code> (e.g., v1.0 → v1.0-alt).</p>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          <h4>Compare Versions</h4>
          <pre><code>GET /projects/{'{projectId}'}/versions/compare</code></pre>
          <p>Compare two versions of a project.</p>
          <p><strong>Query Parameters:</strong></p>
          <ul>
            <li><code>baseVersionId</code>: UUID of the base version for comparison</li>
            <li><code>compareVersionId</code>: UUID of the version to compare against the base</li>
          </ul>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          {/* Content Modules */}
          <h3>Content Modules</h3>
          <h4>Add Content Module</h4>
          <pre><code>POST /projects/{'{projectId}'}/versions/{'{versionId}'}/modules</code></pre>
          <p>Add a new content module to a project version.</p>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
  "moduleType": "section",
  "sequence": 3,
  "title": "Competitive Analysis",
  "content": "Detailed competitive analysis content...",
  "metadata": {
    "customField1": "value1",
    "customField2": "value2"
  }
}`}</code></pre>
          <p>Module types include: <code>section</code>, <code>slide</code>, <code>chart</code>, <code>table</code>, etc.</p>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          <h4>Update Content Module</h4>
          <pre><code>PUT /projects/{'{projectId}'}/versions/{'{versionId}'}/modules/{'{moduleId}'}</code></pre>
          <p>Update an existing content module.</p>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
  "title": "Updated Competitive Analysis",
  "content": "Updated competitive analysis content...",
  "sequence": 4,
  "metadata": {
    "customField1": "updated-value",
    "customField2": "value2"
  }
}`}</code></pre>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          {/* Collaboration */}
          <h3>Collaboration</h3>
          <h4>Add Team Member</h4>
          <pre><code>POST /projects/{'{projectId}'}/team</code></pre>
          <p>Add a team member to a project.</p>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
  "userId": "user-uuid",
  "email": "team@example.com",
  "role": "editor",
  "sections": ["section-uuid-1", "section-uuid-3"]
}`}</code></pre>
          <p>Roles include: <code>owner</code>, <code>admin</code>, <code>editor</code>, <code>reviewer</code>, <code>viewer</code>.</p>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          <h4>Add Comment</h4>
          <pre><code>POST /projects/{'{projectId}'}/comments</code></pre>
          <p>Add a comment to a project, version, or content module.</p>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
  "versionId": "version-uuid",
  "moduleId": "module-uuid",
  "content": "This section needs more data to support the claims.",
  "position": {
    "startOffset": 120,
    "endOffset": 145
  },
  "visibility": "team"
}`}</code></pre>
          <p>Visibility options: <code>private</code>, <code>team</code>, <code>everyone</code>.</p>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          {/* Export & Delivery */}
          <h3>Export & Delivery</h3>
          <h4>Generate Export</h4>
          <pre><code>POST /projects/{'{projectId}'}/exports</code></pre>
          <p>Create an export of a project in a specified format.</p>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>
          <p>Format options: <code>pptx</code>, <code>pdf</code>, <code>docx</code>, <code>html</code>, <code>google_slides</code>, <code>json</code>.</p>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          <h4>Get Export Status</h4>
          <pre><code>GET /projects/{'{projectId}'}/exports/{'{exportId}'}</code></pre>
          <p>Check the status of an export.</p>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          {/* Templates */}
          <h3>Templates</h3>
          <h4>List Templates</h4>
          <pre><code>GET /templates</code></pre>
          <p>Retrieve a list of available templates.</p>
          <p><strong>Query Parameters:</strong></p>
          <ul>
            <li><code>category</code>: Filter by template category</li>
            <li><code>purpose</code>: Filter by template purpose</li>
            <li><code>sortBy</code>: Field to sort by (default: "popularity")</li>
            <li><code>sortOrder</code>: Sort order (default: "desc")</li>
            <li><code>page</code>: Page number (default: 1)</li>
            <li><code>limit</code>: Number of results per page (default: 20, max: 100)</li>
          </ul>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          <h4>Create Template from Project</h4>
          <pre><code>POST /templates</code></pre>
          <p>Create a new template from an existing project.</p>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
  "projectId": "project-uuid",
  "versionId": "version-uuid",
  "name": "Enterprise Sales Proposal",
  "description": "Template optimized for enterprise software sales proposals",
  "category": "proposal",
  "purpose": "sales",
  "isPublic": false,
  "tags": ["enterprise", "software", "sales"]
}`}</code></pre>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          {/* Error Codes */}
          <h2>Error Codes</h2>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>authentication_error</code></td><td>Authentication failed or API key is invalid</td></tr>
              <tr><td><code>authorization_error</code></td><td>User is not authorized to perform the requested action</td></tr>
              <tr><td><code>rate_limit_exceeded</code></td><td>Rate limit has been exceeded</td></tr>
              <tr><td><code>invalid_request</code></td><td>Request is malformed or contains invalid parameters</td></tr>
              <tr><td><code>resource_not_found</code></td><td>The requested resource does not exist</td></tr>
              <tr><td><code>resource_conflict</code></td><td>Resource already exists or conflicts with an existing resource</td></tr>
              <tr><td><code>validation_error</code></td><td>Request validation failed</td></tr>
              <tr><td><code>server_error</code></td><td>An unexpected server error occurred</td></tr>
              <tr><td><code>service_unavailable</code></td><td>The service is temporarily unavailable</td></tr>
              <tr><td><code>feature_not_available</code></td><td>The requested feature is not available in your plan</td></tr>
            </tbody>
          </table>

          {/* Webhooks */}
          <h2>Webhooks</h2>
          <h3>Setup Webhooks</h3>
          <p>Configure webhooks to receive real-time notifications about events in your MagicMuse account.</p>
          <pre><code>POST /webhooks</code></pre>
          <p><strong>Request Body:</strong></p>
          <pre><code>{`{
  "url": "https://your-app.com/magicmuse-webhook",
  "events": [
    "project.created",
    "content.generated",
    "version.created",
    "export.completed"
  ],
  "secret": "your-webhook-secret-for-validation"
}`}</code></pre>
          <p>Event types include: <code>project.*</code>, <code>content.*</code>, <code>version.*</code>, <code>export.*</code>, <code>team.*</code>, <code>comment.*</code>.</p>
          <p><strong>Response:</strong></p>
          <pre><code>{`{
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
}`}</code></pre>

          <h3>Webhook Payload</h3>
          <p>Webhook payloads are sent as HTTP POST requests with the following format:</p>
          <pre><code>{`{
  "event": "content.generated",
  "timestamp": "2025-04-03T18:00:00Z",
  "data": {
    // Event-specific data
  },
  "signature": "sha256-hmac-signature"
}`}</code></pre>
          <p>To verify webhook authenticity, compute an HMAC using your webhook secret and the raw request body.</p>

          {/* SDKs */}
          <h2>SDKs and Client Libraries</h2>
          <p>Official MagicMuse SDKs are available for the following platforms:</p>
          <ul>
            <li><a href="https://github.com/magicmuse/magicmuse-js" target="_blank" rel="noopener noreferrer">JavaScript/TypeScript</a></li>
            <li><a href="https://github.com/magicmuse/magicmuse-python" target="_blank" rel="noopener noreferrer">Python</a></li>
            <li><a href="https://github.com/magicmuse/magicmuse-ruby" target="_blank" rel="noopener noreferrer">Ruby</a></li>
            <li><a href="https://github.com/magicmuse/magicmuse-php" target="_blank" rel="noopener noreferrer">PHP</a></li>
            <li><a href="https://github.com/magicmuse/magicmuse-java" target="_blank" rel="noopener noreferrer">Java</a></li>
            <li><a href="https://github.com/magicmuse/magicmuse-go" target="_blank" rel="noopener noreferrer">Go</a></li>
          </ul>

          {/* Support */}
          <h2>Support</h2>
          <p>
            If you encounter any issues or have questions about the MagicMuse API, please contact our developer support team at <a href="mailto:api-support@magicmuse.io">api-support@magicmuse.io</a> or visit our <a href="https://developers.magicmuse.io/forum" target="_blank" rel="noopener noreferrer">Developer Forum</a>.
          </p>
          <p>
            For detailed tutorials and examples, visit our <a href="https://developers.magicmuse.io/docs" target="_blank" rel="noopener noreferrer">Developer Documentation</a>.
          </p>

        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default ApiDocs;
