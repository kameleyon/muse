// src/features/project_setup/components/SetupForm.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { updateProjectSetupDetails } from '@/services/projectService';
import './SetupForm.css';

interface SetupFormProps {
  projectId: string;
  onComplete: () => void; // Callback when setup is successfully saved
}

// Define structure for form data
interface SetupFormData {
  targetAudience: string;
  industry: string;
  scope: string;
  objective: string;
  differentiators: string;
  budgetRange: string; // Keep as string for flexibility (e.g., "$10k-$20k")
  timeline: string;
  templateId: string; // Store the ID of the selected template
}

// Placeholder template options
const templateOptions = [
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'corporate', name: 'Corporate' },
  { id: 'creative', name: 'Creative' },
  { id: 'data_focused', name: 'Data-focused' },
  { id: 'storytelling', name: 'Storytelling' },
  // Add more templates as needed
];

const SetupForm: React.FC<SetupFormProps> = ({ projectId, onComplete }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<SetupFormData>({
    targetAudience: '',
    industry: '',
    scope: '',
    objective: '',
    differentiators: '',
    budgetRange: '',
    timeline: '',
    templateId: templateOptions[0]?.id || '', // Default to first template
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation (can be enhanced)
    if (!formData.targetAudience || !formData.industry || !formData.objective || !formData.templateId) {
        dispatch(addToast({ type: 'error', message: 'Please fill in all required fields (Audience, Industry, Objective, Template).' }));
        setIsSubmitting(false);
        return;
    }

    try {
      // Prepare data for the service (excluding templateId from the main JSON)
      const setupDetailsToSave: Omit<SetupFormData, 'templateId'> = { ...formData };
      // delete setupDetailsToSave.templateId; // templateId is saved separately in its own column

      await updateProjectSetupDetails(projectId, setupDetailsToSave, formData.templateId);

      dispatch(addToast({ type: 'success', message: 'Project setup saved successfully!' }));
      onComplete(); // Trigger the callback to show the editor

    } catch (error: any) {
      console.error('Failed to save project setup:', error);
      dispatch(addToast({ type: 'error', message: `Failed to save setup: ${error.message}` }));
      setIsSubmitting(false); // Keep form active on error
    }
    // No finally block needed for setIsSubmitting(false) if onComplete navigates away
  };

  return (
    <div className="setup-form-container">
      <h2 className="setup-form-title">Project Setup</h2>
      <p className="setup-form-subtitle">
        Provide some details to help generate the initial pitch deck structure.
      </p>
      <form onSubmit={handleSubmit} className="setup-form">
        {/* Required Fields */}
        <div className="form-group">
          <label htmlFor="targetAudience">Target Audience / Client Name *</label>
          <input
            type="text"
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="industry">Industry / Sector *</label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="objective">Objective *</label>
          <input
            type="text"
            id="objective"
            name="objective"
            placeholder="e.g., Secure funding, Win partnership, Make sale"
            value={formData.objective}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="templateId">Select Template *</label>
          <select
            id="templateId"
            name="templateId"
            value={formData.templateId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            {templateOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
          {/* TODO: Add visual previews if possible */}
        </div>

        {/* Optional Fields */}
         <div className="form-group">
          <label htmlFor="scope">Project / Product / Service Scope</label>
          <textarea
            id="scope"
            name="scope"
            rows={3}
            value={formData.scope}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="differentiators">Key Differentiators / USPs</label>
          <textarea
            id="differentiators"
            name="differentiators"
            rows={3}
            value={formData.differentiators}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group form-group-inline"> {/* Example for inline fields */}
            <div className="form-subgroup">
                 <label htmlFor="budgetRange">Budget Range (Optional)</label>
                 <input
                    type="text"
                    id="budgetRange"
                    name="budgetRange"
                    placeholder="e.g., $10k - $20k"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    disabled={isSubmitting}
                 />
            </div>
            <div className="form-subgroup">
                 <label htmlFor="timeline">Timeline Expectations</label>
                 <input
                    type="text"
                    id="timeline"
                    name="timeline"
                    placeholder="e.g., 3 Months, Q4 2025"
                    value={formData.timeline}
                    onChange={handleChange}
                    disabled={isSubmitting}
                 />
            </div>
        </div>


        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className={isSubmitting ? 'button-disabled' : ''}
          >
            {isSubmitting ? 'Saving Setup...' : 'Save Setup & Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SetupForm;