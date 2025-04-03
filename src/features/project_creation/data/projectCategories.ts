// src/features/project_creation/data/projectCategories.ts
// Data is now split into individual files in the ./categories/ directory

import {
  professionalWritingCategory,
  // creativeWritingCategory,
  // academicEducationalCategory,
  technicalSpecializedCategory,
  // journalismMediaCategory,
  enhancementOptimizationCategory,
  aiWorkflowSolutionsCategory,
  // industrySpecificCategory,
  // governmentPublicSectorCategory,
  // emergingTechnologiesCategory,
  // educationalLearningCategory,
  // customizationIntegrationCategory,
} from './categories'; // Import all categories

export interface ProjectItem {
  id: string;
  name: string;
}

export interface ProjectSection {
  id: string;
  name: string;
  items?: ProjectItem[]; // Made items optional
}

export interface ProjectSubcategory {
  id: string;
  name: string;
  sections: ProjectSection[];
}

export interface ProjectCategory {
  id: string;
  name: string;
  subcategories: ProjectSubcategory[];
}

// Helper function to generate snake_case IDs (remains unchanged)
const generateId = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars except space
    .trim()
    .replace(/\s+/g, '_'); // Replace spaces with underscores
};

// --- PARSED CATEGORIES START ---
// Note: Simple ID generation might create duplicates across different branches.
// Appended suffixes (_lit_review, _annot, _med, _jour, _hr, _gov, _web3, _ai, _sus, _esg, _edu) to some potentially duplicate IDs for uniqueness.
// Consider a more robust unique ID strategy for production.

// Assemble the projectCategories array from imported category objects
export const projectCategories: ProjectCategory[] = [
  professionalWritingCategory,
  // creativeWritingCategory,
  // academicEducationalCategory,
  technicalSpecializedCategory,
  // journalismMediaCategory,
  enhancementOptimizationCategory,
  aiWorkflowSolutionsCategory,
  // industrySpecificCategory,
  // governmentPublicSectorCategory,
  // emergingTechnologiesCategory,
  // educationalLearningCategory,
  // customizationIntegrationCategory,
];

// --- PARSED CATEGORIES END ---


// --- Helper functions (unchanged) ---
export const findCategoryById = (id: string): ProjectCategory | undefined =>
  projectCategories.find((cat) => cat.id === id);

export const findSubcategoryById = (
  category: ProjectCategory | undefined,
  id: string
): ProjectSubcategory | undefined =>
  category?.subcategories.find((sub) => sub.id === id);

export const findSectionById = (
  subcategory: ProjectSubcategory | undefined,
  id: string
): ProjectSection | undefined =>
  subcategory?.sections.find((sec) => sec.id === id);

export const findItemById = (
  section: ProjectSection | undefined,
  id: string
): ProjectItem | undefined => section?.items?.find((item) => item.id === id); // Added optional chaining
