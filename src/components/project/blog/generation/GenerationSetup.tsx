import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';

interface GenerationSetupProps {
  onGenerate: (options: {
    factCheckLevel: 'basic' | 'standard' | 'thorough',
    visualsEnabled: boolean,
    contentTone: 'formal' | 'conversational' | 'persuasive',
    contentDepth: 'brief' | 'standard' | 'comprehensive',
    typingSpeed: number
  }) => void;
  isGenerating: boolean;
  projectId: string | null;
}

const GenerationSetup: React.FC<GenerationSetupProps> = ({
  onGenerate,
  isGenerating,
  projectId
}) => {
  // Local state for generation options
  const [factCheckLevel, setFactCheckLevel] = useState<'basic' | 'standard' | 'thorough'>('standard');
  const [visualsEnabled, setVisualsEnabled] = useState(true);
  const [contentTone, setContentTone] = useState<'formal' | 'conversational' | 'persuasive'>('conversational');
  const [contentDepth, setContentDepth] = useState<'brief' | 'standard' | 'comprehensive'>('standard');
  const [typingSpeed, setTypingSpeed] = useState(50);
  
  // Get store values for info display
  const { 
    projectName, 
    primaryGoal, 
    audienceName, 
    selectedBlogTypeId, 
    targetKeywords 
  } = useProjectWorkflowStore();
  
  // Get blog type name for display
  const getBlogTypeName = (id: string | null) => {
    if (!id) return 'Unknown';
    
    const blogTypes: Record<string, string> = {
      'how-to': 'How-to Guide',
      'listicle': 'List Article',
      'opinion': 'Opinion Piece',
      'trend-analysis': 'Trend Analysis',
      'case-study': 'Case Study',
      'product-review': 'Product Review',
      'thought-leadership': 'Thought Leadership',
      'comparison': 'Comparison Article'
    };
    
    return blogTypes[id] || 'Custom Blog Type';
  };
  
  // Get content goal for display
  const getContentGoal = (goal: string | null) => {
    if (!goal) return 'Not specified';
    
    const goals: Record<string, string> = {
      'educate': 'Educate & Inform',
      'entertain': 'Entertain & Engage',
      'persuade': 'Persuade & Convince',
      'convert': 'Convert Readers',
      'authority': 'Build Authority',
      'engagement': 'Generate Discussion'
    };
    
    return goals[goal] || goal;
  };

  const handleGenerateClick = () => {
    onGenerate({
      factCheckLevel,
      visualsEnabled,
      contentTone,
      contentDepth,
      typingSpeed,
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Blog Generation Setup</h3>
      
      <div className="space-y-6">
        <div className="bg-neutral-light/20 p-4 rounded-md">
          <h4 className="text-sm font-medium text-neutral-dark mb-2">Blog Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-muted">Title:</span>
              <span className="font-medium">{projectName || 'Untitled Blog'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-muted">Type:</span>
              <span className="font-medium">{getBlogTypeName(selectedBlogTypeId)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-muted">Primary Goal:</span>
              <span className="font-medium">{getContentGoal(primaryGoal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-muted">Target Audience:</span>
              <span className="font-medium">{audienceName || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-muted">Keywords:</span>
              <span className="font-medium">{targetKeywords?.slice(0, 30) || 'Not specified'}{targetKeywords?.length > 30 ? '...' : ''}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="contentTone" className="text-sm font-medium text-neutral-dark mb-1 block">Tone of Voice</Label>
            <Select
              value={contentTone}
              onValueChange={(value) => setContentTone(value as 'formal' | 'conversational' | 'persuasive')}
            >
              <SelectTrigger className="w-full" id="contentTone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal & Professional</SelectItem>
                <SelectItem value="conversational">Conversational & Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive & Compelling</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="contentDepth" className="text-sm font-medium text-neutral-dark mb-1 block">Content Depth</Label>
            <Select
              value={contentDepth}
              onValueChange={(value) => setContentDepth(value as 'brief' | 'standard' | 'comprehensive')}
            >
              <SelectTrigger className="w-full" id="contentDepth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Brief (500-800 words)</SelectItem>
                <SelectItem value="standard">Standard (800-1200 words)</SelectItem>
                <SelectItem value="comprehensive">Comprehensive (1200-2000 words)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="factCheckLevel" className="text-sm font-medium text-neutral-dark mb-1 block">Fact Checking Level</Label>
            <Select
              value={factCheckLevel}
              onValueChange={(value) => setFactCheckLevel(value as 'basic' | 'standard' | 'thorough')}
            >
              <SelectTrigger className="w-full" id="factCheckLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (Terminology and obvious errors)</SelectItem>
                <SelectItem value="standard">Standard (Includes claim verification)</SelectItem>
                <SelectItem value="thorough">Thorough (Comprehensive source validation)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-neutral-muted mt-1">
              Higher fact-checking levels may increase generation time.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="visualsEnabled" className="text-sm font-medium text-neutral-dark mb-1 block">
                Visual Element Suggestions
              </Label>
              <p className="text-xs text-neutral-muted">
                Include suggestions for images, charts, and graphics
              </p>
            </div>
            <Switch 
              id="visualsEnabled" 
              checked={visualsEnabled}
              onCheckedChange={setVisualsEnabled}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <Label htmlFor="typingSpeed" className="text-sm font-medium text-neutral-dark">
                Generation Speed
              </Label>
              <span className="text-xs text-neutral-muted">
                {typingSpeed < 30 ? 'Fast' : typingSpeed < 70 ? 'Medium' : 'Slow'}
              </span>
            </div>
            <Slider
              id="typingSpeed"
              value={typingSpeed}
              onChange={(value: number) => setTypingSpeed(value)}
              min={10}
              max={100}
              step={10}
            />
            <p className="text-xs text-neutral-muted mt-1">
              Slower generation shows more of the writing process.
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleGenerateClick}
          disabled={isGenerating || !projectId}
          className="w-full"
          size="lg"
        >
          {isGenerating ? 'Generating Content...' : 'Generate Blog Content'}
        </Button>
      </div>
    </Card>
  );
};

export default GenerationSetup;
