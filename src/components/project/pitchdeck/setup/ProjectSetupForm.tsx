import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Input, RadioGroup, RadioGroupItem } from '@/components/ui';
import { Lock, Users, Globe } from 'lucide-react';

interface ProjectSetupFormProps {
  projectName: string;
  setProjectName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  privacy: 'private' | 'team' | 'public';
  setPrivacy: (privacy: 'private' | 'team' | 'public') => void;
  // Removed tagsInput and teamInput props
  setTagsInput: (tags: string) => void; // Renamed prop for clarity (maps to setTagsFromString)
  setTeamInput: (team: string) => void; // Renamed prop for clarity (maps to setTeamMembersFromString)
}

const ProjectSetupForm: React.FC<ProjectSetupFormProps> = ({
  projectName,
  setProjectName,
  description,
  setDescription,
  privacy,
  setPrivacy,
  setTagsInput, // Destructure renamed prop
  setTeamInput, // Destructure renamed prop
}) => {
  // Local state for input fields
  const [localTagsInput, setLocalTagsInput] = useState<string>('');
  const [localTeamInput, setLocalTeamInput] = useState<string>('');

  // Effect to potentially initialize local state if needed (e.g., loading existing project)
  // This example assumes starting fresh, but you might load initial values here
  // useEffect(() => {
  //   // If loading data, set initial local state based on store values if they exist
  //   // setLocalTagsInput(initialTagsString);
  //   // setLocalTeamInput(initialTeamString);
  // }, []); // Run once on mount

  // Handler for description textarea
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  // Handler for privacy radio group
  const handlePrivacyChange = (value: string) => {
    setPrivacy(value as 'private' | 'team' | 'public');
  };

  // Update global store when input fields lose focus (onBlur)
  const handleTagsBlur = () => {
    setTagsInput(localTagsInput); // Call the prop function (Zustand action)
  };

  const handleTeamBlur = () => {
    setTeamInput(localTeamInput); // Call the prop function (Zustand action)
  };

  return (
    <div className="project-setup-form space-y-6 mb-8">
      {/* Project Name */}
      <div>
        <label htmlFor="projectName" className="settings-label">Project Name <span className="text-red-500">*</span></label>
        <Input
          id="projectName"
          type="text"
          value={projectName} // Still controlled by prop/store
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
          placeholder="Enter a name for your project"
          required
          className="settings-input"
        />
         <p className="text-xs text-neutral-medium mt-1">Category: Proposal & Pitch Deck Generation</p>
      </div>

      {/* Project Description */}
      <div>
        <label htmlFor="description" className="settings-label">Project Description (Optional)</label>
        <textarea
          id="description"
          value={description} // Still controlled by prop/store
          onChange={handleDescriptionChange}
          placeholder="Briefly describe your project..."
          className="settings-textarea w-full"
          rows={4}
        />
      </div>

     {/* Tags Input - Uses local state */}
     <div>
       <label htmlFor="tagsInput" className="settings-label">Tags (Optional)</label>
       <Input
         id="tagsInput"
         type="text"
         value={localTagsInput} // Use local state for value
         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalTagsInput(e.target.value)} // Update local state
         onBlur={handleTagsBlur} // Update global store on blur
         placeholder="Enter tags, separated by commas"
         className="settings-input"
       />
       <p className="text-xs text-neutral-medium mt-1">Separate multiple tags with commas (e.g., proposal, investment, tech).</p>
     </div>

     {/* Team Members Input - Uses local state */}
     <div>
       <label htmlFor="teamInput" className="settings-label">Team Members (Optional)</label>
       <Input
         id="teamInput"
         type="text"
         value={localTeamInput} // Use local state for value
         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalTeamInput(e.target.value)} // Update local state
         onBlur={handleTeamBlur} // Update global store on blur
         placeholder="Enter team member emails, separated by commas"
         className="settings-input"
       />
        <p className="text-xs text-neutral-medium mt-1">Separate multiple emails with commas.</p>
      </div>

      {/* Privacy Settings */}
      <div>
        <label className="settings-label">Privacy Settings</label>
        <RadioGroup
          value={privacy} // Still controlled by prop/store
          onValueChange={handlePrivacyChange}
          className="flex flex-col sm:flex-row gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 p-3 border rounded-md flex-1 cursor-pointer hover:border-[#ae5630] has-[:checked]:border-[#ae5630]  has-[:checked]:ring-1 has-[:checked]:ring-[#ae5630]">
            <RadioGroupItem value="private" id="privacy-private" />
            <label htmlFor="privacy-private" className="flex items-center gap-2 cursor-pointer">
              <Lock size={16} /> Private (Only you)
            </label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-md flex-1 cursor-pointer hover:border-[#ae5630] has-[:checked]:border-[#ae5630] has-[:checked]:ring-1 has-[:checked]:ring-[#ae5630]">
            <RadioGroupItem value="team" id="privacy-team" />
            <label htmlFor="privacy-team" className="flex items-center gap-2 cursor-pointer">
              <Users size={16} /> Team (Invited members)
            </label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-md flex-1 cursor-pointer hover:border-[#ae5630] has-[:checked]:border-[#ae5630] has-[:checked]:ring-1 has-[:checked]:ring-[#ae5630]">
            <RadioGroupItem value="public" id="privacy-public" />
            <label htmlFor="privacy-public" className="flex items-center gap-2 cursor-pointer">
              <Globe size={16} /> Public (Anyone with link)
            </label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default ProjectSetupForm;