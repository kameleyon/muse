// src/features/project_creation/data/projectCategories.ts

export interface ProjectItem {
  id: string;
  name: string;
}

export interface ProjectSection {
  id: string;
  name: string;
  items: ProjectItem[];
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

// NOTE: This is a partial representation of the categories from docs/categories.md
// for demonstration purposes. The full list should be populated for complete functionality.
export const projectCategories: ProjectCategory[] = [
  {
    id: "professional_writing",
    name: "Professional Writing",
    subcategories: [
      {
        id: "business_documents",
        name: "Business Documents",
        sections: [
          {
            id: "proposal_pitch_deck",
            name: "Proposal & Pitch Deck Generation",
            items: [
              { id: "business_proposal", name: "Business proposal" },
              { id: "investment_pitch", name: "Investment pitch" },
              { id: "sales_proposal", name: "Sales proposal" },
              { id: "partnership_proposal", name: "Partnership proposal" },
              { id: "project_proposal", name: "Project proposal" },
              { id: "custom_proposal", name: "Custom proposal" },
            ],
          },
          {
            id: "executive_summary",
            name: "Executive Summary Creation",
            items: [
              { id: "report_summary", name: "Report summary" },
              { id: "business_plan_summary", name: "Business plan summary" },
              { id: "project_summary", name: "Project summary" },
              { id: "research_summary", name: "Research summary" },
              { id: "proposal_summary", name: "Proposal summary" },
              { id: "meeting_summary", name: "Meeting summary" },
            ],
          },
          // Add other sections from Business Documents if needed for initial testing
        ],
      },
      {
        id: "marketing_content",
        name: "Marketing Content",
        sections: [
          {
            id: "ad_copy_generator",
            name: "Ad Copy Generator",
            items: [
              { id: "social_media_ads", name: "Social media ads" },
              // ... other items
            ],
          },
          // Add other sections from Marketing Content
        ],
      },
      // Add other subcategories from Professional Writing
    ],
  },
  {
    id: "creative_writing",
    name: "Creative Writing",
    subcategories: [
      {
        id: "fiction_development",
        name: "Fiction Development",
        sections: [
          {
            id: "genre_specific_story_generators",
            name: "Genre-specific Story Generators",
            items: [
              { id: "science_fiction", name: "Science fiction" },
              // ... other items
            ],
          },
          // Add other sections from Fiction Development
        ],
      },
      // Add other subcategories from Creative Writing
    ],
  },
  // Add other top-level categories (Academic, Technical, etc.)
];

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
): ProjectItem | undefined => section?.items.find((item) => item.id === id);