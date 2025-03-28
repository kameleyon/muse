import React, { useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UploadCloud, Palette, Type } from 'lucide-react'; // Icons

// Define Props
interface BrandCustomizationProps {
  logo: string | null;
  onLogoChange: (logoDataUrl: string | null) => void; // Handle file reading
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

// Placeholder font options
const fontOptions = ['Comfortaa', 'Questrial', 'Montserrat', 'Nunito Sans', 'Arial', 'Verdana'];

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

  const handleLogoButtonClick = () => {
    logoInputRef.current?.click();
  };

  // Read file as Data URL for preview and pass up
  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Logo file selected:', file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(reader.result as string); // Pass Data URL string
      };
      reader.onerror = () => {
         console.error("Failed to read logo file");
         onLogoChange(null); // Clear on error
      }
      reader.readAsDataURL(file);
    } else {
       onLogoChange(null); // Clear if no file selected
    }
    if (event.target) event.target.value = ''; // Reset input
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-4 border-b border-neutral-light/40 pb-2">Brand Customization</h4>
      
      <div className="space-y-4">
        {/* Logo Upload */}
        <div>
          <label className="settings-label flex items-center gap-2 mb-2"><UploadCloud size={16}/> Logo</label>
          <div className="flex items-center gap-2">
            {/* Show logo preview if available */}
            <div className="w-16 h-16 bg-neutral-light rounded flex items-center justify-center text-xs text-neutral-medium overflow-hidden">
               {logo ? <img src={logo} alt="Logo Preview" className="object-contain h-full w-full" /> : 'Preview'}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogoButtonClick}>Upload Logo</Button>
             {logo && <Button variant="ghost" size="sm" className="text-xs p-1 h-auto text-error" onClick={() => onLogoChange(null)}>Remove</Button>}
          </div>
          <input type="file" ref={logoInputRef} onChange={handleLogoFileChange} className="hidden" accept="image/*" />
          <p className="text-xs text-neutral-medium mt-1">Recommended: SVG, PNG</p>
        </div>

        {/* Color Scheme */}
        <div>
          <label className="settings-label flex items-center gap-2 mb-2"><Palette size={16}/> Color Scheme</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-medium text-neutral-medium block mb-1">Primary</label>
              <Input 
                 type="color" 
                 className="settings-input p-0 h-8 w-full" 
                 value={primaryColor} 
                 onChange={(e) => onPrimaryColorChange(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-medium block mb-1">Secondary</label>
              <Input 
                 type="color" 
                 className="settings-input p-0 h-8 w-full" 
                 value={secondaryColor} 
                 onChange={(e) => onSecondaryColorChange(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-medium block mb-1">Accent</label>
              <Input 
                 type="color" 
                 className="settings-input p-0 h-8 w-full" 
                 value={accentColor} 
                 onChange={(e) => onAccentColorChange(e.target.value)} 
              />
            </div>
          </div>
           <Button variant="link" size="sm" className="mt-1 p-0 h-auto text-xs">Extract from logo</Button>
        </div>

        {/* Typography */}
        <div>
           <label className="settings-label flex items-center gap-2 mb-2"><Type size={16}/> Typography</label>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-xs font-medium text-neutral-medium block mb-1">Heading Font</label>
               <select 
                  className="settings-input text-sm p-1 w-full" 
                  value={headingFont} 
                  onChange={(e) => onHeadingFontChange(e.target.value)}
               >
                  {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
               </select>
             </div>
             <div>
               <label className="text-xs font-medium text-neutral-medium block mb-1">Body Font</label>
               <select 
                  className="settings-input text-sm p-1 w-full" 
                  value={bodyFont} 
                  onChange={(e) => onBodyFontChange(e.target.value)}
               >
                   {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
               </select>
             </div>
           </div>
            <Button variant="link" size="sm" className="mt-1 p-0 h-auto text-xs">Upload custom font (Premium)</Button>
        </div>
         {/* Add Layout Elements later */}
      </div>
    </Card>
  );
};

export default BrandCustomization;