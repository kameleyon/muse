import React from 'react';
import { Card } from '@/components/ui/Card';

const RefinementPanel: React.FC = () => {
  return (
    <Card className="p-4 border border-dashed border-neutral-medium bg-neutral-light/20">
      <h4 className="font-semibold text-neutral-dark mb-2">Refinement Recommendation Panel</h4>
      <p className="text-sm text-neutral-medium">
        Placeholder for AI Suggestions (Prioritized Enhancements, Impact-Effort Matrix), Revision Workflow (Implement, Compare), and Final Polishing Tools.
      </p>
      {/* Add basic suggestion list placeholders later */}
    </Card>
  );
};

export default RefinementPanel;