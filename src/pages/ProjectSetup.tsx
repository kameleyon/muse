import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Import useLocation
import SidebarProject from '@/components/project/SidebarProject';
import ProjectArea from '@/components/project/ProjectArea';
import Loading from '@/components/common/Loading'; // Assuming Loading component exists

// Placeholder type for fetched project data
interface ProjectData {
  id: string;
  name: string;
  // Add other relevant fields if needed later
}

const ProjectSetup: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation(); // Get location object
  // Safely access projectName from state, provide default if state is null/undefined
  const initialProjectNameFromState = (location.state as { projectName?: string })?.projectName;

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
        const fetchedData: ProjectData = { id: projectId, name: fetchedName }; 
        
        setProjectData(fetchedData);
      } catch (err) {
        console.error("Failed to fetch project data:", err);
        setError("Failed to load project data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  // Add initialProjectNameFromState to dependency array if you want fetch to re-run if state changes (might not be necessary here)
  }, [projectId, initialProjectNameFromState]); 

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
      <div className="flex-grow w-full md-w-3/4"> {/* Ensure flex-grow works correctly */}
        {/* Pass initialName from fetched data (which now uses navigation state if available) */}
        <ProjectArea initialName={projectData.name} /> 
      </div>
    </div>
  );
};

export default ProjectSetup;