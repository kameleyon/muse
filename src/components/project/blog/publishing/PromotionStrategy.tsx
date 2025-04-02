import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

// Simple styled textarea component to replace the missing Textarea
const StyledTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }
>(({ className = '', ...props }, ref) => (
  <textarea
    className={`w-full min-h-[60px] rounded-md border border-neutral-light bg-white px-3 py-2 text-sm placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-neutral-dark focus:border-neutral-dark ${className}`}
    ref={ref}
    {...props}
  />
));

StyledTextarea.displayName = 'StyledTextarea';

interface PromotionStrategyProps {
  promotionChannels: string[] | null;
  onChannelChange: (channels: string[]) => void;
}

const PromotionStrategy: React.FC<PromotionStrategyProps> = ({
  promotionChannels,
  onChannelChange
}) => {
  const [activeTab, setActiveTab] = useState('social');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailPreview, setEmailPreview] = useState('');
  
  // Initialize channels
  const channels = promotionChannels || [];
  
  // Handle channel toggle
  const handleChannelToggle = (channel: string) => {
    if (channels.includes(channel)) {
      onChannelChange(channels.filter(c => c !== channel));
    } else {
      onChannelChange([...channels, channel]);
    }
  };
  
  // Generate social media post
  const handleGenerateSocial = (platform: string) => {
    console.log(`Generating ${platform} post...`);
    // In a real implementation, this would call an API to generate content
  };
  
  // Generate email content
  const handleGenerateEmail = () => {
    console.log('Generating email content...');
    // In a real implementation, this would call an API to generate content
    setEmailSubject('New Blog Post: [Your Blog Title]');
    setEmailPreview('We\'ve just published a new article that might interest you...');
  };

  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold font-heading text-secondary mb-3">Promotion Strategy</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-neutral-dark mb-2">Distribution Channels</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="channel-twitter" 
                checked={channels.includes('twitter')}
                onCheckedChange={() => handleChannelToggle('twitter')}
              />
              <Label htmlFor="channel-twitter" className="text-sm cursor-pointer">Twitter/X</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="channel-linkedin" 
                checked={channels.includes('linkedin')}
                onCheckedChange={() => handleChannelToggle('linkedin')}
              />
              <Label htmlFor="channel-linkedin" className="text-sm cursor-pointer">LinkedIn</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="channel-facebook" 
                checked={channels.includes('facebook')}
                onCheckedChange={() => handleChannelToggle('facebook')}
              />
              <Label htmlFor="channel-facebook" className="text-sm cursor-pointer">Facebook</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="channel-instagram" 
                checked={channels.includes('instagram')}
                onCheckedChange={() => handleChannelToggle('instagram')}
              />
              <Label htmlFor="channel-instagram" className="text-sm cursor-pointer">Instagram</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="channel-email" 
                checked={channels.includes('email')}
                onCheckedChange={() => handleChannelToggle('email')}
              />
              <Label htmlFor="channel-email" className="text-sm cursor-pointer">Email Newsletter</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="channel-reddit" 
                checked={channels.includes('reddit')}
                onCheckedChange={() => handleChannelToggle('reddit')}
              />
              <Label htmlFor="channel-reddit" className="text-sm cursor-pointer">Reddit</Label>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="space-y-4">
            <div className="space-y-3">
              <div className="bg-neutral-light/10 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm font-medium">Twitter/X Post</h5>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleGenerateSocial('twitter')}
                  >
                    Generate
                  </Button>
                </div>
                <StyledTextarea
                  placeholder="Just published a new blog post about..."
                  className="w-full h-20"
                />
                <div className="flex justify-between text-xs text-neutral-muted mt-1">
                  <span>Add hashtags for better reach</span>
                  <span>0/280</span>
                </div>
              </div>
              
              <div className="bg-neutral-light/10 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm font-medium">LinkedIn Post</h5>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleGenerateSocial('linkedin')}
                  >
                    Generate
                  </Button>
                </div>
                <StyledTextarea
                  placeholder="I'm excited to share our latest insights on..."
                  className="w-full h-20"
                />
                <div className="flex justify-between text-xs text-neutral-muted mt-1">
                  <span>Professional tone recommended</span>
                  <span>0/3000</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button size="sm">
                  Schedule All Social Posts
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="email-subject" className="text-sm font-medium block mb-1">
                  Email Subject Line
                </Label>
                <Input
                  id="email-subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Your Blog Post Title"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="email-preview" className="text-sm font-medium block mb-1">
                  Preview Text
                </Label>
                <Input
                  id="email-preview"
                  value={emailPreview}
                  onChange={(e) => setEmailPreview(e.target.value)}
                  placeholder="The first 50-100 characters subscribers will see in their inbox"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="email-content" className="text-sm font-medium block mb-1">
                  Email Content
                </Label>
                <StyledTextarea
                  id="email-content"
                  placeholder="Dear subscribers,

We've just published a new article that we think you'll find valuable..."
                  className="w-full h-32"
                />
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateEmail}
                >
                  Generate Email Content
                </Button>
                <Button size="sm">
                  Schedule Email
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-3 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark mb-2">Advanced Promotion</h4>
          <div className="space-y-2">
            <div className="bg-neutral-light/10 p-3 rounded-md flex justify-between items-center">
              <div>
                <h5 className="text-sm font-medium">Paid Promotion</h5>
                <p className="text-xs text-neutral-muted">
                  Boost visibility with paid advertising
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <div className="bg-neutral-light/10 p-3 rounded-md flex justify-between items-center">
              <div>
                <h5 className="text-sm font-medium">Influencer Outreach</h5>
                <p className="text-xs text-neutral-muted">
                  Share with relevant influencers in your industry
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <div className="bg-neutral-light/10 p-3 rounded-md flex justify-between items-center">
              <div>
                <h5 className="text-sm font-medium">Content Syndication</h5>
                <p className="text-xs text-neutral-muted">
                  Republish on platforms like Medium or LinkedIn Articles
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PromotionStrategy;
