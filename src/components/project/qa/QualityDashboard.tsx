import React from 'react';
import { Card } from '@/components/ui/Card';

const QualityDashboard: React.FC = () => {
  return (
    <Card className="p-4 border border-dashed border-neutral-medium bg-neutral-light/20">
      <h4 className="font-semibold text-neutral-dark mb-2">Quality Metrics Dashboard</h4>
      <p className="text-sm text-neutral-medium">
        Placeholder for Overall Score, Category Breakdown (Content, Design, Narrative, Data, etc.), Benchmark Comparison, and Issue Summary.
      </p>
      {/* Add basic chart/score placeholders later */}
    </Card>
  );
};

export default QualityDashboard;