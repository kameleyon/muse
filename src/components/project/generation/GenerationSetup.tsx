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
        <RadioGroup
          value={factCheckLevel}
          onValueChange={(value) => setFactCheckLevel(value as FactCheckLevel)}
          className="flex flex-row flex-wrap gap-2" // Use flex-wrap
        >
          <div className="flex items-center space-x-2 p-2 border rounded-md flex-1 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
            <RadioGroupItem value="basic" id="fc-basic" />
            <label htmlFor="fc-basic" className="text-sm cursor-pointer">Basic</label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md flex-1 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
            <RadioGroupItem value="standard" id="fc-standard" />
            <label htmlFor="fc-standard" className="text-sm cursor-pointer">Standard</label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md flex-1 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
            <RadioGroupItem value="thorough" id="fc-thorough" />
            <label htmlFor="fc-thorough" className="text-sm cursor-pointer">Thorough</label>
          </div>
        </RadioGroup>
         <p className="text-xs text-neutral-medium mt-1">Determines depth of fact verification (uses research model).</p>
      </div>

      {/* Add other controls (Tone, Depth, Visuals) later */}
      
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleGenerateClick} // Use updated handler
          disabled={isGenerating}
          size="lg"
          className="text-white" 
        >
          <Wand2 size={18} className="mr-2" /> 
          {isGenerating ? 'Generating...' : 'Start Content Generation'}
        </Button>
      </div>
    </Card>
  );
};

export default GenerationSetup;