import React from 'react';
import { Button } from '@/components/ui/Button';

interface BulkActionBarProps {
  selectedCount: number;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onDeselectAll,
  onDeleteSelected,
}) => {
  if (selectedCount === 0) {
    return null; // Don't render if nothing is selected
  }

  return (
    <div className="mt-4 flex items-center justify-between bg-neutral-light/20 p-2 rounded-md">
      <span className="text-sm">
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onDeselectAll}
        >
          Deselect All
        </Button>
        <Button variant="danger" size="sm" onClick={onDeleteSelected}>
          Delete Selected
        </Button>
        {/* Add other bulk actions here later (e.g., Tag, Move) */}
      </div>
    </div>
  );
};

export default BulkActionBar;