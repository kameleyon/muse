import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lightbulb, ChevronLeft, ChevronRight, Share2, Bookmark, ThumbsUp } from 'lucide-react';

const EnhancedTipOfTheDay: React.FC = () => {
  const [tipContent, setTipContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Sample tips (in a real implementation, these would come from an API)
  const tips = [
    "Use the '@mentions' feature in your content to link to team members and collaborate more effectively.",
    "Try the 'Content Repurposing' feature to quickly transform your blog posts into social media content.",
    "Save time with keyboard shortcuts: Press 'Ctrl+/' to see all available shortcuts.",
    "Improve readability by using the 'Readability Score' feature to analyze your content's complexity.",
    "Organize your projects with tags to quickly filter and find what you need.",
    "Use the 'Version History' feature to track changes and revert to previous versions if needed."
  ];

  useEffect(() => {
    const fetchTip = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now, we'll use the sample tips
        const randomIndex = Math.floor(Math.random() * tips.length);
        setTipIndex(randomIndex);
        setTipContent(tips[randomIndex]);
      } catch (error) {
        console.error("Failed to fetch tip:", error);
        // Fallback to a default tip on error
        setTipContent(tips[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTip();
  }, []);

  const handlePreviousTip = () => {
    const newIndex = tipIndex > 0 ? tipIndex - 1 : tips.length - 1;
    setTipIndex(newIndex);
    setTipContent(tips[newIndex]);
    setIsBookmarked(false);
    setIsLiked(false);
  };

  const handleNextTip = () => {
    const newIndex = (tipIndex + 1) % tips.length;
    setTipIndex(newIndex);
    setTipContent(tips[newIndex]);
    setIsBookmarked(false);
    setIsLiked(false);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // In a real implementation, this would open a share dialog
    alert(`Sharing tip: ${tipContent}`);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-white border border-neutral-light/30 rounded-xl overflow-hidden">
      <CardHeader className="border-b border-neutral-light/40 pb-4 bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="text-xl font-bold font-heading text-secondary flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-primary" />
          Tip of the Day
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-white to-neutral-light/10 rounded-xl p-5 border border-neutral-light/30 min-h-[100px] flex items-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-full -ml-8 -mb-8"></div>
              <Lightbulb className="absolute top-3 right-3 h-4 w-4 text-primary/20" />
              <p className="text-neutral-medium relative z-10">{tipContent}</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-1 bg-white/80 rounded-full p-1 shadow-sm border border-neutral-light/30">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePreviousTip}
                  className="p-1 h-8 w-8 rounded-full hover:bg-primary/10"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleNextTip}
                  className="p-1 h-8 w-8 rounded-full hover:bg-primary/10"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
              <div className="flex space-x-1 bg-white/80 rounded-full p-1 shadow-sm border border-neutral-light/30">
                <Button 
                  variant={isLiked ? "primary" : "ghost"} 
                  size="sm" 
                  onClick={handleLike}
                  className={`p-1 h-8 w-8 rounded-full ${isLiked ? 'shadow-md' : 'hover:bg-primary/10'}`}
                >
                  <ThumbsUp size={16} />
                </Button>
                <Button 
                  variant={isBookmarked ? "primary" : "ghost"} 
                  size="sm" 
                  onClick={handleBookmark}
                  className={`p-1 h-8 w-8 rounded-full ${isBookmarked ? 'shadow-md' : 'hover:bg-primary/10'}`}
                >
                  <Bookmark size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleShare}
                  className="p-1 h-8 w-8 rounded-full hover:bg-primary/10"
                >
                  <Share2 size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTipOfTheDay;
