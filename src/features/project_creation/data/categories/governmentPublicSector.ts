import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const governmentPublicSectorCategory: ProjectCategory = {
  id: 'government_public_sector',
  name: 'Government & Public Sector',
  subcategories: [
    {
      id: 'policy_documentation',
      name: 'Policy Documentation',
      sections: [
        {
          id: 'policy_brief_generation',
          name: 'Policy Brief Generation',
          // items array removed
        },
        {
          id: 'regulatory_content',
          name: 'Regulatory Content',
          // items array removed
        },
        {
          id: 'legislative_summaries',
          name: 'Legislative Summaries',
          // items array removed
        },
      ],
    },
    {
      id: 'civic_engagement',
      name: 'Civic Engagement',
      sections: [
        {
          id: 'public_consultation_material',
          name: 'Public Consultation Material',
          // items array removed
        },
        {
          id: 'citizen_information_campaigns',
          name: 'Citizen Information Campaigns',
          // items array removed
        },
        {
          id: 'community_outreach_messaging',
          name: 'Community Outreach Messaging',
          // items array removed
        },
      ],
    },
  ],
};
