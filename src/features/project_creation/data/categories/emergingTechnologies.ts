import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const emergingTechnologiesCategory: ProjectCategory = {
  id: 'emerging_technologies',
  name: 'Emerging Technologies',
  subcategories: [
    {
      id: 'blockchain_web3',
      name: 'Blockchain & Web3',
      sections: [
        {
          id: 'whitepaper_development_assistance',
          name: 'Whitepaper Development Assistance',
          // items array removed
        },
        {
          id: 'community_documentation',
          name: 'Community Documentation',
          // items array removed
        },
        {
          id: 'technical_content_simplification_web3',
          name: 'Technical Content Simplification', // Appended suffix to section ID
          // items array removed
        },
      ],
    },
    {
      id: 'ai_technology',
      name: 'AI & Technology',
      sections: [
        {
          id: 'ai_capability_explanation',
          name: 'AI Capability Explanation',
          // items array removed
        },
        {
          id: 'technical_documentation_for_nontechnical_audiences',
          name: 'Technical Documentation for Non-technical Audiences',
          // items array removed
        },
        {
          id: 'ethical_ai_content',
          name: 'Ethical AI Content',
          // items array removed
        },
      ],
    },
    {
      id: 'sustainability_green_tech',
      name: 'Sustainability & Green Tech',
      sections: [
        {
          id: 'environmental_impact_reporting',
          name: 'Environmental Impact Reporting',
          // items array removed
        },
        {
          id: 'sustainability_initiative_documentation',
          name: 'Sustainability Initiative Documentation',
          // items array removed
        },
        {
          id: 'esg_reporting',
          name: 'ESG Reporting',
          // items array removed
        },
      ],
    },
  ],
};
