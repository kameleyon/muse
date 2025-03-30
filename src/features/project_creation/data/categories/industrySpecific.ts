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
          items: [
            { id: 'internal_memo_newsletter_creation', name: 'Internal memo & newsletter creation' },
            { id: 'crisis_communication_templates', name: 'Crisis communication templates' },
            { id: 'investor_relations_content', name: 'Investor relations content' },
            { id: 'corporate_announcement_optimization', name: 'Corporate announcement optimization' },
            { id: 'employee_communication_best_practices', name: 'Employee communication best practices' },
          ],
        },
        {
          id: 'human_resources',
          name: 'Human Resources',
          items: [
            { id: 'job_description_generator', name: 'Job description generator' },
            { id: 'interview_question_development_hr', name: 'Interview question development' }, // Appended suffix
            { id: 'performance_review_language_assistance', name: 'Performance review language assistance' },
            { id: 'employee_handbook_creation', name: 'Employee handbook creation' },
            { id: 'training_material_development', name: 'Training material development' },
          ],
        },
        {
          id: 'sales_enablement',
          name: 'Sales Enablement',
          items: [
            { id: 'sales_script_development', name: 'Sales script development' },
            { id: 'objection_handling_response_creation', name: 'Objection handling response creation' },
            { id: 'followup_email_sequence_generation', name: 'Follow-up email sequence generation' },
            { id: 'sales_presentation_narrative', name: 'Sales presentation narrative' },
            { id: 'case_study_testimonial_formatting', name: 'Case study & testimonial formatting' },
          ],
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
          items: [
            { id: 'elevator_pitch_generator', name: 'Elevator pitch generator' },
            { id: 'founder_story_development', name: 'Founder story development' },
            { id: 'investment_deck_narrative', name: 'Investment deck narrative' },
            { id: 'value_proposition_refinement', name: 'Value proposition refinement' },
            { id: 'mission_vision_statement_creation', name: 'Mission & vision statement creation' },
          ],
        },
        {
          id: 'local_business',
          name: 'Local Business',
          items: [
            { id: 'local_seo_content_optimization', name: 'Local SEO content optimization' },
            { id: 'regional_audience_targeting', name: 'Regional audience targeting' },
            { id: 'community_engagement_messaging', name: 'Community engagement messaging' },
            { id: 'local_event_promotion_content', name: 'Local event promotion content' },
            { id: 'neighborhoodfocused_storytelling', name: 'Neighborhood-focused storytelling' },
          ],
        },
        {
          id: 'ecommerce',
          name: 'E-commerce',
          items: [
            { id: 'product_page_optimization', name: 'Product page optimization' },
            { id: 'collection_category_descriptions', name: 'Collection & category descriptions' },
            { id: 'abandoned_cart_recovery_messaging', name: 'Abandoned cart recovery messaging' },
            { id: 'promotional_email_campaigns', name: 'Promotional email campaigns' },
            { id: 'unboxing_experience_content', name: 'Unboxing experience content' },
          ],
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
          items: [
            { id: 'personal_bio_optimization', name: 'Personal bio optimization' },
            { id: 'thought_leadership_content_development', name: 'Thought leadership content development' },
            { id: 'expert_positioning_statements', name: 'Expert positioning statements' },
            { id: 'speaking_media_kit_creation', name: 'Speaking & media kit creation' },
            { id: 'crossplatform_persona_consistency', name: 'Cross-platform persona consistency' },
          ],
        },
        {
          id: 'content_creator_tools',
          name: 'Content Creator Tools',
          items: [
            { id: 'youtube_video_description_tag_optimization', name: 'YouTube video description & tag optimization' },
            { id: 'podcast_show_notes_episode_descriptions', name: 'Podcast show notes & episode descriptions' },
            { id: 'newsletter_template_structure', name: 'Newsletter template & structure' },
            { id: 'membership_subscription_content_planning', name: 'Membership & subscription content planning' },
            { id: 'audience_engagement_question_generation', name: 'Audience engagement question generation' },
          ],
        },
        {
          id: 'freelance_agency',
          name: 'Freelance & Agency',
          items: [
            { id: 'client_proposal_templates', name: 'Client proposal templates' },
            { id: 'service_description_optimization', name: 'Service description optimization' },
            { id: 'portfolio_presentation_content', name: 'Portfolio presentation content' },
            { id: 'client_onboarding_documentation', name: 'Client onboarding documentation' },
            { id: 'project_scope_contract_language', name: 'Project scope & contract language' },
          ],
        },
      ],
    },
  ],
};