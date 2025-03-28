import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lightbulb, CheckSquare, Loader2 } from 'lucide-react'; // Added Loader2

// Define Suggestion type (matching ProjectArea state)
type Suggestion = { id: string; text: string; impact: string; effort: string; };

// Define Props
interface RefinementPanelProps {
  suggestions: Suggestion[];
  onImplement: (id: string) => void;
  onCompare: (id: string) => void;
  onPolish: () => void;
  isLoading: boolean; // Use the general QA loading state for now
}

const RefinementPanel: React.FC<RefinementPanelProps> = ({
  suggestions = [], // Default to empty array
  onImplement,
  onCompare,
  onPolish,
  isLoading
}) => {

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Refinement Recommendations</h4>
      <div className="space-y-4">
        {/* AI Suggestions */}
        <div>
          <label className="settings-label flex items-center gap-1 mb-2"><Lightbulb size={14}/> AI Suggestions</label>
          {isLoading && suggestions.length === 0 ? (
             <div className="text-center text-neutral-medium italic p-4">Loading suggestions...</div>
          ) : suggestions.length === 0 ? (
             <div className="text-center text-neutral-medium italic p-4">No suggestions available.</div>
          ) : (
             <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1"> {/* Added max-height and scroll */}
               {suggestions.map(sug => (
                 <li key={sug.id} className="p-2 border rounded-md bg-white/50 text-xs">
                   <p className="mb-1">{sug.text}</p>
                   <div className="flex justify-between items-center text-neutral-medium">
                      <span className="text-[10px] uppercase">Impact: {sug.impact} | Effort: {sug.effort}</span>
                      <div className="flex gap-1">
                         <Button variant="ghost" size="sm" className="text-xs p-0 h-auto text-primary hover:bg-primary/10" onClick={() => onImplement(sug.id)} disabled={isLoading}>Implement</Button>
                         <Button variant="ghost" size="sm" className="text-xs p-0 h-auto text-neutral-dark hover:bg-neutral-light/50" onClick={() => onCompare(sug.id)} disabled={isLoading}>Compare</Button>
                      </div>
                   </div>
                 </li>
               ))}
             </ul>
          )}
           {/* Optionally add a button to explicitly fetch suggestions if not loaded automatically */}
           {/* <Button variant="link" size="sm" className="mt-1 p-0 h-auto text-xs">Load suggestions...</Button> */}
        </div>

        {/* Final Polishing */}
        <div>
           <label className="settings-label flex items-center gap-1 mb-2"><CheckSquare size={14}/> Final Polish</label>
           <p className="text-xs text-neutral-medium mb-2">Run consistency checks and final proofreading.</p>
           <Button variant="secondary" size="sm" className="w-full" onClick={onPolish} disabled={isLoading}>
              {isLoading ? <Loader2 size={14} className="animate-spin mr-1"/> : null}
              Run Final Polish
           </Button>
        </div>
      </div>
    </Card>
  );
};

export default RefinementPanel;