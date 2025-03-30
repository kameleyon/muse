import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const emergingTechnologiesCategory: ProjectCategory = {
  id: 'emerging_technologies',
  name: 'Emerging Technologies',
  subcategories: [
    {
      id: 'blockchain_web3',
      name: 'Blockchain & Web3',
      sections: [
        {
          id: 'whitepaper_development_assistance',
          name: 'Whitepaper Development Assistance',
          items: [
            { id: 'technical_concept_explanation_web3', name: 'Technical concept explanation' }, // Appended suffix
            { id: 'problemsolution_framework', name: 'Problem-solution framework' },
            { id: 'tokenomics_structure', name: 'Tokenomics structure' },
            { id: 'ecosystem_description', name: 'Ecosystem description' },
            { id: 'roadmap_development_web3', name: 'Roadmap development' }, // Appended suffix
            { id: 'technical_implementation_plan', name: 'Technical implementation plan' },
            { id: 'use_case_articulation', name: 'Use case articulation' },
            { id: 'team_presentation_format', name: 'Team presentation format' },
          ],
        },
        {
          id: 'community_documentation',
          name: 'Community Documentation',
          items: [
            { id: 'governance_model_explanation_web3', name: 'Governance model explanation' }, // Appended suffix
            { id: 'protocol_description', name: 'Protocol description' },
            { id: 'technical_update_announcement', name: 'Technical update announcement' },
            { id: 'user_guide_development', name: 'User guide development' },
            { id: 'faq_generation', name: 'FAQ generation' },
            { id: 'proposal_format_standardization', name: 'Proposal format standardization' },
            { id: 'consensus_mechanism_explanation', name: 'Consensus mechanism explanation' },
            { id: 'security_practice_documentation', name: 'Security practice documentation' },
          ],
        },
        {
          id: 'technical_content_simplification_web3',
          name: 'Technical Content Simplification', // Appended suffix to section ID
          items: [
            { id: 'complex_mechanism_explanation', name: 'Complex mechanism explanation' },
            { id: 'visual_analogy_creation', name: 'Visual analogy creation' },
            { id: 'layerappropriate_explanation', name: 'Layer-appropriate explanation' },
            { id: 'technical_comparison_framework', name: 'Technical comparison framework' },
            { id: 'user_benefit_articulation', name: 'User benefit articulation' },
            { id: 'adoption_path_clarification', name: 'Adoption path clarification' },
            { id: 'risk_assessment_communication_web3', name: 'Risk assessment communication' }, // Appended suffix
            { id: 'future_development_contextualization', name: 'Future development contextualization' },
          ],
        },
      ],
    },
    {
      id: 'ai_technology',
      name: 'AI & Technology',
      sections: [
        {
          id: 'ai_capability_explanation',
          name: 'AI Capability Explanation',
          items: [
            { id: 'technical_functionality_description', name: 'Technical functionality description' },
            { id: 'use_case_scenario_development', name: 'Use case scenario development' },
            { id: 'limitation_transparency_framework', name: 'Limitation transparency framework' },
            { id: 'comparative_advantage_articulation', name: 'Comparative advantage articulation' },
            { id: 'implementation_requirement', name: 'Implementation requirement' },
            { id: 'integration_pathway_documentation', name: 'Integration pathway documentation' },
            { id: 'roi_calculation_framework', name: 'ROI calculation framework' },
            { id: 'future_development_roadmap', name: 'Future development roadmap' },
          ],
        },
        {
          id: 'technical_documentation_for_nontechnical_audiences',
          name: 'Technical Documentation for Non-technical Audiences',
          items: [
            { id: 'jargon_simplification', name: 'Jargon simplification' },
            { id: 'visual_explanation_recommendation', name: 'Visual explanation recommendation' },
            { id: 'analogy_and_metaphor_creation', name: 'Analogy and metaphor creation' },
            { id: 'realworld_application_connection', name: 'Real-world application connection' },
            { id: 'stepbystep_implementation_guidance', name: 'Step-by-step implementation guidance' },
            { id: 'faq_anticipation', name: 'FAQ anticipation' },
            { id: 'decisionmaking_framework', name: 'Decision-making framework' },
            { id: 'resource_requirement_clarification', name: 'Resource requirement clarification' },
          ],
        },
        {
          id: 'ethical_ai_content',
          name: 'Ethical AI Content',
          items: [
            { id: 'framework_documentation', name: 'Framework documentation' },
            { id: 'bias_consideration_explanation', name: 'Bias consideration explanation' },
            { id: 'transparency_protocol_development', name: 'Transparency protocol development' },
            { id: 'governance_model_documentation_ai', name: 'Governance model documentation' }, // Appended suffix
            { id: 'user_rights_articulation', name: 'User rights articulation' },
            { id: 'data_handling_disclosure', name: 'Data handling disclosure' },
            { id: 'testing_methodology_explanation', name: 'Testing methodology explanation' },
            { id: 'human_oversight_documentation', name: 'Human oversight documentation' },
          ],
        },
      ],
    },
    {
      id: 'sustainability_green_tech',
      name: 'Sustainability & Green Tech',
      sections: [
        {
          id: 'environmental_impact_reporting',
          name: 'Environmental Impact Reporting',
          items: [
            { id: 'metric_selection_guidance', name: 'Metric selection guidance' },
            { id: 'data_visualization_narrative_sus', name: 'Data visualization narrative' }, // Appended suffix
            { id: 'benchmark_comparison_framework', name: 'Benchmark comparison framework' },
            { id: 'improvement_tracking_methodology', name: 'Improvement tracking methodology' },
            { id: 'stakeholder_communication_strategy', name: 'Stakeholder communication strategy' },
            { id: 'regulatory_compliance_connection', name: 'Regulatory compliance connection' },
            { id: 'goal_setting_framework_sus', name: 'Goal setting framework' }, // Appended suffix
            { id: 'thirdparty_verification_explanation', name: 'Third-party verification explanation' },
          ],
        },
        {
          id: 'sustainability_initiative_documentation',
          name: 'Sustainability Initiative Documentation',
          items: [
            { id: 'program_structure_explanation', name: 'Program structure explanation' },
            { id: 'implementation_pathway_documentation', name: 'Implementation pathway documentation' },
            { id: 'stakeholder_engagement_framework', name: 'Stakeholder engagement framework' },
            { id: 'impact_measurement_methodology', name: 'Impact measurement methodology' },
            { id: 'resource_requirement_articulation', name: 'Resource requirement articulation' },
            { id: 'timeline_development_sus', name: 'Timeline development' }, // Appended suffix
            { id: 'success_criteria_establishment', name: 'Success criteria establishment' },
            { id: 'case_study_formatting', name: 'Case study formatting' },
          ],
        },
        {
          id: 'esg_reporting',
          name: 'ESG Reporting',
          items: [
            { id: 'disclosure_standard_alignment', name: 'Disclosure standard alignment' },
            { id: 'material_issue_identification', name: 'Material issue identification' },
            { id: 'performance_metric_documentation', name: 'Performance metric documentation' },
            { id: 'goal_setting_framework_esg', name: 'Goal setting framework' }, // Appended suffix
            { id: 'progress_tracking_methodology', name: 'Progress tracking methodology' },
            { id: 'risk_assessment_communication_esg', name: 'Risk assessment communication' }, // Appended suffix
            { id: 'stakeholder_engagement_documentation', name: 'Stakeholder engagement documentation' },
            { id: 'industry_benchmark_comparison', name: 'Industry benchmark comparison' },
          ],
        },
      ],
    },
  ],
};