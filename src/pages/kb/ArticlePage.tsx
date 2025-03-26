// src/pages/kb/ArticlePage.tsx
import React, { useState, useEffect } from 'react';
import { KBArticle } from '../../features/kb'; // Assuming index file setup

// Placeholder markdown content
const placeholderContent = `
# Getting Started with MagicMuse

Welcome to the MagicMuse knowledge base!

## What is MagicMuse?

MagicMuse is an AI-powered writing companion designed to help you create amazing content faster and more effectively.

## Key Features

*   **AI Suggestions:** Get real-time suggestions for grammar, style, and tone.
*   **Content Generation:** Let the AI help you brainstorm ideas or draft sections.
*   **Collaboration:** Work with your team seamlessly.

## Next Steps

1.  Explore the editor interface.
2.  Try generating some content.
3.  Invite your team members.

> Remember to save your work frequently!

\`\`\`javascript
// Example code block
function greet(name) {
  console.log(\\\`Hello, \\\${name}!\\\`);
}
\`\`\`

For more details, check out our other articles.
`;

export const ArticlePage: React.FC = () => {
  // In a real app, you'd fetch content based on route params (e.g., useParams from react-router-dom)
  const [articleContent, setArticleContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching article content
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      // Replace this with actual fetch logic (e.g., fetch('/api/kb/getting-started.md'))
      setArticleContent(placeholderContent);
      setLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, []); // Fetch once on mount

  if (loading) {
    return <div className="p-4">Loading article...</div>;
  }

  if (error) {
    return <div className="p-4 text-error">Error loading article: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Add breadcrumbs or navigation here if needed */}
      <KBArticle content={articleContent} />
    </div>
  );
};

export default ArticlePage;