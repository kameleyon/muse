import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';

interface EnhancementToolsProps {
  editorContent: string;
  onContentChange: (content: string) => void;
  onEnhanceClarity?: () => void;
  isLoading?: boolean;
}

const EnhancementTools: React.FC<EnhancementToolsProps> = ({
  editorContent,
  onContentChange,
  onEnhanceClarity,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState('language');
  const [toneOption, setToneOption] = useState('professional');
  const [enhancementType, setEnhancementType] = useState('clarity');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Simulate loading suggestions
  const handleGenerateSuggestions = () => {
    if (onEnhanceClarity && enhancementType === 'clarity') {
      onEnhanceClarity();
      return;
    }
    
    // Simulate API call to generate suggestions
    setTimeout(() => {
      const sampleSuggestions = {
        clarity: [
          'Consider restructuring the introduction for better flow.',
          'Simplify the technical explanation in paragraph 3.',
          'Add transition between the second and third sections.'
        ],
        engagement: [
          'Add a compelling question in the introduction to engage readers.',
          'Include a relevant anecdote for the main concept.',
          'Consider adding a call-to-action at the end of each main section.'
        ],
        professional: [
          'Maintain a formal tone throughout by replacing casual phrases.',
          'Strengthen your authority with more specific evidence.',
          'Remove first-person references for a more objective stance.'
        ],
        conversational: [
          'Add more rhetorical questions to engage the reader directly.',
          'Include personal anecdotes to make the content relatable.',
          'Use contractions and simpler language for a friendly tone.'
        ]
      };
      
      setSuggestions(sampleSuggestions[enhancementType as keyof typeof sampleSuggestions]);
    }, 1000);
  };

  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold font-heading text-secondary mb-3">Content Enhancement</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="language">Language</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        
        <TabsContent value="language" className="space-y-4">
          <div className="enhancement-panel">
            <h4 className="text-sm font-medium text-neutral-dark mb-2">Language Refinement</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-dark block mb-1">Enhancement Type</label>
                <Select
                  value={enhancementType}
                  onValueChange={setEnhancementType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clarity">Improve Clarity</SelectItem>
                    <SelectItem value="engagement">Boost Engagement</SelectItem>
                    <SelectItem value="professional">More Professional</SelectItem>
                    <SelectItem value="conversational">More Conversational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={handleGenerateSuggestions}
                disabled={isLoading || !editorContent}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  'Generate Suggestions'
                )}
              </Button>
              
              {suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="p-2 bg-neutral-light/10 rounded-md text-sm border-l-2 border-primary"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="enhancement-panel">
            <Accordion type="single" collapsible>
              <AccordionItem value="word-choice">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Word Choice Suggestions
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 py-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="line-through text-neutral-muted">utilize</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">use</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7">
                        Apply
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="line-through text-neutral-muted">in order to</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">to</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7">
                        Apply
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="line-through text-neutral-muted">a large number of</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">many</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7">
                        Apply
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="passive-voice">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Passive Voice Instances
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 py-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="line-through text-neutral-muted">The report was written by the team</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">The team wrote the report</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7">
                        Apply
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tone-adjustment">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Tone Adjustment
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 py-1">
                    <Select
                      value={toneOption}
                      onValueChange={setToneOption}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                        <SelectItem value="instructional">Instructional</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      Adjust Tone
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="structure" className="space-y-4">
          <div className="enhancement-panel">
            <h4 className="text-sm font-medium text-neutral-dark mb-2">Structure Analysis</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Paragraph length</span>
                <span className="text-green-600 font-medium">Good</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Sentence variety</span>
                <span className="text-yellow-600 font-medium">Fair</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Transition quality</span>
                <span className="text-yellow-600 font-medium">Fair</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Section balance</span>
                <span className="text-green-600 font-medium">Good</span>
              </div>
            </div>
            
            <div className="mt-3">
              <Button variant="outline" size="sm" className="w-full">
                Improve Structure
              </Button>
            </div>
          </div>
          
          <div className="enhancement-panel">
            <Accordion type="single" collapsible>
              <AccordionItem value="headings">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Heading Suggestions
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 py-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="line-through text-neutral-muted">Results</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">Key Findings That Transformed Our Approach</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7">
                        Apply
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="transitions">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Transition Enhancements
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 py-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Add Transitions Between Sections
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="ordering">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Content Ordering
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 py-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Optimize Section Order
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="seo" className="space-y-4">
          <div className="enhancement-panel">
            <h4 className="text-sm font-medium text-neutral-dark mb-2">Keyword Optimization</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-dark block mb-1">Target Keyword</label>
                <Input
                  placeholder="Enter primary keyword"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-neutral-dark block mb-1">Secondary Keywords</label>
                <Input
                  placeholder="Enter secondary keywords, comma-separated"
                  className="w-full"
                />
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                Optimize Content
              </Button>
            </div>
          </div>
          
          <div className="enhancement-panel">
            <Accordion type="single" collapsible>
              <AccordionItem value="title-meta">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Title & Meta Description
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 py-1">
                    <div>
                      <label className="text-xs font-medium text-neutral-dark block mb-1">SEO Title</label>
                      <Input
                        placeholder="Enter SEO-optimized title"
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-muted mt-1">
                        Recommended length: 50-60 characters
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-neutral-dark block mb-1">Meta Description</label>
                      <Input
                        placeholder="Enter meta description"
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-muted mt-1">
                        Recommended length: 150-160 characters
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="heading-structure">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Heading Structure
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 py-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Optimize Heading Structure
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="internal-linking">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Internal Linking
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 py-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Suggest Internal Links
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EnhancementTools;
