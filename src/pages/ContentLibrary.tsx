import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/store/store';
// Import ContentItem type from slice
import { setContentFilters, deleteContentItem, setContentItems, ContentItem } from '@/store/slices/contentSlice';
import { addToast } from '@/store/slices/uiSlice'; // Removed setModalState as it's handled in ContentItemCard

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button'; // Keep for empty state button

// Import extracted components
import ContentLibraryToolbar from '@/components/contentLibrary/ContentLibraryToolbar';
import ContentGrid from '@/components/contentLibrary/ContentGrid';
import BulkActionBar from '@/components/contentLibrary/BulkActionBar';
// Removed redundant import of ContentItemData
// ContentItem is imported on line 6 now

// Removed local filter options and helper functions (moved to utils/data)

// Generate mock content if none exists (keep for initial load)
const generateMockContent = (): ContentItem[] => { // Use ContentItem type from slice
  const contentTypes = ['blog', 'marketing', 'creative', 'academic', 'social'];
  const topics = [
    'Digital Transformation', 'Sustainable Living', 'Remote Work Trends', 'Machine Learning Applications',
    'Healthy Eating Habits', 'Mindfulness and Productivity', 'Smart Home Technology',
    'Travel Destinations 2025', 'Investment Strategies', 'Future of Education',
  ];
  return Array.from({ length: 12 }, (_, i) => {
    const now = new Date();
    const createdAt = new Date(now.setDate(now.getDate() - Math.floor(Math.random() * 60))).toISOString();
    // Explicitly cast the type to match ContentItem['type']
    const type = contentTypes[Math.floor(Math.random() * contentTypes.length)] as ContentItem['type'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    return {
      id: `mock-${i + 1}`, title: topic,
      content: `# ${topic}\n\nThis is sample content.\n\n## Section\n\nMore details here.`,
      type, createdAt, updatedAt: createdAt, userId: 'current-user',
      tags: [type, topic.split(' ')[0].toLowerCase()], isPrivate: Math.random() > 0.3, version: 1,
    };
  });
};

const ContentLibrary: React.FC = () => {
  const dispatch = useDispatch();
  const { items: contentItems, filters } = useSelector((state: RootState) => state.content);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Load mock data if needed
  useEffect(() => {
    if (contentItems.length === 0) {
      const mockContent = generateMockContent();
      dispatch(setContentItems(mockContent));
    }
  }, [contentItems.length, dispatch]);

  // Handle item selection
  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      selectedItems.forEach((id) => {
        dispatch(deleteContentItem(id));
      });
      dispatch(addToast({ type: 'success', message: `${selectedItems.length} items deleted successfully` }));
      setSelectedItems([]);
    }
  };

  // Filtering logic (remains here, uses filters from Redux store)
  const filteredItems = contentItems.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (
      filters.search &&
      !item.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !item.content.toLowerCase().includes(filters.search.toLowerCase()) &&
      !item.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase()))
    ) {
      return false;
    }
    // Date filtering logic would go here if implemented
    return true;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Content Library</h1>
        <p className="text-neutral-medium max-w-3xl">
          Manage and organize all your generated content in one place.
        </p>
      </div>

      {/* Filters and Actions Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {/* Render Toolbar */}
          <ContentLibraryToolbar
            initialSearch={filters.search}
            initialType={filters.type || ''}
            // Pass other filter props if needed
          />
          {/* Render Bulk Action Bar */}
          <BulkActionBar
            selectedCount={selectedItems.length}
            onDeselectAll={() => setSelectedItems([])}
            onDeleteSelected={handleBulkDelete}
          />
        </CardContent>
      </Card>

      {/* Content Grid Section */}
      {filteredItems.length > 0 && ( // Show select all only if there are items
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="selectAll"
              className="mr-2 rounded border-neutral-light text-accent-teal focus:ring-accent-teal"
              checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
              onChange={toggleSelectAll}
              disabled={filteredItems.length === 0} // Disable if no items
            />
            <label htmlFor="selectAll" className="text-sm">Select All</label>
          </div>
          <div className="text-sm text-neutral-medium">
            Showing {filteredItems.length} of {contentItems.length} items
          </div>
        </div>
      )}

      {/* Render Content Grid */}
      <ContentGrid
        items={filteredItems}
        selectedItems={selectedItems}
        onToggleSelection={toggleItemSelection}
      />

      {/* Empty state for initial load (handled within ContentGrid now) */}
      {contentItems.length === 0 && filteredItems.length === 0 && (
         <div className="flex flex-col items-center justify-center p-12 text-neutral-medium">
           {/* Icon and text for initial empty state */}
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
           <h3 className="text-xl font-bold font-heading mb-2">Your library is empty</h3>
           <p className="text-center mb-4">Start creating content to see it here.</p>
           <Button asChild leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}>
             <a href="/generator">Create New Content</a>
           </Button>
         </div>
       )}

    </div>
  );
};

export default ContentLibrary;
