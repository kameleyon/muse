import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const enhancementOptimizationCategory: ProjectCategory = {
  id: 'enhancement_optimization_tools',
  name: 'Enhancement & Optimization Tools',
  subcategories: [
    {
      id: 'content_refinement',
      name: 'Content Refinement',
      sections: [
        {
          id: 'style_tone',
          name: 'Style & Tone',
          // items array removed
        },
        {
          id: 'clarity_impact',
          name: 'Clarity & Impact',
          // items array removed
        },
        // { // Non-MVP Section
        //   id: 'seo_discoverability',
        //   name: 'SEO & Discoverability',
        //   // items array removed
        // },
      ],
    },
    // { // Non-MVP Subcategory
    //   id: 'specialized_enhancement',
    //   name: 'Specialized Enhancement',
    //   sections: [
    //     {
    //       id: 'localization_translation',
    //       name: 'Localization & Translation',
    //       // items array removed
    //     },
    //     {
    //       id: 'conversion_optimization',
    //       name: 'Conversion Optimization',
    //       // items array removed
    //     },
    //     {
    //       id: 'ux_writing_microcopy',
    //       name: 'UX Writing & Microcopy',
    //       // items array removed
    //     },
    //   ],
    // },
  ],
};
