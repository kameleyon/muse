import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDispatch } from 'react-redux';
import { addToast, setModalState } from '@/store/slices/uiSlice';
import { deleteContentItem } from '@/store/slices/contentSlice';

// Define the ContentItem type (can be shared)
export interface ContentItemData {
  id: string;
  title: string;
  content: string; // Keep full content for detail view
  type: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
  isPrivate: boolean;
  version: number;
}

interface ContentItemCardProps {
  item: ContentItemData;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}

// Helper function to format date (move to utils later)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

// Helper function to truncate text (move to utils later)
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Helper function to get badge color (move to utils later)
const getBadgeColorForType = (type: string) => {
  switch (type) {
    case 'blog': return 'bg-accent-teal/20 text-accent-teal';
    case 'marketing': return 'bg-primary/20 text-primary-hover';
    case 'creative': return 'bg-accent-purple/20 text-accent-purple';
    case 'academic': return 'bg-secondary/20 text-secondary';
    case 'social': return 'bg-success/20 text-success';
    default: return 'bg-neutral-light/40 text-neutral-medium';
  }
};

// Content type filter options (move to data file later)
const contentTypeFilters = [
    { value: 'blog', label: 'Blog Posts' },
    { value: 'marketing', label: 'Marketing Copy' },
    { value: 'creative', label: 'Creative Writing' },
    { value: 'academic', label: 'Academic Content' },
    { value: 'social', label: 'Social Media Posts' },
];

const ContentItemCard: React.FC<ContentItemCardProps> = ({
  item,
  isSelected,
  onToggleSelection,
}) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      dispatch(deleteContentItem(item.id));
      dispatch(addToast({ type: 'success', message: 'Content deleted successfully' }));
    }
  };

  const handleView = () => {
    dispatch(setModalState({ type: 'contentDetail', isOpen: true, data: item }));
  };

  const handleEdit = () => {
    // TODO: Implement edit navigation/modal
    dispatch(addToast({ type: 'info', message: 'Edit functionality not implemented yet' }));
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 } // Add exit animation
  };

  return (
    <motion.div
      key={item.id} // Key for animation
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit" // Apply exit animation
      transition={{ duration: 0.3 }}
      layout // Animate layout changes
    >
      <Card className={`h-full hover:shadow-lg transition-shadow duration-200 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-start gap-2 mb-4">
            <input
              type="checkbox"
              className="mt-1 rounded border-neutral-light text-accent-teal focus:ring-accent-teal"
              checked={isSelected}
              onChange={() => onToggleSelection(item.id)}
              aria-label={`Select ${item.title}`}
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${getBadgeColorForType(item.type)}`}>
                  {contentTypeFilters.find(filter => filter.value === item.type)?.label || item.type}
                </span>
                <span className="text-xs text-neutral-medium">{formatDate(item.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden text-neutral-medium text-sm mb-4">
            {/* Simple preview - remove markdown */}
            {truncateText(item.content.replace(/[#*_`]/g, '').replace(/\n+/g, ' '), 150)}
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs bg-neutral-light/30 text-neutral-medium px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between mt-auto">
            <Button variant="outline" size="sm" onClick={handleView}>View</Button>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={handleEdit}>Edit</Button>
              <Button variant="outline" size="sm" onClick={handleDelete} aria-label="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentItemCard;