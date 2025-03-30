import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const academicEducationalCategory: ProjectCategory = {
  id: 'academic_educational',
  name: 'Academic & Educational',
  subcategories: [
    {
      id: 'research_writing',
      name: 'Research Writing',
      sections: [
        {
          id: 'hypothesis_formulation_research_question_development',
          name: 'Hypothesis Formulation & Research Question Development',
          items: [
            { id: 'problem_statement_creation', name: 'Problem statement creation' },
            { id: 'research_gap_identification', name: 'Research gap identification' },
            { id: 'variable_relationship_exploration', name: 'Variable relationship exploration' },
            { id: 'testable_hypothesis_structuring', name: 'Testable hypothesis structuring' },
            { id: 'research_question_hierarchy', name: 'Research question hierarchy' },
            { id: 'scope_limitation_techniques', name: 'Scope limitation techniques' },
            { id: 'interdisciplinary_connection', name: 'Interdisciplinary connection' },
            { id: 'research_significance_articulation', name: 'Research significance articulation' },
          ],
        },
        {
          id: 'literature_review_organization_synthesis',
          name: 'Literature Review Organization & Synthesis',
          items: [
            { id: 'thematic_organization', name: 'Thematic organization' },
            { id: 'chronological_development', name: 'Chronological development' },
            { id: 'methodological_comparison', name: 'Methodological comparison' },
            { id: 'research_gap_identification_lit_review', name: 'Research gap identification' }, // Appended suffix for uniqueness
            { id: 'theoretical_framework_connection', name: 'Theoretical framework connection' },
            { id: 'source_categorization', name: 'Source categorization' },
            { id: 'consensus_vs_controversy_mapping', name: 'Consensus vs. controversy mapping' },
            { id: 'synthesis_paragraph_construction', name: 'Synthesis paragraph construction' },
          ],
        },
        {
          id: 'methodology_description_templates',
          name: 'Methodology Description Templates',
          items: [
            { id: 'quantitative_research_design', name: 'Quantitative research design' },
            { id: 'qualitative_approach_documentation', name: 'Qualitative approach documentation' },
            { id: 'mixed_methods_framework', name: 'Mixed methods framework' },
            { id: 'sampling_strategy_explanation', name: 'Sampling strategy explanation' },
            { id: 'data_collection_procedure_documentation', name: 'Data collection procedure documentation' },
            { id: 'instrument_validation_description', name: 'Instrument validation description' },
            { id: 'ethical_consideration_section', name: 'Ethical consideration section' },
            { id: 'limitations_articulation', name: 'Limitations articulation' },
          ],
        },
        {
          id: 'results_analysis_narrative_structure',
          name: 'Results Analysis Narrative Structure',
          items: [
            { id: 'data_visualization_text_description', name: 'Data visualization text description' },
            { id: 'statistical_analysis_explanation', name: 'Statistical analysis explanation' },
            { id: 'qualitative_findings_presentation', name: 'Qualitative findings presentation' },
            { id: 'pattern_and_theme_identification', name: 'Pattern and theme identification' },
            { id: 'correlation_and_causation_distinction', name: 'Correlation and causation distinction' },
            { id: 'unexpected_findings_framing', name: 'Unexpected findings framing' },
            { id: 'data_organization_techniques', name: 'Data organization techniques' },
            { id: 'technical_result_simplification', name: 'Technical result simplification' },
          ],
        },
        {
          id: 'discussion_section_development_with_critical_analysis',
          name: 'Discussion Section Development with Critical Analysis',
          items: [
            { id: 'findings_interpretation', name: 'Findings interpretation' },
            { id: 'literature_connection', name: 'Literature connection' },
            { id: 'theoretical_implications', name: 'Theoretical implications' },
            { id: 'practical_applications', name: 'Practical applications' },
            { id: 'limitations_contextualization', name: 'Limitations contextualization' },
            { id: 'future_research_directions', name: 'Future research directions' },
            { id: 'interdisciplinary_perspectives', name: 'Interdisciplinary perspectives' },
            { id: 'societal_impact_assessment', name: 'Societal impact assessment' },
          ],
        },
      ],
    },
    {
      id: 'educational_content',
      name: 'Educational Content',
      sections: [
        {
          id: 'lesson_plan_development',
          name: 'Lesson Plan Development',
          items: [
            { id: 'learning_objective_formulation', name: 'Learning objective formulation' },
            { id: 'activity_sequence_design', name: 'Activity sequence design' },
            { id: 'assessment_integration', name: 'Assessment integration' },
            { id: 'differentiation_strategies', name: 'Differentiation strategies' },
            { id: 'material_requirements_listing', name: 'Material requirements listing' },
            { id: 'time_management_planning', name: 'Time management planning' },
            { id: 'engagement_technique_inclusion', name: 'Engagement technique inclusion' },
            { id: 'crosscurricular_connection', name: 'Cross-curricular connection' },
          ],
        },
        {
          id: 'educational_blog_post_creation',
          name: 'Educational Blog Post Creation',
          items: [
            { id: 'conceptual_explanation', name: 'Conceptual explanation' },
            { id: 'practical_example_integration', name: 'Practical example integration' },
            { id: 'student_engagement_hooks', name: 'Student engagement hooks' },
            { id: 'visual_element_suggestions', name: 'Visual element suggestions' },
            { id: 'misconception_addressing', name: 'Misconception addressing' },
            { id: 'scaffolded_learning_paths', name: 'Scaffolded learning paths' },
            { id: 'resource_recommendation', name: 'Resource recommendation' },
            { id: 'extension_activity_ideas', name: 'Extension activity ideas' },
          ],
        },
        {
          id: 'instructional_material_with_scaffolded_complexity',
          name: 'Instructional Material with Scaffolded Complexity',
          items: [
            { id: 'beginnerlevel_explanation', name: 'Beginner-level explanation' },
            { id: 'intermediate_concept_building', name: 'Intermediate concept building' },
            { id: 'advanced_application_development', name: 'Advanced application development' },
            { id: 'conceptual_progression_mapping', name: 'Conceptual progression mapping' },
            { id: 'knowledge_prerequisite_identification', name: 'Knowledge prerequisite identification' },
            { id: 'student_support_resources', name: 'Student support resources' },
            { id: 'selfassessment_integration', name: 'Self-assessment integration' },
            { id: 'learning_pathway_design', name: 'Learning pathway design' },
          ],
        },
        {
          id: 'quiz_assessment_question_generation',
          name: 'Quiz & Assessment Question Generation',
          items: [
            { id: 'multiplechoice_question_design', name: 'Multiple-choice question design' },
            { id: 'short_answer_prompt_creation', name: 'Short answer prompt creation' },
            { id: 'essay_question_development', name: 'Essay question development' },
            { id: 'problembased_assessment', name: 'Problem-based assessment' },
            { id: 'blooms_taxonomy_alignment', name: 'Bloom\'s taxonomy alignment' },
            { id: 'knowledge_check_formulation', name: 'Knowledge check formulation' },
            { id: 'critical_thinking_stimulation', name: 'Critical thinking stimulation' },
            { id: 'performancebased_task_design', name: 'Performance-based task design' },
          ],
        },
        {
          id: 'student_feedback_template_creation',
          name: 'Student Feedback Template Creation',
          items: [
            { id: 'formative_assessment_feedback', name: 'Formative assessment feedback' },
            { id: 'summative_evaluation_comments', name: 'Summative evaluation comments' },
            { id: 'growth_mindset_phrasing', name: 'Growth mindset phrasing' },
            { id: 'specific_improvement_guidance', name: 'Specific improvement guidance' },
            { id: 'strength_recognition_language', name: 'Strength recognition language' },
            { id: 'next_steps_recommendation', name: 'Next steps recommendation' },
            { id: 'peer_feedback_facilitation', name: 'Peer feedback facilitation' },
            { id: 'student_selfreflection_prompts', name: 'Student self-reflection prompts' },
          ],
        },
      ],
    },
    {
      id: 'citation_reference',
      name: 'Citation & Reference',
      sections: [
        {
          id: 'multiformat_citation_generator',
          name: 'Multi-format Citation Generator',
          items: [
            { id: 'apa_style_formatting', name: 'APA style formatting' },
            { id: 'mla_citation_creation', name: 'MLA citation creation' },
            { id: 'chicagoturabian_formatting', name: 'Chicago/Turabian formatting' },
            { id: 'harvard_referencing', name: 'Harvard referencing' },
            { id: 'ieee_citation_structure', name: 'IEEE citation structure' },
            { id: 'vancouver_style_for_medicine', name: 'Vancouver style for medicine' },
            { id: 'asa_format_for_sociology', name: 'ASA format for sociology' },
            { id: 'disciplinespecific_adaptations', name: 'Discipline-specific adaptations' },
          ],
        },
        {
          id: 'bibliography_organization_formatting',
          name: 'Bibliography Organization & Formatting',
          items: [
            { id: 'alphabetical_organization', name: 'Alphabetical organization' },
            { id: 'categorized_reference_lists', name: 'Categorized reference lists' },
            { id: 'annotated_bibliography_creation', name: 'Annotated bibliography creation' },
            { id: 'works_cited_formatting', name: 'Works cited formatting' },
            { id: 'reference_list_structuring', name: 'Reference list structuring' },
            { id: 'digital_object_identifier_integration', name: 'Digital object identifier integration' },
            { id: 'multiple_author_handling', name: 'Multiple author handling' },
            { id: 'online_source_citation', name: 'Online source citation' },
          ],
        },
        {
          id: 'annotation_summary_creation_for_sources',
          name: 'Annotation & Summary Creation for Sources',
          items: [
            { id: 'key_argument_identification', name: 'Key argument identification' },
            { id: 'methodology_summary', name: 'Methodology summary' },
            { id: 'finding_encapsulation', name: 'Finding encapsulation' },
            { id: 'relevance_assessment', name: 'Relevance assessment' },
            { id: 'critical_evaluation', name: 'Critical evaluation' },
            { id: 'source_comparison_notes', name: 'Source comparison notes' },
            { id: 'theoretical_framework_connection_annot', name: 'Theoretical framework connection' }, // Appended suffix
            { id: 'research_gap_highlighting', name: 'Research gap highlighting' },
          ],
        },
        {
          id: 'citation_verification_correction',
          name: 'Citation Verification & Correction',
          items: [
            { id: 'formatting_accuracy_check', name: 'Formatting accuracy check' },
            { id: 'source_information_completeness', name: 'Source information completeness' },
            { id: 'doi_and_url_verification', name: 'DOI and URL verification' },
            { id: 'publication_information_accuracy', name: 'Publication information accuracy' },
            { id: 'author_name_standardization', name: 'Author name standardization' },
            { id: 'edition_and_version_confirmation', name: 'Edition and version confirmation' },
            { id: 'date_format_consistency', name: 'Date format consistency' },
            { id: 'intext_citation_correlation', name: 'In-text citation correlation' },
          ],
        },
        {
          id: 'footnote_endnote_optimization',
          name: 'Footnote & Endnote Optimization',
          items: [
            { id: 'explanatory_note_creation', name: 'Explanatory note creation' },
            { id: 'citation_note_formatting', name: 'Citation note formatting' },
            { id: 'discursive_note_development', name: 'Discursive note development' },
            { id: 'crossreference_creation', name: 'Cross-reference creation' },
            { id: 'note_length_optimization', name: 'Note length optimization' },
            { id: 'content_relevance_assessment', name: 'Content relevance assessment' },
            { id: 'numbering_system_consistency', name: 'Numbering system consistency' },
            { id: 'style_guide_compliance', name: 'Style guide compliance' },
          ],
        },
      ],
    },
  ],
};