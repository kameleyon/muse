// src/features/project_creation/components/NewProjectModal.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  projectCategories,
  findCategoryById,
  findSubcategoryById,
  findSectionById,
  findItemById,
  ProjectCategory,
  ProjectSubcategory,
  ProjectSection,
  ProjectItem,
} from '../data/projectCategories';
import CategorySelector from './CategorySelector.tsx';
import SubcategorySelector from './SubcategorySelector.tsx';
import SectionSelector from './SectionSelector.tsx';
import ItemSelector from './ItemSelector.tsx';
import ProjectNameInput from './ProjectNameInput.tsx';
import './NewProjectModal.css';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (details: {
    category: ProjectCategory;
    subcategory: ProjectSubcategory;
    section: ProjectSection;
    item: ProjectItem;
    projectName: string;
  }) => Promise<string | null>; // Assume it returns the new project ID or null on failure
}

type Step = 'category' | 'subcategory' | 'section' | 'item' | 'name';

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const navigate = useNavigate(); // Add useNavigate hook
  const [currentStep, setCurrentStep] = useState<Step>('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>('');

  const selectedCategory = selectedCategoryId ? findCategoryById(selectedCategoryId) : undefined;
  const selectedSubcategory = selectedSubcategoryId ? findSubcategoryById(selectedCategory, selectedSubcategoryId) : undefined;
  const selectedSection = selectedSectionId ? findSectionById(selectedSubcategory, selectedSectionId) : undefined;
  const selectedItem = selectedItemId ? findItemById(selectedSection, selectedItemId) : undefined;

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentStep('subcategory');
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
    setCurrentStep('section');
  };

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setCurrentStep('item');
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
    setCurrentStep('name');
  };

  const handleNameSubmit = async (name: string) => { // Make function async
    setProjectName(name);
    // All selections are made, call the final creation function
    if (selectedCategory && selectedSubcategory && selectedSection && selectedItem) {
      try {
        const newProjectId = await onCreateProject({ // Await the result
          category: selectedCategory,
          subcategory: selectedSubcategory,
          section: selectedSection,
          item: selectedItem,
          projectName: name,
        });

        if (newProjectId) {
          onClose(); // Close the modal first
          // Pass project name in navigation state
          navigate(`/project/${newProjectId}/setup`, { state: { projectName: name } });
        } else {
          // Handle case where creation succeeded but no ID was returned (shouldn't happen ideally)
          console.error("Project created but no ID returned.");
          resetAndClose(); // Reset and close modal
        }
      } catch (error) {
        // Handle error during project creation
        console.error("Error during project creation:", error);
        // Optionally show feedback to the user in the modal
        // For now, just reset and close
        resetAndClose();
      }
    } else {
      // Handle error case - missing selections
      console.error("Error: Missing selections for project creation.");
      resetAndClose(); // Close even on error
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'subcategory':
        setSelectedCategoryId(null);
        setCurrentStep('category');
        break;
      case 'section':
        setSelectedSubcategoryId(null);
        setCurrentStep('subcategory');
        break;
      case 'item':
        setSelectedSectionId(null);
        setCurrentStep('section');
        break;
      case 'name':
        setSelectedItemId(null);
        setCurrentStep('item');
        break;
      default:
        break; // Cannot go back from category step
    }
  };

  const resetAndClose = () => {
    setCurrentStep('category');
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    setSelectedSectionId(null);
    setSelectedItemId(null);
    setProjectName('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'category':
        return (
          <CategorySelector
            categories={projectCategories}
            onSelect={handleCategorySelect}
          />
        );
      case 'subcategory':
        return selectedCategory ? (
          <SubcategorySelector
            subcategories={selectedCategory.subcategories}
            onSelect={handleSubcategorySelect}
            categoryName={selectedCategory.name}
          />
        ) : null; // Should not happen if logic is correct
      case 'section':
        return selectedSubcategory ? (
          <SectionSelector
            sections={selectedSubcategory.sections}
            onSelect={handleSectionSelect}
            categoryName={selectedCategory?.name || ''}
            subcategoryName={selectedSubcategory.name}
          />
        ) : null; // Should not happen
      case 'item':
        return selectedSection ? (
          <ItemSelector
            items={selectedSection.items}
            onSelect={handleItemSelect}
            categoryName={selectedCategory?.name || ''}
            subcategoryName={selectedSubcategory?.name || ''}
            sectionName={selectedSection.name}
          />
        ) : null; // Should not happen
      case 'name':
        return selectedItem ? (
          <ProjectNameInput
            onSubmit={handleNameSubmit}
            categoryName={selectedCategory?.name || ''}
            subcategoryName={selectedSubcategory?.name || ''}
            sectionName={selectedSection?.name || ''}
            itemName={selectedItem.name}
          />
        ) : null; // Should not happen
      default:
        return null;
    }
  };

  const showBackButton = currentStep !== 'category';

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={resetAndClose}>
          &times;
        </button>
        {showBackButton && (
          <button className="modal-back-button" onClick={handleBack}>
            &larr; Back
          </button>
        )}
        <h2>Create New Project</h2>
        {renderStep()}
      </div>
    </div>
  );
};

export default NewProjectModal;