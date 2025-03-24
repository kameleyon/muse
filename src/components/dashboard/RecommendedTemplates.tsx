import React from 'react';
import { Button } from '@/components/ui/Button';

interface Template {
  id: string;
  title: string;
  description: string;
}

interface RecommendedTemplatesProps {
  templates: Template[];
}

const RecommendedTemplates: React.FC<RecommendedTemplatesProps> = ({ templates }) => {
  return (
    <div className="bg-neutral-white rounded-lg p-6 border border-neutral-light/40 shadow-md">
      <h2 className="text-xl font-bold font-heading text-secondary mb-4">
        Recommended Templates
      </h2>
      <p className="text-sm text-neutral-medium mb-4">
        Templates that match your interests:
      </p>
      
      <div className="space-y-3">
        {templates.map((template) => (
          <div key={template.id} className="flex justify-between items-center p-3 bg-neutral-light/20 rounded-md">
            <div>
              <h3 className="font-medium text-secondary">{template.title}</h3>
              <p className="text-xs text-neutral-medium">{template.description}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = `/templates/${template.id}`}
            >
              Explore
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedTemplates;
