// src/features/project_creation/components/SectionSelector.tsx
import React from 'react';
import { ProjectSection } from '../data/projectCategories';

interface SectionSelectorProps {
  sections: ProjectSection[];
  onSelect: (sectionId: string) => void;
  categoryName: string;
  subcategoryName: string;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({
  sections,
  onSelect,
  categoryName,
  subcategoryName,
}) => {
  return (
    <div className="selector-container">
      <h3>
        Select a Section within{' '}
        <span className="breadcrumb">{categoryName} {'>'} {subcategoryName}</span>
      </h3>
      <ul className="selector-list">
        {sections.map((section) => (
          <li
            key={section.id}
            className="selector-item"
            onClick={() => onSelect(section.id)}
          >
            {section.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionSelector;