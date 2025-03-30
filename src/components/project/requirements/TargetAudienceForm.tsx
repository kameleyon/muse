import React, { useState } from 'react'; // Keep useState for local UI state like accordion
import { Input } from '@/components/ui/Input';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { RadioGroupItem } from '@/components/ui/RadioGroupItem';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { useProjectWorkflowStore, AudienceState } from '@/store/projectWorkflowStore'; // Import store and type

// Props interface might not be needed anymore if all state comes from store
// interface TargetAudienceFormProps {
// }

const TargetAudienceForm: React.FC = () => { // Removed props
  // Get state and actions from Zustand store
  const {
    name,
    orgType,
    industry,
    size,
    personaRole,
    personaConcerns, // Note: Multi-selects are placeholders, state handling needs implementation
    personaCriteria, // Note: Multi-selects are placeholders, state handling needs implementation
    personaCommPrefs, // Note: Multi-selects are placeholders, state handling needs implementation
    setAudienceField,
  } = useProjectWorkflowStore();

  // Local state for UI elements like accordion toggle
  const [isPersonaExpanded, setIsPersonaExpanded] = useState(false); // Keep local UI state

  // Remove local state for audience data
  // const [audience, setAudience] = useState<AudienceState>({ ... });

  // Placeholder data for dropdowns/multi-selects (can remain)
  const orgTypes = ['Corporation', 'Non-profit', 'Government', 'Education', 'Startup', 'Other'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Other'];
  const concerns = ['Budget', 'ROI', 'Integration', 'Security', 'Scalability', 'Ease of Use'];
  const criteria = ['Price', 'Features', 'Support', 'Reputation', 'Existing Relationship'];
  const commPrefs = ['Email', 'Phone Call', 'Video Conference', 'In-Person Meeting'];

  // Handler for basic input changes - uses store action
  const handleChange = (field: keyof AudienceState, value: string | string[]) => {
    // For multi-selects (when implemented), ensure value is string[]
    // For now, assumes string for basic inputs
    setAudienceField(field, value as any); // Use store action, 'as any' for simplicity until multi-selects are typed
  };

  // Handler for radio group change - uses store action
  const handleSizeChange = (value: string) => {
    setAudienceField('size', value as AudienceState['size']); // Use store action
  };

  // TODO: Implement handlers for multi-select components when they are added
  // These handlers would call setAudienceField with the appropriate string array value.

  return (
    <div className="space-y-6 border border-neutral-light p-4 rounded-lg bg-white/30 shadow-sm">
      <h3 className="text-lg font-semibold font-heading text-secondary border-b border-neutral-light/40 pb-2">
        Target Audience / Client
      </h3>

      {/* Client/Audience Name - Uses store state */}
      <div>
        <label htmlFor="audienceName" className="settings-label">Client/Audience Name</label>
        <Input
          id="audienceName"
          value={name} // Use store state
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Acme Corp, Marketing Managers"
          className="settings-input"
        />
      </div>

      {/* Org Type (Placeholder Select) - Uses store state */}
      <div>
        <label htmlFor="orgType" className="settings-label">Organization Type</label>
        <select
          id="orgType"
          value={orgType} // Use store state
          onChange={(e) => handleChange('orgType', e.target.value)}
          className="settings-input"
        >
          <option value="" disabled>Select type...</option>
          {orgTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      {/* Industry (Placeholder Autocomplete) - Uses store state */}
      <div>
        <label htmlFor="industry" className="settings-label">Industry</label>
        <Input
          id="industry"
          value={industry} // Use store state
          onChange={(e) => handleChange('industry', e.target.value)}
          placeholder="e.g., SaaS, E-commerce"
          className="settings-input"
        />
         <p className="text-xs text-neutral-medium mt-1">Start typing to see suggestions...</p>
      </div>

      {/* Size/Scope - Uses store state */}
      <div>
        <label className="settings-label">Size/Scope</label>
        <RadioGroup
          value={size} // Use store state
          onValueChange={handleSizeChange}
          className="flex flex-col sm:flex-row gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 p-3 border rounded-md flex-1 cursor-pointer hover:border-[#ae5630] has-[:checked]:border-[#ae5630] has-[:checked]:ring-1 has-[:checked]:ring-[#ae5630]">
            <RadioGroupItem value="small" id="size-small" />
            <label htmlFor="size-small" className="cursor-pointer">Small</label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-md flex-1 cursor-pointer hover:border-[#ae5630] has-[:checked]:border-[#ae5630] has-[:checked]:ring-1 has-[:checked]:ring-[#ae5630]">
            <RadioGroupItem value="medium" id="size-medium" />
            <label htmlFor="size-medium" className="cursor-pointer">Medium</label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-md flex-1 cursor-pointer hover:border-[#ae5630] has-[:checked]:border-[#ae5630] has-[:checked]:ring-1 has-[:checked]:ring-[#ae5630]">
            <RadioGroupItem value="enterprise" id="size-enterprise" />
            <label htmlFor="size-enterprise" className="cursor-pointer">Enterprise</label>
          </div>
        </RadioGroup>
      </div>

      {/* Decision-Maker Persona (Optional Accordion) - Uses store state */}
      <Accordion type="single" collapsible className="w-full border border-neutral-light rounded-lg" onValueChange={(value) => setIsPersonaExpanded(!!value)}>
        <AccordionItem value="item-1">
          <AccordionTrigger className="p-3 settings-label hover:no-underline hover:bg-neutral-light/30 rounded-t-lg">
             Decision-Maker Persona (Optional)
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 border-t border-neutral-light/40 space-y-4">
              <div>
                <label htmlFor="personaRole" className="settings-label text-xs">Role/Title</label>
                <Input id="personaRole" value={personaRole} onChange={(e) => handleChange('personaRole', e.target.value)} className="settings-input text-sm" />
              </div>
              <div>
                <label className="settings-label text-xs">Primary Concerns</label>
                {/* TODO: Replace with actual MultiSelect component using store state 'personaConcerns' and 'setAudienceField' */}
                <div className="p-2 border rounded-md bg-neutral-light/20 text-xs text-neutral-medium">Multi-select placeholder: {concerns.join(', ')}</div>
              </div>
              <div>
                <label className="settings-label text-xs">Decision Criteria</label>
                {/* TODO: Replace with actual MultiSelect component using store state 'personaCriteria' and 'setAudienceField' */}
                <div className="p-2 border rounded-md bg-neutral-light/20 text-xs text-neutral-medium">Multi-select placeholder: {criteria.join(', ')}</div>
              </div>
              <div>
                <label className="settings-label text-xs">Communication Preferences</label>
                {/* TODO: Replace with actual MultiSelect component using store state 'personaCommPrefs' and 'setAudienceField' */}
                <div className="p-2 border rounded-md bg-neutral-light/20 text-xs text-neutral-medium">Multi-select placeholder: {commPrefs.join(', ')}</div>
              </div>
             </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
};

export default TargetAudienceForm;