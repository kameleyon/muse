import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const governmentPublicSectorCategory: ProjectCategory = {
  id: 'government_public_sector',
  name: 'Government & Public Sector',
  subcategories: [
    {
      id: 'policy_documentation',
      name: 'Policy Documentation',
      sections: [
        {
          id: 'policy_brief_generation',
          name: 'Policy Brief Generation',
          items: [
            { id: 'issue_background_summarization', name: 'Issue background summarization' },
            { id: 'policy_alternative_comparison', name: 'Policy alternative comparison' },
            { id: 'implementation_consideration', name: 'Implementation consideration' },
            { id: 'stakeholder_impact_analysis', name: 'Stakeholder impact analysis' },
            { id: 'costbenefit_framework', name: 'Cost-benefit framework' },
            { id: 'timeline_development_gov', name: 'Timeline development' }, // Appended suffix
            { id: 'success_metric_establishment', name: 'Success metric establishment' },
            { id: 'regulatory_alignment_assessment', name: 'Regulatory alignment assessment' },
          ],
        },
        {
          id: 'regulatory_content',
          name: 'Regulatory Content',
          items: [
            { id: 'compliance_requirement_explanation', name: 'Compliance requirement explanation' },
            { id: 'legal_authority_citation', name: 'Legal authority citation' },
            { id: 'procedure_standardization_gov', name: 'Procedure standardization' }, // Appended suffix
            { id: 'enforcement_protocol_documentation', name: 'Enforcement protocol documentation' },
            { id: 'exemption_criteria_clarification', name: 'Exemption criteria clarification' },
            { id: 'public_comment_response_framework', name: 'Public comment response framework' },
            { id: 'technical_requirement_simplification', name: 'Technical requirement simplification' },
            { id: 'implementation_guidance_creation', name: 'Implementation guidance creation' },
          ],
        },
        {
          id: 'legislative_summaries',
          name: 'Legislative Summaries',
          items: [
            { id: 'bill_synopsis_creation', name: 'Bill synopsis creation' },
            { id: 'key_provision_identification', name: 'Key provision identification' },
            { id: 'amendment_tracking', name: 'Amendment tracking' },
            { id: 'impact_assessment_framework_gov', name: 'Impact assessment framework' }, // Appended suffix
            { id: 'constituent_explanation', name: 'Constituent explanation' },
            { id: 'historical_context_integration', name: 'Historical context integration' },
            { id: 'comparative_analysis_with_existing_law', name: 'Comparative analysis with existing law' },
            { id: 'implementation_timeline_projection', name: 'Implementation timeline projection' },
          ],
        },
      ],
    },
    {
      id: 'civic_engagement',
      name: 'Civic Engagement',
      sections: [
        {
          id: 'public_consultation_material',
          name: 'Public Consultation Material',
          items: [
            { id: 'engagement_opportunity_announcement', name: 'Engagement opportunity announcement' },
            { id: 'background_information_provision', name: 'Background information provision' },
            { id: 'question_framework_development', name: 'Question framework development' },
            { id: 'feedback_collection_structuring', name: 'Feedback collection structuring' },
            { id: 'participation_guidance_creation', name: 'Participation guidance creation' },
            { id: 'diverse_stakeholder_consideration', name: 'Diverse stakeholder consideration' },
            { id: 'technical_concept_simplification_gov', name: 'Technical concept simplification' }, // Appended suffix
            { id: 'followup_communication_planning', name: 'Follow-up communication planning' },
          ],
        },
        {
          id: 'citizen_information_campaigns',
          name: 'Citizen Information Campaigns',
          items: [
            { id: 'program_explanation_framework', name: 'Program explanation framework' },
            { id: 'benefit_eligibility_clarification', name: 'Benefit eligibility clarification' },
            { id: 'process_step_simplification', name: 'Process step simplification' },
            { id: 'deadline_and_timeline_emphasis', name: 'Deadline and timeline emphasis' },
            { id: 'resource_access_guidance', name: 'Resource access guidance' },
            { id: 'common_question_anticipation', name: 'Common question anticipation' },
            { id: 'multiple_language_adaptation', name: 'Multiple language adaptation' },
            { id: 'visual_instruction_development', name: 'Visual instruction development' },
          ],
        },
        {
          id: 'community_outreach_messaging',
          name: 'Community Outreach Messaging',
          items: [
            { id: 'demographicspecific_messaging', name: 'Demographic-specific messaging' },
            { id: 'cultural_sensitivity_integration', name: 'Cultural sensitivity integration' },
            { id: 'grassroots_mobilization_content', name: 'Grassroots mobilization content' },
            { id: 'event_promotion_framework', name: 'Event promotion framework' },
            { id: 'volunteer_recruitment_materials', name: 'Volunteer recruitment materials' },
            { id: 'impact_storytelling_templates', name: 'Impact storytelling templates' },
            { id: 'partnership_announcement_structure', name: 'Partnership announcement structure' },
            { id: 'feedback_integration_demonstration', name: 'Feedback integration demonstration' },
          ],
        },
      ],
    },
  ],
};