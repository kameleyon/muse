import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const educationalLearningCategory: ProjectCategory = {
  id: 'educational_learning_applications',
  name: 'Educational & Learning Applications',
  subcategories: [
    {
      id: 'student_support',
      name: 'Student Support',
      sections: [
        {
          id: 'essay_development',
          name: 'Essay Development',
          items: [
            { id: 'thesis_statement_generation', name: 'Thesis statement generation' },
            { id: 'outline_creation_organization', name: 'Outline creation & organization' },
            { id: 'topic_sentence_development', name: 'Topic sentence development' },
            { id: 'evidence_integration_assistance', name: 'Evidence integration assistance' },
            { id: 'conclusion_crafting_with_thesis_reinforcement', name: 'Conclusion crafting with thesis reinforcement' },
          ],
        },
        {
          id: 'research_assistance',
          name: 'Research Assistance',
          items: [
            { id: 'research_question_refinement', name: 'Research question refinement' },
            { id: 'source_evaluation_guidance', name: 'Source evaluation guidance' },
            { id: 'notetaking_organization', name: 'Note-taking organization' },
            { id: 'methodological_approach_suggestion', name: 'Methodological approach suggestion' },
            { id: 'finding_gap_analysis_in_existing_research', name: 'Finding gap analysis in existing research' },
          ],
        },
        {
          id: 'language_learning',
          name: 'Language Learning',
          items: [
            { id: 'vocabulary_enhancement_with_context', name: 'Vocabulary enhancement with context' },
            { id: 'grammar_explanation_application', name: 'Grammar explanation & application' },
            { id: 'language_level_adaptation_basic_to_advanced', name: 'Language level adaptation (basic to advanced)' },
            { id: 'cultural_context_provision', name: 'Cultural context provision' },
            { id: 'idiomatic_expression_explanation', name: 'Idiomatic expression explanation' },
          ],
        },
      ],
    },
    {
      id: 'teacher_resources',
      name: 'Teacher Resources',
      sections: [
        {
          id: 'curriculum_development',
          name: 'Curriculum Development',
          items: [
            { id: 'lesson_plan_structure_with_learning_objectives', name: 'Lesson plan structure with learning objectives' },
            { id: 'activity_description_instruction', name: 'Activity description & instruction' },
            { id: 'assessment_design_rubric_creation', name: 'Assessment design & rubric creation' },
            { id: 'differentiation_strategies_for_various_learners', name: 'Differentiation strategies for various learners' },
            { id: 'unit_planning_progression_mapping', name: 'Unit planning & progression mapping' },
          ],
        },
        {
          id: 'student_feedback',
          name: 'Student Feedback',
          items: [
            { id: 'personalized_feedback_template_generation', name: 'Personalized feedback template generation' },
            { id: 'growthfocused_commentary', name: 'Growth-focused commentary' },
            { id: 'specific_improvement_suggestion', name: 'Specific improvement suggestion' },
            { id: 'strength_recognition_phrasing', name: 'Strength recognition phrasing' },
            { id: 'next_steps_recommendation_edu', name: 'Next steps recommendation' }, // Appended suffix
          ],
        },
        {
          id: 'educational_materials',
          name: 'Educational Materials',
          items: [
            { id: 'textbookstyle_explanation_generation', name: 'Textbook-style explanation generation' },
            { id: 'concept_simplification_for_various_age_groups', name: 'Concept simplification for various age groups' },
            { id: 'example_creation_for_abstract_concepts', name: 'Example creation for abstract concepts' },
            { id: 'problem_set_development_with_solutions', name: 'Problem set development with solutions' },
            { id: 'visual_aid_description_for_complex_ideas', name: 'Visual aid description for complex ideas' },
          ],
        },
      ],
    },
    {
      id: 'professional_development',
      name: 'Professional Development',
      sections: [
        {
          id: 'skill_documentation',
          name: 'Skill Documentation',
          items: [
            { id: 'resume_achievement_description', name: 'Resume achievement description' },
            { id: 'cover_letter_personalization', name: 'Cover letter personalization' },
            { id: 'linkedin_profile_optimization', name: 'LinkedIn profile optimization' },
            { id: 'professional_bio_development', name: 'Professional bio development' },
            { id: 'portfolio_project_description', name: 'Portfolio project description' },
          ],
        },
        {
          id: 'continuing_education',
          name: 'Continuing Education',
          items: [
            { id: 'learning_summary_note_organization', name: 'Learning summary & note organization' },
            { id: 'concept_explanation_simplification', name: 'Concept explanation & simplification' },
            { id: 'knowledge_application_examples', name: 'Knowledge application examples' },
            { id: 'selfassessment_question_generation', name: 'Self-assessment question generation' },
            { id: 'practical_implementation_planning', name: 'Practical implementation planning' },
          ],
        },
        {
          id: 'presentation_public_speaking',
          name: 'Presentation & Public Speaking',
          items: [
            { id: 'presentation_script_development', name: 'Presentation script development' },
            { id: 'slide_content_optimization', name: 'Slide content optimization' },
            { id: 'transition_phrase_creation_edu', name: 'Transition phrase creation' }, // Appended suffix
            { id: 'opening_hook_closing_impact_statements', name: 'Opening hook & closing impact statements' },
            { id: 'qa_preparation_response_templates', name: 'Q&A preparation & response templates' },
          ],
        },
      ],
    },
  ],
};