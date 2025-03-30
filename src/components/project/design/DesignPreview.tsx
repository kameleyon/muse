import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Check } from 'lucide-react';
import { Slide } from './StructurePlanning';

// Define Props
interface DesignPreviewProps {
  slides: Slide[];
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  templateId: string | null;
}

const DesignPreview: React.FC<DesignPreviewProps> = ({
  slides,
  logo,
  primaryColor,
  secondaryColor,
  accentColor,
  headingFont,
  bodyFont,
  templateId,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullPreview, setIsFullPreview] = useState(false);

  // Font fallbacks for safety
  const getFontFamily = (fontName: string, isFallback = true) => {
    if (!fontName) return isFallback ? 'system-ui, sans-serif' : '';
    return `'${fontName}', ${isFallback ? 'system-ui, sans-serif' : ''}`;
  };

  // Get template-specific styling
  const getTemplateStyle = (id: string | null) => {
    if (!id) return {};
    
    // Define template-specific styles
    const styles: Record<string, any> = {
      'minimalist-pro': {
        background: 'white',
        borderColor: '#e5e7eb',
        fontWeight: 300,
        headerStyle: { 
          background: 'white', 
          color: primaryColor,
          borderBottom: `1px solid ${primaryColor}20` 
        }
      },
      'corporate-blue': {
        background: `linear-gradient(to bottom, ${primaryColor}05, white)`,
        borderColor: primaryColor,
        headerStyle: { 
          background: primaryColor,
          color: 'white',
          borderBottom: `1px solid ${primaryColor}` 
        }
      },
      'creative-splash': {
        background: `radial-gradient(circle at top left, ${primaryColor}15, transparent), 
                    radial-gradient(circle at bottom right, ${accentColor}15, white)`,
        borderColor: `${accentColor}40`,
        headerStyle: { 
          background: 'white',
          color: primaryColor,
          borderBottom: `1px solid ${accentColor}40` 
        }
      },
      'data-focus': {
        background: 'white',
        borderColor: `${primaryColor}30`,
        headerStyle: { 
          background: primaryColor,
          color: 'white',
          borderBottom: `1px solid ${primaryColor}50` 
        }
      },
      'narrative-arc': {
        background: `linear-gradient(135deg, white, ${primaryColor}10)`,
        borderColor: `${primaryColor}20`,
        headerStyle: { 
          background: 'white',
          color: primaryColor,
          borderBottom: `1px solid ${primaryColor}20` 
        }
      },
      'tech-startup': {
        background: `linear-gradient(to right, white, ${primaryColor}10)`,
        borderColor: '#e5e7eb',
        headerStyle: { 
          background: primaryColor,
          color: 'white',
          borderBottom: `1px solid ${primaryColor}` 
        }
      },
      'elegant-gradient': {
        background: `linear-gradient(135deg, white, ${primaryColor}15, ${secondaryColor}10)`,
        borderColor: `${primaryColor}30`,
        headerStyle: { 
          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
          color: 'white',
          borderBottom: `1px solid ${primaryColor}30` 
        }
      },
      'bold-contrast': {
        background: '#111',
        color: 'white',
        borderColor: primaryColor,
        headerStyle: { 
          background: primaryColor,
          color: 'white',
          borderBottom: `1px solid ${primaryColor}` 
        }
      }
    };
    
    return styles[id] || {
      background: `linear-gradient(135deg, white, ${primaryColor}05)`,
      borderColor: `${primaryColor}20`,
      headerStyle: { 
        background: 'white',
        color: primaryColor,
        borderBottom: `1px solid ${primaryColor}20` 
      }
    };
  };

  // Navigate between slides
  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Get current slide
  const currentSlide = slides[currentSlideIndex] || { id: 'placeholder', title: 'No slides defined' };
  
  // Get the template style
  const templateStyle = getTemplateStyle(templateId);

  // Generate placeholder content based on slide title
  const getPlaceholderContent = (slideTitle: string) => {
    switch (slideTitle) {
      case 'Cover Slide':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            {logo && (
              <div className="mb-4">
                <img src={logo} alt="Company Logo" className="max-h-12 mb-2" />
              </div>
            )}
            <h1 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
              InstaSmart
            </h1>
            <p className="text-sm" style={{ color: secondaryColor }}>
              Category: Proposal & Pitch Deck Generation
            </p>
          </div>
        );
      case 'Problem':
        return (
          <div className="flex flex-col p-4 h-full">
            <h2 className="text-lg font-bold mb-3" style={{ color: primaryColor }}>
              Problem
            </h2>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start">
                <div className="rounded-full p-0.5 mr-2 mt-0.5" style={{ backgroundColor: primaryColor }}>
                  <Check size={10} className="text-white" />
                </div>
                <span>Creating professional pitch decks is time-consuming</span>
              </li>
              <li className="flex items-start">
                <div className="rounded-full p-0.5 mr-2 mt-0.5" style={{ backgroundColor: primaryColor }}>
                  <Check size={10} className="text-white" />
                </div>
                <span>Maintaining consistent branding across presentations is challenging</span>
              </li>
              <li className="flex items-start">
                <div className="rounded-full p-0.5 mr-2 mt-0.5" style={{ backgroundColor: primaryColor }}>
                  <Check size={10} className="text-white" />
                </div>
                <span>Non-designers struggle to create visually appealing content</span>
              </li>
            </ul>
          </div>
        );
      case 'Solution':
        return (
          <div className="flex flex-col p-4 h-full">
            <h2 className="text-lg font-bold mb-3" style={{ color: primaryColor }}>
              Solution
            </h2>
            <div className="flex-1 flex">
              <div className="w-1/2 pr-2">
                <div
                  className="rounded-lg h-full flex items-center justify-center p-2"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <div className="text-xs text-center">
                    <div className="mb-1 font-semibold" style={{ color: primaryColor }}>
                      InstaSmart Platform
                    </div>
                    <p className="text-[10px]">
                      AI-powered pitch deck generation with professional templates and branding
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-1/2 pl-2 text-xs space-y-2">
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <span>AI content generation</span>
                </div>
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                  <span>Professional templates</span>
                </div>
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <span>Brand customization</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'How It Works':
        return (
          <div className="flex flex-col p-4 h-full">
            <h2 className="text-lg font-bold mb-3" style={{ color: primaryColor }}>
              How It Works
            </h2>
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-center mb-2">
                <div className="flex flex-row items-center w-full justify-between">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center w-1/3">
                    <div
                      className="rounded-full w-8 h-8 flex items-center justify-center mb-1"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div className="text-[10px] font-medium" style={{ color: primaryColor }}>Input Requirements</div>
                    <p className="text-[8px] mt-0.5">Enter project details</p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="w-8 h-px" style={{ backgroundColor: secondaryColor }}></div>
                  
                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center w-1/3">
                    <div
                      className="rounded-full w-8 h-8 flex items-center justify-center mb-1"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div className="text-[10px] font-medium" style={{ color: primaryColor }}>AI Processing</div>
                    <p className="text-[8px] mt-0.5">Content generation</p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="w-8 h-px" style={{ backgroundColor: secondaryColor }}></div>
                  
                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center w-1/3">
                    <div
                      className="rounded-full w-8 h-8 flex items-center justify-center mb-1"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div className="text-[10px] font-medium" style={{ color: primaryColor }}>Slide Creation</div>
                    <p className="text-[8px] mt-0.5">Visual assembly</p>
                  </div>
                </div>
              </div>
              
              {/* Process details */}
              <div
                className="mt-2 p-2 rounded-md text-xs flex-1"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                <div className="flex items-start mb-1.5">
                  <div
                    className="min-w-4 w-4 h-4 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="text-white text-[8px]">1</span>
                  </div>
                  <p className="text-[9px]">User provides project requirements and branding preferences</p>
                </div>
                <div className="flex items-start mb-1.5">
                  <div
                    className="min-w-4 w-4 h-4 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="text-white text-[8px]">2</span>
                  </div>
                  <p className="text-[9px]">AI analyzes inputs and generates optimized content for each slide</p>
                </div>
                <div className="flex items-start">
                  <div
                    className="min-w-4 w-4 h-4 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="text-white text-[8px]">3</span>
                  </div>
                  <p className="text-[9px]">Complete, professional pitch deck delivered ready for presentation</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col p-4 h-full">
            <h2 className="text-lg font-bold mb-3" style={{ color: primaryColor }}>
              {slideTitle}
            </h2>
            <div className="space-y-2 flex-1">
              <div
                className="h-2 rounded-full"
                style={{ width: '80%', backgroundColor: `${primaryColor}30` }}
              ></div>
              <div
                className="h-2 rounded-full"
                style={{ width: '60%', backgroundColor: `${primaryColor}30` }}
              ></div>
              <div
                className="h-2 rounded-full"
                style={{ width: '90%', backgroundColor: `${primaryColor}30` }}
              ></div>
              <div className="flex justify-between mt-4">
                <div
                  className="w-20 h-20 rounded-lg"
                  style={{ backgroundColor: `${secondaryColor}30` }}
                ></div>
                <div
                  className="w-20 h-20 rounded-lg"
                  style={{ backgroundColor: `${accentColor}30` }}
                ></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={`${isFullPreview ? 'p-0' : 'p-4'} border border-neutral-light bg-white/30 shadow-sm`}>
      {!isFullPreview && (
        <h4 className="font-semibold text-neutral-dark text-lg mb-4 border-b border-neutral-light/40 pb-2">
          Live Preview
        </h4>
      )}

      <div className={`${isFullPreview ? 'pt-2 px-2' : ''}`}>
        {/* Preview Controls */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevSlide}
              disabled={currentSlideIndex === 0}
              className="p-1 h-8 w-8"
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-xs text-neutral-medium mx-2">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-1 h-8 w-8"
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newValue = !isFullPreview;
              setIsFullPreview(newValue);
              console.log("Toggling full preview:", newValue);
            }}
            className="p-1 h-8 hover:bg-primary/10"
          >
            {isFullPreview ? (
              <>
                <Minimize size={14} className="mr-1" /> Compact
              </>
            ) : (
              <>
                <Maximize size={14} className="mr-1" /> Expand
              </>
            )}
          </Button>
        </div>

        {/* Preview Area */}
        <div 
          className={`border rounded-md overflow-hidden relative ${
            isFullPreview ? 'h-[400px]' : 'h-[300px]'
          }`}
          style={{
            fontFamily: getFontFamily(bodyFont),
          }}
        >
          {/* Header Bar */}
          <div 
            className="h-6 flex items-center px-2 text-xs"
            style={{ 
              backgroundColor: templateId ? templateStyle.headerStyle?.background : primaryColor,
              color: templateId ? templateStyle.headerStyle?.color : 'white'
            }}
          >
            <div className="w-2 h-2 rounded-full bg-white/50 mr-1"></div>
            <span>{currentSlide.title}</span>
          </div>

          {/* Slide Content Area with Template Styling */}
          <div
            className="absolute inset-6 top-8 rounded border shadow-sm flex flex-col overflow-hidden"
            style={{
              fontFamily: getFontFamily(bodyFont),
              background: templateStyle.background || `linear-gradient(135deg, white, ${primaryColor}05)`,
              borderColor: templateStyle.borderColor || '#e5e7eb',
              color: templateStyle.color || 'inherit',
              transition: 'all 0.3s ease-in-out'
            }}
          >
            {/* Slide Header */}
            <div
              className="text-center py-1 text-xs flex justify-between items-center px-3"
              style={{
                borderBottom: templateStyle.headerStyle?.borderBottom || `1px solid ${primaryColor}20`,
                background: templateStyle.headerStyle?.background,
                color: templateStyle.headerStyle?.color || primaryColor
              }}
            >
              <div className="w-12"></div>
              <div>{currentSlide.title}</div>
              <div className="w-12 flex justify-end">
                {logo && <img src={logo} alt="Logo" className="h-3" />}
              </div>
            </div>

            {/* Dynamic Content Based on Slide Type */}
            <div className="flex-1 overflow-auto">
              {getPlaceholderContent(currentSlide.title)}
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="mt-3 text-xs text-neutral-medium">
          <p className="text-center">
            Preview reflects structure and basic branding. Generated content will be more detailed.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DesignPreview;