import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Archive, BarChart2, Tag, CheckCircle } from 'lucide-react'; // Icons

const ArchivingAnalytics: React.FC = () => {
   // Placeholder handlers
  const handleArchive = () => console.log('Archive Project clicked');
  const handleViewAnalytics = () => console.log('View Analytics clicked');
  const handleRecordOutcome = () => console.log('Record Outcome clicked');

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Archiving & Analytics</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
         {/* Archive */}
         <Button variant="outline" size="sm" className="text-xs justify-start" onClick={handleArchive}>
            <Archive size={14} className="mr-1"/> Archive Project
         </Button>
         {/* Analytics */}
         <Button variant="outline" size="sm" className="text-xs justify-start" onClick={handleViewAnalytics}>
            <BarChart2 size={14} className="mr-1"/> View Performance Analytics
         </Button>
          {/* Outcome */}
         <Button variant="outline" size="sm" className="text-xs justify-start" onClick={handleRecordOutcome}>
            <CheckCircle size={14} className="mr-1"/> Record Project Outcome
         </Button>
         {/* Add Knowledge Capture/Tagging later */}
      </div>
       <p className="text-xs text-neutral-medium mt-2">
         Archive the project for long-term storage or review its performance.
       </p>
    </Card>
  );
};

export default ArchivingAnalytics;