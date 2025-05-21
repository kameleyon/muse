import React, { useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { setContentFilters } from '@/store/slices/contentSlice'; // Import Redux action

// Filter options (can be moved to a data file)
const contentTypeFilters = [
  { value: 'all', label: 'All Types' },  // Changed from empty string to 'all'
  { value: 'blog', label: 'Blog Posts' },
  { value: 'marketing', label: 'Marketing Copy' },
  { value: 'creative', label: 'Creative Writing' },
  { value: 'academic', label: 'Academic Content' },
  { value: 'social', label: 'Social Media Posts' },
];

const dateFilters = [
  { value: 'all', label: 'All Time' },  // Changed from empty string to 'all'
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'Last 3 Months' },
];

interface ContentLibraryToolbarProps {
  initialSearch?: string;
  initialType?: string;
  // Add initialDate later if needed
}

const ContentLibraryToolbar: React.FC<ContentLibraryToolbarProps> = ({
  initialSearch = '',
  initialType = 'all', // Default to 'all' instead of empty string
}) => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [dateFilter, setDateFilter] = useState('all'); // Local state for date filter, default to 'all'

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const applyFilters = () => {
    dispatch(
      setContentFilters({
        type: typeFilter === 'all' ? null : typeFilter, // Send null if 'All Types' is selected
        search: searchInput,
        // Add date filter later
      })
    );
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  // Update Redux store immediately when type filter changes
  const handleTypeFilterChange = (newType: string) => {
    setTypeFilter(newType);
    dispatch(
      setContentFilters({
        type: newType === 'all' ? null : newType, // Send null if 'All Types' is selected
        search: searchInput, // Keep current search term
      })
    );
  };

  // TODO: Implement date filter logic similarly if needed

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search content..."
          value={searchInput}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>
      <div className="w-full md:w-48">
        <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type..." />
          </SelectTrigger>
          <SelectContent>
            {contentTypeFilters.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-48">
        <Select value={dateFilter} onValueChange={(value: string) => setDateFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by date..." />
          </SelectTrigger>
          <SelectContent>
            {dateFilters.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Button onClick={applyFilters}>Apply Filters</Button> {/* Keep apply button for explicit search/date filter application */}
      </div>
    </div>
  );
};

export default ContentLibraryToolbar;
