import React from 'react';
import { useChatContext } from '@/context/ChatContext';
import { MessageSquare } from 'lucide-react';

const ChatToggleButton: React.FC = () => {
  const { toggleChat, isOpen } = useChatContext();
  
  return (
    <button 
      onClick={toggleChat}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[#ae5630] text-white shadow-lg hover:bg-[#8e4628] transition-all duration-300 ${isOpen ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
    >
      <MessageSquare size={20} />
      <span className="font-medium">Need Help?</span>
    </button>
  );
};

export default ChatToggleButton;
