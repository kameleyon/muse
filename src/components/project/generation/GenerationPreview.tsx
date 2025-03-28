import React from 'react';
import { Card } from '@/components/ui/Card';

const GenerationPreview: React.FC = () => {
  return (
    <Card className="p-4 border border-dashed border-neutral-medium bg-neutral-light/20 h-full min-h-[300px] flex items-center justify-center">
      <div className="text-center">
        <h4 className="font-semibold text-neutral-dark mb-2">Real-Time Preview Panel</h4>
        <p className="text-sm text-neutral-medium">
          Live updates of generated content and slide previews will appear here.
        </p>
      </div>
    </Card>
  );
};

export default GenerationPreview;