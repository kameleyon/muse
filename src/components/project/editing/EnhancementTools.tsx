import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, TextCursorInput, AlignLeft, Languages } from 'lucide-react'; // Icons

const EnhancementTools: React.FC = () => {
  // Placeholder handlers
  const handleEnhance = (type: string) => console.log(`Enhance: ${type}`);

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Enhancement Tools</h4>
      <div className="space-y-3">
        {/* Text Enhancement */}
        <div>
           <label className="settings-label flex items-center gap-1 mb-1"><Sparkles size={14}/> Text</label>
           <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('clarity')}>Improve Clarity</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('conciseness')}>Make Concise</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('persuasion')}>Boost Persuasion</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('tone')}>Adjust Tone</Button>
           </div>
        </div>
         {/* Narrative Tools */}
         <div>
           <label className="settings-label flex items-center gap-1 mb-1"><AlignLeft size={14}/> Narrative</label>
           <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('flow')}>Analyze Flow</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('transitions')}>Suggest Transitions</Button>
           </div>
        </div>
         {/* Language Optimization */}
         <div>
           <label className="settings-label flex items-center gap-1 mb-1"><Languages size={14}/> Language</label>
           <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('readability')}>Check Readability</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEnhance('jargon')}>Detect Jargon</Button>
           </div>
        </div>
         {/* Section Regeneration */}
         <Button variant="secondary" size="sm" className="w-full mt-2" onClick={() => handleEnhance('regenerate')}>
            Regenerate Section
         </Button>
      </div>
    </Card>
  );
};

export default EnhancementTools;