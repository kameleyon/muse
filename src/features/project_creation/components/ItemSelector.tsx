// src/features/project_creation/components/ItemSelector.tsx
import React from 'react';
import { ProjectItem } from '../data/projectCategories';

interface ItemSelectorProps {
  items: ProjectItem[];
  onSelect: (itemId: string) => void;
  categoryName: string;
  subcategoryName: string;
  sectionName: string;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  items,
  onSelect,
  categoryName,
  subcategoryName,
  sectionName,
}) => {
  return (
    <div className="selector-container">
      <h3>
        Select a Project Type within{' '}
        <span className="breadcrumb">
          {categoryName} {'>'} {subcategoryName} {'>'} {sectionName}
        </span>
      </h3>
      <ul className="selector-list">
        {items.map((item) => (
          <li
            key={item.id}
            className="selector-item"
            onClick={() => onSelect(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemSelector;