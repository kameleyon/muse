import React from 'react';
import { Card } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';

const BlogObjectivesForm: React.FC = () => {
  const { 
    primaryGoal, 
    contentGoals, 
    targetKeywords, 
    setObjectiveField 
  } = useProjectWorkflowStore();

  // Initialize contentGoals as an array if it's null
  const goals = contentGoals || [];

  const handleGoalToggle = (value: string) => {
    if (!contentGoals) {
      setObjectiveField('contentGoals', [value]);
      return;
    }

    const updatedGoals = contentGoals.includes(value)
      ? contentGoals.filter(goal => goal !== value)
      : [...contentGoals, value];
    
    setObjectiveField('contentGoals', updatedGoals);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Blog Objectives & Goals</h3>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="primaryGoal" className="block mb-2">Primary Goal</Label>
          <Select 
            value={primaryGoal || ''} 
            onValueChange={(value) => setObjectiveField('primaryGoal', value)}
          >
            <SelectTrigger id="primaryGoal" className="w-full">
              <SelectValue placeholder="Select primary goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="educate">Educate - Inform readers about a topic</SelectItem>
              <SelectItem value="entertain">Entertain - Engage readers with interesting content</SelectItem>
              <SelectItem value="persuade">Persuade - Convince readers of a viewpoint</SelectItem>
              <SelectItem value="convert">Convert - Turn readers into customers/subscribers</SelectItem>
              <SelectItem value="authority">Build Authority - Establish expertise and credibility</SelectItem>
              <SelectItem value="engagement">Generate Discussion - Encourage comments and shares</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-muted mt-1">
            The main purpose of your blog post. This helps focus the content strategy.
          </p>
        </div>
        
        <div>
          <Label className="block mb-2">Secondary Goals (Select all that apply)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goal-seo" 
                checked={goals.includes('seo')}
                onCheckedChange={() => handleGoalToggle('seo')}
              />
              <Label htmlFor="goal-seo" className="cursor-pointer text-sm">Improve SEO rankings</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goal-traffic" 
                checked={goals.includes('traffic')}
                onCheckedChange={() => handleGoalToggle('traffic')}
              />
              <Label htmlFor="goal-traffic" className="cursor-pointer text-sm">Drive website traffic</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goal-leads" 
                checked={goals.includes('leads')}
                onCheckedChange={() => handleGoalToggle('leads')}
              />
              <Label htmlFor="goal-leads" className="cursor-pointer text-sm">Generate leads</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goal-shares" 
                checked={goals.includes('shares')}
                onCheckedChange={() => handleGoalToggle('shares')}
              />
              <Label htmlFor="goal-shares" className="cursor-pointer text-sm">Increase social shares</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goal-newsletter" 
                checked={goals.includes('newsletter')}
                onCheckedChange={() => handleGoalToggle('newsletter')}
              />
              <Label htmlFor="goal-newsletter" className="cursor-pointer text-sm">Build email list</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goal-backlinks" 
                checked={goals.includes('backlinks')}
                onCheckedChange={() => handleGoalToggle('backlinks')}
              />
              <Label htmlFor="goal-backlinks" className="cursor-pointer text-sm">Attract backlinks</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goal-awareness" 
                checked={goals.includes('awareness')}
                onCheckedChange={() => handleGoalToggle('awareness')}
              />
              <Label htmlFor="goal-awareness" className="cursor-pointer text-sm">Raise brand awareness</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="goal-engagement" 
                checked={goals.includes('engagement')}
                onCheckedChange={() => handleGoalToggle('engagement')}
              />
              <Label htmlFor="goal-engagement" className="cursor-pointer text-sm">Increase engagement</Label>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="targetKeywords" className="block mb-2">Target Keywords</Label>
          <Textarea
            id="targetKeywords"
            value={targetKeywords || ''}
            onChange={(e) => setObjectiveField('targetKeywords', e.target.value)}
            placeholder="Primary and secondary keywords, one per line"
            className="w-full h-20"
          />
          <p className="text-xs text-neutral-muted mt-1">
            Enter your target keywords or phrases, ideally one per line. Include both primary and secondary keywords.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BlogObjectivesForm;
