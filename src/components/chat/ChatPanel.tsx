import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { X, Send, Globe, Search, MessageSquare } from 'lucide-react';

// Define custom CSS for the scrollbar
const scrollbarStyles = `
  /* Custom scrollbar styles */
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const ChatPanel: React.FC = () => {
  const { 
    isOpen, 
    messages, 
    isLoading,
    chatMode, 
    toggleChat, 
    sendMessage,
    setChatMode
  } = useChatContext();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === '' || isLoading) return;
    
    try {
      // Use the sendMessage function from context which handles API calls
      await sendMessage(inputValue);
      
      // Clear input
      setInputValue('');
    } catch (error) {
      console.error('Error submitting message:', error);
      // Error is already handled in the context, just log it here
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Inject the custom scrollbar styles */}
      <style>{scrollbarStyles}</style>
      
      <div 
        className={`fixed right-4 bottom-20 z-50 h-[500px] w-[300px] rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full flex flex-col bg-[#ae5630]">
          {/* Header */}
          <div className="text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/mmlogolight.png" alt="MagicMuse Logo" className="h-6 w-auto" />
              <h2 className="text-lg font-comfortaa text-[#faf9f5]">magicmuse chat</h2>
            </div>
            <div className="flex items-center gap-2">
              
              <button 
                onClick={toggleChat}
                className="text-white hover:text-gray-300 transition-colors ml-2"
                aria-label="Close AI Chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto custom-scrollbar bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl mx-2">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-xl max-w-[85%] ${
                    message.sender === 'ai' 
                      ? 'bg-[#edeae2]/90 text-[#1a1918]/90 shadow-sm' 
                      : 'bg-[#ffffff]/90 text-[#1a1918]/90 ml-auto shadow-sm'
                  } ${message.isLoading ? 'animate-pulse' : ''}`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.isLoading ? 'Thinking...' : message.content}
                  </p>
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Mode Indicator */}
          {chatMode === 'research' && (
            <div className="px-4 py-1 text-xs text-center text-white/80 bg-white/10">
              <div className="flex items-center justify-center gap-1">
                <Globe size={12} />
                <span>Research mode - Using web search to answer your questions</span>
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-4">
            <form onSubmit={handleSubmit} className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="w-full border border-[#ae5630]/30 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae5630] focus:border-transparent bg-[#faf9f5]"
              />
              <button 
                type="submit"
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-[#ae5630] transition-colors ${
                  isLoading || inputValue.trim() === '' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:text-[#6d371f]'
                }`}
                aria-label="Send message"
                disabled={isLoading || inputValue.trim() === ''}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPanel;
