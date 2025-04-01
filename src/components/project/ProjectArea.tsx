import React, { useEffect } from 'react';
import PitchDeckLayout from './pitchdeck/PitchDeckLayout';
import BlogLayout from './blog/BlogLayout';
// Add future imports here as needed, e.g.:
// import ReportLayout from './report/ReportLayout';
// import StoryLayout from './story/StoryLayout';

// Define the type for the layout map keys explicitly if possible,
// otherwise use string. Using the actual project type IDs/keys is best.
// Example: type ProjectTypeKey = 'pitchdeck-investor' | 'pitchdeck-sales' | 'blog-post' | 'report-market';
// For now, we'll use string and rely on lowercase comparison.

// Define a common interface for layout components
interface LayoutProps {
  initialName?: string | null;
}

const layoutMap: Record<string, React.FC<LayoutProps>> = {
  // Map keys should ideally match the 'projectType' values stored in the database
  // or passed down. Using lowercase for robustness.
  'pitchdeck': PitchDeckLayout, // Assuming 'pitchdeck' is a possible projectType key
  'investor_pitch': PitchDeckLayout, // Example: Map specific pitch deck types if needed
  'sales_pitch': PitchDeckLayout, // Example
  'blog': BlogLayout,
  'blog_post': BlogLayout, // Example: Map specific blog types if needed
  // Add future mappings here:
  // 'report': ReportLayout,
  // 'story': StoryLayout,
  // 'email': EmailLayout,
  // ... add mappings for all expected project types
};

// Define props for ProjectArea
interface ProjectAreaProps {
  projectType?: string | null | undefined; // Type received from the parent (e.g., ProjectSetup page)
  initialName?: string | null; // Optional project name passed from parent
}

export const ProjectArea: React.FC<ProjectAreaProps> = ({ projectType, initialName }) => {
  // Log the project type for debugging
  useEffect(() => {
    console.log(`ProjectArea: Received projectType = "${projectType}"`);
  }, [projectType]);

  // Handle null or undefined projectType gracefully
  if (!projectType) {
    // Optionally render a default state or a message asking to select a project
    return <div className="p-4 text-center text-neutral-medium">Please select or load a project to see its content area.</div>;
    // Or perhaps render a default layout if applicable:
    // const DefaultLayout = SomeDefaultLayoutComponent;
    // return <DefaultLayout />;
  }

  // Find the layout component based on the projectType, converting to lowercase for case-insensitivity
  const normalizedType = projectType.toLowerCase();
  console.log(`ProjectArea: Looking for layout with normalized type = "${normalizedType}"`);
  const SelectedLayout = layoutMap[normalizedType];

  // Handle cases where the projectType doesn't match any known layout
  if (!SelectedLayout) {
    console.warn(`No layout found for project type: ${projectType}`);
    return (
      <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded">
        ⚠️ Unknown project type: <strong>{projectType}</strong>. No specific layout is configured for this type.
        <div className="mt-2 text-sm">
          Available types: {Object.keys(layoutMap).join(', ')}
        </div>
      </div>
    );
  }

  // Render the selected layout component
  console.log(`ProjectArea: Rendering layout for type "${normalizedType}"`);
  // Pass initialName prop to the layout component if provided
  // Note: The layout components may need to be updated to accept this prop
  return <SelectedLayout initialName={initialName} />;
};

// Export as default if this is the primary export of the file
export default ProjectArea;
