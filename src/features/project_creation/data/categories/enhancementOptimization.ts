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
          items: [
            { id: 'tone_adjustment_formal_casual_persuasive_informative', name: 'Tone adjustment (formal, casual, persuasive, informative)' },
            { id: 'brand_voice_consistency_checker', name: 'Brand voice consistency checker' },
            { id: 'emotional_impact_analysis', name: 'Emotional impact analysis' },
            { id: 'audiencespecific_language_optimization', name: 'Audience-specific language optimization' },
            { id: 'cultural_sensitivity_review', name: 'Cultural sensitivity review' },
          ],
        },
        {
          id: 'clarity_impact',
          name: 'Clarity & Impact',
          items: [
            { id: 'readability_scoring_improvement', name: 'Readability scoring & improvement' },
            { id: 'sentence_structure_optimization', name: 'Sentence structure optimization' },
            { id: 'paragraph_flow_transition_enhancement', name: 'Paragraph flow & transition enhancement' },
            { id: 'redundancy_wordiness_elimination', name: 'Redundancy & wordiness elimination' },
            { id: 'active_voice_conversion', name: 'Active voice conversion' },
          ],
        },
        {
          id: 'seo_discoverability',
          name: 'SEO & Discoverability',
          items: [
            { id: 'keyword_integration_density_optimization', name: 'Keyword integration & density optimization' },
            { id: 'meta_description_generator', name: 'Meta description generator' },
            { id: 'header_structure_optimization', name: 'Header structure optimization' },
            { id: 'internal_linking_suggestion', name: 'Internal linking suggestion' },
            { id: 'seo_title_generator_with_clickthrough_optimization', name: 'SEO title generator with click-through optimization' },
          ],
        },
      ],
    },
    {
      id: 'specialized_enhancement',
      name: 'Specialized Enhancement',
      sections: [
        {
          id: 'localization_translation',
          name: 'Localization & Translation',
          items: [
            { id: 'cultural_context_adaptation', name: 'Cultural context adaptation' },
            { id: 'multilanguage_content_generation', name: 'Multi-language content generation' },
            { id: 'regional_dialect_idiom_consideration', name: 'Regional dialect & idiom consideration' },
            { id: 'international_seo_optimization', name: 'International SEO optimization' },
            { id: 'translation_quality_verification', name: 'Translation quality verification' },
          ],
        },
        {
          id: 'conversion_optimization',
          name: 'Conversion Optimization',
          items: [
            { id: 'calltoaction_enhancement', name: 'Call-to-action enhancement' },
            { id: 'persuasive_language_pattern_integration', name: 'Persuasive language pattern integration' },
            { id: 'urgency_scarcity_element_addition', name: 'Urgency & scarcity element addition' },
            { id: 'value_proposition_clarification', name: 'Value proposition clarification' },
            { id: 'trustbuilding_element_integration', name: 'Trust-building element integration' },
          ],
        },
        {
          id: 'ux_writing_microcopy',
          name: 'UX Writing & Microcopy',
          items: [
            { id: 'error_message_humanization', name: 'Error message humanization' },
            { id: 'onboarding_sequence_optimization', name: 'Onboarding sequence optimization' },
            { id: 'feature_description_clarity', name: 'Feature description clarity' },
            { id: 'button_interface_text_optimization', name: 'Button & interface text optimization' },
            { id: 'user_journey_narrative_development', name: 'User journey narrative development' },
          ],
        },
      ],
    },
  ],
};