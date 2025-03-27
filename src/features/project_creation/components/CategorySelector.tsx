// src/features/project_creation/components/CategorySelector.tsx
import React from 'react';
import { ProjectCategory } from '../data/projectCategories';

interface CategorySelectorProps {
  categories: ProjectCategory[];
  onSelect: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, onSelect }) => {
  return (
    <div className="selector-container">
      <h3>Select a Category</h3>
      <ul className="selector-list">
        {categories.map((category) => (
          <li key={category.id} className="selector-item" onClick={() => onSelect(category.id)}>
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelector;