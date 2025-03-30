import { ProjectCategory } from '../projectCategories'; // Adjust path as needed

export const customizationIntegrationCategory: ProjectCategory = {
  id: 'customization_integration',
  name: 'Customization & Integration',
  subcategories: [
    {
      id: 'platform_adaptability',
      name: 'Platform Adaptability',
      sections: [
        {
          id: 'api_technology_integration',
          name: 'API & Technology Integration',
          items: [
            { id: 'custom_api_implementation_for_enterprise_systems', name: 'Custom API implementation for enterprise systems' },
            { id: 'cms_integration_wordpress_drupal_etc', name: 'CMS integration (WordPress, Drupal, etc.)' },
            { id: 'marketing_platform_connection_hubspot_marketo_etc', name: 'Marketing platform connection (Hubspot, Marketo, etc.)' },
            { id: 'ecommerce_platform_integration_shopify_woocommerce', name: 'E-commerce platform integration (Shopify, WooCommerce)' },
            { id: 'analytics_system_connection_google_analytics_adobe', name: 'Analytics system connection (Google Analytics, Adobe)' },
          ],
        },
        {
          id: 'workflow_integration',
          name: 'Workflow Integration',
          items: [
            { id: 'project_management_tool_connection_asana_monday_trello', name: 'Project management tool connection (Asana, Monday, Trello)' },
            { id: 'communication_platform_integration_slack_teams_discord', name: 'Communication platform integration (Slack, Teams, Discord)' },
            { id: 'document_management_system_connection_sharepoint_google_workspace', name: 'Document management system connection (SharePoint, Google Workspace)' },
            { id: 'crm_integration_for_personalized_content_salesforce_zoho', name: 'CRM integration for personalized content (Salesforce, Zoho)' },
            { id: 'design_tool_workflow_figma_adobe_creative_cloud', name: 'Design tool workflow (Figma, Adobe Creative Cloud)' },
          ],
        },
        {
          id: 'custom_implementation',
          name: 'Custom Implementation',
          items: [
            { id: 'industryspecific_terminology_databases', name: 'Industry-specific terminology databases' },
            { id: 'custom_template_development', name: 'Custom template development' },
            { id: 'branded_voice_tone_configuration', name: 'Branded voice & tone configuration' },
            { id: 'compliance_regulatory_requirement_integration', name: 'Compliance & regulatory requirement integration' },
            { id: 'multilevel_approval_workflow_setup', name: 'Multi-level approval workflow setup' },
          ],
        },
      ],
    },
    {
      id: 'content_governance',
      name: 'Content Governance',
      sections: [
        {
          id: 'brand_consistency',
          name: 'Brand Consistency',
          items: [
            { id: 'style_guide_enforcement_monitoring', name: 'Style guide enforcement & monitoring' },
            { id: 'terminology_consistency_checking', name: 'Terminology consistency checking' },
            { id: 'visual_element_description_consistency', name: 'Visual element description consistency' },
            { id: 'message_architecture_alignment', name: 'Message architecture alignment' },
            { id: 'brand_personality_expression_verification', name: 'Brand personality expression verification' },
          ],
        },
        {
          id: 'compliance_legal',
          name: 'Compliance & Legal',
          items: [
            { id: 'industry_regulation_adherence_checking', name: 'Industry regulation adherence checking' },
            { id: 'legal_requirement_verification', name: 'Legal requirement verification' },
            { id: 'risk_phrase_identification', name: 'Risk phrase identification' },
            { id: 'disclosure_requirement_integration', name: 'Disclosure requirement integration' },
            { id: 'accessibility_compliance_wcag_ada_section_508', name: 'Accessibility compliance (WCAG, ADA, Section 508)' },
          ],
        },
        {
          id: 'quality_assurance',
          name: 'Quality Assurance',
          items: [
            { id: 'comprehensive_error_detection', name: 'Comprehensive error detection' },
            { id: 'factual_accuracy_verification', name: 'Factual accuracy verification' },
            { id: 'source_reliability_assessment', name: 'Source reliability assessment' },
            { id: 'bias_sensitivity_scanning', name: 'Bias & sensitivity scanning' },
            { id: 'technical_precision_verification', name: 'Technical precision verification' },
          ],
        },
      ],
    },
    {
      id: 'user_experience',
      name: 'User Experience',
      sections: [
        {
          id: 'interface_personalization',
          name: 'Interface Personalization',
          items: [
            { id: 'rolebased_interface_configuration', name: 'Role-based interface configuration' },
            { id: 'frequently_used_feature_prioritization', name: 'Frequently used feature prioritization' },
            { id: 'workflow_customization_by_user_type', name: 'Workflow customization by user type' },
            { id: 'visual_theme_layout_preferences', name: 'Visual theme & layout preferences' },
            { id: 'shortcut_quick_access_customization', name: 'Shortcut & quick access customization' },
          ],
        },
        {
          id: 'learning_onboarding',
          name: 'Learning & Onboarding',
          items: [
            { id: 'interactive_tutorial_development', name: 'Interactive tutorial development' },
            { id: 'progressive_feature_introduction', name: 'Progressive feature introduction' },
            { id: 'contextual_help_content', name: 'Contextual help content' },
            { id: 'user_achievement_milestone_tracking', name: 'User achievement & milestone tracking' },
            { id: 'personalized_feature_recommendation', name: 'Personalized feature recommendation' },
          ],
        },
        {
          id: 'accessibility_features',
          name: 'Accessibility Features',
          items: [
            { id: 'screen_reader_optimization', name: 'Screen reader optimization' },
            { id: 'keyboard_navigation_enhancement', name: 'Keyboard navigation enhancement' },
            { id: 'color_contrast_visual_accessibility', name: 'Color contrast & visual accessibility' },
            { id: 'cognitive_accessibility_features', name: 'Cognitive accessibility features' },
            { id: 'language_simplification_options', name: 'Language simplification options' },
          ],
        },
      ],
    },
  ],
};