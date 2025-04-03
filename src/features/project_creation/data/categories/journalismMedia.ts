import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const journalismMediaCategory: ProjectCategory = {
  id: 'journalism_media',
  name: 'Journalism & Media',
  subcategories: [
    {
      id: 'news_content',
      name: 'News Content',
      sections: [
        {
          id: 'news_article_structuring',
          name: 'News Article Structuring',
          // items array removed
        },
        {
          id: 'investigative_reporting',
          name: 'Investigative Reporting',
          // items array removed
        },
        {
          id: 'broadcast_script_development',
          name: 'Broadcast Script Development',
          // items array removed
        },
      ],
    },
    {
      id: 'feature_writing',
      name: 'Feature Writing',
      sections: [
        {
          id: 'longform_structure_development',
          name: 'Long-form Structure Development',
          // items array removed
        },
        {
          id: 'profile_interview_content',
          name: 'Profile & Interview Content',
          // items array removed
        },
        {
          id: 'magazine_style_content',
          name: 'Magazine Style Content',
          // items array removed
        },
      ],
    },
    {
      id: 'editorial_opinion',
      name: 'Editorial & Opinion',
      sections: [
        {
          id: 'argument_structure_development',
          name: 'Argument Structure Development',
          // items array removed
        },
        {
          id: 'commentary_analysis',
          name: 'Commentary & Analysis',
          // items array removed
        },
        {
          id: 'review_criticism',
          name: 'Review & Criticism',
          // items array removed
        },
      ],
    },
  ],
};
