import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input'; 
import { Button } from '@/components/ui/Button';
import { GripVertical, Plus, Trash2, Info } from 'lucide-react'; 
import { Tooltip } from '../../ui/Tooltip';

// Define Slide type
export interface Slide {
  id: string;
  title: string;
  description?: string;
  isRequired?: boolean;
}

// Define Props
interface StructurePlanningProps {
  slides: Slide[];
  onSlidesChange: (newSlides: Slide[]) => void;
  complexity: number;
  onComplexityChange: (newComplexity: number) => void;
  primaryColor?: string; // Add primary color prop
}

// Default pitch deck structure - the top 4 slides removed as requested
export const defaultPitchDeckStructure: Slide[] = [
  { id: 'slide-1', title: 'Cover Slide', description: 'Company Logo, Project Name, Tagline or Short Mission Statement', isRequired: true },
  { id: 'slide-2', title: 'Problem', description: 'Define the problem your product/service aims to solve', isRequired: true },
  { id: 'slide-3', title: 'Solution', description: 'Explain how your product/service solves the problem', isRequired: true },
  { id: 'slide-4', title: 'How It Works', description: 'Explain the mechanics of your solution', isRequired: true },
  { id: 'slide-5', title: 'Core Features', description: 'Highlight the main features and benefits', isRequired: true },
  { id: 'slide-6', title: 'Market Opportunity', description: 'Market size, trends, and growth potential', isRequired: true },
  { id: 'slide-7', title: 'Business Model', description: 'Revenue streams and monetization strategy', isRequired: true },
  { id: 'slide-8', title: 'Competitive Advantage', description: 'What sets you apart from competitors', isRequired: true },
  { id: 'slide-9', title: 'Go-to-Market Strategy', description: 'Plan for acquiring customers and scaling', isRequired: true },
  { id: 'slide-10', title: 'Financial Projections', description: 'Key financial metrics and forecasts', isRequired: true },
  { id: 'slide-11', title: 'Team & Expertise', description: 'Key team members and their qualifications', isRequired: true },
  { id: 'slide-12', title: 'Roadmap & Milestones', description: 'Timeline of key achievements and future goals', isRequired: true },
  { id: 'slide-13', title: 'Call to Action', description: 'Specific ask and next steps', isRequired: true },
  { id: 'slide-14', title: 'Appendix', description: 'Additional supporting information (optional)', isRequired: false }
];

const StructurePlanning: React.FC<StructurePlanningProps> = ({
  slides,
  onSlidesChange,
  complexity,
  onComplexityChange,
  primaryColor = '#AE5630', // Default color
}) => {
  // ALWAYS ensure all 14 slides are present
  useEffect(() => {
    // Force loading all slides
    onSlidesChange(defaultPitchDeckStructure);
  }, [onSlidesChange]);
  
  // Basic drag-and-drop simulation
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
  
  const removeSlide = (index: number) => {
    // Don't allow removal at all - we need to maintain all 14 slides
    return;
  };
  
  // State for the new slide modal and inputs
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideDescription, setNewSlideDescription] = useState('');
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [editingSlideTitle, setEditingSlideTitle] = useState('');
  const [editingSlideDescription, setEditingSlideDescription] = useState('');

  // Add a custom slide with a title and description
  const addSlide = () => {
    // We don't need to add more slides since we're showing all 14 already
    setShowAddSlideModal(false);
    setNewSlideTitle('');
    setNewSlideDescription('');
  }

  // Start editing a slide title and description
  const startEditSlideTitle = (index: number) => {
    setEditingSlideIndex(index);
    setEditingSlideTitle(slides[index].title);
    setEditingSlideDescription(slides[index].description || '');
  };

  // Save edited slide title and description
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slide Structure List (Simulated Drag/Drop) */}
        <div className="md:col-span-2">
          <div className="flex items-center mb-2">
            <label className="settings-label">Slide Order</label>
            <Tooltip content="Drag to reorder slides. Required slides cannot be removed.">
              <Info size={14} className="ml-1 text-neutral-medium cursor-help" />
            </Tooltip>
          </div>
          
          <ul className="border rounded-md p-2 bg-neutral-light/20 space-y-1 min-h-[800px]">
            {slides.map((slide, index) => (
              <li 
                key={slide.id} 
                draggable 
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                className={`flex items-center justify-between p-2 border rounded cursor-move text-sm ${
                  slide.isRequired ? 'bg-primary/5 border-primary/20' : 'bg-white border-neutral-light'
                }`}
              >
                <div className="flex items-start gap-2 flex-1">
                  <GripVertical size={14} className="text-neutral-medium flex-shrink-0 mt-1" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-wrap items-center">
                      <span
                        className="font-medium break-all cursor-pointer hover:text-primary"
                        onDoubleClick={() => !slide.isRequired && startEditSlideTitle(index)}
                        title={slide.isRequired ? "Required slides cannot be renamed" : "Double-click to edit title"}
                      >{`${index + 1}. ${slide.title}`}</span>
                      {slide.isRequired && (
                        <span className="ml-1 px-0.5 py-0 bg-primary/10 text-primary text-[9px] rounded">Required</span>
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
          
          {/* Add Slide Button */}
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowAddSlideModal(true)}>
              <Plus size={14} className="mr-1"/> Add Custom Slide
            </Button>
          </div>
          <p className="text-xs text-neutral-medium mt-1">Standard pitch deck structure with 13 required slides + optional appendix.</p>
          
          {/* Add Slide Modal */}
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
                    placeholder="Enter slide title..."
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddSlideModal(false);
                      setNewSlideTitle('');
                      setNewSlideDescription('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={addSlide}
                    disabled={!newSlideTitle.trim()}
                  >
                    Add Slide
                  </Button>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSlideIndex(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveSlideTitle}
                    disabled={!editingSlideTitle.trim()}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Structure Tools */}
        <div className="space-y-4">
          <div>
            <label htmlFor="complexity" className="settings-label mb-1">
              Complexity ({complexity}%)
            </label>
            <div className="relative mb-2">
              <div className="relative">
                {/* Custom styled range slider */}
                <div className="w-full h-2 bg-neutral-200 rounded-lg relative">
                  {/* Track fill based on value */}
                  <div
                    className="absolute h-2 left-0 top-0 rounded-lg"
                    style={{
                      width: `${complexity}%`,
                      backgroundColor: primaryColor || '#AE5630',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                  
                  {/* Tick marks for complexity levels */}
                  <div className="absolute w-full flex justify-between top-2">
                    {[10, 30, 50, 70, 90].map((tick) => (
                      <div
                        key={tick}
                        className={`h-1 w-0.5 mt-1 ${complexity >= tick ? 'bg-primary' : 'bg-neutral-300'}`}
                        style={{ marginLeft: `${tick}%`, transform: 'translateX(-50%)' }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Larger touch target for better usability */}
                <Input
                  id="complexity"
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={complexity}
                  onChange={(e) => onComplexityChange(parseInt(e.target.value, 10))}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-8 top-[-10px]"
                  style={{ zIndex: 10 }}
                />
                
                {/* Larger thumb (custom styled) for easier manipulation */}
                <div
                  className="absolute h-6 w-6 rounded-full bg-white border-2 shadow top-[-7px] cursor-pointer"
                  style={{
                    left: `${complexity}%`,
                    transform: 'translateX(-50%)',
                    transition: 'left 0.3s ease',
                    backgroundColor: 'white',
                    borderColor: primaryColor,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                ></div>
              </div>
              
              {/* Single label that changes based on complexity */}
              <div className="text-center text-xs font-medium mt-3" style={{ color: primaryColor }}>
                {complexity <= 30 && "Simple"}
                {complexity > 30 && complexity < 70 && "Balanced"}
                {complexity >= 70 && "Detailed"}
              </div>
            </div>
            
            {/* Complexity level description */}
            <div className="text-xs text-neutral-dark mt-2 p-2 bg-primary/5 border border-primary/10 rounded">
              {complexity < 30 && (
                <p>Basic content with essential information only</p>
              )}
              {complexity >= 30 && complexity < 60 && (
                <p>Balanced content with key details and supporting information</p>
              )}
              {complexity >= 60 && complexity < 80 && (
                <p>Comprehensive content with detailed explanations</p>
              )}
              {complexity >= 80 && (
                <p>Maximum detail with in-depth analysis and examples</p>
              )}
            </div>
            
            <p className="text-xs text-neutral-medium mt-2">
              Adjusts detail & depth of content per slide.
            </p>
          </div>
          
          <div>
            <label className="settings-label mb-1">Duration Estimate</label>
            <p className="text-sm font-medium">
              ~ {Math.round(slides.length * (1 + (complexity / 100)))} minutes
            </p>
            <p className="text-xs text-neutral-medium">
              Based on ~{Math.round(60 * (1 + (complexity / 100)))} seconds per slide
            </p>
          </div>
          
          <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
            <h5 className="text-sm font-medium mb-2">Content Generation Impact</h5>
            <ul className="text-xs space-y-1">
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>The selected structure defines the slide content framework</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Slide order impacts narrative flow and story progression</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Higher complexity creates more detailed content per slide</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StructurePlanning;