import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const customizationIntegrationCategory: ProjectCategory = {
  id: 'customization_integration',
  name: 'Customization & Integration',
  subcategories: [
    {
      id: 'platform_adaptability',
      name: 'Platform Adaptability',
      sections: [
        {
          id: 'api_technology_integration',
          name: 'API & Technology Integration',
          // items array removed
        },
        {
          id: 'workflow_integration',
          name: 'Workflow Integration',
          // items array removed
        },
        {
          id: 'custom_implementation',
          name: 'Custom Implementation',
          // items array removed
        },
      ],
    },
    {
      id: 'content_governance',
      name: 'Content Governance',
      sections: [
        {
          id: 'brand_consistency',
          name: 'Brand Consistency',
          // items array removed
        },
        {
          id: 'compliance_legal',
          name: 'Compliance & Legal',
          // items array removed
        },
        {
          id: 'quality_assurance',
          name: 'Quality Assurance',
          // items array removed
        },
      ],
    },
    {
      id: 'user_experience',
      name: 'User Experience',
      sections: [
        {
          id: 'interface_personalization',
          name: 'Interface Personalization',
          // items array removed
        },
        {
          id: 'learning_onboarding',
          name: 'Learning & Onboarding',
          // items array removed
        },
        {
          id: 'accessibility_features',
          name: 'Accessibility Features',
          // items array removed
        },
      ],
    },
  ],
};
