import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentItemCard, { ContentItemData } from './ContentItemCard';
import { Button } from '@/components/ui/Button'; // Keep Button for empty state

interface ContentGridProps {
  items: ContentItemData[];
  selectedItems: string[];
  onToggleSelection: (id: string) => void;
  // Delete/Edit actions are handled within ContentItemCard now
}

const ContentGrid: React.FC<ContentGridProps> = ({
  items,
  selectedItems,
  onToggleSelection,
}) => {

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Stagger animation for each card
      },
    },
  };

  return (
    <>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-neutral-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-bold font-heading mb-2">No content found</h3>
          <p className="text-center mb-4">No content matches your current filters.</p>
          {/* Consider adding a button to clear filters or create content */}
        </div>
      ) : (
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence> {/* Ensure AnimatePresence wraps the items for exit animations */}
            {items.map((item) => (
              <ContentItemCard
                key={item.id} // Key is now on the direct child of AnimatePresence
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onToggleSelection={onToggleSelection}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
};

export default ContentGrid;