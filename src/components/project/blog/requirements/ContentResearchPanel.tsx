import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Label } from '@/components/ui/Label';

const ContentResearchPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('keywords');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = () => {
    setIsSearching(true);
    setSearchResults([]);
    
    // Simulate search results based on the active tab
    setTimeout(() => {
      const simulatedResults = {
        keywords: [
          'content marketing strategy',
          'content marketing for beginners',
          'effective content marketing',
          'content marketing roi',
          'content marketing examples',
          'content marketing plan'
        ],
        trending: [
          'AI content creation tools',
          'Video content marketing statistics',
          'Content personalization strategies',
          'Voice search optimization',
          'Interactive content engagement',
          'User-generated content campaigns'
        ],
        questions: [
          'How to measure content marketing success?',
          'What is a good content marketing strategy?',
          'How often should I publish new content?',
          'What content formats perform best?',
          'How to repurpose content effectively?',
          'What is the ROI of content marketing?'
        ],
        competitors: [
          'Competitor A Blog: "10 Content Marketing Trends for 2025"',
          'Competitor B Blog: "The Ultimate Guide to Content Strategy"',
          'Competitor C Blog: "How We Increased Traffic by 200% with Content"',
          'Competitor D Blog: "Content Marketing Case Studies That Work"',
          'Competitor E Blog: "Content Distribution Channels Compared"',
          'Competitor F Blog: "Measuring Content Performance: Metrics That Matter"'
        ]
      };
      
      setSearchResults(simulatedResults[activeTab as keyof typeof simulatedResults]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Content Research & Planning</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="keywords">Keyword Research</TabsTrigger>
          <TabsTrigger value="trending">Trending Topics</TabsTrigger>
          <TabsTrigger value="questions">Common Questions</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Content</TabsTrigger>
        </TabsList>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-grow">
              <Label htmlFor="searchQuery" className="sr-only">Search Query</Label>
              <Input
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for ${activeTab === 'keywords' ? 'keywords' : activeTab === 'trending' ? 'trending topics' : activeTab === 'questions' ? 'questions' : 'competitor content'}`}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!searchQuery || isSearching}
              className="whitespace-nowrap"
            >
              {isSearching ? 'Searching...' : 'Research'}
            </Button>
          </div>
          
          <TabsContent value="keywords" className="mt-0">
            <Card className="p-4 bg-neutral-light/10">
              <h4 className="text-sm font-medium text-neutral-dark mb-2">Keyword Research</h4>
              <p className="text-xs text-neutral-muted mb-4">
                Research keywords to identify what your target audience is searching for related to your topic.
              </p>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md border border-neutral-light">
                      <span className="text-sm">{result}</span>
                      <Button variant="ghost" size="sm">Add</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-neutral-muted">
                    {isSearching ? 'Searching...' : 'Enter a topic to research keywords'}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
            <Card className="p-4 bg-neutral-light/10">
              <h4 className="text-sm font-medium text-neutral-dark mb-2">Trending Topics</h4>
              <p className="text-xs text-neutral-muted mb-4">
                Discover what's currently trending in your industry or related to your topic.
              </p>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md border border-neutral-light">
                      <span className="text-sm">{result}</span>
                      <Button variant="ghost" size="sm">Add</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-neutral-muted">
                    {isSearching ? 'Searching...' : 'Enter a topic to find trending content'}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="questions" className="mt-0">
            <Card className="p-4 bg-neutral-light/10">
              <h4 className="text-sm font-medium text-neutral-dark mb-2">Common Questions</h4>
              <p className="text-xs text-neutral-muted mb-4">
                Find questions people are asking about your topic on forums, Q&A sites, and social media.
              </p>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md border border-neutral-light">
                      <span className="text-sm">{result}</span>
                      <Button variant="ghost" size="sm">Add</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-neutral-muted">
                    {isSearching ? 'Searching...' : 'Enter a topic to find common questions'}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="competitors" className="mt-0">
            <Card className="p-4 bg-neutral-light/10">
              <h4 className="text-sm font-medium text-neutral-dark mb-2">Competitor Content Analysis</h4>
              <p className="text-xs text-neutral-muted mb-4">
                Research what your competitors are publishing on this topic and identify content gaps.
              </p>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md border border-neutral-light">
                      <span className="text-sm">{result}</span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-neutral-muted">
                    {isSearching ? 'Searching...' : 'Enter a topic to find competitor content'}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default ContentResearchPanel;
