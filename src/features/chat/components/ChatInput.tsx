import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import { useChat } from '../../../context/ChatContext';

interface ChatInputProps {
  onClearChat?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onClearChat }) => {
  const [message, setMessage] = useState('');
  const { sendMessage, isLoading, clearChat } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      
      // Set the height to the scrollHeight
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
      
      // Limit max height
      if (scrollHeight > 150) {
        textareaRef.current.style.height = '150px';
      }
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    await sendMessage(message);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClearChat = () => {
    clearChat();
    if (onClearChat) {
      onClearChat();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-10"
    >
      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <button
          type="button"
          onClick={handleClearChat}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          title="Start new chat"
        >
          <FiRefreshCw className="w-5 h-5" />
        </button>
        
        <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden flex items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-transparent resize-none min-h-[48px] max-h-[150px] focus:outline-none"
            rows={1}
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`p-3 mr-1 mb-1 rounded-full transition-colors ${
              !message.trim() || isLoading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-primary hover:bg-primary hover:text-white'
            }`}
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="text-center text-sm text-gray-500 mt-2">
          MagicMuse is thinking...
        </div>
      )}
    </form>
  );
};

export default ChatInput;
