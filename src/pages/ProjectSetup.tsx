//src/pages/ProjectSetup.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Import useLocation
import SidebarProject from '@/components/project/SidebarProject';
import ProjectArea from '@/components/project/ProjectArea';
import Loading from '@/components/common/Loading'; // Assuming Loading component exists

// Placeholder type for fetched project data
interface ProjectData {
  id: string;
  name: string;
  projectType: string; // Add projectType field
}

const ProjectSetup: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation(); // Get location object
  // Safely access state, provide defaults if state is null/undefined
  const locationState = location.state as { projectName?: string; projectType?: string } | null;
  const initialProjectNameFromState = locationState?.projectName;
  const initialProjectTypeFromState = locationState?.projectType; // Get projectType from state

  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError("Project ID is missing from URL");
      setIsLoading(false);
      return;
    }

    const fetchProjectData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call to fetch project data by projectId
        console.log(`Fetching data for project: ${projectId}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        // Use the name from navigation state if available, otherwise generate placeholder
        const fetchedName = initialProjectNameFromState || `Project ${projectId.substring(0, 5)}...`;
        
        // IMPORTANT: Get the project type from state or try to determine from URL/query params
        // This is critical for loading the correct layout
        let fetchedType = initialProjectTypeFromState;
        
        // If no type in state, check if we can determine it from other sources
        // For example, you might extract it from URL path segments or query parameters
        if (!fetchedType) {
          // Instead of defaulting to a specific type, set an error
          setError("Project type is missing. Cannot set up project correctly.");
          setIsLoading(false);
          return; // Exit early from useEffect
        }
        
        console.log(`ProjectSetup: Using projectType: ${fetchedType} (from state: ${initialProjectTypeFromState})`);
        const fetchedData: ProjectData = { id: projectId, name: fetchedName, projectType: fetchedType };

        setProjectData(fetchedData);
      } catch (err) {
        console.error("Failed to fetch project data:", err);
        setError("Failed to load project data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  // Add dependencies from state if fetch should re-run when they change
  }, [projectId, initialProjectNameFromState, initialProjectTypeFromState]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">{error}</div>;
  }

  if (!projectData) {
     // This case might happen if fetch fails but doesn't throw an error handled above
    return <div className="container mx-auto p-4">Project not found or failed to load.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row py-4 gap-6 px-0 md:px-0">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 flex-shrink-0">
        {/* Pass projectId if SidebarProject needs it later */}
        <SidebarProject /> 
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full md:w-3/4"> {/* Ensure flex-grow works correctly */}
        {/* Pass projectType AND initialName from fetched data */}
        <ProjectArea projectType={projectData.projectType} initialName={projectData.name} />
      </div>
    </div>
  );
};

export default ProjectSetup;
