import React, { useState, useEffect, lazy, Suspense } from 'react'; // Added lazy and Suspense here
import { Link } from 'react-router-dom';
import { getAllProjectsAPI } from '@/services/projectService';
import { Project } from '@/services/projectService'; // Assuming Project type is exported
import { format } from 'date-fns'; // For date formatting
import { Button } from '@/components/ui/Button'; // Corrected casing
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'; // Corrected casing
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'; // Corrected casing
import { Badge } from '@/components/ui/Badge'; // Corrected casing
import { Edit3 } from 'lucide-react'; // Icon for edit
// Removed duplicate React import below
import Loading from '@/components/common/Loading'; // Import Loading component

// Lazy load the modal
const NewProjectModal = lazy(() => import('@/features/project_creation/components/NewProjectModal'));
import {
  ProjectCategory,
  ProjectSubcategory,
  ProjectSection,
} from '@/features/project_creation/data/projectCategories'; // Import types needed for handleCreateProject

// Removed local RecentProjectDisplay interface

const RecentProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]); // Use imported Project type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Define fetch function outside useEffect to make it callable
  const fetchRecentProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch the 5 most recently updated projects
      const result = await getAllProjectsAPI({ limit: 5, sortBy: 'updated_at', sortOrder: 'desc' });
      if (result && result.projects) {
        // Removed simulation logic
        setProjects(result.projects); // Set projects directly from API result
      } else {
        setError('Failed to fetch recent projects.');
      }
    } catch (err) {
      console.error("Error fetching recent projects:", err);
      setError('An error occurred while fetching projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentProjects(); // Call on initial mount
  }, []); // Empty dependency array means run once on mount

  // Correctly placed formatDate function
  const formatDate = (dateString: string) => {
    try {
      // Format date like: April 3rd 2025
      // Removed duplicated fetch logic from here
      return format(new Date(dateString), "MMMM do yyyy");
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  // --- Modal Handlers (copied from WelcomeSection) ---
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateProject = async (details: {
    category: ProjectCategory;
    subcategory: ProjectSubcategory;
    section: ProjectSection;
    projectName: string;
  }): Promise<string | null> => {
    console.log('Creating project from RecentProjects with details:', details);
    // TODO: Ideally, this logic should be centralized or passed down if needed elsewhere.
    // For now, replicating the simulation from WelcomeSection.
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation
      const newProjectId = `proj_${Date.now()}`;
      console.log(`Simulated creation, got ID: ${newProjectId}`);
      handleCloseModal();
      fetchRecentProjects(); // Re-fetch projects after closing modal
      // Optionally navigate to the new project page
      // navigate(`/project/${newProjectId}`);
      return newProjectId;
    } catch (error) {
      console.error("Simulated project creation failed:", error);
      handleCloseModal();
      return null;
    }
  };
  // --- End Modal Handlers ---


  return (
    <> {/* Wrap in Fragment to include Modal */}
      <Card className="w-full bornder-0 border-transparent shadow-0 shadow-transparent text-xl ">
        
      <CardContent>
        {loading && <p>Loading recent projects...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow key="header-row">
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead className="w-[30%]">Date</TableHead>
                  <TableHead className="w-[20%]">Status</TableHead>
                  <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium text-base">{project.name}</TableCell>
                      <TableCell className="text-base">{formatDate(project.updated_at)}</TableCell>
                      <TableCell className="text-base">
                        <Badge variant={project.status === 'Published' ? 'default' : 'secondary'}>
                          {project.status ?? 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/project/${project.id}/edit`} title="Edit Project">
                            <Edit3 className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow key="no-projects-row"> {/* Added static key */}
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No recent projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="mt-6 text-center">
              {/* Changed Link to Button with onClick handler */}
              <Button variant="outline" onClick={handleOpenModal}>
                + Start New Project
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>

    {/* --- Render Modal --- */}
    <Suspense fallback={<Loading />}>
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateProject={handleCreateProject}
      />
    </Suspense>
    {/* --- End Render Modal --- */}
    </>
  );
};

export default RecentProjects;
