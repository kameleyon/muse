import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import TemplateGallery from './TemplateGallery';
import BrandCustomization from './BrandCustomization';
// Import default structure and conversion helper from StructurePlanning
import StructurePlanning, { defaultPitchDeckStructure, numberToComplexityLevel } from './StructurePlanning';
import { Slide, ComplexityLevel } from '@/store/types'; // Import Slide and ComplexityLevel from types
import DesignPreview from './DesignPreview';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore'; // Import Zustand store

// Define Step3 Props
interface Step3DesignProps {
  projectData: any; // This would be properly typed in a production app
  onSaveDesign: (designData: any) => void;
  isCompleted: boolean;
  onCompleteStep: () => void;
}

const Step3Design: React.FC<Step3DesignProps> = ({ 
  projectData, 
  onSaveDesign,
  isCompleted,
  onCompleteStep
}) => {
  // Get projectName from store
  const projectName = useProjectWorkflowStore((state) => state.projectName);

  // State for template selection
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    projectData?.design?.templateId || null
  );
  
  // State for brand customization
  const [logo, setLogo] = useState<string | null>(
    projectData?.design?.logo || null
  );
  const [primaryColor, setPrimaryColor] = useState<string>(
    projectData?.design?.primaryColor || '#AE5630'
  );
  const [secondaryColor, setSecondaryColor] = useState<string>(
    projectData?.design?.secondaryColor || '#333333'
  );
  const [accentColor, setAccentColor] = useState<string>(
    projectData?.design?.accentColor || '#C85A32'
  );
  const [headingFont, setHeadingFont] = useState<string>(
    projectData?.design?.headingFont || 'Montserrat'
  );
  const [bodyFont, setBodyFont] = useState<string>(
    projectData?.design?.bodyFont || 'Open Sans'
  );
  
  // State for structure planning - Force using all 14 slides from defaultPitchDeckStructure
  const [slides, setSlides] = useState<Slide[]>(defaultPitchDeckStructure);

  // Force load all 14 slides
  useEffect(() => {
    // Ensure we always have all 14 slides
    setSlides(defaultPitchDeckStructure);
  }, []);
  // State for complexity level - Use ComplexityLevel type and convert initial value
  const [complexity, setComplexity] = useState<ComplexityLevel>(
    // Convert potential number from projectData or default 50 to ComplexityLevel string
    numberToComplexityLevel(projectData?.design?.complexity || 50)
  );
  
  // State for save/autosave functionality
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFormComplete, setIsFormComplete] = useState<boolean>(isCompleted);
  
  // Check if all required fields are filled
  useEffect(() => {
    const requiredFieldsFilled = 
      selectedTemplateId !== null && 
      primaryColor !== '' && 
      slides.length > 0;
    
    setIsFormComplete(requiredFieldsFilled);
  }, [selectedTemplateId, primaryColor, slides]);
  
  // Auto-save changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDesignData();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [selectedTemplateId, logo, primaryColor, secondaryColor, accentColor, headingFont, bodyFont, slides, complexity]);
  
  // Save design data to parent component
  const saveDesignData = () => {
    setIsSaving(true);
    
    const designData = {
      templateId: selectedTemplateId,
      logo,
      primaryColor,
      secondaryColor,
      accentColor,
      headingFont,
      bodyFont,
      slides,
      complexity,
      lastUpdated: new Date().toISOString()
    };
    
    onSaveDesign(designData);
    
    // Simulate a save operation
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 500);
  };
  
  // Handle manual save and complete
  const handleSaveAndComplete = () => {
    saveDesignData();
    onCompleteStep();
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Templates & Branding */}
        <div className="space-y-6">
          {/* Template Selection */}
          <TemplateGallery
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={setSelectedTemplateId}
            primaryColor={primaryColor}
          />
          
          {/* Brand Customization */}
          <BrandCustomization 
            logo={logo}
            onLogoChange={setLogo}
            primaryColor={primaryColor}
            onPrimaryColorChange={setPrimaryColor}
            secondaryColor={secondaryColor}
            onSecondaryColorChange={setSecondaryColor}
            accentColor={accentColor}
            onAccentColorChange={setAccentColor}
            headingFont={headingFont}
            onHeadingFontChange={setHeadingFont}
            bodyFont={bodyFont}
            onBodyFontChange={setBodyFont}
          />
        </div>
        
        {/* Column 2: Structure & Preview */}
        <div className="space-y-6">
          {/* Structure Planning */}
          <StructurePlanning
            slides={slides}
            onSlidesChange={setSlides}
            complexity={complexity}
            onComplexityChange={setComplexity}
            primaryColor={primaryColor}
          />
          
          {/* Live Preview */}
          <DesignPreview
            projectName={projectName || ''} // Provide fallback for potentially null/undefined projectName
            slides={slides}
            logo={logo}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            headingFont={headingFont}
            bodyFont={bodyFont}
            templateId={selectedTemplateId}
          />
        </div>
      </div>
      
      {/* Save & Continue Bar */}
      <div className="flex justify-between items-center border-t border-neutral-light/40 pt-4 mt-6">
        <div className="text-sm text-neutral-medium">
          {lastSaved && (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
          {isSaving && (
            <span>Saving...</span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={saveDesignData}>
            Save Design
          </Button>
          
          <Button 
            disabled={!isFormComplete}
            onClick={handleSaveAndComplete}
          >
            {isCompleted ? 'Update & Continue' : 'Save & Continue'}
          </Button>
        </div>
      </div>
      
      {/* Design Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-md p-4 mt-4">
        <h5 className="text-sm font-medium text-primary mb-2">Design & Structure Tips</h5>
        <ul className="text-xs space-y-1 text-neutral-dark">
          <li className="flex items-start">
            <span className="mr-1">•</span>
            <span>Your template selection, branding, and slide structure directly influence AI content generation</span>
          </li>
          <li className="flex items-start">
            <span className="mr-1">•</span>
            <span>Colors and logo will be applied consistently across all generated slides</span>
          </li>
          <li className="flex items-start">
            <span className="mr-1">•</span>
            <span>Higher complexity setting creates more detailed content per slide</span>
          </li>
          <li className="flex items-start">
            <span className="mr-1">•</span>
            <span>The slide sequence affects narrative flow and storytelling progression</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Step3Design;
