import React, { useRef, useEffect } from 'react';
import { useChat } from '../../../context/ChatContext';
import ChatMessage from './ChatMessage';

const ChatWindow: React.FC = () => {
  const { messages, isLoading, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Filter out system messages from display
  const displayMessages = messages.filter(msg => msg.role !== 'system');

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
      {displayMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">Start a conversation with MagicMuse</p>
            <p className="text-sm">Ask about content creation, writing tips, or start a new project</p>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {displayMessages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg rounded-tl-none max-w-[75%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 max-w-3xl mx-auto">
              <p className="font-medium">Error sending message</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
