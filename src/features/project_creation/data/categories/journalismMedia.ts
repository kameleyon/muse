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
          items: [
            { id: 'headline_optimization', name: 'Headline optimization' },
            { id: 'lead_paragraph_development', name: 'Lead paragraph development' },
            { id: 'inverted_pyramid_structure', name: 'Inverted pyramid structure' },
            { id: 'quote_integration_framework', name: 'Quote integration framework' },
            { id: 'background_context_inclusion', name: 'Background context inclusion' },
            { id: 'source_attribution_techniques', name: 'Source attribution techniques' },
            { id: 'followup_angle_suggestion', name: 'Follow-up angle suggestion' },
            { id: 'multimedia_element_recommendation', name: 'Multimedia element recommendation' },
          ],
        },
        {
          id: 'investigative_reporting',
          name: 'Investigative Reporting',
          items: [
            { id: 'research_methodology_documentation', name: 'Research methodology documentation' },
            { id: 'source_verification_framework', name: 'Source verification framework' },
            { id: 'complex_information_simplification', name: 'Complex information simplification' },
            { id: 'data_visualization_narrative_jour', name: 'Data visualization narrative' }, // Appended suffix
            { id: 'timeline_construction', name: 'Timeline construction' },
            { id: 'ethical_consideration_guidance', name: 'Ethical consideration guidance' },
            { id: 'public_interest_justification', name: 'Public interest justification' },
            { id: 'impact_assessment_framing', name: 'Impact assessment framing' },
          ],
        },
        {
          id: 'broadcast_script_development',
          name: 'Broadcast Script Development',
          items: [
            { id: 'tv_news_script_formatting', name: 'TV news script formatting' },
            { id: 'radio_news_structure', name: 'Radio news structure' },
            { id: 'podcast_episode_scripting', name: 'Podcast episode scripting' },
            { id: 'visualaudio_coordination_notes', name: 'Visual/audio coordination notes' },
            { id: 'time_segment_planning', name: 'Time segment planning' },
            { id: 'transition_phrase_creation', name: 'Transition phrase creation' },
            { id: 'interview_question_development_jour', name: 'Interview question development' }, // Appended suffix
            { id: 'audience_engagement_hooks', name: 'Audience engagement hooks' },
          ],
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
          items: [
            { id: 'narrative_arc_creation', name: 'Narrative arc creation' },
            { id: 'scene_construction_techniques', name: 'Scene construction techniques' },
            { id: 'character_development_for_nonfiction', name: 'Character development for non-fiction' },
            { id: 'thematic_throughline_establishment', name: 'Thematic through-line establishment' },
            { id: 'section_transition_crafting', name: 'Section transition crafting' },
            { id: 'opening_hook_optimization', name: 'Opening hook optimization' },
            { id: 'closing_impact_development', name: 'Closing impact development' },
            { id: 'multimedia_integration_planning', name: 'Multimedia integration planning' },
          ],
        },
        {
          id: 'profile_interview_content',
          name: 'Profile & Interview Content',
          items: [
            { id: 'subject_introduction_frameworks', name: 'Subject introduction frameworks' },
            { id: 'question_progression_structure', name: 'Question progression structure' },
            { id: 'quote_contextualizing_techniques', name: 'Quote contextualizing techniques' },
            { id: 'character_portrait_development', name: 'Character portrait development' },
            { id: 'environmental_description_integration', name: 'Environmental description integration' },
            { id: 'historical_context_weaving', name: 'Historical context weaving' },
            { id: 'impact_measurement_inclusion', name: 'Impact measurement inclusion' },
            { id: 'human_interest_angle_development', name: 'Human interest angle development' },
          ],
        },
        {
          id: 'magazine_style_content',
          name: 'Magazine Style Content',
          items: [
            { id: 'departmentspecific_formatting', name: 'Department-specific formatting' },
            { id: 'frontofbook_shortform_content', name: 'Front-of-book short-form content' },
            { id: 'feature_well_structure', name: 'Feature well structure' },
            { id: 'service_journalism_frameworks', name: 'Service journalism frameworks' },
            { id: 'specialized_column_formatting', name: 'Specialized column formatting' },
            { id: 'visual_content_narrative', name: 'Visual content narrative' },
            { id: 'sidebar_development', name: 'Sidebar development' },
            { id: 'pull_quote_selection_guidance', name: 'Pull quote selection guidance' },
          ],
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
          items: [
            { id: 'thesis_statement_formulation', name: 'Thesis statement formulation' },
            { id: 'evidence_hierarchy_organization', name: 'Evidence hierarchy organization' },
            { id: 'counterargument_anticipation', name: 'Counterargument anticipation' },
            { id: 'logical_reasoning_framework', name: 'Logical reasoning framework' },
            { id: 'emotional_appeal_integration', name: 'Emotional appeal integration' },
            { id: 'expert_opinion_incorporation', name: 'Expert opinion incorporation' },
            { id: 'calltoaction_development', name: 'Call-to-action development' },
            { id: 'reader_objection_addressing', name: 'Reader objection addressing' },
          ],
        },
        {
          id: 'commentary_analysis',
          name: 'Commentary & Analysis',
          items: [
            { id: 'news_event_contextualization', name: 'News event contextualization' },
            { id: 'historical_pattern_connection', name: 'Historical pattern connection' },
            { id: 'expert_insight_integration', name: 'Expert insight integration' },
            { id: 'policy_implication_assessment', name: 'Policy implication assessment' },
            { id: 'future_impact_prediction', name: 'Future impact prediction' },
            { id: 'multiple_perspective_presentation', name: 'Multiple perspective presentation' },
            { id: 'complex_issue_simplification', name: 'Complex issue simplification' },
            { id: 'solution_framework_proposal', name: 'Solution framework proposal' },
          ],
        },
        {
          id: 'review_criticism',
          name: 'Review & Criticism',
          items: [
            { id: 'evaluation_criteria_establishment', name: 'Evaluation criteria establishment' },
            { id: 'descriptive_analysis_framework', name: 'Descriptive analysis framework' },
            { id: 'balanced_assessment_approach', name: 'Balanced assessment approach' },
            { id: 'comparative_context_provision', name: 'Comparative context provision' },
            { id: 'cultural_impact_assessment', name: 'Cultural impact assessment' },
            { id: 'technical_element_evaluation', name: 'Technical element evaluation' },
            { id: 'audience_guidance_inclusion', name: 'Audience guidance inclusion' },
            { id: 'rating_system_implementation', name: 'Rating system implementation' },
          ],
        },
      ],
    },
  ],
};