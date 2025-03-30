import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Wand2, LineChart, Layout, Clock } from 'lucide-react';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { RadioGroupItem } from '@/components/ui/RadioGroupItem';
import { Label } from '@/components/ui/Label';

// Define all option types
type FactCheckLevel = 'basic' | 'standard' | 'thorough';
type ContentTone = 'formal' | 'conversational' | 'persuasive';
type SlideStructure = 'default' | 'comprehensive' | 'custom';

interface GenerationSetupProps {
  onGenerate: (options: {
    factCheckLevel: FactCheckLevel;
    visualsEnabled: boolean;
    contentTone: ContentTone;
    slideStructure: SlideStructure;
    typingSpeed: number;
    includeAllSlides: boolean;
  }) => void;
  isGenerating: boolean;
  slideCount?: number;
}

const GenerationSetup: React.FC<GenerationSetupProps> = ({ 
  onGenerate,
  isGenerating,
  slideCount = 14
}) => {
  // State for all generation options
  const [factCheckLevel, setFactCheckLevel] = useState<FactCheckLevel>('standard');
  const [visualsEnabled, setVisualsEnabled] = useState<boolean>(true);
  const [contentTone, setContentTone] = useState<ContentTone>('formal');
  const [slideStructure, setSlideStructure] = useState<SlideStructure>('comprehensive');
  const [typingSpeed, setTypingSpeed] = useState<number>(2); // 0-4 scale
  const [includeAllSlides, setIncludeAllSlides] = useState<boolean>(true);

  const handleGenerateClick = () => {
    onGenerate({
      factCheckLevel,
      visualsEnabled,
      contentTone,
      slideStructure,
      typingSpeed,
      includeAllSlides
    });
  };

  // Helper to convert typingSpeed (0-4 scale) to actual milliseconds (inverse relationship)
  const getTypingSpeedInMs = () => {
    // Map 0-4 to different speeds: 0=fastest, 4=slowest
    const speedMap = [0, 2, 5, 10, 20];
    return speedMap[typingSpeed];
  };

  // Helper to display human-readable typing speed
  const getTypingSpeedLabel = () => {
    const labels = ["Instantaneous", "Very Fast", "Fast", "Medium", "Slow"];
    return labels[typingSpeed];
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-4 border-b border-neutral-light/40 pb-2">Generation Setup</h4>
      
      {/* Fact Checking Level */}
      <div className="mb-4">
        <label className="settings-label mb-2">Research Depth</label>
        <div className="flex flex-col gap-2">
          {(['basic', 'standard', 'thorough'] as FactCheckLevel[]).map((level) => (
            <Button
              key={level}
              variant={factCheckLevel === level ? 'primary' : 'outline'}
              onClick={() => setFactCheckLevel(level)}
              size="sm"
              className={`flex-1 ${factCheckLevel === level ? 'text-white border-black p-1' : ''}`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          ))}
        </div>
        <p className="text-xs text-neutral-medium mt-1">Determines depth of research and fact verification.</p>
      </div>

      {/* Content Tone */}
      <div className="mb-4">
        <label className="settings-label mb-2">Content Tone</label>
        <RadioGroup 
          value={contentTone}
          onValueChange={(value) => setContentTone(value as ContentTone)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="formal" id="tone-formal" />
            <Label htmlFor="tone-formal">Formal</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="conversational" id="tone-conversational" />
            <Label htmlFor="tone-conversational">Conversational</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="persuasive" id="tone-persuasive" />
            <Label htmlFor="tone-persuasive">Persuasive</Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-neutral-medium mt-1">Affects language style and presentation approach.</p>
      </div>

      {/* Slide Structure */}
      <div className="mb-4">
        <label className="settings-label mb-2">Slide Structure</label>
        <RadioGroup 
          value={slideStructure}
          onValueChange={(value) => setSlideStructure(value as SlideStructure)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="default" id="struct-default" />
            <Label htmlFor="struct-default">Default (10-12 slides)</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="comprehensive" id="struct-comprehensive" />
            <Label htmlFor="struct-comprehensive">Comprehensive (All {slideCount} slides)</Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="custom" id="struct-custom" />
            <Label htmlFor="struct-custom">Custom (From selected structure)</Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-neutral-medium mt-1">Determines slide organization and content flow.</p>
      </div>

      {/* Advanced Options */}
      <div className="mb-4 space-y-3 p-3 bg-gray-50 rounded-md">
        <h5 className="text-sm font-medium text-neutral-dark">Advanced Options</h5>
        
        {/* Visual Elements Toggle */}
        <div className="flex items-center space-x-2 p-2 border rounded-md">
          <input
            type="checkbox"
            id="visuals-enabled"
            checked={visualsEnabled}
            onChange={(e) => setVisualsEnabled(e.target.checked)}
            className="cursor-pointer"
          />
          <Label htmlFor="visuals-enabled" className="text-sm cursor-pointer flex items-center">
            <LineChart size={16} className="mr-1" /> Include visual elements (charts, tables, diagrams)
          </Label>
        </div>

        {/* Include All Slides Toggle */}
        <div className="flex items-center space-x-2 p-2 border rounded-md">
          <input
            type="checkbox"
            id="all-slides"
            checked={includeAllSlides}
            onChange={(e) => setIncludeAllSlides(e.target.checked)}
            className="cursor-pointer"
          />
          <Label htmlFor="all-slides" className="text-sm cursor-pointer flex items-center">
            <Layout size={16} className="mr-1" /> Generate content for all required slides
          </Label>
        </div>

        {/* Typing Speed Radio Buttons */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm flex items-center">
              <Clock size={16} className="mr-1" /> Preview Animation Speed
            </Label>
            <span className="text-xs font-medium text-neutral-dark">
              {getTypingSpeedLabel()}
            </span>
          </div>
          <RadioGroup 
            value={String(typingSpeed)}
            onValueChange={(value) => setTypingSpeed(Number(value))}
            className="flex justify-between"
          >
            {[0, 1, 2, 3, 4].map((speed) => (
              <div key={speed} className="flex flex-col items-center">
                <RadioGroupItem value={String(speed)} id={`speed-${speed}`} />
                <Label htmlFor={`speed-${speed}`} className="text-xs mt-1">
                  {speed === 0 ? "Fastest" : speed === 4 ? "Slowest" : ""}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      
      {/* Generate Button */}
      <div className="flex justify-center mt-4">
        <Button
          onClick={handleGenerateClick}
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