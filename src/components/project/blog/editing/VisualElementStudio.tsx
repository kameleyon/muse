import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';

const VisualElementStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartType, setChartType] = useState('bar');
  
  // Mock data for demonstration
  const sampleImages = [
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
  ];
  
  const handleSearchImages = () => {
    // In a real implementation, this would trigger an API call
    console.log(`Searching for images: ${searchQuery}`);
  };

  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold font-heading text-secondary mb-3">Visual Element Studio</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="embeds">Embeds</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Search for images"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleSearchImages}>
                Search
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {sampleImages.map((src, index) => (
                <div 
                  key={index}
                  className={`aspect-square border rounded-md overflow-hidden cursor-pointer ${selectedImage === index ? 'border-2 border-primary' : 'border-neutral-light'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={src} 
                    alt={`Sample image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            {selectedImage !== null && (
              <div className="pt-3 border-t border-neutral-light">
                <h4 className="text-sm font-medium text-neutral-dark mb-2">Image Settings</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="alt-text" className="text-xs font-medium block mb-1">
                      Alt Text
                    </Label>
                    <Input
                      id="alt-text"
                      placeholder="Describe the image for accessibility"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image-caption" className="text-xs font-medium block mb-1">
                      Caption
                    </Label>
                    <Input
                      id="image-caption"
                      placeholder="Optional image caption"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Replace
                    </Button>
                    <Button size="sm" className="flex-1">
                      Insert
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="chart-type" className="text-sm font-medium block mb-1">
                Chart Type
              </Label>
              <Select
                value={chartType}
                onValueChange={setChartType}
              >
                <SelectTrigger id="chart-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="chart-data" className="text-sm font-medium block mb-1">
                Chart Data
              </Label>
              <textarea
                id="chart-data"
                className="w-full min-h-[100px] p-2 rounded-md border border-neutral-light text-sm font-mono"
                placeholder="Enter data in CSV format:
Category, Value
Item 1, 45
Item 2, 28
Item 3, 65"
              />
            </div>
            
            <div className="flex justify-between items-center space-x-3">
              <div className="text-center flex-grow border border-dashed border-neutral-light rounded-md p-4">
                <div className="text-neutral-muted mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-xs text-neutral-muted">Chart preview will appear here</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Customize
              </Button>
              <Button size="sm" className="flex-1">
                Insert Chart
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="embeds" className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="embed-type" className="text-sm font-medium block mb-1">
                Embed Type
              </Label>
              <Select defaultValue="social">
                <SelectTrigger id="embed-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">Social Media Post</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="tweet">Tweet</SelectItem>
                  <SelectItem value="instagram">Instagram Post</SelectItem>
                  <SelectItem value="custom">Custom Embed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="embed-url" className="text-sm font-medium block mb-1">
                URL
              </Label>
              <Input
                id="embed-url"
                placeholder="https://example.com/embed-link"
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between items-center space-x-3">
              <div className="text-center flex-grow border border-dashed border-neutral-light rounded-md p-4">
                <div className="text-neutral-muted mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-xs text-neutral-muted">Embed preview will appear here</p>
              </div>
            </div>
            
            <Button className="w-full">
              Insert Embed
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default VisualElementStudio;
