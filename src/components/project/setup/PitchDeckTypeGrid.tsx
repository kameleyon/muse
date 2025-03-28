import React from 'react';
import { pitchDeckTypes, PitchDeckType } from '../data/pitchDeckTypes';
import PitchDeckTypeCard from './PitchDeckTypeCard';

interface PitchDeckTypeGridProps {
  selectedTypeId: string | null;
  onSelectType: (id: string) => void;
}

const PitchDeckTypeGrid: React.FC<PitchDeckTypeGridProps> = ({ selectedTypeId, onSelectType }) => {
  return (
    <div className="mb-8 ">
      <h2 className="text-xl font-semibold font-heading text-secondary mb-4">Choose Your Pitch Deck Type</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
        {pitchDeckTypes.map((type: PitchDeckType) => (
          <PitchDeckTypeCard
            key={type.id}
            type={type}
            isSelected={selectedTypeId === type.id}
            onSelect={onSelectType}
          />
        ))}
      </div>
    </div>
  );
};

export default PitchDeckTypeGrid;