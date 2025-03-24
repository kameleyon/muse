import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/store/store';
import { setContentFilters, deleteContentItem, setContentItems } from '@/store/slices/contentSlice';
import { addToast, setModalState } from '@/store/slices/uiSlice';

import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

// Content type filter options
const contentTypeFilters = [
  { value: '', label: 'All Types' },
  { value: 'blog', label: 'Blog Posts' },
  { value: 'marketing', label: 'Marketing Copy' },
  { value: 'creative', label: 'Creative Writing' },
  { value: 'academic', label: 'Academic Content' },
  { value: 'social', label: 'Social Media Posts' },
];

// Mock date filter options
const dateFilters = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'Last 3 Months' },
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Helper function to get badge color based on content type
const getBadgeColorForType = (type: string) => {
  switch (type) {
    case 'blog':
      return 'bg-accent-teal/20 text-accent-teal';
    case 'marketing':
      return 'bg-primary/20 text-primary-hover';
    case 'creative':
      return 'bg-accent-purple/20 text-accent-purple';
    case 'academic':
      return 'bg-secondary/20 text-secondary   ';
    case 'social':
      return 'bg-success/20 text-success';
    default:
      return 'bg-neutral-light/40 text-neutral-medium';
  }
};

// Generate mock content if none exists
const generateMockContent = () => {
  const contentTypes = ['blog', 'marketing', 'creative', 'academic', 'social'];
  const topics = [
    'Digital Transformation',
    'Sustainable Living',
    'Remote Work Trends',
    'Machine Learning Applications',
    'Healthy Eating Habits',
    'Mindfulness and Productivity',
    'Smart Home Technology',
    'Travel Destinations 2025',
    'Investment Strategies',
    'Future of Education',
  ];

  return Array.from({ length: 12 }, (_, i) => {
    const now = new Date();
    const createdAt = new Date(now.setDate(now.getDate() - Math.floor(Math.random() * 60))).toISOString();
    const type = contentTypes[Math.floor(Math.random() * contentTypes.length)] as any;
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    return {
      id: `mock-${i + 1}`,
      title: topic,
      content: `# ${topic}\n\nThis is a sample content for ${topic}.\n\n## Section 1\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.\n\n## Section 2\n\nNullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.`,
      type,
      createdAt,
      updatedAt: createdAt,
      userId: 'current-user',
      tags: [type, topic.split(' ')[0].toLowerCase()],
      isPrivate: Math.random() > 0.3,
      version: 1,
    };
  });
};

const ContentLibrary: React.FC = () => {
  const dispatch = useDispatch();
  const { items: contentItems, filters } = useSelector((state: RootState) => state.content);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [typeFilter, setTypeFilter] = useState(filters.type || '');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Load mock data if no content exists
  useEffect(() => {
    if (contentItems.length === 0) {
      const mockContent = generateMockContent();
      dispatch(setContentItems(mockContent));
    }
  }, [contentItems.length, dispatch]);

  // Handler for search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Apply filters when search button is clicked
  const applyFilters = () => {
    dispatch(
      setContentFilters({
        type: typeFilter,
        search: searchInput,
      })
    );
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

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

    // Confirm before deleting
    if (
      window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)
    ) {
      selectedItems.forEach((id) => {
        dispatch(deleteContentItem(id));
      });

      dispatch(
        addToast({
          type: 'success',
          message: `${selectedItems.length} items deleted successfully`,
        })
      );

      setSelectedItems([]);
    }
  };

  // Apply filters to content items
  const filteredItems = contentItems.filter((item) => {
    // Filter by type
    if (filters.type && item.type !== filters.type) {
      return false;
    }

    // Filter by search term
    if (
      filters.search &&
      !item.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !item.content.toLowerCase().includes(filters.search.toLowerCase()) &&
      !item.tags.some((tag) =>
        tag.toLowerCase().includes(filters.search.toLowerCase())
      )
    ) {
      return false;
    }

    // Date filtering would be implemented here
    // For now, we return true for all items that pass type and search filters
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

      {/* Filters and Actions */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search content..."
                value={searchInput}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                leftIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                options={contentTypeFilters}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                options={dateFilters}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="mt-4 flex items-center justify-between bg-neutral-light/20    p-2 rounded-md">
              <span className="text-sm">
                {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}{' '}
                selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Deselect All
                </Button>
                <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                  Delete Selected
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Grid */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-neutral-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-xl font-bold font-heading mb-2">No content found</h3>
          <p className="text-center mb-4">
            {contentItems.length === 0
              ? "You haven't created any content yet."
              : 'No content matches your current filters.'}
          </p>
          <Button
            asChild
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            }
          >
            <a href="/generator">Create New Content</a>
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="selectAll"
                className="mr-2 rounded border-neutral-light text-accent-teal focus:ring-accent-teal"
                checked={selectedItems.length === filteredItems.length}
                onChange={toggleSelectAll}
              />
              <label htmlFor="selectAll" className="text-sm">
                Select All
              </label>
            </div>
            <div className="text-sm text-neutral-medium">
              Showing {filteredItems.length} of {contentItems.length} items
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-2 mb-4">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-light text-accent-teal focus:ring-accent-teal"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${getBadgeColorForType(
                              item.type
                            )}`}
                          >
                            {
                              contentTypeFilters.find(
                                (filter) => filter.value === item.type
                              )?.label
                            }
                          </span>
                          <span className="text-xs text-neutral-medium">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-hidden text-neutral-medium text-sm mb-4">
                      {truncateText(
                        item.content.replace(/[#*_]/g, ''),
                        150
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-neutral-light/30    text-neutral-medium px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Open the content detail modal
                          dispatch(
                            setModalState({
                              type: 'contentDetail',
                              isOpen: true,
                              data: item,
                            })
                          );
                        }}
                      >
                        View
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Edit content
                            dispatch(
                              addToast({
                                type: 'info',
                                message: 'Edit functionality not implemented in this demo',
                              })
                            );
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Delete content
                            if (
                              window.confirm(
                                'Are you sure you want to delete this content?'
                              )
                            ) {
                              dispatch(deleteContentItem(item.id));
                              dispatch(
                                addToast({
                                  type: 'success',
                                  message: 'Content deleted successfully',
                                })
                              );
                            }
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-error"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ContentLibrary;
