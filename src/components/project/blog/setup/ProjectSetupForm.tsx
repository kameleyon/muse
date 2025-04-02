import React from 'react';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Label } from '@/components/ui';
import { Card } from '@/components/ui';
import { RadioGroup, RadioGroupItem } from '@/components/ui';
import { PrivacyLevel } from '@/store/types';

interface ProjectSetupFormProps {
  projectName: string;
  description: string;
  privacy: PrivacyLevel;
  setProjectName: (name: string) => void;
  setDescription: (description: string) => void;
  setPrivacy: (privacy: PrivacyLevel) => void;
  setTagsInput: (tags: string) => void;
  setTeamInput: (team: string) => void;
}

const ProjectSetupForm: React.FC<ProjectSetupFormProps> = ({
  projectName,
  description,
  privacy,
  setProjectName,
  setDescription,
  setPrivacy,
  setTagsInput,
  setTeamInput
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Blog Post Details</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="projectName" className="block mb-2">Blog Post Title <span className="text-red-500">*</span></Label>
          <Input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter a title for your blog post"
            className="w-full"
            required
          />
          <p className="text-xs text-neutral-muted mt-1">
            A clear, engaging title that accurately reflects your content.
          </p>
        </div>
        
        <div>
          <Label htmlFor="description" className="block mb-2">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief summary of what your blog post will cover"
            className="w-full h-24"
          />
          <p className="text-xs text-neutral-muted mt-1">
            A concise 2-3 sentence overview that captures the essence of your post.
          </p>
        </div>
        
        <div>
          <Label htmlFor="tags" className="block mb-2">Tags</Label>
          <Input
            id="tags"
            type="text"
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="productivity, marketing, growth strategy"
            className="w-full"
          />
          <p className="text-xs text-neutral-muted mt-1">
            Comma-separated keywords related to your content (helps with organization and SEO).
          </p>
        </div>
        
        <div>
          <Label htmlFor="teamMembers" className="block mb-2">Contributors</Label>
          <Input
            id="teamMembers"
            type="text"
            onChange={(e) => setTeamInput(e.target.value)}
            placeholder="john@example.com, jane@example.com"
            className="w-full"
          />
          <p className="text-xs text-neutral-muted mt-1">
            Email addresses of team members who will collaborate on this blog post.
          </p>
        </div>
        
        <div>
          <Label className="block mb-2">Privacy Settings</Label>
          <RadioGroup 
            value={privacy} 
            onValueChange={(value: string) => setPrivacy(value as PrivacyLevel)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="cursor-pointer">Private (Only you can access)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="team" id="team" />
              <Label htmlFor="team" className="cursor-pointer">Team (You and contributors can access)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="cursor-pointer">Public (Anyone with the link can access)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </Card>
  );
};

export default ProjectSetupForm;
