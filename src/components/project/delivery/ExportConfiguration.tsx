import React from 'react';
import { Card } from '@/components/ui/Card';

const ExportConfiguration: React.FC = () => {
  return (
    <Card className="p-4 border border-dashed border-neutral-medium bg-neutral-light/20">
      <h4 className="font-semibold text-neutral-dark mb-2">Export Configuration</h4>
      <p className="text-sm text-neutral-medium">
        Placeholder for Format Selection (PPTX, PDF, Google Slides, HTML5, Video), Advanced Options (Styling, Security, Tracking), and Batch Export.
      </p>
      {/* Add basic format selection placeholders later */}
    </Card>
  );
};

export default ExportConfiguration;