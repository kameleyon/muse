import React from 'react';

interface ChatHistoryToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filter: string; // 'all', 'favorites', 'archived'
  onFilterChange: (filter: string) => void;
  viewMode: 'list' | 'compact';
  onViewModeChange: (mode: 'list' | 'compact') => void;
}

const ChatHistoryToolbar: React.FC<ChatHistoryToolbarProps> = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search chat history..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-4 py-2 pr-10 w-full border border-neutral-light rounded-xl focus:border-primary"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-medium"
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
      </div>

      {/* Filter and View Mode */}
      <div className="flex gap-2">
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 border border-neutral-light rounded-xl bg-white focus:border-primary"
        >
          <option value="all">All Chats</option>
          <option value="favorites">Favorites</option>
          <option value="archived">Archived</option>
        </select>

        <div className="flex border border-neutral-light rounded-xl overflow-hidden">
          <button
            className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary text-secondary' : 'bg-white text-secondary hover:bg-neutral-light/20'}`}
            onClick={() => onViewModeChange('list')}
            title="List View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            className={`px-3 py-2 ${viewMode === 'compact' ? 'bg-primary text-secondary' : 'bg-white text-secondary hover:bg-neutral-light/20'}`}
            onClick={() => onViewModeChange('compact')}
            title="Compact View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16M4 10h16M4 15h16M4 20h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryToolbar;