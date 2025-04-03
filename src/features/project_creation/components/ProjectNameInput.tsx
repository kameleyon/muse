// src/features/project_creation/components/ProjectNameInput.tsx
import React, { useState } from 'react';

interface ProjectNameInputProps {
  onSubmit: (projectName: string) => void;
  categoryName: string;
  subcategoryName: string;
  sectionName: string;
  itemName?: string; // Made itemName optional
}

const ProjectNameInput: React.FC<ProjectNameInputProps> = ({
  onSubmit,
  categoryName,
  subcategoryName,
  sectionName,
  // itemName, // No longer needed for display logic
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="selector-container">
      <h3>Enter Project Name</h3>
      <p className="breadcrumb-final">
        Selected Path: {categoryName} {'>'} {subcategoryName} {'>'} {sectionName}
      </p>
      <form onSubmit={handleSubmit} className="project-name-form">
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., My Awesome Project"
          required
          autoFocus
        />
        <button type="submit" className="submit-button">
          Create Project
        </button>
      </form>
    </div>
  );
};

export default ProjectNameInput;
