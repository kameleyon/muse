// src/features/project_creation/components/SubcategorySelector.tsx
import React from 'react';
import { ProjectSubcategory } from '../data/projectCategories';

interface SubcategorySelectorProps {
  subcategories: ProjectSubcategory[];
  onSelect: (subcategoryId: string) => void;
  categoryName: string;
}

const SubcategorySelector: React.FC<SubcategorySelectorProps> = ({
  subcategories,
  onSelect,
  categoryName,
}) => {
  return (
    <div className="selector-container">
      <h3>
        Select a Subcategory within <span className="breadcrumb">{categoryName}</span>
      </h3>
      <ul className="selector-list">
        {subcategories.map((subcategory) => (
          <li
            key={subcategory.id}
            className="selector-item"
            onClick={() => onSelect(subcategory.id)}
          >
            {subcategory.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubcategorySelector;