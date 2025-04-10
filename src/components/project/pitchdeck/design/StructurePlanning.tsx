import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input'; 
import { Button } from '@/components/ui/Button';
import { GripVertical, Plus, Trash2, Info } from 'lucide-react';
import { Tooltip } from '../../../ui/Tooltip';
// Explicitly import the centralized Slide type again
import { Slide, ComplexityLevel } from '@/store/types';

// Define Props using imported types
interface StructurePlanningProps {
  slides: Slide[]; // Use imported Slide type
  onSlidesChange: (newSlides: Slide[]) => void; // Use imported Slide type
  complexity: ComplexityLevel; // Use imported ComplexityLevel type ('basic' | 'intermediate' | 'advanced')
  onComplexityChange: (newComplexity: ComplexityLevel) => void; // Use imported ComplexityLevel type
  primaryColor?: string; 
}

// Helper function to convert ComplexityLevel string to a number (10-100)
const complexityLevelToNumber = (level: ComplexityLevel): number => {
  switch (level) {
    case 'basic': return 25; // Map 'basic' to a lower percentage, e.g., 25%
    case 'intermediate': return 50; // Map 'intermediate' to mid-range, e.g., 50%
    case 'advanced': return 85; // Map 'advanced' to a higher percentage, e.g., 85%
    default: return 50; // Default to intermediate
  }
};

// Helper function to convert number (10-100) back to ComplexityLevel string
export const numberToComplexityLevel = (value: number): ComplexityLevel => {
  if (value <= 33) return 'basic';
  if (value <= 66) return 'intermediate';
  return 'advanced';
};

// Default pitch deck structure - now includes 'type'
export const defaultPitchDeckStructure: Slide[] = [
  { id: 'slide-1', title: 'Cover Slide', type: 'cover', description: 'Company Logo, Project Name, Tagline or Short Mission Statement', isRequired: true },
  { id: 'slide-2', title: 'Problem', type: 'problem', description: 'Define the problem your product/service aims to solve', isRequired: true },
  { id: 'slide-3', title: 'Solution', type: 'solution', description: 'Explain how your product/service solves the problem', isRequired: true },
  { id: 'slide-4', title: 'How It Works', type: 'how_it_works', description: 'Explain the mechanics of your solution', isRequired: true },
  { id: 'slide-5', title: 'Core Features', type: 'features', description: 'Highlight the main features and benefits', isRequired: true },
  { id: 'slide-6', title: 'Market Opportunity', type: 'market_analysis', description: 'Market size, trends, and growth potential', isRequired: true },
  { id: 'slide-7', title: 'Business Model', type: 'business_model', description: 'Revenue streams and monetization strategy', isRequired: true },
  { id: 'slide-8', title: 'Competitive Advantage', type: 'competition', description: 'What sets you apart from competitors', isRequired: true },
  { id: 'slide-9', title: 'Go-to-Market Strategy', type: 'go_to_market', description: 'Plan for acquiring customers and scaling', isRequired: true },
  { id: 'slide-10', title: 'Financial Projections', type: 'financials', description: 'Key financial metrics and forecasts', isRequired: true },
  { id: 'slide-11', title: 'Team & Expertise', type: 'team', description: 'Key team members and their qualifications', isRequired: true },
  { id: 'slide-12', title: 'Roadmap & Milestones', type: 'roadmap', description: 'Timeline of key achievements and future goals', isRequired: true },
  { id: 'slide-13', title: 'Call to Action', type: 'call_to_action', description: 'Specific ask and next steps', isRequired: true },
  { id: 'slide-14', title: 'Appendix', type: 'appendix', description: 'Additional supporting information (optional)', isRequired: false }
];

const StructurePlanning: React.FC<StructurePlanningProps> = ({
  slides,
  onSlidesChange,
  complexity, // Receive ComplexityLevel string
  onComplexityChange, // Expects function taking ComplexityLevel string
  primaryColor = '#AE5630',
}) => {
  const [selectedStructure, setSelectedStructure] = useState('standard-14');

  // Convert complexity string to number for the slider
  const complexityValue = complexityLevelToNumber(complexity);

  // Handle slider change and convert back to ComplexityLevel string
  const handleSliderChange = (value: number) => {
    const newLevel = numberToComplexityLevel(value);
    if (newLevel !== complexity) {
      onComplexityChange(newLevel);
    }
  };

  const handleStructureChange = (structureId: string) => {
    const newStructure = pitchDeckStructures.find(s => s.id === structureId);
    if (newStructure) {
      onSlidesChange(newStructure.slides);
      setSelectedStructure(structureId);
    }
  };

  // ALWAYS ensure all 14 slides are present (or initialize if empty)
  useEffect(() => {
    const selectedStructureData = pitchDeckStructures.find(s => s.id === selectedStructure);
    if (selectedStructureData) {
      if (!slides || slides.length === 0) {
        onSlidesChange(selectedStructureData.slides);
      } else if (slides.length !== selectedStructureData.slides.length) {
        // Optional: Reset to selected structure if length doesn't match
        // onSlidesChange(selectedStructureData.slides);
      }
    }
  }, [slides, onSlidesChange, selectedStructure]);
  
  // Drag-and-drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (sourceIndex === targetIndex) return;

    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(sourceIndex, 1);
    newSlides.splice(targetIndex, 0, movedSlide);
    onSlidesChange(newSlides);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault(); 
  };
  
  // Remove slide (disabled as per previous logic)
  const removeSlide = (index: number) => {
    return; 
  };
  
  // State for modals
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideDescription, setNewSlideDescription] = useState('');
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [editingSlideTitle, setEditingSlideTitle] = useState('');
  const [editingSlideDescription, setEditingSlideDescription] = useState('');

// Add slide
const addSlide = () => {
  if (newSlideTitle.trim()) {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: newSlideTitle,
      description: newSlideDescription || '',
      type: 'custom',
      isRequired: false
    };
    onSlidesChange([...slides, newSlide]);
    setShowAddSlideModal(false);
    setNewSlideTitle('');
    setNewSlideDescription('');
  }
};

  // Edit slide handlers
  const startEditSlideTitle = (index: number) => {
    // Allow editing only if not required (or adjust logic if needed)
    if (!slides[index].isRequired) { 
      setEditingSlideIndex(index);
      setEditingSlideTitle(slides[index].title);
      setEditingSlideDescription(slides[index].description || '');
    }
  };

  const saveSlideTitle = () => {
    if (editingSlideIndex !== null && editingSlideTitle.trim()) {
      const newSlides = [...slides];
      newSlides[editingSlideIndex] = {
        ...newSlides[editingSlideIndex],
        title: editingSlideTitle,
        description: editingSlideDescription
      };
      onSlidesChange(newSlides);
    }
    setEditingSlideIndex(null);
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-4 border-b border-neutral-light/40 pb-2">Structure Planning</h4>

      {/* Structure Templates Section */}
      <div className="mb-6">
        <label className="settings-label mb-2">Pitch Deck Structure</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {pitchDeckStructures.map((structure) => (
            <button
              key={structure.id}
              onClick={() => handleStructureChange(structure.id)}
              className={`p-3 border rounded-lg text-left ${
                selectedStructure === structure.id
                  ? 'border-primary bg-primary/5'
                  : 'border-neutral-light hover:border-primary/50'
              }`}
            >
              <p className="font-medium mb-1 text-md text-primary/80 align-top">{structure.name}</p>
              <p className="text-xs text-neutral-medium">{structure.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Slide Structure List */}
        <div className="md:col-span-2">
          <div className="flex items-center mb-2">
            <label className="settings-label">Slide Order</label>
            <Tooltip content="Drag to reorder slides. Required slides cannot be removed or renamed.">
              <Info size={14} className="ml-1 text-neutral-medium cursor-help" />
            </Tooltip>
          </div>
          
          <ul className="border rounded-xl p-1 bg-neutral-light/20 space-y-1 min-h-auto">
            {slides.map((slide, index) => (
              <li 
                key={slide.id} 
                draggable 
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                className={`flex items-center justify-between p-1 border rounded-xl cursor-move text-sm ${
                  slide.isRequired ? 'bg-primary/5 border-primary/20' : 'bg-white border-neutral-light'
                }`}
              >
                <div className="flex items-start gap-2 flex-1">
                  <GripVertical size={14} className="text-neutral-medium flex-shrink-0 mt-1" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-wrap items-center">
                      <span
                        className={`font-medium break-all ${!slide.isRequired ? 'cursor-pointer hover:text-primary' : 'cursor-default'}`}
                        onDoubleClick={() => startEditSlideTitle(index)}
                        title={slide.isRequired ? "Required slides cannot be renamed" : "Double-click to edit title"}
                      >{`${index + 1}. ${slide.title}`}</span>
                      {slide.isRequired && (
                        <span className="ml-1 px-1 py-0 bg-primary/1 font-semibold text-primary text-[9px] rounded-lg">Required</span>
                      )}
                    </div>
                    {slide.description && (
                      <div className="text-xs text-neutral-medium break-words pr-2">{slide.description}</div>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-1 h-auto ${
                    slide.isRequired ? 'text-neutral-light cursor-not-allowed' : 'text-neutral-medium hover:text-error'
                  }`}
                  onClick={() => removeSlide(index)}
                  disabled={slide.isRequired}
                >
                  <Trash2 size={14} />
                </Button>
              </li>
            ))}
          </ul>
          
          {/* Add Slide Button (kept but functionally disabled) */}
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowAddSlideModal(true)}>
              <Plus size={14} className="mr-1"/> Add Custom Slide
            </Button>
          </div>
          <p className="text-xs text-neutral-medium mt-1">Standard 14-slide pitch deck structure.</p>
          
          {/* Add Slide Modal (kept but functionally disabled) */}
          {showAddSlideModal && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-md shadow-lg max-w-md w-full">
                <h5 className="font-medium text-lg mb-4">Add Custom Slide</h5>
                <div className="mb-3">
                  <label className="block text-sm mb-1">Slide Title <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    value={newSlideTitle}
                    onChange={(e) => setNewSlideTitle(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Slide Description</label>
                  <textarea
                    value={newSlideDescription}
                    onChange={(e) => setNewSlideDescription(e.target.value)}
                    placeholder="Enter slide description or content summary..."
                    className="w-full h-20 p-2 border rounded-md text-sm resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowAddSlideModal(false)}>Cancel</Button>
                  <Button size="sm" onClick={addSlide} disabled={!newSlideTitle.trim()}>Add Slide</Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Edit Slide Title Modal */}
          {editingSlideIndex !== null && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-md shadow-lg max-w-md w-full">
                <h5 className="font-medium text-lg mb-4">Edit Slide Details</h5>
                <div className="mb-3">
                  <label className="block text-sm mb-1">Slide Title <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    value={editingSlideTitle}
                    onChange={(e) => setEditingSlideTitle(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1">Slide Description</label>
                  <textarea
                    value={editingSlideDescription}
                    onChange={(e) => setEditingSlideDescription(e.target.value)}
                    placeholder="Enter slide description or content summary..."
                    className="w-full h-20 p-2 border rounded-md text-sm resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingSlideIndex(null)}>Cancel</Button>
                  <Button size="sm" onClick={saveSlideTitle} disabled={!editingSlideTitle.trim()}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Structure Tools */}
        <div className="space-y-4">
          <div>
            <label htmlFor="complexity" className="settings-label mb-1">
              Complexity ({complexityValue}%) {/* Display numeric value */}
            </label>
            <div className="relative mb-2">
              <div className="relative">
                {/* Custom styled range slider */}
                <div className="w-full h-2 bg-neutral-200 rounded-xl relative">
                  <div
                    className="absolute h-2 left-0 top-0 rounded-lg"
                    style={{
                      width: `${complexityValue}%`, // Use numeric value
                      backgroundColor: primaryColor || '#AE5630',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                  
                  {/* Tick marks */}
                  <div className="absolute w-full flex justify-between top-2">
                    {[10, 30, 50, 70, 90].map((tick) => (
                      <div
                        key={tick}
                        className={`h-1 w-0.5 mt-1 ${complexityValue >= tick ? 'bg-primary' : 'bg-neutral-300'}`}
                        style={{ marginLeft: `${tick}%`, transform: 'translateX(-50%)' }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Input range */}
                <Input
                  id="complexity"
                  type="range"
                  min="10"
                  max="100"
                  step="1" // Finer steps for conversion
                  value={complexityValue} // Use numeric value
                  onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))} // Call conversion handler
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-8 top-[-10px]"
                  style={{ zIndex: 10 }}
                />
                
                {/* Thumb */}
                <div
                  className="absolute h-6 w-6 rounded-full bg-white border-2 shadow top-[-7px] cursor-pointer"
                  style={{
                    left: `${complexityValue}%`, // Use numeric value
                    transform: 'translateX(-50%)',
                    transition: 'left 0.3s ease',
                    backgroundColor: 'white',
                    borderColor: primaryColor,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                ></div>
              </div>
              
              {/* Label based on string complexity level */}
              <div className="text-center text-xs font-medium mt-3" style={{ color: primaryColor }}>
                {complexity === 'basic' && "Simple"}
                {complexity === 'intermediate' && "Balanced"}
                {complexity === 'advanced' && "Detailed"}
              </div>
            </div>
            
            {/* Description based on string complexity level */}
            <div className="text-xs text-neutral-dark mt-2 p-2 bg-primary/10 border border-primary/20 rounded-lg">
              {complexity === 'basic' && <p>Basic content with essential information only</p>}
              {complexity === 'intermediate' && <p>Balanced content with key details and supporting information</p>}
              {complexity === 'advanced' && <p>Comprehensive content with detailed explanations and analysis</p>}
            </div>
            
            <p className="text-xs text-neutral-medium mt-2 px-2">
              Adjusts detail & depth of content per slide.
            </p>
          </div>
          
          {/* Duration Estimate */}
          <div>
            <label className="mb-1 text-primary text-sm font-semibold">Duration Estimate</label>
            <p className="text-sm font-medium">
              ~ {Math.round(slides.length * (1 + (complexityValue / 100)))} minutes {/* Use numeric value */}
            </p>
            <p className="text-xs text-neutral-medium">
              Based on ~{Math.round(60 * (1 + (complexityValue / 100)))} seconds per slide {/* Use numeric value */}
            </p>
          </div>
          
          {/* Content Generation Impact */}
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <h5 className="text-sm font-medium mb-2">Content Generation Impact</h5>
            <ul className="text-xs space-y-1">
              <li className="flex items-start"><span className="mr-1">•</span><span>The selected structure defines the slide content framework</span></li>
              <li className="flex items-start"><span className="mr-1">•</span><span>Slide order impacts narrative flow and story progression</span></li>
              <li className="flex items-start"><span className="mr-1">•</span><span>Higher complexity creates more detailed content per slide</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Define available pitch deck structures
import { pitchDeckStructures } from '@/data/pitchDeckStructures';

// Remove the local pitchDeckStructures definition

// Remove the duplicate handleStructureChange definition

export default StructurePlanning;