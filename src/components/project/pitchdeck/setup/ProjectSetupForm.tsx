import React, { useState } from 'react';
import { Input, RadioGroup, RadioGroupItem, Label, Card, Textarea } from '@/components/ui';
import { Lock, Users, Globe } from 'lucide-react';
import ImportOptions from './ImportOptions';

interface ProjectSetupFormProps {
  projectName: string;
  setProjectName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  privacy: 'private' | 'team' | 'public';
  setPrivacy: (privacy: 'private' | 'team' | 'public') => void;
  setTagsInput: (tags: string) => void;
  setTeamInput: (team: string) => void;
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
    <>
      <Card className="p-6">
        <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Pitch Deck Details</h3>
        
        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <Label htmlFor="projectName" className="block mb-2">Project Name <span className="text-red-500">*</span></Label>
            <Input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter a name for your project"
              required
              className="w-full"
            />
            <p className="text-xs text-neutral-muted mt-1">
              A clear, descriptive name for your pitch deck project.
            </p>
            <p className="text-xs text-neutral-muted">Category: Proposal & Pitch Deck Generation</p>
          </div>

          {/* Project Description */}
          <div>
            <Label htmlFor="description" className="block mb-2">Project Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your project..."
              className="w-full h-24"
            />
            <p className="text-xs text-neutral-muted mt-1">
              A concise overview that captures the essence of your pitch deck project.
            </p>
          </div>

          {/* Tags Input */}
          <div>
            <Label htmlFor="tagsInput" className="block mb-2">Tags (Optional)</Label>
            <Input
              id="tagsInput"
              type="text"
              value={localTagsInput}
              onChange={(e) => setLocalTagsInput(e.target.value)}
              onBlur={handleTagsBlur}
              placeholder="proposal, investment, tech"
              className="w-full"
            />
            <p className="text-xs text-neutral-muted mt-1">
              Comma-separated keywords related to your pitch deck (helps with organization).
            </p>
          </div>

          {/* Contributors Input */}
          <div>
            <Label htmlFor="teamInput" className="block mb-2">Contributors</Label>
            <Input
              id="teamInput"
              type="text"
              value={localTeamInput}
              onChange={(e) => setLocalTeamInput(e.target.value)}
              onBlur={handleTeamBlur}
              placeholder="john@example.com, jane@example.com"
              className="w-full"
            />
            <p className="text-xs text-neutral-muted mt-1">
              Email addresses of team members who will collaborate on this pitch deck.
            </p>
          </div>

          {/* Privacy Settings */}
          <div>
            <Label className="block mb-2">Privacy Settings</Label>
            <RadioGroup
              value={privacy}
              onValueChange={handlePrivacyChange}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="privacy-private" />
                <Label htmlFor="privacy-private" className="cursor-pointer flex items-center gap-2">
                  <Lock size={16} /> Private (Only you can access)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="team" id="privacy-team" />
                <Label htmlFor="privacy-team" className="cursor-pointer flex items-center gap-2">
                  <Users size={16} /> Team (You and contributors can access)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="privacy-public" />
                <Label htmlFor="privacy-public" className="cursor-pointer flex items-center gap-2">
                  <Globe size={16} /> Public (Anyone with the link can access)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>
      
      {/* Import Options Section */}
      <div className="mt-6">
        <ImportOptions />
      </div>
    </>
  );
};

export default ProjectSetupForm;