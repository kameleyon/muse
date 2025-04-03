import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const aiWorkflowSolutionsCategory: ProjectCategory = {
  id: 'aipowered_workflow_solutions',
  name: 'AI-Powered Workflow Solutions',
  subcategories: [
    {
      id: 'content_strategy',
      name: 'Content Strategy',
      sections: [
        {
          id: 'content_planning',
          name: 'Content Planning',
          // items array removed (MVP includes Topic Cluster, Gap Analysis, Basic Planning Interface)
        },
        // { // Non-MVP Section
        //   id: 'research_analysis',
        //   name: 'Research & Analysis',
        //   // items array removed
        // },
        // { // Non-MVP Section
        //   id: 'content_repurposing',
        //   name: 'Content Repurposing',
        //   // items array removed
        // },
      ],
    },
    // { // Non-MVP Subcategory
    //   id: 'collaboration_productivity',
    //   name: 'Collaboration & Productivity',
    //   sections: [
    //     {
    //       id: 'team_writing',
    //       name: 'Team Writing',
    //       // items array removed
    //     },
    //     {
    //       id: 'workflow_automation',
    //       name: 'Workflow Automation',
    //       // items array removed
    //     },
    //     {
    //       id: 'batch_processing',
    //       name: 'Batch Processing',
    //       // items array removed
    //     },
    //   ],
    // },
  ],
};
