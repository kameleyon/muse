import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

interface Project {
  id: string;
  title: string;
  date: string;
  views: number;
  status: 'Draft' | 'Published';
}

interface RecentProjectsProps {
  projects: Project[];
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects }) => {
  return (
    <div className="py-2 ">
      
      
      {projects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left">
              <tr className="border-b border-neutral-light">
                <th className="pb-2 text-sm font-medium text-neutral-medium">Title</th>
                <th className="pb-2 text-sm font-medium text-neutral-medium">Date</th>
                <th className="pb-2 text-sm font-medium text-neutral-medium">Views</th>
                <th className="pb-2 text-sm font-medium text-neutral-medium">Status</th>
                <th className="pb-2 text-sm font-medium text-neutral-medium"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-neutral-light/40 hover:bg-neutral-light/10">
                  <td className="py-3 text-secondary">{project.title}</td>
                  <td className="py-3 text-neutral-medium text-sm">{project.date}</td>
                  <td className="py-3 text-neutral-medium text-sm">{project.views}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'Draft' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link to={`/project/${project.id}/edit`} className="text-primary hover:text-primary-hover">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-medium">No projects yet</p>
          <Button variant="primary" className="mt-4">Create New Project</Button>
        </div>
      )}
      
      <div className="mt-4">
        <Button variant="outline" fullWidth leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        }>
          Start New Project
        </Button>
      </div>
    </div>
  );
};

export default RecentProjects;
