import React, { useState } from 'react';
import { 
  Card,
  Button, 
  Input, 
  Label, 
  RadioGroup,
  RadioGroupItem,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui';
import { Loader2 } from 'lucide-react';

interface PublicationConfigurationProps {
  publishingPlatform: string | null;
  onPlatformChange: (platform: string) => void;
  scheduledTime: string | null;
  onScheduleChange: (time: string) => void;
  isPublishing: boolean;
  onPublish: () => void;
}

const PublicationConfiguration: React.FC<PublicationConfigurationProps> = ({
  publishingPlatform,
  onPlatformChange,
  scheduledTime,
  onScheduleChange,
  isPublishing,
  onPublish
}) => {
  const [publishType, setPublishType] = useState<'now' | 'schedule'>('now');
  const [customSlug, setCustomSlug] = useState('');
  const [categories, setCategories] = useState('');
  const [author, setAuthor] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  
  // Handle date-time input for scheduling
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onScheduleChange(e.target.value);
  };
  
  // Format the date-time for the input value
  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };

  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold font-heading text-secondary mb-3">Publication Configuration</h3>
      
      <div className="space-y-5">
        <div>
          <Label htmlFor="publishing-platform" className="text-sm font-medium text-neutral-dark mb-1 block">
            Publishing Platform
          </Label>
          <Select
            value={publishingPlatform || ''}
            onValueChange={onPlatformChange}
          >
            <SelectTrigger id="publishing-platform" className="w-full">
              <SelectValue placeholder="Select publishing platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wordpress">WordPress</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="hubspot">HubSpot</SelectItem>
              <SelectItem value="wix">Wix</SelectItem>
              <SelectItem value="custom">Custom CMS</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-muted mt-1">
            Select the platform where you want to publish your blog post.
          </p>
        </div>
        
        <div className="space-y-3 pt-3 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark">Publication Settings</h4>
          
          <div>
            <Label htmlFor="slug" className="text-xs font-medium block mb-1">
              Custom URL Slug (Optional)
            </Label>
            <Input
              id="slug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="my-awesome-blog-post"
              className="w-full"
            />
            <p className="text-xs text-neutral-muted mt-1">
              Leave blank to generate automatically from title.
            </p>
          </div>
          
          <div>
            <Label htmlFor="categories" className="text-xs font-medium block mb-1">
              Categories & Tags
            </Label>
            <Input
              id="categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="marketing, content-strategy, productivity"
              className="w-full"
            />
            <p className="text-xs text-neutral-muted mt-1">
              Comma-separated list of categories and tags.
            </p>
          </div>
          
          <div>
            <Label htmlFor="author" className="text-xs font-medium block mb-1">
              Author
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="John Doe"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="featured-image" className="text-xs font-medium block mb-1">
              Featured Image URL
            </Label>
            <Input
              id="featured-image"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full"
            />
            <Button size="sm" variant="outline" className="mt-2">
              Select from Media Library
            </Button>
          </div>
        </div>
        
        <div className="space-y-3 pt-3 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark">Publication Timing</h4>
          
          <RadioGroup 
            value={publishType} 
            onValueChange={(value) => setPublishType(value as 'now' | 'schedule')}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="publish-now" />
              <Label htmlFor="publish-now" className="cursor-pointer">Publish immediately</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="schedule" id="publish-schedule" />
              <Label htmlFor="publish-schedule" className="cursor-pointer">Schedule for later</Label>
            </div>
          </RadioGroup>
          
          {publishType === 'schedule' && (
            <div>
              <Label htmlFor="schedule-date" className="text-xs font-medium block mb-1">
                Schedule Date & Time
              </Label>
              <Input
                type="datetime-local"
                id="schedule-date"
                value={scheduledTime || ''}
                onChange={handleDateChange}
                min={getMinDateTime()}
                className="w-full"
              />
            </div>
          )}
        </div>
        
        <div className="pt-3 border-t border-neutral-light">
          <Button
            onClick={onPublish}
            disabled={isPublishing || !publishingPlatform || (publishType === 'schedule' && !scheduledTime)}
            className="w-full"
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              publishType === 'now' ? 'Publish Now' : 'Schedule Publication'
            )}
          </Button>
          <p className="text-xs text-neutral-muted text-center mt-2">
            {publishType === 'now' 
              ? 'Your blog post will be published immediately.' 
              : 'Your blog post will be scheduled for publication at the specified time.'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PublicationConfiguration;
