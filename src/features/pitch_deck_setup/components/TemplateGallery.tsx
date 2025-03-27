import React, { useState, useEffect } from 'react';
import './TemplateGallery.css'; // Create this CSS file next

// Placeholder for Template data structure (align with DB schema later)
interface Template {
  template_id: string;
  template_name: string;
  template_category?: string;
  template_preview_url?: string; // URL for a preview image/gif
  industry_relevance?: string[];
  popularity_score?: number;
  is_premium?: boolean;
  // Add other relevant fields from schema (description, structure?)
}

// Placeholder data - replace with actual data fetching
const placeholderTemplates: Template[] = [
  { template_id: 'tpl_minimal', template_name: 'Minimalist Professional', template_category: 'Minimalist/Professional', template_preview_url: '/placeholders/tpl_minimal.png', is_premium: false },
  { template_id: 'tpl_corp', template_name: 'Corporate Standard', template_category: 'Corporate/Enterprise', template_preview_url: '/placeholders/tpl_corp.png', is_premium: false },
  { template_id: 'tpl_creative', template_name: 'Modern Creative', template_category: 'Creative/Modern', template_preview_url: '/placeholders/tpl_creative.png', is_premium: false },
  { template_id: 'tpl_data', template_name: 'Data-Focused', template_category: 'Data-focused/Analytical', template_preview_url: '/placeholders/tpl_data.png', is_premium: true },
  { template_id: 'tpl_story', template_name: 'Narrative Storytelling', template_category: 'Storytelling/Narrative', template_preview_url: '/placeholders/tpl_story.png', is_premium: false },
  // Add more placeholders
];


interface TemplateGalleryProps {
  projectId: string;
  deckTypeId: string; // To potentially filter/suggest templates
  onTemplateSelected: (projectId: string, templateId: string) => void; // Callback
  // Add props for fetching templates, user account type (for premium), etc.
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  projectId,
  deckTypeId,
  onTemplateSelected,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For fetching templates
  const [isSaving, setIsSaving] = useState(false); // For saving selection
  const [error, setError] = useState<string | null>(null);

  // TODO: Fetch templates based on deckTypeId, user preferences, etc.
  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setTemplates(placeholderTemplates);
      setIsLoading(false);
    }, 500);
  }, [deckTypeId]);

  const handleSelectTemplate = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    setIsSaving(true);
    setError(null);

    try {
      // TODO: Call service function to update project's default_template_id
      console.log(`Saving template ${templateId} for project ${projectId}`);
      // await projectService.updateProjectTemplate(projectId, templateId);

      // Call the callback
      onTemplateSelected(projectId, templateId);

    } catch (err) {
      console.error('Error saving template selection:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setSelectedTemplateId(null); // Reset on error
    } finally {
      setIsSaving(false);
    }
  };

  // TODO: Implement filtering UI (industry, purpose, style)
  // TODO: Implement brand customization options (logo, colors, fonts) - maybe separate component?

  return (
    <div className="template-gallery">
      <h2>Select a Template</h2>
      <p>Choose a visual style for your document. You can customize branding later.</p>

      {/* TODO: Add Filter Controls Here */}

      {isLoading && <p>Loading templates...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <div className="template-grid">
          {templates.map((template) => (
            <div
              key={template.template_id}
              className={`template-card ${selectedTemplateId === template.template_id ? 'selected' : ''} ${isSaving ? 'disabled' : ''}`}
              onClick={() => !isSaving && handleSelectTemplate(template.template_id)}
              role="button"
              tabIndex={isSaving ? -1 : 0}
              aria-pressed={selectedTemplateId === template.template_id}
            >
              <div className="template-preview">
                 {/* Use template.template_preview_url */}
                 <span>{template.template_name.substring(0, 1)}</span>
                 {template.is_premium && <span className="premium-badge">Premium</span>}
              </div>
              <h3>{template.template_name}</h3>
              <p>{template.template_category}</p>
              {isSaving && selectedTemplateId === template.template_id && <div className="loading-spinner"></div>}
            </div>
          ))}
        </div>
      )}

      {/* TODO: Add Brand Customization Section/Component Here */}

    </div>
  );
};

export default TemplateGallery;