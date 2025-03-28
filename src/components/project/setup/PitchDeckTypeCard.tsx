import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PitchDeckType } from '../data/pitchDeckTypes'; // Import the type definition
import { CheckCircle } from 'lucide-react'; // Icon for selected state

interface PitchDeckTypeCardProps {
  type: PitchDeckType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PitchDeckTypeCard: React.FC<PitchDeckTypeCardProps> = ({ type, isSelected, onSelect }) => {
  return (
    <Card
      // Add onClick to the Card itself
      onClick={() => onSelect(type.id)}
      className={`pitch-deck-card relative flex flex-col border-2 w-full transition-all duration-300 ease-in-out shadow-xm hover:shadow-sm cursor-pointer ${ // Added cursor-pointer
        isSelected
          ? 'border-[#ae5630] ring-2 ring-[#ae5630]/50'
          : 'border-neutral-light hover:border-[#ae5630]/80'
      }`}
      style={{ minHeight: isSelected ? '250px' : '120px' }}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-[#ae5630] text-white rounded-full p-1 z-10">
          <CheckCircle size={12} />
        </div>
      )}
      <div className={`p-2 sm:p-2 flex flex-col flex-grow transition-all duration-300 ease-in-out ${isSelected ? 'justify-center' : 'justify-center'}`}>
        <div className={`flex items-center justify-center sm:justify-start gap-2 ${isSelected ? 'mb-3' : ''}`}>
          <span className="flex-shrink-0">
             {React.cloneElement(type.icon as React.ReactElement, { size: 16 })}
          </span>
          <h4 className="text-lg sm:text-sm font-regular  text-secondary">{type.name}</h4>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? 'max-h-96 opacity-100 ' : 'max-h-0 opacity-0'}`}>
            <p className="text-sm text-neutral-dark mb-3">{type.description}</p>
            <ul className="list-disc list-inside space-y-1 text-xs text-neutral-medium mb-4">
              {type.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
        </div>
      </div>
      <div className="p-1 pt-0 mt-auto">
         {/* The button now primarily serves as a visual indicator */}
        <Button
          variant={isSelected ? 'primary' : 'outline'}
          size="sm"
          className={`w-full pointer-events-none ${isSelected ? 'text-white' : ''}`} // Added pointer-events-none
          // Removed onClick from button
          tabIndex={-1} // Prevent button from being focused via keyboard
        >
          {isSelected ? 'Selected' : 'Select Type'}
        </Button>
      </div>
    </Card>
  );
};

export default PitchDeckTypeCard;