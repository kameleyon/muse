import React from 'react';
import BlogProjectSetupForm from './BlogProjectSetupForm';
import BlogTypeSelector from './BlogTypeSelector';
import InitializationOptions from './InitializationOptions';
import VersionControlInfo from './VersionControlInfo';
import '../../../../styles/BlogSetup.css'; // Import the specific CSS

const BlogSetupStep: React.FC = () => {
  // TODO: Add state management for setup data and step progression

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">1. Project Setup & Configuration</h2>
      <BlogProjectSetupForm />
      <BlogTypeSelector />
      <InitializationOptions />
      <VersionControlInfo />
      {/* TODO: Add navigation buttons (e.g., "Next", "Save Draft") */}
    </div>
  );
};

export default BlogSetupStep;
