import React from 'react';
import { Card } from '@/components/ui/Card';

// Define props to accept dynamic styles/content
interface DesignPreviewProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string; 
  headingFont?: string;
  bodyFont?: string;
  slides?: { id: string; title: string }[]; // Add slides prop
}

const DesignPreview: React.FC<DesignPreviewProps> = ({
  primaryColor = '#ae5630', 
  secondaryColor = '#232321', 
  accentColor = '#9d4e2c', 
  headingFont = 'Comfortaa, cursive', 
  bodyFont = 'Questrial, sans-serif', 
  slides = [], // Default to empty array
}) => {
  const backgroundColor = '#faf9f5'; 
  const mediumColor = '#3d3d3a'; 

  // Simulate a very basic slide rendering based on structure
  const renderSlidePreview = (slide: { id: string; title: string }, index: number) => {
    // Basic differentiation for title slide vs others
    const isTitleSlide = index === 0;
    const titleSize = isTitleSlide ? 'text-xl' : 'text-lg';
    const titleWeight = isTitleSlide ? 'font-bold' : 'font-semibold';

    return (
      <div 
        key={slide.id}
        className="border border-neutral-light rounded p-3 mb-2 shadow-sm flex flex-col bg-white/80" // Simple box for each slide
        style={{ fontFamily: bodyFont, color: mediumColor }}
      >
        <span 
           className={`${titleSize} ${titleWeight} truncate mb-1`} 
           style={{ fontFamily: headingFont, color: secondaryColor }}
        >
           {index + 1}. {slide.title}
        </span>
        {/* Add more placeholder content based on slide type later */}
        {!isTitleSlide && <div className="text-xs mt-1">Placeholder body content...</div>}
         {/* Example visual element using accent */}
         <div className="mt-auto pt-2 flex justify-end">
             <div className="h-4 w-8 rounded" style={{ backgroundColor: accentColor + '50' }}></div>
         </div>
      </div>
    );
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white shadow-md h-full min-h-[400px] flex flex-col">
      <h4 className="font-semibold text-neutral-dark mb-2 text-center text-sm border-b pb-2">Live Preview</h4>
      
      {/* Scrollable area for slide previews */}
      <div 
        className="flex-grow border border-dashed border-neutral-medium rounded-md p-2 overflow-y-auto bg-neutral-light/30" 
        style={{ backgroundColor: backgroundColor }} 
      >
         {slides.length > 0 ? (
            slides.map(renderSlidePreview)
         ) : (
            <div className="text-center text-neutral-medium italic p-4">
               Slide structure will appear here.
            </div>
         )}
      </div>
       <p className="text-xs text-neutral-medium mt-2 text-center italic">
          Preview reflects structure and basic branding.
       </p>
    </Card>
  );
};

export default DesignPreview;