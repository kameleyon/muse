import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  preview: string;
  isFavorite: boolean;
  isArchived: boolean;
}

const ChatHistorySettings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, favorites, archived
  const [viewMode, setViewMode] = useState('list'); // list, compact
  const [chatHistories, setChatHistories] = useState<ChatHistoryItem[]>([
    {
      id: '1',
      title: 'Content Creation Ideas',
      date: '2025-03-25',
      preview: 'Discussion about blog post ideas for the company website...',
      isFavorite: true,
      isArchived: false,
    },
    {
      id: '2',
      title: 'Marketing Strategy',
      date: '2025-03-24',
      preview: 'Planning for Q2 marketing campaign and content strategy...',
      isFavorite: false,
      isArchived: false,
    },
    {
      id: '3',
      title: 'Product Description Draft',
      date: '2025-03-22',
      preview: 'Creating compelling product descriptions for the new line...',
      isFavorite: true,
      isArchived: false,
    },
    {
      id: '4',
      title: 'Email Newsletter',
      date: '2025-03-20',
      preview: 'Drafting the monthly newsletter with latest updates...',
      isFavorite: false,
      isArchived: true,
    },
    {
      id: '5',
      title: 'Social Media Post Ideas',
      date: '2025-03-18',
      preview: 'Brainstorming engaging social media content...',
      isFavorite: false,
      isArchived: false,
    },
  ]);

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
    if (window.confirm('Are you sure you want to delete this chat history? This action cannot be undone.')) {
      setChatHistories(prevHistories => 
        prevHistories.filter(history => history.id !== id)
      );
    }
  };

  const filteredChats = chatHistories.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         chat.preview.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'favorites') return matchesSearch && chat.isFavorite;
    if (filter === 'archived') return matchesSearch && chat.isArchived;
    return matchesSearch && !chat.isArchived; // 'all' shows non-archived by default
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
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search chat history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            
            <div className="flex gap-2">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-light rounded-xl bg-white focus:border-primary"
              >
                <option value="all">All Chats</option>
                <option value="favorites">Favorites</option>
                <option value="archived">Archived</option>
              </select>
              
              <div className="flex border border-neutral-light rounded-xl overflow-hidden">
                <button
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary text-secondary' : 'bg-white text-secondary hover:bg-neutral-light/20'}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  className={`px-3 py-2 ${viewMode === 'compact' ? 'bg-primary text-secondary' : 'bg-white text-secondary hover:bg-neutral-light/20'}`}
                  onClick={() => setViewMode('compact')}
                  title="Compact View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16M4 10h16M4 15h16M4 20h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Chat History List */}
          {filteredChats.length === 0 ? (
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
            <div className="space-y-4">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
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
                          <button
                            className={`p-1 rounded-md transition-colors ${
                              chat.isFavorite ? 'text-amber-500 hover:text-amber-600' : 'text-neutral-medium hover:text-neutral-dark'
                            }`}
                            onClick={() => toggleFavorite(chat.id)}
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
                          <button
                            className="p-1 text-neutral-medium hover:text-neutral-dark rounded-md transition-colors"
                            onClick={() => toggleArchive(chat.id)}
                            title={chat.isArchived ? 'Unarchive' : 'Archive'}
                          >
                            {chat.isArchived ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Open
                          </Button>
                          <button
                            className="p-1 text-red-500 hover:text-red-600 rounded-md transition-colors"
                            onClick={() => deleteChat(chat.id)}
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-secondary">{chat.title}</h3>
                        {chat.isFavorite && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )}
                        {chat.isArchived && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-light text-neutral-medium">
                            Archived
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Open
                        </Button>
                        <button
                          className={`p-1 rounded-md transition-colors ${
                            chat.isFavorite ? 'text-amber-500 hover:text-amber-600' : 'text-neutral-medium hover:text-neutral-dark'
                          }`}
                          onClick={() => toggleFavorite(chat.id)}
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
                        <button
                          className="p-1 text-neutral-medium hover:text-neutral-dark rounded-md transition-colors"
                          onClick={() => toggleArchive(chat.id)}
                          title={chat.isArchived ? 'Unarchive' : 'Archive'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        </button>
                        <button
                          className="p-1 text-red-500 hover:text-red-600 rounded-md transition-colors"
                          onClick={() => deleteChat(chat.id)}
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination (simplified) */}
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChatHistorySettings;
