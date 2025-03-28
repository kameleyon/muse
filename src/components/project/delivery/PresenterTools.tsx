import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mic, Timer, HelpCircle, FileText } from 'lucide-react'; // Icons

const PresenterTools: React.FC = () => {
  // Placeholder handlers
  const handleGenerateNotes = () => console.log('Generate Speaker Notes');
  const handleStartRehearsal = () => console.log('Start Rehearsal');
  const handleGenerateQA = () => console.log('Generate Q&A Prep');
  const handleGenerateLeaveBehind = () => console.log('Generate Leave-Behind');


  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Presenter Support</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
         <Button variant="outline" size="sm" className="text-xs justify-start" onClick={handleGenerateNotes}>
            <FileText size={14} className="mr-1"/> Generate Speaker Notes
         </Button>
          <Button variant="outline" size="sm" className="text-xs justify-start" onClick={handleStartRehearsal}>
            <Timer size={14} className="mr-1"/> Rehearsal Mode
         </Button>
          <Button variant="outline" size="sm" className="text-xs justify-start" onClick={handleGenerateQA}>
            <HelpCircle size={14} className="mr-1"/> Q&A Preparation
         </Button>
          <Button variant="outline" size="sm" className="text-xs justify-start" onClick={handleGenerateLeaveBehind}>
            <FileText size={14} className="mr-1"/> Generate Leave-Behind Doc
         </Button>
         {/* Add other tools like Supplementary Materials later */}
      </div>
    </Card>
  );
};

export default PresenterTools;