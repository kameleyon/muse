import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
// Removed Button import as it's handled in child components now
import { motion } from 'framer-motion';
// Import the new components
import ChatHistoryToolbar from './chatHistory/ChatHistoryToolbar';
import ChatHistoryList from './chatHistory/ChatHistoryList';
import { ChatHistoryItemData } from './chatHistory/ChatHistoryItem'; // Import shared type

// Removed local interface definition

const ChatHistorySettings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, favorites, archived
  const [viewMode, setViewMode] = useState<'list' | 'compact'>('list');
  // Sample data - In a real app, this would come from a store or API
  const [chatHistories, setChatHistories] = useState<ChatHistoryItemData[]>([
    { id: '1', title: 'Content Creation Ideas', date: '2025-03-25', preview: 'Discussion about blog post ideas for the company website...', isFavorite: true, isArchived: false },
    { id: '2', title: 'Marketing Strategy', date: '2025-03-24', preview: 'Planning for Q2 marketing campaign and content strategy...', isFavorite: false, isArchived: false },
    { id: '3', title: 'Product Description Draft', date: '2025-03-22', preview: 'Creating compelling product descriptions for the new line...', isFavorite: true, isArchived: false },
    { id: '4', title: 'Email Newsletter', date: '2025-03-20', preview: 'Drafting the monthly newsletter with latest updates...', isFavorite: false, isArchived: true },
    { id: '5', title: 'Social Media Post Ideas', date: '2025-03-18', preview: 'Brainstorming engaging social media content...', isFavorite: false, isArchived: false },
  ]);

  // Action Handlers (remain here as they modify the main state)
  const toggleFavorite = (id: string) => {
    setChatHistories(prevHistories =>
      prevHistories.map(history =>
        history.id === id ? { ...history, isFavorite: !history.isFavorite } : history
      )
    );
  };

  const toggleArchive = (id: string) => {
    setChatHistories(prevHistories =>
      prevHistories.map(history =>
        history.id === id ? { ...history, isArchived: !history.isArchived } : history
      )
    );
  };

  const deleteChat = (id: string) => {
    // Consider adding confirmation toast/modal here instead of window.confirm
    if (window.confirm('Are you sure you want to delete this chat history? This action cannot be undone.')) {
      setChatHistories(prevHistories =>
        prevHistories.filter(history => history.id !== id)
      );
      // TODO: Dispatch success toast
    }
  };

  // Filtering logic (remains here)
  const filteredChats = chatHistories.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.preview.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'favorites') return matchesSearch && chat.isFavorite && !chat.isArchived; // Also exclude archived from favorites view
    if (filter === 'archived') return matchesSearch && chat.isArchived;
    // 'all' shows non-archived by default
    return matchesSearch && !chat.isArchived;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-heading font-bold text-secondary mb-6">Chat History</h2>

          <p className="text-neutral-medium mb-6">
            View, search, and manage your previous chat conversations.
          </p>

          {/* Render Toolbar */}
          <ChatHistoryToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filter={filter}
            onFilterChange={setFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Render List */}
          <ChatHistoryList
            chats={filteredChats}
            viewMode={viewMode}
            onToggleFavorite={toggleFavorite}
            onToggleArchive={toggleArchive}
            onDelete={deleteChat}
          />

        </CardContent>
        {/* Footer might be added later if needed */}
      </Card>
    </motion.div>
  );
};

export default ChatHistorySettings;
