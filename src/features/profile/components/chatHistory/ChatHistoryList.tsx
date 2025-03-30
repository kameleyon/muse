import React from 'react';
import ChatHistoryItemComponent, { ChatHistoryItemData } from './ChatHistoryItem'; // Import item component and type
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence

interface ChatHistoryListProps {
  chats: ChatHistoryItemData[];
  viewMode: 'list' | 'compact';
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  chats,
  viewMode,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
}) => {

  const listVariants = { // Animation for the list container
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Stagger animation for each item
      },
    },
  };

  return (
    <>
      {chats.length === 0 ? (
        <div className="text-center py-12 text-neutral-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-neutral-light"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-lg">No chat history found.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <motion.div
          variants={listVariants} // Apply container variants
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence> {/* Wrap items for exit animations */}
            {chats.map((chat) => (
              <ChatHistoryItemComponent
                key={chat.id} // Key moved to the motion component inside ChatHistoryItemComponent
                chat={chat}
                viewMode={viewMode}
                onToggleFavorite={onToggleFavorite}
                onToggleArchive={onToggleArchive}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination (simplified) - Kept here for context, could be separate */}
      {chats.length > 0 && ( // Only show pagination if there are chats
        <div className="mt-6 flex justify-center">
          <nav className="inline-flex shadow-sm -space-x-px rounded-md">
            <button className="px-3 py-2 rounded-l-md border border-neutral-light bg-white text-neutral-medium hover:bg-neutral-light/20">
              Previous
            </button>
            <button className="px-3 py-2 border border-neutral-light bg-primary text-secondary">1</button>
            <button className="px-3 py-2 border border-neutral-light bg-white text-neutral-medium hover:bg-neutral-light/20">
              2
            </button>
            <button className="px-3 py-2 rounded-r-md border border-neutral-light bg-white text-neutral-medium hover:bg-neutral-light/20">
              Next
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default ChatHistoryList;