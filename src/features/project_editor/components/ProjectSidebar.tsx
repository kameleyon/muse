// src/features/project_editor/components/ProjectSidebar.tsx
import React from 'react';
import { Project, ContentModule, Version } from '@/services/projectService'; // Import types
import { formatDistanceToNow } from 'date-fns'; // For relative time formatting
import './ProjectSidebar.css'; // We'll create this next

interface ProjectSidebarProps {
  project: Project | null;
  module: ContentModule | null; // Assuming single module for now
  versions: Version[];
  currentVersionId: string | null;
  onSelectVersion: (versionId: string) => void; // Callback when a version is clicked
  // Add callbacks for other actions later (new version, rename, etc.)
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  project,
  module,
  versions,
  currentVersionId,
  onSelectVersion,
}) => {

  const formatRelativeDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString; // Fallback to original string
    }
  };

  return (
    <div className="project-sidebar shadow-sm sm:shadow-md hover:shadow-lg transition-shadow mb-4 lg:mb-6 sticky rounded-xl bg-white/80 mt-8 px-6">
      {/* Project Info */}
      {project && (
        <div className="sidebar-section">
          <h3 className="sidebar-project-title pt-10 ">{project.project_name}</h3>
          {/* Add other project details or actions if needed */}
        </div>
      )}

      {/* Module Info (assuming one module for pitch deck) */}
      {module && (
        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Module</h4>
          <div className="sidebar-module-name">{module.module_name}</div>
          {/* Add module actions if needed */}
        </div>
      )}

      {/* Version List */}
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Versions</h4>
        {versions.length === 0 && <p className="sidebar-no-items">No versions found.</p>}
        <ul className="sidebar-list">
          {versions.map((version) => (
            <li
              key={version.version_id}
              className={`sidebar-list-item ${version.version_id === currentVersionId ? 'active' : ''}`}
              onClick={() => onSelectVersion(version.version_id)}
              title={`Created ${formatRelativeDate(version.creation_date)}`}
            >
              <span className="version-number">V{version.version_number}</span>
              <span className="version-name">{version.version_name}</span>
              <span className="version-status">{version.approval_status}</span>
              {/* Add creator/timestamp later if needed */}
            </li>
          ))}
        </ul>
        {/* Add "New Version" button here later */}
      </div>

      {/* Components Section (Placeholder) */}
      {/* <div className="sidebar-section">
        <h4 className="sidebar-section-title">Components</h4>
        <p className="sidebar-no-items">Reusable components coming soon.</p>
      </div> */}
    </div>
  );
};

export default ProjectSidebar;