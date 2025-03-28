import React from 'react'; // Removed useState as state is lifted
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input'; 
import { Button } from '@/components/ui/Button';
import { GripVertical, Plus, Trash2 } from 'lucide-react'; 

// Define Slide type
interface Slide {
  id: string;
  title: string;
}

// Define Props
interface StructurePlanningProps {
  slides: Slide[];
  onSlidesChange: (newSlides: Slide[]) => void;
  complexity: number;
  onComplexityChange: (newComplexity: number) => void;
}

const StructurePlanning: React.FC<StructurePlanningProps> = ({
  slides,
  onSlidesChange,
  complexity,
  onComplexityChange,
}) => {
  // State is now managed by the parent (ProjectArea)

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
    onSlidesChange(newSlides); // Update parent state
    console.log(`Moved slide from index ${sourceIndex} to ${targetIndex}`);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault(); 
  };
  const removeSlide = (index: number) => {
     onSlidesChange(slides.filter((_, i) => i !== index)); // Update parent state
  };
  const addSlide = () => {
     // Placeholder: Add a generic new slide
     const newSlide: Slide = { id: `s${Date.now()}`, title: 'New Slide' };
     onSlidesChange([...slides, newSlide]); // Update parent state
  }

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm">
      <h4 className="font-semibold text-neutral-dark text-lg mb-4 border-b border-neutral-light/40 pb-2">Structure Planning</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slide Structure List (Simulated Drag/Drop) */}
        <div className="md:col-span-2">
          <label className="settings-label mb-2">Slide Order</label>
          <ul className="border rounded-md p-2 bg-neutral-light/20 space-y-1 min-h-[200px]">
            {slides.map((slide, index) => ( // Use slides from props
              <li 
                key={slide.id} 
                draggable 
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                className="flex items-center justify-between p-1.5 bg-white border rounded cursor-move text-sm"
              >
                <div className="flex items-center gap-1">
                   <GripVertical size={14} className="text-neutral-medium" />
                   <span>{slide.title}</span>
                </div>
                <Button variant="ghost" size="sm" className="p-1 h-auto text-neutral-medium hover:text-error" onClick={() => removeSlide(index)}>
                   <Trash2 size={14} />
                </Button>
              </li>
            ))}
             {/* Add Slide Button */}
             <li className="pt-2">
                <Button variant="outline" size="sm" className="w-full" onClick={addSlide}> {/* Add onClick */}
                   <Plus size={14} className="mr-1"/> Add Slide / Section
                </Button>
             </li>
          </ul>
          <p className="text-xs text-neutral-medium mt-1">Drag to reorder slides.</p>
        </div>

        {/* Structure Tools */}
        <div className="space-y-4">
          <div>
            <label htmlFor="complexity" className="settings-label mb-1">Complexity ({complexity})</label>
            <Input 
              id="complexity" 
              type="range" 
              min="10" 
              max="100" 
              step="10" 
              value={complexity} // Use complexity from props
              onChange={(e) => onComplexityChange(parseInt(e.target.value, 10))} // Update parent state
              className="w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer accent-primary" 
            />
             <p className="text-xs text-neutral-medium mt-1">Adjusts detail & number of slides.</p>
          </div>
           <div>
            <label className="settings-label mb-1">Duration Estimate</label>
            <p className="text-sm font-medium">~ {Math.round(slides.length * 1.5)} minutes</p> {/* Use slides.length from props */}
          </div>
           {/* Add more tools like weighting, recommendations later */}
        </div>
      </div>
    </Card>
  );
};

export default StructurePlanning;