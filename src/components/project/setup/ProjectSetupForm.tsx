import React from 'react';
import { Input } from '@/components/ui/Input';
// Removed incorrect Textarea import
// Removed incorrect Label import
import { RadioGroup } from '@/components/ui/RadioGroup'; // Correct import path
import { RadioGroupItem } from '@/components/ui/RadioGroupItem'; // Correct import path
import { Button } from '@/components/ui/Button';
// Assuming Select/MultiSelect components exist or will be created
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
// import { MultiSelect } from "@/components/ui/MultiSelect";
import { Lock, Users, Globe } from 'lucide-react';

interface ProjectSetupFormProps {
  projectName: string;
  setProjectName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  privacy: 'private' | 'team' | 'public';
  setPrivacy: (privacy: 'private' | 'team' | 'public') => void;
  tagsInput: string; // Add prop for tags input value
  setTagsInput: (tags: string) => void; // Add prop for tags input setter
  teamInput: string; // Add prop for team input value
  setTeamInput: (team: string) => void; // Add prop for team input setter
}

const ProjectSetupForm: React.FC<ProjectSetupFormProps> = ({
  projectName,
  setProjectName,
  description,
  setDescription,
  privacy,
  setPrivacy,
  tagsInput,    // Destructure new prop
  setTagsInput, // Destructure new prop
  teamInput,    // Destructure new prop
  setTeamInput, // Destructure new prop
}) => {
  // Placeholder data/handlers for tags and team members
  const availableTags = ['Proposal', 'Pitch Deck', 'Investment', 'Sales', 'Startup']; // Keep for placeholder text
  const availableTeamMembers = [{id: '1', name: 'Jo Constant'}, {id: '2', name: 'AI Assistant'}]; // Example
  const selectedTags: string[] = [];
  const selectedTeamMembers: string[] = [];

  const handleTagsChange = (newTags: string[]) => console.log('Tags changed:', newTags);
  const handleTeamChange = (newMembers: string[]) => console.log('Team changed:', newMembers);

  // Explicit type for textarea change event
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  // Explicit type for radio group change event
  const handlePrivacyChange = (value: string) => {
     // Type assertion is safe here as values are controlled
    setPrivacy(value as 'private' | 'team' | 'public');
  };


  return (
    <div className="project-setup-form space-y-6 mb-8">
      {/* Project Name */}
      <div>
        {/* Use standard label tag */}
        <label htmlFor="projectName" className="settings-label">Project Name <span className="text-red-500">*</span></label>
        <Input
          id="projectName"
          type="text"
          value={projectName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)} // Added type to event
          placeholder="Enter a name for your project"
          required
          className="settings-input" // Reuse settings input style
        />
         <p className="text-xs text-neutral-medium mt-1">Category: Proposal & Pitch Deck Generation</p> {/* Display fixed category */}
      </div>

      {/* Project Description */}
      <div>
         {/* Use standard label tag */}
        <label htmlFor="description" className="settings-label">Project Description (Optional)</label>
         {/* Use standard textarea tag */}
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange} // Use handler with explicit type
          placeholder="Briefly describe your project or upload a file..."
          className="settings-textarea w-full" // Reuse settings textarea style + ensure width
          rows={4} // Example height
        />
        {/* Add file upload button/area here later */}
      </div>

     {/* Tags Input */}
     <div>
       <label htmlFor="tagsInput" className="settings-label">Tags (Optional)</label>
       <Input
         id="tagsInput"
         type="text"
         value={tagsInput}
         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagsInput(e.target.value)}
         placeholder="Enter tags, separated by commas"
         className="settings-input"
       />
       <p className="text-xs text-neutral-medium mt-1">Separate multiple tags with commas (e.g., proposal, investment, tech).</p>
     </div>

     {/* Team Members Input */}
     <div>
       <label htmlFor="teamInput" className="settings-label">Team Members (Optional)</label>
       <Input
         id="teamInput"
         type="text"
         value={teamInput}
         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamInput(e.target.value)}
         placeholder="Enter team member emails, separated by commas"
         className="settings-input"
       />
        <p className="text-xs text-neutral-medium mt-1">Separate multiple emails with commas.</p>
      </div>

      {/* Privacy Settings */}
      <div>
         {/* Use standard label tag */}
        <label className="settings-label">Privacy Settings</label>
        <RadioGroup
          value={privacy}
          onValueChange={handlePrivacyChange} // Use handler with explicit type
          className="flex flex-col sm:flex-row gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 p-3 border rounded-md flex-1 cursor-pointer hover:border-[#ae5630] has-[:checked]:border-[#ae5630]  has-[:checked]:ring-1 has-[:checked]:ring-[#ae5630]">
            <RadioGroupItem value="private" id="privacy-private" />
             {/* Use standard label tag */}
            <label htmlFor="privacy-private" className="flex items-center gap-2 cursor-pointer">
              <Lock size={16} /> Private (Only you)
            </label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-md flex-1 cursor-pointer hover:border-[#ae5630] has-[:checked]:border-[#ae5630] has-[:checked]:ring-1 has-[:checked]:ring-[#ae5630]">
            <RadioGroupItem value="team" id="privacy-team" />
             {/* Use standard label tag */}
            <label htmlFor="privacy-team" className="flex items-center gap-2 cursor-pointer">
              <Users size={16} /> Team (Invited members)
            </label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-md flex-1 cursor-pointer hover:border-[#ae5630] has-[:checked]:border-[#ae5630] has-[:checked]:ring-1 has-[:checked]:ring-[#ae5630]">
            <RadioGroupItem value="public" id="privacy-public" />
             {/* Use standard label tag */}
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