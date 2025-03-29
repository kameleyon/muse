import React, { useState } from 'react'; // Added useState
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Wand2 } from 'lucide-react'; // Icon for generate button
import { RadioGroup } from '@/components/ui/RadioGroup'; // Assuming fixed or available
import { RadioGroupItem } from '@/components/ui/RadioGroupItem'; // Assuming fixed or available

// Define Fact Check Level type
type FactCheckLevel = 'basic' | 'standard' | 'thorough';

interface GenerationSetupProps {
  onGenerate: (options: { factCheckLevel: FactCheckLevel }) => void; // Pass options up
  isGenerating: boolean; 
}

const GenerationSetup: React.FC<GenerationSetupProps> = ({ onGenerate, isGenerating }) => {
  const [factCheckLevel, setFactCheckLevel] = useState<FactCheckLevel>('standard'); // Default level

  const handleGenerateClick = () => {
    onGenerate({ factCheckLevel }); // Pass selected level
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-4 border-b border-neutral-light/40 pb-2">Generation Setup</h4>
      
      {/* Fact Checking Level */}
      <div className="mb-4">
        <label className="settings-label mb-2">Fact-Checking Level</label>
        <div className="flex flex-col gap-2"> {/* Changed to flex-col */}
          {(['basic', 'standard', 'thorough'] as FactCheckLevel[]).map((level) => (
            <Button
              key={level}
              variant={factCheckLevel === level ? 'primary' : 'outline'}
              onClick={() => setFactCheckLevel(level)}
              size="sm" // Adjust size as needed
              className={`flex-1 ${factCheckLevel === level ? 'text-white border-black p-1' : ''}`} // Ensure text color contrast for primary
            >
              {level.charAt(0).toUpperCase() + level.slice(1)} {/* Capitalize */}
            </Button>
          ))}
        </div>
         <p className="text-xs text-neutral-medium mt-1">Determines depth of fact verification (uses research model).</p>
      </div>

      {/* Add other controls (Tone, Depth, Visuals) later */}
      
      <div className="flex justify-center mt-4"> {/* Changed justify-end to justify-center */}
        <Button
          onClick={handleGenerateClick} // Use updated handler
          disabled={isGenerating}
          size="sm"
          className="text-white p-2 rounded-lg w-full" 
        >
          <Wand2 size={18} className="text-xs pr-1" /> 
          {isGenerating ? 'Generating...' : 'Start Content Generation'}
        </Button>
      </div>
    </Card>
  );
};

export default GenerationSetup;