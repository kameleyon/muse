import React from 'react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion'; // Import motion

// Define the ChatHistoryItem type (can be shared)
export interface ChatHistoryItemData {
  id: string;
  title: string;
  date: string;
  preview: string;
  isFavorite: boolean;
  isArchived: boolean;
}

interface ChatHistoryItemProps {
  chat: ChatHistoryItemData;
  viewMode: 'list' | 'compact';
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
  // Add onOpen prop later if needed
}

const ChatHistoryItemComponent: React.FC<ChatHistoryItemProps> = ({
  chat,
  viewMode,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
}) => {

  const itemVariants = { // Animation variants
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      key={chat.id}
      variants={itemVariants} // Apply animation variants
      className={`p-4 border ${chat.isArchived ? 'bg-neutral-light/10' : 'bg-white'} border-neutral-light rounded-xl transition-all hover:shadow-md ${
        viewMode === 'compact' ? 'flex items-center justify-between' : ''
      }`}
    >
      {viewMode === 'list' ? (
        <>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-secondary">{chat.title}</h3>
            <span className="text-sm text-neutral-medium">{new Date(chat.date).toLocaleDateString()}</span>
          </div>
          <p className="text-neutral-medium text-sm mb-3 line-clamp-2">{chat.preview}</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {/* Favorite Button */}
              <button
                className={`p-1 rounded-md transition-colors ${
                  chat.isFavorite ? 'text-amber-500 hover:text-amber-600' : 'text-neutral-medium hover:text-neutral-dark'
                }`}
                onClick={() => onToggleFavorite(chat.id)}
                title={chat.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {chat.isFavorite ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
              </button>
              {/* Archive Button */}
              <button
                className="p-1 text-neutral-medium hover:text-neutral-dark rounded-md transition-colors"
                onClick={() => onToggleArchive(chat.id)}
                title={chat.isArchived ? 'Unarchive' : 'Archive'}
              >
                 {/* Using same icon for archive/unarchive for simplicity */}
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                 </svg>
              </button>
            </div>
            <div className="flex gap-2">
              {/* Open Button */}
              <Button variant="outline" size="sm">Open</Button>
              {/* Delete Button */}
              <button
                className="p-1 text-red-500 hover:text-red-600 rounded-md transition-colors"
                onClick={() => onDelete(chat.id)}
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : ( // Compact View
        <>
          <div className="flex items-center space-x-3">
            <h3 className="font-medium text-secondary">{chat.title}</h3>
            {chat.isFavorite && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
            {chat.isArchived && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-light text-neutral-medium">Archived</span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Open</Button>
            {/* Favorite Button */}
            <button
              className={`p-1 rounded-md transition-colors ${ chat.isFavorite ? 'text-amber-500 hover:text-amber-600' : 'text-neutral-medium hover:text-neutral-dark' }`}
              onClick={() => onToggleFavorite(chat.id)}
              title={chat.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {chat.isFavorite ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> )}
            </button>
            {/* Archive Button */}
            <button
              className="p-1 text-neutral-medium hover:text-neutral-dark rounded-md transition-colors"
              onClick={() => onToggleArchive(chat.id)}
              title={chat.isArchived ? 'Unarchive' : 'Archive'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            </button>
            {/* Delete Button */}
            <button
              className="p-1 text-red-500 hover:text-red-600 rounded-md transition-colors"
              onClick={() => onDelete(chat.id)}
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChatHistoryItemComponent; // Renamed export