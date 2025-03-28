import React from 'react';
import '@/styles/SidebarProject.css'; // We will create this CSS file next

const SidebarProject: React.FC = () => {
  return (
    <div className="sidebar-project-container bg-white/80 px-6 py-8 rounded-xl shadow-md border border-neutral-light">
      <h2 className="text-lg font-semibold mb-4 text-secondary">Project Sidebar</h2>
      {/* Content for the project sidebar will go here */}
      <p className="text-neutral-medium">Sidebar content placeholder.</p>
    </div>
  );
};

export default SidebarProject;