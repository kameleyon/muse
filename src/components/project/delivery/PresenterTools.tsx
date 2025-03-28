import React from 'react';
import { Card } from '@/components/ui/Card';

const PresenterTools: React.FC = () => {
  return (
    <Card className="p-4 border border-dashed border-neutral-medium bg-neutral-light/20">
      <h4 className="font-semibold text-neutral-dark mb-2">Presenter Support Tools</h4>
      <p className="text-sm text-neutral-medium">
        Placeholder for Speaker Notes Generation, Presentation Assistance, Practice Tools (Timer, Recording), and Q&A Preparation.
      </p>
      {/* Add basic tool placeholders later */}
    </Card>
  );
};

export default PresenterTools;