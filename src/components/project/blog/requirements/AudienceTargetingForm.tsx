import React, { useState } from 'react';
import { 
  Card, 
  Input, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Textarea,
  Label,
  Button
} from '@/components/ui';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';

const AudienceTargetingForm: React.FC = () => {
  const { 
    audienceName, 
    demographicInfo, 
    knowledgeLevel, 
    industry, 
    interests, 
    painPoints, 
    desiredOutcomes,
    setAudienceField 
  } = useProjectWorkflowStore();

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFromPrompt = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Simulate AI generating audience details
      setAudienceField('audienceName', 'Marketing Professionals');
      setAudienceField('demographicInfo', '25-45 years old, primarily in tech and digital marketing sectors');
      setAudienceField('knowledgeLevel', 'intermediate');
      setAudienceField('industry', 'Marketing & Advertising');
      setAudienceField('interests', 'Content strategy, SEO, marketing automation, digital analytics');
      setAudienceField('painPoints', 'Time constraints, measuring ROI, keeping up with platform changes, content creation at scale');
      setAudienceField('desiredOutcomes', 'Improved efficiency, better campaign performance, actionable insights for strategy');
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold font-heading text-secondary">Target Audience Definition</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGenerateFromPrompt}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate from Project Description'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="audienceName" className="block mb-2">Primary Audience</Label>
          <Input
            id="audienceName"
            value={audienceName || ''}
            onChange={(e) => setAudienceField('audienceName', e.target.value)}
            placeholder="e.g., Small Business Owners, Senior Marketing Managers"
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="demographicInfo" className="block mb-2">Demographics (Optional)</Label>
          <Input
            id="demographicInfo"
            value={demographicInfo || ''}
            onChange={(e) => setAudienceField('demographicInfo', e.target.value)}
            placeholder="e.g., 30-45 years old, B2B sector, mid-career professionals"
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="knowledgeLevel" className="block mb-2">Knowledge Level</Label>
          <Select 
            value={knowledgeLevel || ''} 
            onValueChange={(value) => setAudienceField('knowledgeLevel', value)}
          >
            <SelectTrigger id="knowledgeLevel" className="w-full">
              <SelectValue placeholder="Select reader knowledge level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner - New to the topic</SelectItem>
              <SelectItem value="intermediate">Intermediate - Some familiarity</SelectItem>
              <SelectItem value="expert">Expert - Advanced understanding</SelectItem>
              <SelectItem value="mixed">Mixed - Various levels of expertise</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="industry" className="block mb-2">Industry/Field</Label>
          <Input
            id="industry"
            value={industry || ''}
            onChange={(e) => setAudienceField('industry', e.target.value)}
            placeholder="e.g., Healthcare, Finance, Education, Technology"
            className="w-full"
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="interests" className="block mb-2">Interests & Focus Areas</Label>
          <Textarea
            id="interests"
            value={interests || ''}
            onChange={(e) => setAudienceField('interests', e.target.value)}
            placeholder="Topics, themes, and subjects that interest your target audience"
            className="w-full h-20"
          />
        </div>
        
        <div>
          <Label htmlFor="painPoints" className="block mb-2">Pain Points & Challenges</Label>
          <Textarea
            id="painPoints"
            value={painPoints || ''}
            onChange={(e) => setAudienceField('painPoints', e.target.value)}
            placeholder="Problems your audience is trying to solve"
            className="w-full h-20"
          />
          <p className="text-xs text-neutral-muted mt-1">
            What specific problems or challenges does your audience face that this content will address?
          </p>
        </div>
        
        <div>
          <Label htmlFor="desiredOutcomes" className="block mb-2">Desired Outcomes</Label>
          <Textarea
            id="desiredOutcomes"
            value={desiredOutcomes || ''}
            onChange={(e) => setAudienceField('desiredOutcomes', e.target.value)}
            placeholder="What readers hope to gain from your content"
            className="w-full h-20"
          />
          <p className="text-xs text-neutral-muted mt-1">
            What should readers be able to do, understand, or achieve after reading your blog post?
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AudienceTargetingForm;
