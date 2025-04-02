import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ContentElement {
  type: string;
  id: string;
  name: string;
}

interface ContentElementPlannerProps {
  contentElements: ContentElement[] | null;
  onContentElementsChange: (elements: ContentElement[]) => void;
}

const ContentElementPlanner: React.FC<ContentElementPlannerProps> = ({
  contentElements,
  onContentElementsChange
}) => {
  const [activeTab, setActiveTab] = useState('visual');
  const [customElement, setCustomElement] = useState('');
  
  // Initialize elements
  const elements = contentElements || [];
  
  // Predefined element templates
  const visualElements = [
    { type: 'visual', id: 'image', name: 'Featured Image' },
    { type: 'visual', id: 'infographic', name: 'Infographic' },
    { type: 'visual', id: 'chart', name: 'Chart or Graph' },
    { type: 'visual', id: 'screenshot', name: 'Screenshot' },
    { type: 'visual', id: 'video', name: 'Embedded Video' },
    { type: 'visual', id: 'social-embed', name: 'Social Media Embed' }
  ];
  
  const contentStructureElements = [
    { type: 'structure', id: 'toc', name: 'Table of Contents' },
    { type: 'structure', id: 'callout', name: 'Callout Box' },
    { type: 'structure', id: 'blockquote', name: 'Blockquote' },
    { type: 'structure', id: 'bullet-list', name: 'Bullet List' },
    { type: 'structure', id: 'numbered-list', name: 'Numbered List' },
    { type: 'structure', id: 'table', name: 'Data Table' }
  ];
  
  const interactiveElements = [
    { type: 'interactive', id: 'poll', name: 'Poll' },
    { type: 'interactive', id: 'quiz', name: 'Quiz' },
    { type: 'interactive', id: 'calculator', name: 'Calculator' },
    { type: 'interactive', id: 'form', name: 'Form/Survey' },
    { type: 'interactive', id: 'comments', name: 'Comments Section' },
    { type: 'interactive', id: 'interactive-chart', name: 'Interactive Chart' }
  ];
  
  const handleToggleElement = (element: ContentElement) => {
    const isSelected = elements.some(el => el.id === element.id);
    
    if (isSelected) {
      onContentElementsChange(elements.filter(el => el.id !== element.id));
    } else {
      onContentElementsChange([...elements, element]);
    }
  };
  
  const handleAddCustomElement = () => {
    if (customElement.trim() === '') return;
    
    const newElement = {
      type: 'custom',
      id: `custom-${Date.now()}`,
      name: customElement
    };
    
    onContentElementsChange([...elements, newElement]);
    setCustomElement('');
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Content Element Planning</h3>
      <p className="text-sm text-neutral-muted mb-6">
        Select the elements you want to include in your blog post to enhance the content.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="visual">Visual Elements</TabsTrigger>
          <TabsTrigger value="structure">Structure Elements</TabsTrigger>
          <TabsTrigger value="interactive">Interactive Elements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visual" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {visualElements.map((element) => (
              <div key={element.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`element-${element.id}`}
                  checked={elements.some(el => el.id === element.id)}
                  onCheckedChange={() => handleToggleElement(element)}
                />
                <div>
                  <Label 
                    htmlFor={`element-${element.id}`}
                    className="cursor-pointer font-medium text-sm"
                  >
                    {element.name}
                  </Label>
                  <p className="text-xs text-neutral-muted">
                    {getElementDescription(element.id)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="structure" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {contentStructureElements.map((element) => (
              <div key={element.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`element-${element.id}`}
                  checked={elements.some(el => el.id === element.id)}
                  onCheckedChange={() => handleToggleElement(element)}
                />
                <div>
                  <Label 
                    htmlFor={`element-${element.id}`}
                    className="cursor-pointer font-medium text-sm"
                  >
                    {element.name}
                  </Label>
                  <p className="text-xs text-neutral-muted">
                    {getElementDescription(element.id)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="interactive" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {interactiveElements.map((element) => (
              <div key={element.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`element-${element.id}`}
                  checked={elements.some(el => el.id === element.id)}
                  onCheckedChange={() => handleToggleElement(element)}
                />
                <div>
                  <Label 
                    htmlFor={`element-${element.id}`}
                    className="cursor-pointer font-medium text-sm"
                  >
                    {element.name}
                  </Label>
                  <p className="text-xs text-neutral-muted">
                    {getElementDescription(element.id)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 pt-6 border-t border-neutral-light">
        <h4 className="font-medium text-neutral-dark mb-2">Add Custom Element</h4>
        <div className="flex gap-2">
          <Input
            value={customElement}
            onChange={(e) => setCustomElement(e.target.value)}
            placeholder="Enter custom element name"
            className="flex-grow"
          />
          <Button 
            onClick={handleAddCustomElement}
            disabled={!customElement.trim()}
            size="sm"
          >
            Add
          </Button>
        </div>
      </div>
      
      {elements.length > 0 && (
        <div className="mt-6 pt-6 border-t border-neutral-light">
          <h4 className="font-medium text-neutral-dark mb-3">Selected Elements</h4>
          <div className="flex flex-wrap gap-2">
            {elements.map((element) => (
              <div 
                key={element.id}
                className="bg-neutral-light/30 text-neutral-dark text-sm px-3 py-1.5 rounded-full flex items-center gap-2"
              >
                {element.name}
                <button 
                  onClick={() => handleToggleElement(element)}
                  className="text-neutral-muted hover:text-primary focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

// Helper function to get descriptions for elements
function getElementDescription(id: string): string {
  const descriptions: Record<string, string> = {
    'image': 'Eye-catching relevant images to illustrate your points',
    'infographic': 'Visual representation of data or concepts',
    'chart': 'Data visualization to support your arguments',
    'screenshot': 'Visual examples of software, websites, or processes',
    'video': 'Embedded video content for deeper explanation',
    'social-embed': 'Embedded social media posts as examples',
    
    'toc': 'Navigation aid for longer articles',
    'callout': 'Highlighted information boxes for important points',
    'blockquote': 'Quote formatting for testimonials or sources',
    'bullet-list': 'Organized points in an easy-to-scan format',
    'numbered-list': 'Sequential steps or ranked items',
    'table': 'Organized comparison of multiple data points',
    
    'poll': 'Reader engagement through voting',
    'quiz': 'Test reader knowledge or provide self-assessment',
    'calculator': 'Interactive tool for personalized results',
    'form': 'Gather feedback or generate leads',
    'comments': 'Enable reader discussion and feedback',
    'interactive-chart': 'Charts that readers can manipulate to explore data'
  };
  
  return descriptions[id] || 'Custom content element';
}

export default ContentElementPlanner;
