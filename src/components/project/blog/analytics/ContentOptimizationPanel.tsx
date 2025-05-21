import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface ContentSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'update' | 'expand' | 'repurpose';
}

const ContentOptimizationPanel: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Sample content suggestions
  const contentSuggestions: ContentSuggestion[] = [
    {
      id: 'sug-1',
      title: 'Update with Recent Statistics',
      description: 'Refresh the market size statistics with the latest data to improve relevance and accuracy.',
      impact: 'high',
      type: 'update'
    },
    {
      id: 'sug-2',
      title: 'Add FAQ Section',
      description: 'Add a frequently asked questions section to address common reader queries and improve SEO.',
      impact: 'medium',
      type: 'expand'
    },
    {
      id: 'sug-3',
      title: 'Create Infographic',
      description: 'Repurpose the key points into a shareable infographic to increase social engagement.',
      impact: 'high',
      type: 'repurpose'
    },
    {
      id: 'sug-4',
      title: 'Add Case Study Example',
      description: 'Include a brief case study to illustrate the main concept with a real-world example.',
      impact: 'medium',
      type: 'expand'
    },
    {
      id: 'sug-5',
      title: 'Update Competitor Information',
      description: 'Refresh the competitor analysis section to reflect recent market changes.',
      impact: 'medium',
      type: 'update'
    },
    {
      id: 'sug-6',
      title: 'Create Social Media Snippets',
      description: 'Extract 5-7 quote-worthy snippets for sharing on social media platforms.',
      impact: 'low',
      type: 'repurpose'
    }
  ];
  
  // Filter suggestions by type
  const filteredSuggestions = selectedType 
    ? contentSuggestions.filter(suggestion => suggestion.type === selectedType)
    : contentSuggestions;
  
  // Get impact color
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Get type label
  const getTypeLabel = (type: 'update' | 'expand' | 'repurpose') => {
    switch (type) {
      case 'update': return 'Update';
      case 'expand': return 'Expand';
      case 'repurpose': return 'Repurpose';
      default: return type;
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold font-heading text-secondary mb-4">Content Optimization</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-neutral-dark">Improvement Suggestions</h4>
            <p className="text-xs text-neutral-muted">
              AI-powered optimization recommendations
            </p>
          </div>
          
          <Select
            value={selectedType || 'all'}
            onValueChange={(value) => setSelectedType(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="update">Updates</SelectItem>
              <SelectItem value="expand">Expansions</SelectItem>
              <SelectItem value="repurpose">Repurposing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {filteredSuggestions.map((suggestion) => (
            <div 
              key={suggestion.id}
              className="bg-white p-3 rounded-md border border-neutral-light shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-sm font-medium text-neutral-dark">{suggestion.title}</h5>
                <div className="flex gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactColor(suggestion.impact)}`}>
                    {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800">
                    {getTypeLabel(suggestion.type)}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-neutral-muted mb-3">
                {suggestion.description}
              </p>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Implement
                </Button>
                <Button size="sm">
                  {suggestion.type === 'update' ? 'Update Now' : 
                   suggestion.type === 'expand' ? 'Expand Content' : 
                   'Create'}
                </Button>
              </div>
            </div>
          ))}
          
          {filteredSuggestions.length === 0 && (
            <div className="text-center py-6 bg-neutral-light/10 rounded-md">
              <p className="text-sm text-neutral-muted">
                No suggestions found for the selected type.
              </p>
            </div>
          )}
        </div>
        
        <div className="pt-3 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark mb-3">Content Repurposing</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-light/10 p-3 rounded-md flex flex-col">
              <h5 className="text-sm font-medium mb-1">Social Media Series</h5>
              <p className="text-xs text-neutral-muted flex-grow mb-3">
                Transform this blog post into a series of social media posts.
              </p>
              <Button variant="outline" size="sm" className="self-end">
                Generate
              </Button>
            </div>
            
            <div className="bg-neutral-light/10 p-3 rounded-md flex flex-col">
              <h5 className="text-sm font-medium mb-1">Email Newsletter</h5>
              <p className="text-xs text-neutral-muted flex-grow mb-3">
                Adapt this content for an email newsletter format.
              </p>
              <Button variant="outline" size="sm" className="self-end">
                Generate
              </Button>
            </div>
            
            <div className="bg-neutral-light/10 p-3 rounded-md flex flex-col">
              <h5 className="text-sm font-medium mb-1">Infographic</h5>
              <p className="text-xs text-neutral-muted flex-grow mb-3">
                Create a visual infographic from key points and data.
              </p>
              <Button variant="outline" size="sm" className="self-end">
                Generate
              </Button>
            </div>
            
            <div className="bg-neutral-light/10 p-3 rounded-md flex flex-col">
              <h5 className="text-sm font-medium mb-1">Video Script</h5>
              <p className="text-xs text-neutral-muted flex-grow mb-3">
                Convert this blog post into a video script format.
              </p>
              <Button variant="outline" size="sm" className="self-end">
                Generate
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark mb-3">Evergreen Updates</h4>
          <div className="flex justify-between items-center bg-neutral-light/10 p-3 rounded-md">
            <div>
              <div className="text-sm font-medium mb-1">Schedule Regular Content Refresh</div>
              <p className="text-xs text-neutral-muted">
                Set up automatic reminders to update this content periodically.
              </p>
            </div>
            <Select defaultValue="quarterly">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="biannually">Bi-annually</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContentOptimizationPanel;
