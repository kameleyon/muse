import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const industrySpecificCategory: ProjectCategory = {
  id: 'industryspecific_solutions',
  name: 'Industry-Specific Solutions',
  subcategories: [
    {
      id: 'enterprise_corporate',
      name: 'Enterprise & Corporate',
      sections: [
        {
          id: 'corporate_communications',
          name: 'Corporate Communications',
          // items array removed
        },
        {
          id: 'human_resources',
          name: 'Human Resources',
          // items array removed
        },
        {
          id: 'sales_enablement',
          name: 'Sales Enablement',
          // items array removed
        },
      ],
    },
    {
      id: 'small_business_entrepreneurship',
      name: 'Small Business & Entrepreneurship',
      sections: [
        {
          id: 'startup_messaging',
          name: 'Startup Messaging',
          // items array removed
        },
        {
          id: 'local_business',
          name: 'Local Business',
          // items array removed
        },
        {
          id: 'ecommerce',
          name: 'E-commerce',
          // items array removed
        },
      ],
    },
    {
      id: 'creator_economy',
      name: 'Creator Economy',
      sections: [
        {
          id: 'personal_branding',
          name: 'Personal Branding',
          // items array removed
        },
        {
          id: 'content_creator_tools',
          name: 'Content Creator Tools',
          // items array removed
        },
        {
          id: 'freelance_agency',
          name: 'Freelance & Agency',
          // items array removed
        },
      ],
    },
  ],
};
