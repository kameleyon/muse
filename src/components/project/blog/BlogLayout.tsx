// src/components/project/blog/BlogLayout.tsx
import React from 'react';
import { Card } from '@/components/ui/Card';
import '@/styles/ProjectArea.css'; // Keep styles if they apply broadly
import '@/styles/ProjectSetup.css'; // Keep styles if they apply broadly

interface BlogLayoutProps {
  initialName?: string | null;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ initialName }) => {
  return (
    <Card className="p-4">
      {/* Project Title Header - This might also move upstream depending on design */}
      <div className="p-4 border-b border-neutral-light/40 bg-gradient-to-r from-neutral-light/10 to-transparent">
         <h1 className="text-2xl font-bold font-heading text-secondary truncate">
            Blog Project Area
           {/*{projectName || "Untitled Project"}*/}
         </h1>
         <p className="text-sm text-neutral-dark font-medium">
           Category: Blog Content Generation
         </p>
       </div>
      {/* Add basic structure or placeholder content for blog projects */}
    </Card>
  );
};

export default BlogLayout;
