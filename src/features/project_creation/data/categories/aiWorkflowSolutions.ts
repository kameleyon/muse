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
          items: [
            { id: 'content_calendar_generation', name: 'Content calendar generation' },
            { id: 'topic_cluster_development', name: 'Topic cluster development' },
            { id: 'content_gap_analysis_ai', name: 'Content gap analysis' }, // Appended suffix
            { id: 'audience_persona_content_mapping', name: 'Audience persona content mapping' },
            { id: 'competitive_content_analysis', name: 'Competitive content analysis' },
          ],
        },
        {
          id: 'research_analysis',
          name: 'Research & Analysis',
          items: [
            { id: 'topic_research_automation', name: 'Topic research automation' },
            { id: 'data_interpretation_narrative', name: 'Data interpretation narrative' },
            { id: 'trend_analysis_reporting', name: 'Trend analysis reporting' },
            { id: 'market_research_summary', name: 'Market research summary' },
            { id: 'competitor_messaging_analysis', name: 'Competitor messaging analysis' },
          ],
        },
        {
          id: 'content_repurposing',
          name: 'Content Repurposing',
          items: [
            { id: 'longform_to_social_media_adaptation', name: 'Long-form to social media adaptation' },
            { id: 'blog_to_newsletter_conversion', name: 'Blog to newsletter conversion' },
            { id: 'written_content_to_script_transformation', name: 'Written content to script transformation' },
            { id: 'content_format_transformation_article__infographic_text', name: 'Content format transformation (article → infographic text)' },
            { id: 'crossplatform_content_optimization', name: 'Cross-platform content optimization' },
          ],
        },
      ],
    },
    {
      id: 'collaboration_productivity',
      name: 'Collaboration & Productivity',
      sections: [
        {
          id: 'team_writing',
          name: 'Team Writing',
          items: [
            { id: 'style_guide_enforcement', name: 'Style guide enforcement' },
            { id: 'collaborative_editing_with_rolebased_suggestions', name: 'Collaborative editing with role-based suggestions' },
            { id: 'version_comparison_merging', name: 'Version comparison & merging' },
            { id: 'comment_feedback_integration', name: 'Comment & feedback integration' },
            { id: 'multicontributor_consistency_check', name: 'Multi-contributor consistency check' },
          ],
        },
        {
          id: 'workflow_automation',
          name: 'Workflow Automation',
          items: [
            { id: 'content_approval_process_templates', name: 'Content approval process templates' },
            { id: 'deadlinebased_content_scheduling', name: 'Deadline-based content scheduling' },
            { id: 'task_assignment_status_tracking', name: 'Task assignment & status tracking' },
            { id: 'editorial_calendar_integration', name: 'Editorial calendar integration' },
            { id: 'content_performance_tracking', name: 'Content performance tracking' },
          ],
        },
        {
          id: 'batch_processing',
          name: 'Batch Processing',
          items: [
            { id: 'multidocument_generation', name: 'Multi-document generation' },
            { id: 'templatebased_bulk_content_creation', name: 'Template-based bulk content creation' },
            { id: 'mass_personalization_of_content', name: 'Mass personalization of content' },
            { id: 'consistency_verification_across_documents', name: 'Consistency verification across documents' },
            { id: 'crosscontent_linking_references', name: 'Cross-content linking & references' },
          ],
        },
      ],
    },
  ],
};