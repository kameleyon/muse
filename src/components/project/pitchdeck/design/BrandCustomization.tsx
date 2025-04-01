import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UploadCloud, Palette, Type, Eye, Check, Sparkles, RotateCcw } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

// Define Props
interface BrandCustomizationProps {
  logo: string | null;
  onLogoChange: (logoDataUrl: string | null) => void;
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  secondaryColor: string;
  onSecondaryColorChange: (color: string) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  headingFont: string;
  onHeadingFontChange: (font: string) => void;
  bodyFont: string;
  onBodyFontChange: (font: string) => void;
}

// Font options with proper fallbacks
const fontOptions = [
  { name: 'Comfortaa', fallback: "'Comfortaa', cursive" },
  { name: 'Questrial', fallback: "'Questrial', sans-serif" },
  { name: 'Montserrat', fallback: "'Montserrat', sans-serif" },
  { name: 'Nunito Sans', fallback: "'Nunito Sans', sans-serif" },
  { name: 'Open Sans', fallback: "'Open Sans', sans-serif" },
  { name: 'Roboto', fallback: "'Roboto', sans-serif" },
  { name: 'Source Sans Pro', fallback: "'Source Sans Pro', sans-serif" },
  { name: 'Lato', fallback: "'Lato', sans-serif" },
  { name: 'Raleway', fallback: "'Raleway', sans-serif" },
  { name: 'Poppins', fallback: "'Poppins', sans-serif" },
];

const BrandCustomization: React.FC<BrandCustomizationProps> = ({
  logo,
  onLogoChange,
  primaryColor,
  onPrimaryColorChange,
  secondaryColor,
  onSecondaryColorChange,
  accentColor,
  onAccentColorChange,
  headingFont,
  onHeadingFontChange,
  bodyFont,
  onBodyFontChange,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isExtractingColors, setIsExtractingColors] = useState(false);

  // Default values for reset
  const defaultValues = {
    primaryColor: '#AE5630',
    secondaryColor: '#333333',
    accentColor: '#C85A32',
    headingFont: 'Montserrat',
    bodyFont: 'Open Sans'
  };

  const handleLogoButtonClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(reader.result as string);
      };
      reader.onerror = () => {
        console.error("Failed to read logo file");
        onLogoChange(null);
      }
      reader.readAsDataURL(file);
    } else {
      onLogoChange(null);
    }
    if (event.target) event.target.value = '';
  };

  // Extract colors from logo using canvas
  const extractColorsFromLogo = () => {
    if (!logo) return;
    
    setIsExtractingColors(true);
    
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = logo;
    
    img.onload = () => {
      // Create canvas to analyze the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsExtractingColors(false);
        return;
      }
      
      // Set canvas size proportional to image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      try {
        // Get image data for analysis
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        // Create color frequency map
        const colorMap: Record<string, number> = {};
        
        // Sample pixels (skip some for performance)
        for (let i = 0; i < imageData.length; i += 16) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];
          
          // Skip transparent pixels
          if (a < 128) continue;
          
          // Skip very light or very dark colors
          if ((r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) continue;
          
          // Create color key and count occurrences
          const colorKey = `${r},${g},${b}`;
          colorMap[colorKey] = (colorMap[colorKey] || 0) + 1;
        }
        
        // Convert to array for sorting
        const colors = Object.entries(colorMap)
          .map(([key, count]) => ({ 
            color: key.split(',').map(Number), 
            count 
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Top 10 colors
        
        if (colors.length > 0) {
          // Extract primary, secondary, and accent colors
          const extractedPrimary = `rgb(${colors[0].color[0]}, ${colors[0].color[1]}, ${colors[0].color[2]})`;
          
          // For secondary, either take the second most common or create a complementary
          let extractedSecondary;
          if (colors.length > 1) {
            extractedSecondary = `rgb(${colors[1].color[0]}, ${colors[1].color[1]}, ${colors[1].color[2]})`;
          } else {
            // Create complementary color if only one dominant color
            const [h, s, l] = rgbToHsl(colors[0].color[0], colors[0].color[1], colors[0].color[2]);
            const [r, g, b] = hslToRgb((h + 0.3) % 1, s, l);
            extractedSecondary = `rgb(${r}, ${g}, ${b})`;
          }
          
          // For accent, use third color or create a contrasting color
          let extractedAccent;
          if (colors.length > 2) {
            extractedAccent = `rgb(${colors[2].color[0]}, ${colors[2].color[1]}, ${colors[2].color[2]})`;
          } else {
            // Create contrasting accent
            const [h, s, l] = rgbToHsl(colors[0].color[0], colors[0].color[1], colors[0].color[2]);
            const [r, g, b] = hslToRgb((h + 0.5) % 1, s, l);
            extractedAccent = `rgb(${r}, ${g}, ${b})`;
          }
          
          onPrimaryColorChange(extractedPrimary);
          onSecondaryColorChange(extractedSecondary);
          onAccentColorChange(extractedAccent);
        }
      } catch (error) {
        console.error("Error extracting colors:", error);
      }
      
      setIsExtractingColors(false);
    };
    
    img.onerror = () => {
      console.error("Failed to load image for color extraction");
      setIsExtractingColors(false);
    };
  };
  
  // Color conversion helpers
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return [h, s, l];
  };
  
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // Reset to default values
  const resetToDefaults = () => {
    onPrimaryColorChange(defaultValues.primaryColor);
    onSecondaryColorChange(defaultValues.secondaryColor);
    onAccentColorChange(defaultValues.accentColor);
    onHeadingFontChange(defaultValues.headingFont);
    onBodyFontChange(defaultValues.bodyFont);
  };

  // Find font fallback
  const getFontFallback = (fontName: string) => {
    const font = fontOptions.find(f => f.name === fontName);
    return font ? font.fallback : `'${fontName}', sans-serif`;
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-neutral-dark text-lg">Brand Customization</h4>
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex items-center h-7"
          onClick={resetToDefaults}
          title="Reset to default values"
        >
          <RotateCcw size={14} className="mr-1" />
          Reset to Default
        </Button>
      </div>
      <div className="border-b border-neutral-light/40 mb-4 pb-2"></div>
      
      <div className="space-y-5">
        {/* Logo Upload with Enhanced UI */}
        <div>
          <label className="settings-label flex items-center gap-2 mb-2">
            <UploadCloud size={16} className="text-primary"/>
            <span>Logo</span>
          </label>
          
          <div className="flex items-center gap-3">
            {/* Logo preview area with better styling */}
            <div className={`w-20 h-20 rounded-md border-2 border-dashed flex items-center justify-center overflow-hidden ${logo ? 'border-primary/20 bg-primary/5' : 'border-neutral-light bg-neutral-light/20'}`}>
              {logo ? (
                <img 
                  src={logo} 
                  alt="Company Logo" 
                  className="w-full h-full object-contain p-1" 
                  style={{ maxWidth: '100%' }}
                />
              ) : (
                <span className="text-xs text-neutral-medium text-center">
                  No logo<br />uploaded
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogoButtonClick}
                className="text-xs w-full flex items-center justify-center h-8"
              >
                <UploadCloud size={14} className="mr-1" />
                Upload Logo
              </Button>
              
              {logo && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs w-full flex items-center justify-center h-8 text-error hover:bg-error/10"
                  onClick={() => onLogoChange(null)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
          
          <input 
            type="file" 
            ref={logoInputRef} 
            onChange={handleLogoFileChange} 
            className="hidden" 
            accept="image/svg+xml,image/png,image/jpeg" 
          />
          
          <p className="text-xs text-neutral-medium mt-1">
            Recommended: SVG, PNG with transparent background
          </p>
        </div>

        {/* Color Scheme with Visual Swatches */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="settings-label flex items-center gap-2">
              <Palette size={16} className="text-primary" />
              <span>Color Scheme</span>
            </label>
            
            {logo && (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs flex items-center h-6 py-0"
                onClick={extractColorsFromLogo}
                disabled={isExtractingColors}
              >
                {isExtractingColors ? (
                  <span className="flex items-center">
                    <Sparkles size={12} className="mr-1 animate-pulse" />
                    Extracting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles size={12} className="mr-1" />
                    Extract from logo
                  </span>
                )}
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-medium block mb-1">Primary</label>
              <div className="relative">
                <div 
                  className="w-full h-8 rounded-md mb-1" 
                  style={{ backgroundColor: primaryColor }}
                />
                <Input 
                  type="color" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  value={primaryColor}
                  onChange={(e) => onPrimaryColorChange(e.target.value)}
                />
              </div>
              <div className="text-[10px] text-neutral-medium uppercase tracking-wider">
                {primaryColor}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-neutral-medium block mb-1">Secondary</label>
              <div className="relative">
                <div 
                  className="w-full h-8 rounded-md mb-1" 
                  style={{ backgroundColor: secondaryColor }}
                />
                <Input 
                  type="color" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  value={secondaryColor}
                  onChange={(e) => onSecondaryColorChange(e.target.value)}
                />
              </div>
              <div className="text-[10px] text-neutral-medium uppercase tracking-wider">
                {secondaryColor}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-neutral-medium block mb-1">Accent</label>
              <div className="relative">
                <div 
                  className="w-full h-8 rounded-md mb-1" 
                  style={{ backgroundColor: accentColor }}
                />
                <Input 
                  type="color" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  value={accentColor}
                  onChange={(e) => onAccentColorChange(e.target.value)}
                />
              </div>
              <div className="text-[10px] text-neutral-medium uppercase tracking-wider">
                {accentColor}
              </div>
            </div>
          </div>
        </div>
        
        {/* Typography with Enhanced Previews */}
        <div>
          <label className="settings-label flex items-center gap-2 mb-2">
            <Type size={16} className="text-primary" />
            <span>Typography</span>
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-medium block mb-1">Heading Font</label>
              <div className="relative">
                <select 
                  className="w-full h-10 px-3 rounded-md border border-neutral-light bg-white text-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  value={headingFont}
                  onChange={(e) => onHeadingFontChange(e.target.value)}
                  style={{ fontFamily: getFontFallback(headingFont) }}
                >
                  {fontOptions.map((font) => (
                    <option 
                      key={font.name} 
                      value={font.name} 
                      style={{ fontFamily: font.fallback }}
                    >
                      {font.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg 
                    width="10" 
                    height="6" 
                    viewBox="0 0 10 6" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div 
                className="text-base mt-2 p-2 border border-neutral-light rounded-md"
                style={{ fontFamily: getFontFallback(headingFont) }}
              >
                Heading Sample
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-neutral-medium block mb-1">Body Font</label>
              <div className="relative">
                <select 
                  className="w-full h-10 px-3 rounded-md border border-neutral-light bg-white text-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  value={bodyFont}
                  onChange={(e) => onBodyFontChange(e.target.value)}
                  style={{ fontFamily: getFontFallback(bodyFont) }}
                >
                  {fontOptions.map((font) => (
                    <option 
                      key={font.name} 
                      value={font.name} 
                      style={{ fontFamily: font.fallback }}
                    >
                      {font.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg 
                    width="10" 
                    height="6" 
                    viewBox="0 0 10 6" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div 
                className="text-sm mt-2 p-2 border border-neutral-light rounded-md"
                style={{ fontFamily: getFontFallback(bodyFont) }}
              >
                Body text sample. This shows how your paragraphs will appear in your presentation.
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs flex items-center h-8"
          >
            <Eye size={14} className="mr-1" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>
        
        {/* Combined Preview */}
        {showPreview && (
          <div className="border border-neutral-light rounded-md p-4 bg-white">
            <div 
              className="border rounded-md overflow-hidden shadow-sm"
              style={{ 
                backgroundColor: `${primaryColor}05`,
                borderColor: `${primaryColor}30` 
              }}
            >
              <div 
                className="p-2 text-sm font-medium flex items-center justify-between"
                style={{ 
                  backgroundColor: primaryColor,
                  color: 'white'
                }}
              >
                <div>Sample Slide</div>
                <div>
                  {logo && (
                    <img src={logo} alt="Logo" className="h-4" />
                  )}
                </div>
              </div>
              
              <div className="p-3">
                <h3 
                  className="text-base font-medium mb-1"
                  style={{ 
                    fontFamily: getFontFallback(headingFont),
                    color: primaryColor
                  }}
                >
                  Branding Preview
                </h3>
                
                <p 
                  className="text-xs mb-2"
                  style={{ 
                    fontFamily: getFontFallback(bodyFont),
                    color: secondaryColor
                  }}
                >
                  This shows how your branding will appear in slides.
                </p>
                
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <div 
                    className="text-xs"
                    style={{ fontFamily: getFontFallback(bodyFont) }}
                  >
                    Primary Element
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                  <div 
                    className="text-xs"
                    style={{ fontFamily: getFontFallback(bodyFont) }}
                  >
                    Secondary Element
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div 
                    className="text-xs"
                    style={{ fontFamily: getFontFallback(bodyFont) }}
                  >
                    Accent Element
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BrandCustomization;