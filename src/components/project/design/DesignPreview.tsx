import React from 'react';
import { Card } from '@/components/ui/Card';

const DesignPreview: React.FC = () => {
  return (
    <Card className="p-4 border border-dashed border-neutral-medium bg-neutral-light/20 h-full min-h-[300px] flex items-center justify-center">
      <div className="text-center">
        <h4 className="font-semibold text-neutral-dark mb-2">Preview Panel</h4>
        <p className="text-sm text-neutral-medium">
          Real-time preview of design and structure changes will appear here.
        </p>
      </div>
    </Card>
  );
};

export default DesignPreview;