import React from 'react';
import { Card } from '@/components/ui';
import { RadioGroup, RadioGroupItem } from '@/components/ui';
import { Label } from '@/components/ui/Label';

interface StructureTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
}

interface StructureTemplateSelectorProps {
  selectedStructureId: string | null;
  onSelectStructure: (id: string) => void;
}

const StructureTemplateSelector: React.FC<StructureTemplateSelectorProps> = ({
  selectedStructureId,
  onSelectStructure
}) => {
  const structureTemplates: StructureTemplate[] = [
    {
      id: 'standard',
      name: 'Standard Article',
      description: 'A classic blog structure with introduction, body sections, and conclusion.',
      sections: ['Introduction', 'Main Body (2-3 sections)', 'Conclusion']
    },
    {
      id: 'deep-dive',
      name: 'Deep Dive',
      description: 'An in-depth exploration with comprehensive background and detailed analysis.',
      sections: ['Introduction', 'Background/Context', 'Multiple Detailed Sections', 'Expert Insights', 'Analysis', 'Conclusion']
    },
    {
      id: 'tutorial',
      name: 'Step-by-Step Tutorial',
      description: 'A practical guide with clear instructions for completing a task or process.',
      sections: ['Introduction/Problem', 'Solution Overview', 'Materials/Prerequisites', 'Step 1, Step 2, etc.', 'Troubleshooting', 'Results/Conclusion']
    },
    {
      id: 'listicle',
      name: 'Listicle',
      description: 'A structured list of items, tips, methods, or examples with brief descriptions.',
      sections: ['Introduction', 'List Items (5-10)', 'Summary']
    },
    {
      id: 'comparison',
      name: 'Comparison Article',
      description: 'A side-by-side analysis of different options, approaches, or solutions.',
      sections: ['Introduction', 'Option A Overview', 'Option B Overview', 'Comparison Criteria', 'Analysis', 'Recommendation']
    },
    {
      id: 'problem-solution',
      name: 'Problem-Solution',
      description: 'A focused examination of a specific problem and potential solutions.',
      sections: ['Problem Statement', 'Impact/Consequences', 'Solution Options', 'Implementation Guide', 'Conclusion']
    },
    {
      id: 'interview',
      name: 'Interview/Q&A',
      description: 'A conversation-style article with questions and expert answers.',
      sections: ['Introduction', 'Background on Interviewee', 'Q&A Segments', 'Key Takeaways']
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Blog Structure Template</h3>
      <p className="text-sm text-neutral-muted mb-6">
        Select a structure template that best fits your content. You can modify sections in the next step.
      </p>
      
      <RadioGroup 
        value={selectedStructureId || ''} 
        onValueChange={onSelectStructure}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {structureTemplates.map((template) => (
            <div key={template.id} className={`structure-item ${selectedStructureId === template.id ? 'selected' : ''}`}>
              <RadioGroupItem 
                value={template.id} 
                id={`structure-${template.id}`} 
                className="sr-only" 
              />
              <Label 
                htmlFor={`structure-${template.id}`}
                className="cursor-pointer block h-full"
              >
                <div className="h-full flex flex-col">
                  <h4 className="font-semibold text-primary mb-2">{template.name}</h4>
                  <p className="text-sm text-neutral-muted mb-3">{template.description}</p>
                  <div className="mt-auto">
                    <p className="text-xs font-medium text-neutral-dark mb-1">Sections:</p>
                    <ul className="text-xs text-neutral-muted list-disc list-inside">
                      {template.sections.map((section, index) => (
                        <li key={index}>{section}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </Card>
  );
};

export default StructureTemplateSelector;
